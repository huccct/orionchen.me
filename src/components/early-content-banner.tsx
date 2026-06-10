export function EarlyContentBanner({ message }: { message: string }) {
  return (
    <div className="border-accent text-muted-foreground my-6 border-l-2 py-2 pl-4 font-mono text-xs break-words sm:text-sm">
      {message}
    </div>
  )
}
