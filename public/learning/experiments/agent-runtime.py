"""Run and evaluate the lease recovery lab with Python 3 on macOS or Linux."""

import argparse
import json
import signal
import sqlite3
import subprocess
import sys
from contextlib import closing
from pathlib import Path
from tempfile import TemporaryDirectory


def run_worker(db, name, now, duplicate_report):
    def emit(event, **fields):
        print(json.dumps(dict(event=event, worker=name, time=now, **fields)), flush=True)

    # The attempt number is a fencing token for writes to the task record.
    with db:
        claimed = db.execute(
            """
            UPDATE task SET status = 'running', attempt = attempt + 1, lease_until = ?
            WHERE id = 1 AND (status = 'pending' OR (status = 'running' AND lease_until <= ?))
            """,
            (now + 10, now),
        ).rowcount
        if not claimed:
            emit("claim_denied")
            return
        attempt = db.execute("SELECT attempt FROM task WHERE id = 1").fetchone()[0]
    emit("task_claimed", attempt=attempt, lease_until=now + 10)

    # Commit the tool write separately so it survives a worker crash.
    operation_key = "task-1:create-report"
    if duplicate_report:
        operation_key += f":{attempt}"
    with db:
        inserted = db.execute(
            "INSERT INTO report (operation_key) VALUES (?) ON CONFLICT (operation_key) DO NOTHING",
            (operation_key,),
        ).rowcount
        report_id = db.execute(
            "SELECT id FROM report WHERE operation_key = ?", (operation_key,)
        ).fetchone()[0]
    emit("tool_result", attempt=attempt, report_id=report_id, created=bool(inserted))
    if name == "A":
        signal.raise_signal(signal.SIGKILL)

    with db:
        saved = db.execute(
            """
            UPDATE task SET status = 'succeeded', report_id = ?, lease_until = NULL
            WHERE id = 1 AND status = 'running' AND attempt = ? AND lease_until > ?
            """,
            (report_id, attempt, now),
        ).rowcount
        if saved != 1:
            raise RuntimeError(f"Worker {name} could not save attempt {attempt}")
    emit("task_succeeded", attempt=attempt, report_id=report_id)


def run_lab(path, db, duplicate_report):
    db.executescript(
        """
        CREATE TABLE task (
            id INTEGER PRIMARY KEY,
            status TEXT NOT NULL,
            attempt INTEGER NOT NULL,
            lease_until INTEGER,
            report_id INTEGER
        );
        CREATE TABLE report (id INTEGER PRIMARY KEY, operation_key TEXT NOT NULL UNIQUE);
        INSERT INTO task (id, status, attempt) VALUES (1, 'pending', 0);
        """
    )

    trace = []
    # ponytail: advance a shared lab clock for repeatable lease checks without waiting.
    for worker, now in (("A", 0), ("B", 9), ("B", 10)):
        command = [sys.executable, __file__, "--worker", str(path), worker, str(now)]
        if duplicate_report:
            command.append("--duplicate-report")
        result = subprocess.run(command, stdout=subprocess.PIPE, text=True, timeout=10)
        trace.extend(json.loads(line) for line in result.stdout.splitlines())
        status, attempt, lease_until, report_id = db.execute(
            "SELECT status, attempt, lease_until, report_id FROM task WHERE id = 1"
        ).fetchone()
        trace.append(
            dict(
                event="process_exit",
                worker=worker,
                time=now,
                returncode=result.returncode,
                status=status,
                attempt=attempt,
                lease_until=lease_until,
                report_id=report_id,
                report_ids=[row[0] for row in db.execute("SELECT id FROM report ORDER BY id")],
            )
        )
    return trace


def evaluate(trace):
    crashed, early, recovered = [event for event in trace if event["event"] == "process_exit"]
    if (
        crashed["returncode"] != -signal.SIGKILL
        or crashed["status"] != "running"
        or crashed["attempt"] != 1
        or crashed["report_id"] is not None
        or len(crashed["report_ids"]) != 1
    ):
        return "worker A: expected a committed report and an unfinished task after SIGKILL"

    lease_until = crashed["lease_until"]
    early_denied = any(
        event["event"] == "claim_denied" and event["time"] == early["time"]
        for event in trace
    )
    task_fields = ("status", "attempt", "lease_until", "report_id", "report_ids")
    if (
        lease_until is None
        or not early["time"] < lease_until <= recovered["time"]
        or early["returncode"] != 0
        or any(early[field] != crashed[field] for field in task_fields)
        or not early_denied
    ):
        return f"worker B at t={early['time']}: expected the active lease to block takeover"

    report_id = crashed["report_ids"][0]
    tool_results = [event for event in trace if event["event"] == "tool_result"]
    if len(tool_results) != 2:
        return "create-report: expected one tool result from each attempt"
    original, retry = tool_results
    if original["attempt"] != 1 or not original["created"] or original["report_id"] != report_id:
        return "create-report attempt 1: expected the original committed report"
    if retry["created"]:
        return (
            f"create-report attempt {retry['attempt']} (worker {retry['worker']}): "
            f"created report {retry['report_id']}, expected reuse of report {report_id}"
        )
    if (
        retry["attempt"] != 2
        or retry["report_id"] != report_id
        or recovered["returncode"] != 0
        or recovered["status"] != "succeeded"
        or recovered["attempt"] != 2
        or recovered["report_id"] != report_id
        or recovered["report_ids"] != [report_id]
    ):
        return "worker B: expected attempt 2 to finish with the original report"
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--trace", action="store_true", help="write the JSONL trace to stdout")
    parser.add_argument("--duplicate-report", action="store_true", help="use a new key on retry")
    parser.add_argument("--worker", nargs=3, help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.worker:
        path, worker, now = args.worker
        with closing(sqlite3.connect(path)) as db:
            run_worker(db, worker, int(now), args.duplicate_report)
    else:
        with TemporaryDirectory() as directory:
            path = Path(directory) / "runtime.sqlite3"
            with closing(sqlite3.connect(path)) as db:
                trace = run_lab(path, db, args.duplicate_report)
        if args.trace:
            for event in trace:
                print(json.dumps(event))
        failure = evaluate(trace)
        if failure:
            print(f"FAIL: {failure}", file=sys.stderr)
            sys.exit(1)
        print("PASS: lease respected, original report reused, task recovered", file=sys.stderr)
