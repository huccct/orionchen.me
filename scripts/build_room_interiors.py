"""Three real room interiors. Blender Z-up becomes glTF Y-up on export."""
import bpy, math, random
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
random.seed(14)

def material(name, color):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.85
    return m

def finish(o,name,mat):
    o.name='GEO-'+name;o['action']=ACTION;o.data.materials.append(mat);return o

def box(name,loc,size,mat,bevel=.025):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        b=o.modifiers.new('Soft handmade edge','BEVEL');b.width=bevel;b.segments=1 if min(size)<.15 else 5
        b.harden_normals=True
        o.modifiers.new('Furniture weighted normals','WEIGHTED_NORMAL')
    return finish(o,name,mat)

def cylinder(name,loc,r,depth,mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=r,depth=depth,location=loc)
    o=bpy.context.object
    for p in o.data.polygons: p.use_smooth=len(p.vertices)==4
    return finish(o,name,mat)

def ball(name,loc,size,mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=loc)
    o=bpy.context.object;o.scale=size
    for p in o.data.polygons:p.use_smooth=True
    return finish(o,name,mat)

def beam(name,a,b,r,mat):
    a,b=Vector(a),Vector(b);o=cylinder(name,(a+b)/2,r,(b-a).length,mat);o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o

def book(x,y,z,h=.34,w=.12):
    box('cloth binding',(x,y,z+h/2),(w,.30,h),random.choice(cloth),.01)
    box('page block',(x,y+.025,z+h/2),(w*.73,.245,h*.92),paper,0)
    for zz in [z+h*.13,z+h*.87]:box('spine binding band',(x,y-.155,zz),(w*.88,.013,.009),wood,0)
    box('spine label',(x,y-.157,z+h*.7),(w*.65,.014,.035),paper,.002)

def shelf(x,y,width=1.7):
    box('shelf back',(x,y+.14,1.25),(width,.07,2.35),wood)
    for xx in [x-width/2,x+width/2]:box('shelf side',(xx,y,1.25),(.07,.47,2.4),wood)
    for level in range(5):
        z=.15+level*.48;box('shelf ledge',(x,y-.04,z),(width,.5,.06),oak)
        for i in range(int(width/.16)-1): book(x-width/2+.15+i*.16,y-.12,z+.035,random.uniform(.25,.39),random.uniform(.08,.13))

def desk(x,y):
    box('desktop',(x,y,.86),(2.3,1.05,.095),oak)
    for xx in [x-.98,x+.98]:
        for yy in [y-.38,y+.38]:box('desk leg',(xx,yy,.42),(.08,.08,.83),wood)
    box('desk apron',(x,y-.40,.72),(2.05,.09,.19),wood,.012)
    for xx in [x-.52,x+.52]:
        box('drawer front',(xx,y-.465,.72),(.95,.045,.15),oak,.009)
        ball('drawer brass pull',(xx,y-.50,.72),(.036,.023,.025),wood)
    for i in range(5):box('paper stack',(x-.23,y-.1,.92+i*.007),(.58,.45,.006),paper,.003)
    for i in range(7):box('written line',(x-.23,y-.25+i*.047,.959),(.37,.009,.002),ink,0)
    o=box('fountain pen',(x+.16,y-.2,.98),(.025,.34,.025),ink,.008);o.rotation_euler.z=-.3
    cylinder('mug',(x+.70,y-.20,1.03),.095,.21,clay)
    bpy.ops.mesh.primitive_torus_add(major_segments=32,minor_segments=12,location=(x+.80,y-.20,1.04),major_radius=.065,minor_radius=.018,rotation=(math.pi/2,0,0));finish(bpy.context.object,'ceramic mug handle',clay)
    bpy.ops.mesh.primitive_torus_add(major_segments=40,minor_segments=10,location=(x+.70,y-.20,1.14),major_radius=.085,minor_radius=.011);finish(bpy.context.object,'ceramic rim',clay)
    cylinder('coffee',(x+.70,y-.20,1.14),.077,.004,ink)
    cylinder('lamp foot',(x-.8,y+.24,.95),.14,.055,ink)
    beam('lamp stem',(x-.8,y+.24,.97),(x-.8,y+.24,1.52),.025,ink)
    bpy.ops.mesh.primitive_cone_add(vertices=24,radius1=.24,radius2=.08,depth=.21,location=(x-.8,y+.24,1.55));finish(bpy.context.object,'lamp shade',olive)
    box('chair seat',(x,y-.93,.45),(.65,.58,.09),olive,.055)
    box('chair back',(x,y-1.17,.77),(.65,.08,.6),olive,.07)
    for xx in [x-.26,x+.26]:
        for yy in [y-.72,y-1.13]:box('chair leg',(xx,yy,.22),(.05,.05,.44),wood)

for room in ['writing','works','reading']:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    paper=material('Warm plaster',(.83,.79,.70));oak=material('Honey oak',(.56,.46,.32));wood=material('Dark oak',(.36,.28,.19));ink=material('Charcoal',(.055,.061,.06));olive=material('Sage cloth',(.37,.41,.30));clay=material('Terracotta',(.51,.34,.25));glass=material('Daylight blue',(.58,.74,.78))
    cloth=[material('Book '+str(i),c) for i,c in enumerate([(.39,.25,.19),(.29,.35,.31),(.51,.45,.32),(.29,.33,.37),(.65,.60,.49)])]
    ACTION='shell'
    for i in range(24):
        for j in range(4):box('floorboard',(-2.875+i*.25,-2.55+j*1.7,-.045),(.246,1.695,.09),oak,0)
    box('plaster ceiling',(0,0,3.43),(6,6.8,.1),paper,.008)
    box('back plaster',(0,3.35,1.65),(6,.15,3.4),paper)
    for x in [-3,3]:
        box('side plaster',(x,0,1.65),(.15,6.8,3.4),paper)
        box('skirting',(x*.985,0,.12),(.10,6.8,.2),wood)
    box('back skirting',(0,3.23,.12),(6,.09,.2),wood)
    # The camera physically passes through this opening on arrival.
    for x in [-1.94,1.94]:box('door wall',(x,-3.35,1.65),(2.12,.15,3.4),paper)
    box('door lintel',(0,-3.35,2.98),(1.75,.2,.72),paper)
    for x in [-.87,.87]:box('door jamb',(x,-3.31,1.3),(.12,.25,2.6),wood)
    box('door top',(0,-3.31,2.62),(1.88,.25,.14),wood)
    # Open door leaf sits against the inside right wall of the doorway.
    box('open door',(.91,-2.5,1.25),(.08,1.6,2.5),oak)
    for y in [-2,0,2]:box('ceiling beam',(0,y,3.2),(6,.15,.20),wood)
    # Deep-set side window, divided panes and a sill.
    box('window recess',(-2.905,.6,1.95),(.06,2.1,1.65),wood)
    box('window daylight',(-2.86,.6,1.95),(.02,1.93,1.48),glass,0)
    for y in [-.4,.6,1.6]:box('window mullion',(-2.81,y,1.95),(.08,.05,1.58),paper)
    box('window crossbar',(-2.81,.6,1.95),(.08,2.05,.06),paper)
    box('window sill',(-2.7,.6,1.10),(.46,2.3,.09),oak)
    box('woven rug',(0,-.15,.013),(3.5,3.0,.025),olive,.02)
    for x in [-1.58,1.58]:box('rug stitched border',(x,-.15,.029),(.025,2.85,.005),paper,0)
    if room=='writing':
        ACTION='desk';desk(-.6,1.35)
        ACTION='shelf';shelf(1.85,2.95,1.6)
        ACTION='detail'
        box('pinboard',(-.85,3.22,2.2),(1.6,.06,.90),clay)
        for i in range(3):box('pinned notes',(-1.35+i*.49,3.17,2.21),(.34,.02,.53),paper,.005)
    elif room=='works':
        ACTION='screen'
        box('screen frame',(0,3.20,2.05),(3.65,.13,1.95),ink)
        box('projection cloth',(0,3.11,2.05),(3.43,.025,1.73),paper,.005)
        # Quiet film frame; no invented finished footage.
        box('screen letterbox top',(0,3.08,2.79),(3.4,.015,.23),ink,0)
        box('screen letterbox bottom',(0,3.08,1.31),(3.4,.015,.23),ink,0)
        ACTION='desk';desk(-1.15,.4)
        box('projector',(-1.15,.5,1.09),(.55,.42,.28),ink)
        o=cylinder('projector lens',(-1.15,.73,1.1),.10,.12,glass);o.rotation_euler.x=math.pi/2
        ACTION='shelf';shelf(2.25,2.85,1.05)
        ACTION='detail'
        for x in [.55,1.65]:
            box('cinema cushion',(x,-.8,.46),(.83,.82,.22),clay,.1)
            box('cinema chair back',(x,-1.14,.9),(.83,.16,.83),clay,.1)
            for xx in [x-.3,x+.3]:box('seat foot',(xx,-.8,.2),(.06,.7,.35),ink)
    else:
        ACTION='shelf'
        for x in [-1.95,0,1.95]:shelf(x,2.97,1.75)
        ACTION='desk'
        cylinder('reading table',(-.6,.5,.55),.70,.10,oak)
        cylinder('table pedestal',(-.6,.5,.28),.09,.5,wood)
        cylinder('table base',(-.6,.5,.05),.4,.08,wood)
        for x in [-.79,-.42]:
            o=box('open book',(x,.5,.62),(.36,.47,.055),paper,.007);o.rotation_euler.y=.10 if x<-.6 else -.1
        ACTION='detail'
        box('sofa base',(1.5,.45,.45),(1.55,1.1,.5),clay,.12)
        box('sofa back',(1.5,.92,.94),(1.55,.24,1.0),clay,.12)
        for x in [.77,2.23]:box('sofa arm',(x,.4,.78),(.22,1.06,.38),clay,.08)
        ball('soft cushion',(1.5,.8,1.05),(.35,.15,.32),olive)
    ACTION='detail'
    cylinder('plant pot',(-2.3,2.5,.25),.23,.45,clay)
    for i in range(9):
        end=(-2.3+math.cos(i*2.4)*.36,2.5+math.sin(i*2.4)*.36,.8+(i%3)*.18)
        beam('plant stem',(-2.3,2.5,.45),end,.015,wood)
        o=ball('plant leaf',end,(.15,.055,.26),olive);o.rotation_euler.y=i*.7
    # Merge by interaction target, apply bevels, retain semantic picking.
    for o in list(bpy.context.scene.objects):
        bpy.context.view_layer.objects.active=o
        for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
    for action in ['shell','desk','shelf','screen','detail']:
        objs=[o for o in bpy.context.scene.objects if o.get('action')==action]
        if not objs:continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs:o.select_set(True)
        bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();bpy.context.object.name=action
    assert all(bpy.data.objects.get(n) for n in ['shell','desk','shelf'])
    triangles=sum(len(p.vertices)-2 for o in bpy.context.scene.objects if o.type=='MESH' for p in o.data.polygons)
    assert triangles<220000,triangles
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/f'output/models/interior-{room}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/f'public/models/interior-{room}.glb'),export_format='GLB',export_extras=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
    print(room,triangles,flush=True)

    # Archive portraits come from the same room geometry and eye-height camera.
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
    world=bpy.data.worlds.new('Paper room daylight');scene.world=world;world.use_nodes=True
    world.node_tree.nodes['Background'].inputs[0].default_value=(.83,.85,.87,1)
    world.node_tree.nodes['Background'].inputs[1].default_value=.5
    for loc,target,power,size in [((-2.6,.5,2.6),(0,1,1),220,3.0),((1,-1.5,2.7),(0,1,.8),120,3.0)]:
        bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector(target)-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.camera_add(location=(0,-1.95,1.55));cam=bpy.context.object;cam.data.lens=23;cam.rotation_euler=(Vector((0,3.0,1.25))-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam
    scene.render.resolution_x=1200;scene.render.resolution_y=750;scene.render.resolution_percentage=100
    scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/f'output/models/interior-{room}.png')
    bpy.ops.render.render(write_still=True)
