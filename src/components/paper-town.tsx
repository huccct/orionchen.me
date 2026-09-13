'use client'

import Image from 'next/image'
import { neighborhoodWalk } from '@/lib/neighborhood'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { RotateCcw, RotateCw, ArrowUpRight, Pause, Play } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { useTheme } from 'next-themes'

type Props = {
  interiorOpen: boolean
  active: number
  labels: string[]
  hrefs: string[]
  zh: boolean
  onSelect: (index: number) => void
  onDog: () => void
  onGuestbook: () => void
}
const names = ['writing', 'works', 'reading', 'guestbook', 'dog']
// Coordinates are the Blender landmarks converted from Z-up to glTF Y-up.
const anchors = [
  [2.85, 3.1, -1.25],
  [-0.55, 3.5, -2.05],
  [-3, 2.9, 0.85],
  [3, 1.5, 2.5],
  [0.03, 0.65, 2.85],
]

export default function PaperTown(props: Props) {
  const host = useRef<HTMLDivElement>(null)
  const labels = useRef<(HTMLElement | null)[]>([])
  const callbacks = useRef(props)
  const api = useRef<{
    motion: (paused: boolean) => void
    enter: (index: number) => void
    reset: () => void
    rotate: () => void
    theme: (dark: boolean) => void
    select: (index: number) => void
  } | null>(null)
  const { resolvedTheme } = useTheme()
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState<number | null>(null)
  useEffect(() => {
    callbacks.current = props
    api.current?.select(props.active)
    api.current?.motion(paused || props.interiorOpen)
  }, [props, paused])
  useEffect(() => {
    api.current?.theme(resolvedTheme === 'dark')
  }, [resolvedTheme])

  useEffect(() => {
    const container = host.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      })
    } catch {
      const fallback = window.setTimeout(() => setStatus('fallback'), 0)
      return () => window.clearTimeout(fallback)
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.domElement.setAttribute(
      'aria-label',
      props.zh
        ? '纸模型街区，拖动旋转。也可使用下方导航按钮。'
        : 'Paper neighborhood. Drag to rotate, or use the navigation buttons.'
    )
    renderer.domElement.setAttribute('role', 'img')
    container.prepend(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-7, 7, 5.5, -5.5, 0.1, 100)
    const home = new THREE.Vector3(10, 12, 16)
    camera.position.copy(home)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.8, 0)
    renderer.domElement.style.touchAction = 'none'
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI / 5
    controls.maxPolarAngle = Math.PI / 2.6
    controls.minAzimuthAngle = -0.95
    controls.maxAzimuthAngle = 1.35
    controls.rotateSpeed = 0.55
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    controls.enableDamping = !reduced.matches
    controls.dampingFactor = 0.12
    controls.update()
    controls.saveState()
    // One shadow-casting key, plus soft sky fill, keeps the model legible on mobile.
    const fill = new THREE.HemisphereLight(0xfff5e0, 0x81725d, 2)
    scene.add(fill)
    const sun = new THREE.DirectionalLight(0xfff5e8, 3)
    sun.position.set(-5, 10, 7)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 30 })
    sun.shadow.radius = 4
    sun.shadow.blurSamples = 8
    sun.shadow.bias = -0.0003
    sun.shadow.normalBias = 0.025
    scene.add(sun)
    const bounce = new THREE.DirectionalLight(0xe6eeff, 1)
    bounce.position.set(5, 4, -5)
    scene.add(bounce)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setRGB(0.94, 0.875, 0.74),
        roughness: 1,
      })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0.002
    floor.receiveShadow = true
    scene.add(floor)
    let town: THREE.Group | null = null
    let disposed = false,
      visible = true,
      frame = 0,
      lastTime = 0
    let motionPaused = callbacks.current.interiorOpen,
      elapsed = 0
    const residents: THREE.Object3D[] = []
    const routes = [
      [
        [1, 3.5],
        [0.8, 2.7],
        [1.2, 1.2],
        [0.8, -0.1],
        [-0.55, -1],
      ],
      [
        [-2.8, 1.9],
        [-2, 1.7],
        [-0.6, 1.2],
        [0.9, 1.4],
      ],
      [
        [0.03, 2.85],
        [0.8, 2.7],
        [1.2, 1.2],
        [0.8, -0.1],
      ],
    ].map(
      (points) => new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)))
    )
    const movingPoint = new THREE.Vector3()
    const restRotations = new WeakMap<THREE.Object3D, THREE.Quaternion>()
    const jointRotation = new THREE.Quaternion()
    function joint(model: THREE.Object3D, name: string, axis: 'x' | 'y' | 'z', angle: number) {
      const limb = model.getObjectByName(name)
      if (!limb) return
      if (!restRotations.has(limb)) restRotations.set(limb, limb.quaternion.clone())
      jointRotation.setFromAxisAngle(
        new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0),
        angle
      )
      limb.quaternion.copy(restRotations.get(limb)!).premultiply(jointRotation)
    }
    function walk(model: THREE.Object3D, index: number, time: number) {
      const route = routes[index]!
      const duration = route.getLength() / (index === 2 ? 0.36 : 0.27)
      const { returning, moving, u } = neighborhoodWalk(time + index * 7, duration)
      route.getPointAt(u, movingPoint)
      model.position.copy(movingPoint)
      const tangent = route.getTangentAt(u).multiplyScalar(returning ? -1 : 1)
      const heading = Math.atan2(tangent.x, tangent.z) + (index === 2 ? Math.PI / 2 : 0)
      model.rotation.y +=
        Math.atan2(Math.sin(heading - model.rotation.y), Math.cos(heading - model.rotation.y)) *
        0.09
      const stride = moving ? Math.sin(time * (index === 2 ? 10 : 6)) * 0.38 : 0
      model.position.y = moving ? Math.abs(stride) * 0.025 : 0
      if (index === 2) {
        for (let i = 0; i < 4; i++) {
          joint(model, `dog-leg-${i}`, 'z', stride * (i === 0 || i === 3 ? 1 : -1))
        }
        joint(model, 'dog-tail', 'y', Math.sin(time * 7) * 0.4)
      } else {
        for (const [name, sign] of [
          ['leg-left', 1],
          ['leg-right', -1],
          ['arm-left', -1],
          ['arm-right', 1],
        ] as const) {
          joint(model, name, 'x', stride * sign)
        }
        joint(model, 'head', 'y', moving ? 0 : Math.sin(time * 0.8) * 0.18)
      }
    }
    let active = callbacks.current.active
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const projected = new THREE.Vector3()
    const draco = new DRACOLoader()
      .setDecoderPath('/models/draco/')
      .setDecoderConfig({ type: 'wasm' })
      .setWorkerLimit(2)
    const loader = new GLTFLoader().setDRACOLoader(draco)
    function requestRender() {
      if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render)
    }
    let entering: { start: number; index: number; target: THREE.Vector3 } | null = null
    const originalTarget = new THREE.Vector3()
    function enter(index: number) {
      if (entering) return
      if (reduced.matches) {
        activate(index)
        return
      }
      originalTarget.copy(controls.target)
      entering = {
        start: performance.now(),
        index,
        target: new THREE.Vector3(...anchors[index]!).multiply(new THREE.Vector3(1, 0.45, 1)),
      }
      controls.enabled = false
      requestRender()
    }
    function render(time: number) {
      frame = 0
      if (entering) {
        const progress = Math.min((time - entering.start) / 850, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        camera.zoom = 1 + ease * 2.2
        controls.target.lerpVectors(originalTarget, entering.target, ease)
        camera.updateProjectionMatrix()
        if (progress < 1) requestRender()
        else {
          const index = entering.index
          entering = null
          activate(index)
          camera.zoom = 1
          controls.reset()
          controls.enabled = true
          camera.updateProjectionMatrix()
        }
      }
      controls.update()
      const dog = town?.getObjectByName('dog')
      const animate = !motionPaused && !reduced.matches && visible && !document.hidden
      if (animate) {
        elapsed += lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
        residents.forEach((resident, i) => walk(resident, i, elapsed))
        if (dog) walk(dog, 2, elapsed)
        requestRender()
      }
      lastTime = animate ? time : 0
      const { width, height } = container.getBoundingClientRect()
      anchors.forEach((point, index) => {
        const el = labels.current[index]
        if (!el) return
        if (index === 4 && dog) projected.copy(dog.position).add(new THREE.Vector3(0, 0.7, 0))
        else projected.set(point[0]!, point[1]!, point[2]!)
        projected.project(camera)
        el.style.left = `${THREE.MathUtils.clamp((projected.x * 0.5 + 0.5) * width, 42, width - 42)}px`
        el.style.top = `${THREE.MathUtils.clamp((-projected.y * 0.5 + 0.5) * height, 110, height - 110)}px`
      })
      renderer.render(scene, camera)
    }
    function resize() {
      const width = container.clientWidth,
        height = container.clientHeight
      if (!width || !height) return
      const aspect = width / height
      const halfWidth = aspect < 0.8 ? 3.35 : Math.max(4.9, 3.8 * aspect)
      camera.left = -halfWidth
      camera.right = halfWidth
      camera.top = halfWidth / aspect
      camera.bottom = -halfWidth / aspect
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      requestRender()
    }
    function disposeModel(model: THREE.Object3D) {
      const materials = new Set<THREE.Material>()
      model.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          for (const mat of Array.isArray(obj.material) ? obj.material : [obj.material])
            materials.add(mat)
        }
      })
      materials.forEach((mat) => mat.dispose())
    }
    function highlight(index: number) {
      if (!town) return
      town.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return
        let parent: THREE.Object3D | null = obj
        while (parent && !names.includes(parent.name)) parent = parent.parent
        const selected = parent?.name === names[index]
        for (const material of Array.isArray(obj.material) ? obj.material : [obj.material]) {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissive.set(selected ? 0x6b3c13 : 0x000000)
            material.emissiveIntensity = selected ? 0.12 : 0
          }
        }
      })
      requestRender()
    }
    loader.load(
      '/models/paper-town.glb',
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene)
          return
        }
        town = gltf.scene
        const originalMaterials = new Set<THREE.Material>()
        town.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = obj.name !== 'ground'
            obj.receiveShadow = true
            for (const material of Array.isArray(obj.material) ? obj.material : [obj.material])
              originalMaterials.add(material)
            // Clone shared glTF materials once so highlighting one building cannot tint another.
            obj.material = Array.isArray(obj.material)
              ? obj.material.map((m) => m.clone())
              : obj.material.clone()
          }
        })
        originalMaterials.forEach((material) => material.dispose())
        scene.add(town)
        setStatus('ready')
        resize()
        highlight(active)
      },
      undefined,
      () => {
        if (!disposed) setStatus('fallback')
      }
    )
    loader.load(
      '/models/resident.glb',
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene)
          return
        }
        const template = gltf.scene.getObjectByName('resident')!
        for (let i = 0; i < 2; i++) {
          const resident = template.clone(true)
          resident.scale.setScalar(i ? 0.68 : 0.74)
          resident.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.castShadow = true
              obj.receiveShadow = true
            }
          })
          walk(resident, i, 0)
          residents.push(resident)
          scene.add(resident)
        }
        requestRender()
      },
      undefined,
      () => {
        /* The town remains usable if the optional residents cannot load. */
      }
    )
    function theme(dark: boolean) {
      fill.intensity = dark ? 1.25 : 2
      sun.intensity = dark ? 1.6 : 2.2
      renderer.toneMappingExposure = dark ? 0.9 : 1.15
      requestRender()
    }
    api.current = {
      motion: (paused) => {
        motionPaused = paused
        lastTime = 0
        requestRender()
      },
      enter,
      reset: () => {
        controls.reset()
        requestRender()
      },
      rotate: () => {
        camera.position
          .sub(controls.target)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.25)
          .add(controls.target)
        controls.update()
        requestRender()
      },
      theme,
      select: (index) => {
        active = index
        highlight(index)
      },
    }
    theme(document.documentElement.classList.contains('dark'))
    let downX = 0,
      downY = 0
    function hit(event: PointerEvent) {
      if (!town) return -1
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(pointer, camera)
      for (const intersection of raycaster.intersectObject(town, true)) {
        let obj: THREE.Object3D | null = intersection.object
        while (obj) {
          const index = names.indexOf(obj.name)
          if (index >= 0) return index
          obj = obj.parent
        }
        // Opaque ground and vegetation obscure items behind them.
        return -1
      }
      return -1
    }
    function pointerDown(event: PointerEvent) {
      downX = event.clientX
      downY = event.clientY
    }
    function pointerMove(event: PointerEvent) {
      if (event.buttons) return
      const index = hit(event)
      setHover(index < 0 ? null : index)
      renderer.domElement.style.cursor = index < 0 ? 'grab' : 'pointer'
      highlight(index < 0 ? active : index)
    }
    function pointerLeave() {
      setHover(null)
      highlight(active)
    }
    function pointerUp(event: PointerEvent) {
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return
      const index = hit(event)
      if (index < 0) return
      if (index === 4) {
        callbacks.current.onDog()
      } else enter(index)
    }
    function motionChange() {
      controls.enableDamping = !reduced.matches
      requestRender()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (visible) requestRender()
    })
    intersection.observe(container)
    document.addEventListener('visibilitychange', requestRender)
    reduced.addEventListener('change', motionChange)
    controls.addEventListener('change', requestRender)
    renderer.domElement.addEventListener('pointerdown', pointerDown)
    renderer.domElement.addEventListener('pointermove', pointerMove)
    renderer.domElement.addEventListener('pointerup', pointerUp)
    renderer.domElement.addEventListener('pointerleave', pointerLeave)
    function lost(event: Event) {
      event.preventDefault()
      visible = false
      cancelAnimationFrame(frame)
      setStatus('fallback')
    }
    renderer.domElement.addEventListener('webglcontextlost', lost)
    resize()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      api.current = null
      observer.disconnect()
      intersection.disconnect()
      controls.dispose()
      draco.dispose()
      reduced.removeEventListener('change', motionChange)
      document.removeEventListener('visibilitychange', requestRender)
      renderer.domElement.removeEventListener('pointerdown', pointerDown)
      renderer.domElement.removeEventListener('pointermove', pointerMove)
      renderer.domElement.removeEventListener('pointerup', pointerUp)
      renderer.domElement.removeEventListener('pointerleave', pointerLeave)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      if (town) disposeModel(town)
      if (residents[0]) disposeModel(residents[0])
      floor.geometry.dispose()
      floor.material.dispose()
      sun.shadow.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
    // The WebGL scene lives for the component lifetime; callbacks and selection use refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function activate(index: number) {
    if (index === 4) callbacks.current.onDog()
    else if (index === 3) callbacks.current.onGuestbook()
    else callbacks.current.onSelect(index)
  }
  return (
    <div className="paper-town" data-state={status}>
      <div ref={host} className="town-canvas">
        {status !== 'ready' && (
          <Image
            className="town-poster"
            loading="eager"
            src="/images/paper-town.webp"
            width={1400}
            height={1050}
            alt=""
            sizes="100vw"
          />
        )}
        {props.labels.map((label, index) => {
          const className = `town-label town-label-${index}`
          return index < 4 ? (
            <Link
              key={label}
              href={props.hrefs[index]!}
              ref={(el) => {
                labels.current[index] = el
              }}
              className={className}
              data-active={props.active === index || hover === index}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  status !== 'ready'
                )
                  return
                event.preventDefault()
                api.current?.enter(index)
              }}
            >
              {label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ) : (
            <button
              key={label}
              ref={(el) => {
                labels.current[index] = el
              }}
              className={className}
              onClick={() => activate(index)}
              aria-label={props.zh ? '跟狗狗去读一篇文章' : 'Follow the dog to a random post'}
            >
              {label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          )
        })}
      </div>
      <div className="town-controls">
        <p role="status">
          {status === 'loading'
            ? props.zh
              ? '正在打开小镇…'
              : 'Opening the town…'
            : status === 'fallback'
              ? props.zh
                ? '静态视图 · 各站仍可点击'
                : 'Still view · all stops remain available'
              : props.zh
                ? '拖动看看 · 点小屋，进去坐坐'
                : 'Drag to explore · click a house to enter'}
        </p>
        <button
          disabled={status !== 'ready'}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
          aria-label={
            props.zh
              ? paused
                ? '继续小镇活动'
                : '暂停小镇活动'
              : paused
                ? 'Resume town life'
                : 'Pause town life'
          }
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
        <button
          disabled={status !== 'ready'}
          onClick={() => api.current?.rotate()}
          aria-label={props.zh ? '旋转小镇' : 'Rotate the town'}
        >
          <RotateCw size={17} />
        </button>
        <button disabled={status !== 'ready'} onClick={() => api.current?.reset()}>
          <RotateCcw size={15} />
          {props.zh ? '回到正面' : 'Reset view'}
        </button>
      </div>
    </div>
  )
}
