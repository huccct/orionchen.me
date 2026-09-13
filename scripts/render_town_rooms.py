"""Render room entrance portraits from the editable town, without rebuilding geometry."""
from pathlib import Path
import bpy
from mathutils import Vector
ROOT = Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'output/models/paper-town.blend'))
scene = bpy.context.scene
scene.render.resolution_x = 800
scene.render.resolution_y = 640
scene.render.film_transparent = True
scene.cycles.samples = 24
rooms = {'writing': (2.85, 1.25, 1.35), 'works': (-.55, 2.05, 1.4), 'reading': (-3, -.85, 1.25), 'guestbook': (3, -2.5, .65)}
for name, target in rooms.items():
    for obj in scene.objects:
        if obj.type == 'MESH':
            obj.hide_render = obj.name != name
    point = Vector(target)
    scene.camera.location = point + Vector((4, -8, 4))
    scene.camera.rotation_euler = (point - scene.camera.location).to_track_quat('-Z', 'Y').to_euler()
    scene.camera.data.ortho_scale = 4.5 if name != 'guestbook' else 2.2
    scene.render.filepath = str(ROOT / 'output/models' / f'room-{name}.png')
    bpy.ops.render.render(write_still=True)
