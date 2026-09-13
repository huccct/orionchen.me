"""Rebuild the hand-crafted homepage town. Run with Blender --background --python."""
import bpy, math, random, json
from mathutils import Vector
from pathlib import Path
random.seed(29)
ROOT = Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
GROUP = 'ground'

# Matte dyed paper, warm timber, dark ink; consistent real miniature scale.
def material(name, color, roughness=.85, emission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=roughness
    if emission:
        p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=emission
    return m
paper=material('Ivory cotton paper',(.78,.735,.63))
trim=material('Cut paper edges',(.94,.875,.74))
wood=material('Oiled oak',(.32,.215,.12))
lightwood=material('End grain',(.54,.39,.235))
ink=material('Graphite',(.065,.068,.057))
recess=material('Interior shade',(.12,.095,.065))
rust=material('Sienna',(.46,.18,.09))
glass=material('Warm window',(.77,.50,.21),.42,.12)
stone=material('Warm limestone',(.64,.59,.48))
soil=material('Soil',(.14,.12,.085))
roofmats=[material('Slate '+str(i),(.22+i*.009,.235+i*.009,.215+i*.009)) for i in range(5)]
leaves=[material('Olive leaf '+str(i),(.18+i*.035,.205+i*.034,.075+i*.022)) for i in range(5)]
books=[material('Book cloth '+str(i),c) for i,c in enumerate([(.38,.18,.12),(.22,.30,.26),(.65,.57,.36),(.20,.25,.29),(.68,.63,.52)])]

def finish(o,name,mat):
    o.name='GEO-'+name; o['district']=GROUP
    if mat:o.data.materials.append(mat)
    return o

def cube(name,loc,scale,mat,bevel=.02):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        b=o.modifiers.new('Hand-finished edges','BEVEL');b.width=bevel;b.segments=1 if min(scale)<.10 else 4
        b.harden_normals=True
        o.modifiers.new('Weighted face normals','WEIGHTED_NORMAL')
        b.affect='EDGES'
    return finish(o,name,mat)

def cyl(name,loc,r,depth,mat,vertices=16,r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r,radius2=r if r2 is None else r2,depth=depth,location=loc)
    o=finish(bpy.context.object,name,mat)
    for p in o.data.polygons:p.use_smooth=True
    return o

def sphere(name,loc,scale,mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=1,location=loc)
    o=bpy.context.object;o.scale=scale
    for p in o.data.polygons:p.use_smooth=True
    return finish(o,name,mat)

def beam(name,a,b,r,mat):
    a,b=Vector(a),Vector(b);o=cyl(name,(a+b)/2,r,(b-a).length,mat,10,r*.72)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o

def mesh(name,verts,faces,mat):
    m=bpy.data.meshes.new(name);m.from_pydata(verts,[],faces);m.update()
    o=bpy.data.objects.new('GEO-'+name,m);bpy.context.collection.objects.link(o);return finish(o,name,mat)

def text(name,body,loc,size,mat):
    c=bpy.data.curves.new(name,'FONT');c.body=body;c.align_x='CENTER';c.size=size;c.extrude=.001
    o=bpy.data.objects.new('GEO-'+name,c);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=(math.pi/2,0,0)
    finish(o,name,mat);return o

def gable(name,x,y,z,w,d,rise,mat):
    v=[(x-w/2,y-d/2,z),(x+w/2,y-d/2,z),(x,y-d/2,z+rise),(x-w/2,y+d/2,z),(x+w/2,y+d/2,z),(x,y+d/2,z+rise)]
    return mesh(name,v,[(0,2,1),(3,4,5),(0,1,4,3),(1,2,5,4),(2,0,3,5)],mat)

def roof(x,y,w,d,h,rise,tiled=True):
    half=w/2+.17;slope=rise/(w/2); angle=math.atan(slope)
    for side in [-1,1]:
        o=cube('roof folded board',(x+side*half/2,y,h+rise-half*slope/2),(half/math.cos(angle),d+.34,.075),roofmats[2] if tiled else trim)
        o.rotation_euler.y=side*angle
        # Individually overlapped slate shingles give the roof a readable silhouette.
        for row in range(6):
            xx=(row+.5)*half/6
            if tiled:
                for col in range(8):
                    yy=y-d/2-.12+(col+.5)*(d+.24)/8
                    o=cube('individual slate',(x+side*xx,yy,h+rise-xx*slope+.055),((half/6+.035)/math.cos(angle),(d+.24)/8-.014,.038),random.choice(roofmats),.008)
                    o.rotation_euler.y=side*angle
            else:
                # Paper roof seams, no texture substitute for real geometry.
                o=cube('roof standing seam',(x+side*xx,y,h+rise-xx*slope+.05),(.016,d+.34,.025),lightwood,.004);o.rotation_euler.y=side*angle
        for yy in [y-d/2-.18,y+d/2+.18]:
            beam('roof verge',(x,yy,h+rise+.035),(x+side*half,yy,h+rise-half*slope+.035),.036,trim)
    beam('ridge cap',(x,y-d/2-.22,h+rise+.075),(x,y+d/2+.22,h+rise+.075),.055,roofmats[1] if tiled else lightwood)

def window(x,y,z,w=.62,h=.66):
    cube('window recessed glass',(x,y+.025,z),(w,.045,h),glass,.005)
    for xx in [x-w/2,x+w/2]:cube('window jamb',(xx,y-.03,z),(.055,.10,h+.12),lightwood,.007)
    for zz in [z-h/2,z+h/2]:cube('window rail',(x,y-.035,zz),(w+.12,.11,.05),trim,.007)
    cube('window mullion',(x,y-.06,z),(.027,.09,h),wood,.004)
    cube('window crossbar',(x,y-.06,z),(w,.09,.027),wood,.004)
    cube('deep windowsill',(x,y-.10,z-h/2-.06),(w+.20,.28,.08),trim,.015)

def shelf(x,y,z,w=1.25,h=1.2):
    cube('shelf back',(x,y+.12,z+h/2),(w,.10,h),recess)
    for xx in [x-w/2,x+w/2]:cube('shelf upright',(xx,y,z+h/2),(.065,.27,h),wood,.009)
    for row in range(4):
        zz=z+row*h/3
        cube('shelf plank',(x,y-.03,zz),(w,.34,.055),lightwood,.007)
        if row<3:
            xx=x-w/2+.075
            while xx<x+w/2-.09:
                bw=random.uniform(.045,.085);bh=random.uniform(.21,.31)
                cube('cloth book',(xx+bw/2,y-.05,zz+bh/2+.03),(bw,.19,bh),random.choice(books),.003)
                cube('spine gilt',(xx+bw/2,y-.15,zz+bh*.73),(bw*.62,.008,.012),trim,.001)
                xx+=bw+.01

def building(name,x,y,w,d,h,rise,studio=False):
    global GROUP
    GROUP=name
    cube('stone footing',(x,y,.085),(w+.22,d+.22,.17),stone,.045)
    cube('oak floor',(x,y,.19),(w,d,.10),lightwood,.018)
    # Back and side walls leave a real open front, with depth and visible interior.
    cube('back wall',(x,y+d/2-.06,h/2+.18),(w,.12,h),paper)
    for xx in [x-w/2+.055,x+w/2-.055]:cube('side wall',(xx,y,h/2+.18),(.11,d,h),paper)
    front=y-d/2
    for xx in [x-w/2+.08,x+w/2-.08]:cube('front corner',(xx,front,h/2+.18),(.16,.16,h),trim)
    cube('front lintel',(x,front,h+.10),(w,.18,.19),trim)
    gable('front gable',x,front,h+.18,w,.13,rise,paper)
    gable('rear gable',x,y+d/2,h+.18,w,.13,rise,paper)
    roof(x,y,w,d,h+.18,rise,not studio)
    # Visible oak studs and siding joints.
    for xx in [x-w/2+.02,x+w/2-.02]:
        for j in range(1,8):cube('side siding seam',(xx,y,.20+j*h/8),(.13,d-.08,.017),trim,.002)
    if studio:
        shelf(x-.42,y+d/2-.22,.26,.8,1.25)
        cube('worktop',(x+.22,y-.1,.92),(1.25,.65,.09),lightwood)
        for xx in [x-.26,x+.70]:
            for yy in [y-.34,y+.1]:cube('table leg',(xx,yy,.57),(.065,.065,.68),wood,.01)
        cube('notebook',(x+.1,y-.13,1.0),(.3,.22,.045),books[1],.004)
        cube('paper on desk',(x+.45,y-.19,.978),(.28,.25,.006),trim,.001)
        cyl('pencil cup',(x+.63,y+.08,1.075),.055,.21,rust)
        for i in range(4):beam('pencil',(x+.60+i*.018,y+.08,1.02),(x+.61+i*.018,y+.08,1.30),.009,ink)
        # An open door made of separate planks, at an angle.
        for i in range(5):
            o=cube('open oak door',(x+w/2+.1+i*.10,front+.03+i*.08,.96),(.13,.09,1.5),lightwood,.008);o.rotation_euler.z=.65
        window(x,front-.08,h+.50,.46,.36)
        beam('hanging lamp cable',(x,y,h+.08),(x,y,h-.30),.012,ink)
        cyl('lamp shade',(x,y,h-.37),.22,.16,ink,24,.04)
        sphere('lamp bulb',(x,y,h-.44),(.08,.08,.035),glass)
        text('studio sign','STUDIO',(x,front-.112,h+.12),.17,wood)
    else:
        shelf(x-.35,y+d/2-.22,.27,w-.35,1.3)
        shelf(x-w*.18,front+.30,.38,w*.53,1.03)
        # Front door and glazed display split; the books remain visible behind glass-free opening.
        doorx=x+w*.30
        cube('door inset',(doorx,front+.045,.94),(.50,.08,1.42),wood,.015)
        window(doorx,front-.02,1.16,.34,.70)
        cube('door lower panel',(doorx,front-.03,.49),(.37,.055,.32),lightwood,.008)
        sphere('brass knob',(doorx-.16,front-.095,.80),(.025,.018,.025),trim)
        for xx in [x-w/2+.2,x+.24]:cube('display frame',(xx,front,1.05),(.05,.1,1.50),lightwood,.006)
        cube('display sill',(x-w*.17,front-.08,.35),(w*.61,.22,.07),trim)
        cube('display rail',(x-w*.17,front-.04,1.20),(w*.61,.08,.036),wood,.005)
        window(x,front-.09,h+.52,.40,.43)
        cube('shop sign',(x,front-.12,h-.13),(w-.23,.10,.26),trim,.015)
        text('lettering','BOOKS' if name=='reading' else 'WORDS',(x,front-.18,h-.20),.20,ink)
        # Real curved canvas awning, alternating seams and scalloped valance.
        segments=9
        for i in range(segments):
            xx=x-w/2+(i+.5)*w/segments
            o=cube('awning canvas',(xx,front-.32,h-.43),(w/segments-.006,.66,.045),rust if name=='reading' else leaves[2],.008);o.rotation_euler.x=.22
            cube('awning valance',(xx,front-.64,h-.51),(w/segments-.006,.04,.12),rust if name=='reading' else leaves[2],.02)
        for xx in [x-w/2,x+w/2]:beam('awning bracket',(xx,front,h-.9),(xx,front-.63,h-.49),.018,ink)
    for i in range(2):cube('entry step',(x+w*.25,front-.18-i*.15,.105-i*.035),(.86,.35,.15-i*.04),stone,.028)
    # Small chimney with open dark mouth and cap.
    cube('chimney',(x-w*.32,y+d*.25,h+rise*.78),(.27,.30,.85),paper)
    cube('chimney cap',(x-w*.32,y+d*.25,h+rise*.78+.43),(.36,.39,.07),trim,.015)
    cube('chimney hollow',(x-w*.32,y+d*.25,h+rise*.78+.47),(.20,.23,.01),recess,.005)

# Terrain is a thin sheet of heavy stock, not a chunky game island.
GROUP='ground'
N=80
verts=[]
for z in [-.09,0]:
    for i in range(N):
        t=math.tau*i/N;r=1+.023*math.sin(t*5)+.018*math.cos(t*7)
        verts.append((5.6*math.cos(t)*r,4.3*math.sin(t)*r,z))
faces=[tuple(range(N,2*N)),tuple(reversed(range(N)))]+[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)]
mesh('cotton paper ground',verts,faces,trim)

path_layer=0
def path(points,width=.48):
    global path_layer
    path_layer += 1
    # Catmull-Rom centerline with a flat ribbon for walkable, continuous paths.
    pts=[Vector((x,y,.013+path_layer*.004)) for x,y in points]; samples=[]
    ex=[pts[0]]+pts+[pts[-1]]
    for i in range(1,len(ex)-2):
        a,b,c,d=ex[i-1:i+3]
        for j in range(16):
            t=j/16;samples.append(.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t))
    samples.append(pts[-1]);v=[]
    for i,p in enumerate(samples):
        tangent=samples[min(i+1,len(samples)-1)]-samples[max(0,i-1)]
        normal=Vector((-tangent.y,tangent.x,0)).normalized()*width/2
        v.extend([p+normal,p-normal])
    mesh('winding path',v,[(2*i,2*i+1,2*i+3,2*i+2) for i in range(len(samples)-1)],lightwood)
path([(1,-3.9),(.8,-2.7),(1.2,-1.2),(.8,.1),(-.55,1.0)])
path([(.9,-1.4),(-.6,-1.2),(-2,-1.7),(-3,-2.0)],.40)
path([(1.0,-.8),(2.5,-.25),(2.8,.65)],.40)
path([(1,-2.9),(2,-2.7),(3.1,-2.4)],.36)
building('reading',-3.0,-.85,2.0,1.65,1.66,.83)
building('works',-.55,2.05,2.1,1.75,1.98,.94,True)
building('writing',2.85,1.25,1.90,1.62,1.79,.92)

# Paper trees have branching silhouettes and hundreds of individually folded leaves.
def tree(x,y,height,seed):
    global GROUP
    GROUP='garden'; rng=random.Random(seed)
    trunk=(x,y,0);top=(x+.10,y-.08,height)
    beam('tapered trunk',trunk,top,.075,wood)
    centers=[]
    for k in range(11):
        ang=k*2.399; zz=height*(.48+.48*k/11); spread=height*.32*(1-.35*k/11)
        end=(x+math.cos(ang)*spread,y+math.sin(ang)*spread,zz+.20)
        beam('branch',(x+.06,y,zz-.28),end,.025,wood);centers.append(Vector(end))
    # Smooth, overlapping foliage masses give a coherent crown; rounded leaves soften its edge.
    for center in centers:
        sphere('olive crown',center,(rng.uniform(.32,.43),rng.uniform(.30,.40),rng.uniform(.28,.38)),leaves[rng.randrange(1,4)])
        for j in range(10):
            pos=center+Vector((rng.gauss(0,.28),rng.gauss(0,.28),rng.gauss(0,.22)))
            o=sphere('rounded olive leaf',pos,(.16,.055,.035),leaves[rng.randrange(5)])
            o.rotation_euler=(rng.uniform(-.5,.5),rng.uniform(-.6,.6),rng.uniform(0,math.tau))
for data in [(-1.7,-1.15,2.0,1),(-4.5,.0,1.8,2),(1.1,2.8,2.35,3),(4.3,1.65,1.7,4),(-2.3,2.6,1.8,5)]:tree(*data)

# Reading bench: five seat slats, a curved-ish back, iron armrests and stretchers.
GROUP='reading';bx,by=-.65,-2.25
for i in range(5):cube('bench seat slat',(bx,by-.22+i*.10,.45),(1.42,.085,.055),lightwood,.012)
for i in range(3):cube('bench back slat',(bx,by+.24+i*.022,.68+i*.15),(1.42,.065,.105),lightwood,.013)
for xx in [bx-.57,bx+.57]:
    for yy in [by-.16,by+.20]:beam('bench iron leg',(xx,yy-.04,.035),(xx,yy,.43),.026,ink)
    beam('bench back support',(xx,by+.20,.15),(xx,by+.31,1.02),.023,ink)
    beam('bench arm',(xx,by-.2,.69),(xx,by+.23,.72),.025,ink)
    beam('bench arm support',(xx,by-.17,.44),(xx,by-.17,.69),.02,ink)
# Open book with visible pages.
o=cube('open book left',(bx+.25,by,.505),(.23,.27,.024),trim,.003);o.rotation_euler.y=-.13
o=cube('open book right',(bx+.48,by,.505),(.23,.27,.024),trim,.003);o.rotation_euler.y=.13
for i in range(5):cube('book page ink',(bx+.27,by-.09+i*.036,.525),(.15,.006,.002),wood,0)

GROUP='guestbook';px,py=3.0,-2.5
cyl('postbox plinth',(px,py,.07),.31,.14,ink,32)
cyl('postbox column',(px,py,.62),.23,1.05,rust,32)
cyl('postbox lower ring',(px,py,.17),.255,.09,ink,32)
cyl('postbox collar',(px,py,1.15),.29,.09,rust,32)
sphere('postbox dome',(px,py,1.22),(.30,.30,.105),rust)
cube('mail slot',(px,py-.233,.97),(.26,.025,.055),ink,.01)
cube('mail slot brow',(px,py-.25,1.015),(.30,.08,.032),rust,.006)
cube('postbox notice frame',(px,py-.238,.73),(.21,.027,.27),lightwood,.01)
cube('postbox notice',(px,py-.256,.73),(.17,.015,.23),trim,.003)
for i in range(4):cube('notice line',(px,py-.266,.79-i*.04),(.11,.005,.008),wood,0)
text('post lettering','POST',(px,py-.24,.43),.11,trim)

# A floppy-eared dog, with a long muzzle, collar and four planted paws.
GROUP='dog';cx,cy=.03,-2.85
fur=material('Dog cream coat',(.85,.77,.58));patch=material('Dog chestnut patches',(.30,.12,.045))
sphere('dog body',(cx,cy,.28),(.32,.16,.20),fur)
sphere('dog chest',(cx-.23,cy,.32),(.15,.16,.23),fur)
sphere('dog head',(cx-.28,cy-.02,.57),(.16,.14,.15),fur)
sphere('dog muzzle',(cx-.29,cy-.16,.52),(.105,.11,.075),fur)
sphere('dog nose',(cx-.29,cy-.252,.54),(.052,.032,.034),ink)
for xx in [cx-.42,cx-.14]:
    o=sphere('dog floppy ear',(xx,cy-.01,.51),(.063,.09,.17),patch);o.rotation_euler.y=.15 if xx<cx-.28 else -.15
for xx in [cx-.35,cx-.22]:sphere('dog eye',(xx,cy-.145,.607),(.018,.012,.021),ink)
for leg_index,(xx,yy) in enumerate([(cx-.23,cy-.105),(cx-.23,cy+.105),(cx+.22,cy-.105),(cx+.22,cy+.105)]):
    GROUP='dog-leg-'+str(leg_index)
    if True:
        sphere('dog leg',(xx,yy,.13),(.06,.06,.13),fur)
        sphere('dog paw',(xx,yy-.025,.055),(.074,.086,.045),fur)
GROUP='dog'
sphere('dog saddle',(cx+.08,cy,.43),(.20,.15,.075),patch)
o=cyl('dog collar',(cx-.24,cy,.40),.145,.055,rust,24)
sphere('dog tag',(cx-.24,cy-.15,.37),(.035,.014,.046),lightwood)
GROUP='dog-tail'
pts=[(cx+.28,cy,.35),(cx+.43,cy,.48),(cx+.47,cy,.64)]
for a,b in zip(pts,pts[1:]):beam('dog tail',a,b,.045,patch)
sphere('dog tail tip',pts[-1],(.05,.05,.06),fur)

# Handmade paving, pots and understory give the buildings a lived-in scale.
GROUP='garden'
for x,y in [(-4,-1.9),(-1.9,-1.6),(-1.8,1.1),(.68,1.35),(2,-.0),(3.9,.15)]:
    cyl('clay pot',(x,y,.18),.18,.36,rust,16,.22)
    cyl('pot soil',(x,y,.367),.19,.015,soil,16)
    for j in range(9):
        ang=j*2.4; end=(x+math.cos(ang)*.19,y+math.sin(ang)*.19,.43+random.random()*.27)
        beam('plant stem',(x,y,.35),end,.009,wood)
        o=sphere('plant leaf',end,(.06,.025,.15),random.choice(leaves));o.rotation_euler=(.3,ang,.3)
for i in range(75):
    x=random.uniform(-4.8,4.8);y=random.uniform(-3.3,3.3)
    if abs(x)<1.5 or (-4.1<x<-1.9 and -1.9<y<.1) or (-1.7<x<.7 and 1<y<3.2) or (1.7<x<4 and .1<y<2.5):continue
    o=sphere('paper pebble',(x,y,.035),(random.uniform(.04,.10),random.uniform(.035,.075),.035),stone)

# Convert, apply the bevels, and merge by destination; keep pickable semantic meshes.
for o in list(bpy.context.scene.objects):
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    if o.type in {'FONT','CURVE'}:bpy.ops.object.convert(target='MESH')
    for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
for group in ['ground','garden','reading','writing','works','guestbook','dog','dog-tail','dog-leg-0','dog-leg-1','dog-leg-2','dog-leg-3']:
    objs=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('district')==group]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.object;o.name=group
    # A single origin per semantic mesh makes small interactions safe.
    bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    o['destination']=group

# Local pivots make the pet's gait and tail motion independent of its route.
dog=bpy.data.objects['dog']
bpy.context.scene.cursor.location=(cx,cy,0)
bpy.ops.object.select_all(action='DESELECT');dog.select_set(True);bpy.context.view_layer.objects.active=dog;bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
for name,pivot in [('dog-tail',(cx+.28,cy,.35))]+[(f'dog-leg-{i}',(xx,yy,.24)) for i,(xx,yy) in enumerate([(cx-.23,cy-.105),(cx-.23,cy+.105),(cx+.22,cy-.105),(cx+.22,cy+.105)])]:
    o=bpy.data.objects[name];bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.context.scene.cursor.location=pivot;bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    matrix=o.matrix_world.copy();o.parent=dog;o.matrix_world=matrix

# Geometry checks stay executable with the model source.
for name in ['reading','writing','works','guestbook','dog']:
    assert bpy.data.objects.get(name) and len(bpy.data.objects[name].data.polygons)>20,name
triangles=sum(len(p.vertices)-2 for o in bpy.context.scene.objects if o.type=='MESH' for p in o.data.polygons)
assert triangles<650000,triangles
out=ROOT/'public/models';out.mkdir(parents=True,exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(out/'paper-town.glb'),export_format='GLB',export_extras=True,export_yup=True,export_cameras=False,export_lights=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)

# A real Blender render provides a review image of the exported geometry.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32
scene.cycles.use_denoising=True
world=bpy.data.worlds.new('Warm studio');scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.78,.81,.85,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.65
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.115));floor=bpy.context.object;floor.name='Render-only floor';floor.data.materials.append(trim)
def area(name,loc,power,size):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-5,-6,10),1600,7)
area('Window fill',(5,3,8),700,6)
bpy.ops.object.camera_add(location=(10,-16,12));cam=bpy.context.object;cam.name='Hero camera';cam.rotation_euler=(Vector((0,0,.6))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=13.3;scene.camera=cam
scene.render.resolution_x=1400;scene.render.resolution_y=1050;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'output/models/paper-town.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'output/models/paper-town.blend'))
print(json.dumps({'triangles':triangles,'bytes':(out/'paper-town.glb').stat().st_size}),flush=True)
bpy.ops.render.render(write_still=True)
