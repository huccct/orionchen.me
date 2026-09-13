"""An articulated miniature resident, using the town's material/model helpers."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'scripts/build_paper_town.py').read_text()
exec(compile(source[:source.index('# Terrain')],str(ROOT/'scripts/build_paper_town.py'),'exec'))
skin=material('Warm skin',(.64,.43,.30));coat=material('Resident coat',(.24,.32,.29));denim=material('Soft denim',(.16,.21,.23));hair=material('Chestnut hair',(.11,.075,.055));canvas=material('Canvas backpack',(.42,.29,.18))
GROUP='torso'
sphere('tailored coat',(0,0,.81),(.18,.12,.28),coat)
cube('coat hem',(0,-.005,.64),(.31,.21,.10),coat,.035)
for z in [.72,.81,.9]:sphere('coat button',(.025,-.12,z),(.012,.008,.012),lightwood)
beam('coat seam',(0,-.121,.65),(0,-.121,.96),.004,wood)
sphere('neck',(0,0,1.02),(.065,.06,.09),skin)
sphere('backpack',(0,.15,.82),(.15,.065,.20),canvas)
for x in [-.11,.11]:beam('bag strap',(x,.035,1),(x,-.105,.77),.012,canvas)
GROUP='head'
sphere('face',(0,-.015,1.16),(.135,.11,.16),skin)
sphere('hair cap',(0,.015,1.25),(.139,.115,.105),hair)
for x in [-.137,.137]:sphere('ear',(x,0,1.16),(.024,.029,.043),skin)
for x in [-.048,.048]:sphere('eye',(x,-.115,1.18),(.012,.008,.014),ink)
sphere('nose',(0,-.133,1.145),(.025,.028,.032),skin)
beam('quiet smile',(-.024,-.12,1.10),(.024,-.12,1.10),.005,hair)
# Hat brim/crown with a cloth band.
sphere('hat crown',(0,.0,1.33),(.16,.13,.065),lightwood)
sphere('hat brim',(0,-.025,1.29),(.205,.18,.018),lightwood)
for side,x in [('left',-.21),('right',.21)]:
    GROUP='arm-'+side
    beam('coat sleeve',(x,0,.96),(x*1.14,-.015,.64),.06,coat)
    sphere('hand',(x*1.14,-.018,.60),(.048,.044,.065),skin)
for side,x in [('left',-.085),('right',.085)]:
    GROUP='leg-'+side
    beam('trouser leg',(x,0,.61),(x,-.005,.15),.065,denim)
    sphere('shoe',(x,-.05,.085),(.077,.12,.065),ink)
    cube('shoe sole',(x,-.05,.035),(.15,.23,.023),wood,.012)
for o in list(bpy.context.scene.objects):
    bpy.context.view_layer.objects.active=o
    for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
root=bpy.data.objects.new('resident',None);bpy.context.collection.objects.link(root)
pivots={'torso':(0,0,0),'head':(0,0,1.04),'arm-left':(-.21,0,.96),'arm-right':(.21,0,.96),'leg-left':(-.085,0,.61),'leg-right':(.085,0,.61)}
for part,pivot in pivots.items():
    objs=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('district')==part]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.object;o.name=part
    bpy.context.scene.cursor.location=pivot;bpy.ops.object.origin_set(type='ORIGIN_CURSOR');matrix=o.matrix_world.copy();o.parent=root;o.matrix_world=matrix
assert all(bpy.data.objects.get(name) for name in pivots)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'output/models/resident.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/resident.glb'),export_format='GLB',export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
