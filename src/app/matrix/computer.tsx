'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { MatrixTerminal } from './terminal'
import { MatrixTerminal as TerminalContent } from './terminal'
import type { ComponentProps } from 'react'

export function monitorPath(href: string, origin: string) {
  try {
    const url = new URL(href, origin)
    if (
      url.origin !== origin ||
      !['http:', 'https:'].includes(url.protocol) ||
      url.pathname === '/' ||
      url.pathname === '/matrix' ||
      url.pathname.startsWith('/matrix/')
    )
      return null
    return url.pathname + url.search + url.hash
  } catch {
    return null
  }
}

export function MatrixComputer({ posts }: ComponentProps<typeof MatrixTerminal>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(false)
  const [zoomed, setZoomed] = useState(false)
  const toggleZoom = (value: boolean) => {
    zoomRef.current = value
    setZoomed(value)
  }
  const [inside, setInside] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const motionPausedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [activePath, setActivePath] = useState<string | null>(null)
  const readingRef = useRef(false)
  useEffect(() => {
    readingRef.current = activePath !== null
  }, [activePath])
  const [frameLoading, setFrameLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lampOnRef = useRef(true)
  const [lampOn, setLampOn] = useState(true)

  function openInMonitor(event: React.MouseEvent<HTMLDivElement>) {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
    if (
      !link ||
      link.target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return
    const path = monitorPath(link.href, window.location.origin)
    if (!path) return
    event.preventDefault()
    if (path === activePath) {
      iframeRef.current?.focus()
      return
    }
    setFrameLoading(true)
    setActivePath(path)
  }

  function prepareReader() {
    const frame = iframeRef.current
    const doc = frame?.contentDocument
    if (!doc || !frame?.contentWindow) return
    const style = doc.createElement('style')
    style.textContent = `
      :root, html.dark { color-scheme:dark; --background:#07130c; --foreground:#c1d8c7; --muted:#112419; --muted-foreground:#a1b9a9; --border:#2c4634; --accent:#a7e8b9; --card:#0b1b11; }
      html, body { background:#07130c!important; color:#c1d8c7!important; font-size:15px; scrollbar-width:thin; scrollbar-color:#426c50 #07130c; }
      body::before, .site-header, .site-footer, .detail-navigation { display:none!important; }
      body > main { padding:22px!important; max-width:100%!important; }
      h1 { font-size:24px!important; line-height:1.5!important; } h2 { font-size:20px!important; }
      .prose { font-size:15px!important; line-height:1.95!important; } .prose p { color:#c1d8c7!important; }
      a { color:#b1efc2; } pre { background:#0d2115!important; } ::selection {background:#a0d8ae;color:#07130c;}
      @media(max-width:480px) { body > main {padding:14px!important;} h1 {font-size:20px!important;} }
    `
    doc.head.appendChild(style)
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setActivePath(null)
        screenRef.current?.focus()
      }
    })
    doc.addEventListener(
      'click',
      (event) => {
        const target = event.target as Element
        const link = target.closest<HTMLAnchorElement>('a[href]')
        if (!link) return
        const url = new URL(link.href)
        if (url.origin !== window.location.origin) {
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          return
        }
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === '_blank'
        )
          return
        if (
          url.pathname === doc.location.pathname &&
          url.search === doc.location.search &&
          url.hash
        )
          return
        event.preventDefault()
        event.stopPropagation()
        if (url.pathname === '/' || url.pathname === '/matrix') {
          setActivePath(null)
          screenRef.current?.focus()
        } else {
          const path = monitorPath(link.href, window.location.origin)
          if (path && path !== activePath) {
            setFrameLoading(true)
            setActivePath(path)
          }
        }
      },
      true
    )
    setFrameLoading(false)
    if (zoomRef.current) frame.focus()
  }

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    Promise.all([
      import('three'),
      import('three/addons/geometries/RoundedBoxGeometry.js'),
      import('three/addons/environments/RoomEnvironment.js'),
    ])
      .then(([THREE, { RoundedBoxGeometry }, { RoomEnvironment }]) => {
        if (disposed || !canvasRef.current) return
        const canvas = canvasRef.current
        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
        } catch {
          setFailed(true)
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.shadowMap.autoUpdate = false
        renderer.shadowMap.needsUpdate = true
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#070d0b')
        scene.fog = new THREE.FogExp2('#070d0b', 0.032)
        const environment = new RoomEnvironment()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const environmentTarget = pmrem.fromScene(environment, 0.08)
        scene.environment = environmentTarget.texture
        scene.environmentIntensity = 0.16
        environment.dispose()
        pmrem.dispose()
        const textures: InstanceType<typeof THREE.Texture>[] = []
        // ponytail: local procedural textures avoid network/model loading; scanned assets can replace these if fidelity needs to go further.
        function surface(kind: 'wood' | 'plaster' | 'plastic') {
          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 512
          const c = canvas.getContext('2d')!
          const pixels = c.createImageData(512, 512)
          for (let y = 0; y < 512; y++)
            for (let x = 0; x < 512; x++) {
              const i = (y * 512 + x) * 4
              const noise = Math.random() * 18
              const grain =
                kind === 'wood'
                  ? Math.sin(y * 0.55 + Math.sin(x * 0.012) * 3) * 12 +
                    Math.sin(y * 2.5 + x * 0.008) * 5
                  : 0
              const shade = kind === 'wood' ? 100 + grain + noise : 190 + noise
              pixels.data[i] = shade
              pixels.data[i + 1] = kind === 'wood' ? shade * 0.72 : shade
              pixels.data[i + 2] = kind === 'wood' ? shade * 0.48 : shade
              pixels.data[i + 3] = 255
            }
          c.putImageData(pixels, 0, 0)
          if (kind === 'wood') {
            c.strokeStyle = '#261b1640'
            c.lineWidth = 1
            for (let i = 0; i < 6; i++) {
              c.beginPath()
              c.moveTo(0, i * 91)
              c.lineTo(512, i * 91 + 2)
              c.stroke()
            }
          }
          const texture = new THREE.CanvasTexture(canvas)
          texture.colorSpace = THREE.SRGBColorSpace
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          textures.push(texture)
          return texture
        }
        const wood = surface('wood'),
          plaster = surface('plaster'),
          plastic = surface('plastic')
        const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80)
        const target = new THREE.Vector3(0, 1.45, 0)
        const lookAt = target.clone()
        const closeTarget = new THREE.Vector3(0, 2.1, 0.609)
        const closePosition = new THREE.Vector3()
        const readingPosition = new THREE.Vector3(0, 2.1, 2.75)
        const destination = new THREE.Vector3()
        const screenTop = new THREE.Vector3(),
          screenBottom = new THREE.Vector3()
        const ambient = new THREE.HemisphereLight('#9badb2', '#21180f', 0.45)
        scene.add(ambient)
        const lamp = new THREE.SpotLight('#ffd19a', 30, 9, 0.95, 0.9, 2)
        lamp.position.set(-2.5, 2.28, 0.3)
        lamp.target.position.set(-0.3, 0.55, 0.9)
        lamp.castShadow = true
        lamp.shadow.mapSize.set(1024, 1024)
        lamp.shadow.bias = -0.0002
        lamp.shadow.normalBias = 0.025
        scene.add(lamp, lamp.target)
        const rim = new THREE.PointLight('#78bfa5', 9, 9, 2)
        rim.position.set(2.2, 3.5, -1.7)
        scene.add(rim)
        const screenLight = new THREE.PointLight('#80ffaf', 2.8, 4, 2)
        screenLight.position.set(0, 1.9, 1.2)
        scene.add(screenLight)
        const beige = new THREE.MeshStandardMaterial({
          color: '#bcb8a5',
          map: plastic,
          bumpMap: plastic,
          bumpScale: 0.008,
          roughness: 0.68,
        })
        const dark = new THREE.MeshStandardMaterial({ color: '#101914', roughness: 0.8 })
        const edge = new THREE.MeshStandardMaterial({
          color: '#47534b',
          roughness: 0.48,
          metalness: 0.2,
        })
        function box(
          w: number,
          h: number,
          d: number,
          x: number,
          y: number,
          z: number,
          material: InstanceType<typeof THREE.Material> = beige
        ) {
          const mesh = new THREE.Mesh(
            new RoundedBoxGeometry(w, h, d, 2, Math.min(0.055, w / 5, h / 5, d / 5)),
            material
          )
          mesh.position.set(x, y, z)
          mesh.castShadow = true
          mesh.receiveShadow = true
          scene.add(mesh)
          return mesh
        }
        function cylinder(
          radius: number,
          height: number,
          x: number,
          y: number,
          z: number,
          material = dark
        ) {
          const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(radius, radius, height, 32),
            material
          )
          mesh.position.set(x, y, z)
          mesh.castShadow = true
          mesh.receiveShadow = true
          scene.add(mesh)
          return mesh
        }
        // The monitor is built from simple solid parts, so no downloaded model blocks entry.
        box(
          8,
          0.18,
          4,
          0,
          0.45,
          0.25,
          new THREE.MeshStandardMaterial({
            color: '#9a8270',
            map: wood,
            bumpMap: wood,
            bumpScale: 0.025,
            roughness: 0.63,
          })
        )
        box(
          8,
          5,
          0.15,
          0,
          2.5,
          -2.3,
          new THREE.MeshStandardMaterial({
            color: '#49504a',
            map: plaster,
            bumpMap: plaster,
            bumpScale: 0.018,
            roughness: 0.95,
          })
        )
        box(0.15, 5, 5, -4, 2.5, 0, dark)
        box(2.8, 0.28, 1.8, 0, 0.69, 0, beige)
        box(0.65, 0.38, 0.65, 0, 0.96, -0.15, edge)
        box(2.65, 2.12, 1.5, 0, 2, -0.26, beige)
        box(2.37, 1.78, 0.09, 0, 2.08, 0.51, edge)
        box(2.21, 1.59, 0.06, 0, 2.1, 0.57, dark)
        box(2.4, 0.11, 0.11, 0, 1.08, 0.55, beige)
        for (let i = 0; i < 14; i++) box(0.018, 0.15, 0.012, -1.1 + i * 0.047, 1.24, 0.502, dark)
        const monitorKnobs = Array.from({ length: 4 }, (_, i) => {
          const knob = cylinder(0.045, 0.025, 0.62 + i * 0.14, 1.22, 0.56, edge)
          knob.rotation.x = Math.PI / 2
          return knob
        })
        const led = new THREE.MeshBasicMaterial({ color: '#90ff9a' })
        box(0.035, 0.025, 0.013, 1.12, 1.22, 0.518, led)
        for (let i = 0; i < 10; i++) box(0.012, 0.025, 0.65, 1.331, 2.6 - i * 0.075, -0.3, dark)
        const screen = document.createElement('canvas')
        screen.width = 1024
        screen.height = 768
        const ctx = screen.getContext('2d')!
        const texture = new THREE.CanvasTexture(screen)
        texture.colorSpace = THREE.SRGBColorSpace
        const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
        const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.09, 1.47), screenMaterial)
        screenMesh.position.set(0, 2.1, 0.609)
        scene.add(screenMesh)
        function drawScreen(t: number) {
          ctx.fillStyle = '#03110a'
          ctx.fillRect(0, 0, 1024, 768)
          ctx.fillStyle = '#619b73'
          ctx.font = '20px monospace'
          ctx.fillText('ORION PERSONAL COMPUTER', 55, 65)
          ctx.fillText('CONSTRUCT OS / v.01', 55, 101)
          ctx.strokeStyle = '#224c32'
          ctx.beginPath()
          ctx.moveTo(55, 128)
          ctx.lineTo(970, 128)
          ctx.stroke()
          ctx.shadowColor = '#50ff89'
          ctx.shadowBlur = 10
          ctx.fillStyle = '#a1ffc0'
          ctx.font = '62px monospace'
          ctx.fillText('Wake up, Orion.', 55, 300)
          ctx.font = '28px monospace'
          ctx.fillStyle = '#63c185'
          ctx.fillText('The Matrix has you...', 55, 370)
          ctx.shadowBlur = 0
          ctx.fillStyle = '#89c49c'
          ctx.font = '23px monospace'
          ctx.fillText('Follow the white rabbit.', 55, 503)
          ctx.fillStyle = '#7bed9d'
          ctx.fillText('> enter the construct', 55, 595)
          if (Math.floor(t / 700) % 2 === 0) ctx.fillRect(369, 574, 15, 25)
          ctx.font = '17px monospace'
          ctx.fillStyle = '#679a77'
          ctx.fillText('CLICK THE SCREEN TO CONNECT', 55, 708)
          ctx.fillStyle = 'rgba(0,0,0,.18)'
          for (let y = 0; y < 768; y += 4) ctx.fillRect(0, y, 1024, 1)
          texture.needsUpdate = true
        }
        box(2.65, 0.12, 0.82, 0, 0.62, 1.45, beige)
        for (let row = 0; row < 5; row++)
          for (let col = 0; col < 15; col++) {
            if (row === 4 && col > 3 && col < 10) continue
            box(0.135, 0.045, 0.105, -1.18 + col * 0.166, 0.703, 1.16 + row * 0.14, edge)
          }
        box(0.98, 0.045, 0.105, -0.03, 0.703, 1.72, edge)
        const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16), beige)
        mouse.scale.set(0.8, 0.45, 1.35)
        mouse.position.set(1.86, 0.64, 1.4)
        scene.add(mouse)
        const wire = new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.85, 0.56, 1.2),
          new THREE.Vector3(2.2, 0.56, 0.8),
          new THREE.Vector3(1.5, 0.56, 0.5),
          new THREE.Vector3(1.3, 0.56, -0.4),
        ])
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(wire, 32, 0.018, 6, false), dark))
        function printedPlane(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
          const label = document.createElement('canvas')
          label.width = 1024
          label.height = 512
          draw(label.getContext('2d')!)
          const map = new THREE.CanvasTexture(label)
          map.colorSpace = THREE.SRGBColorSpace
          textures.push(map)
          const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({
              map,
              transparent: true,
              toneMapped: false,
              depthWrite: false,
            })
          )
          scene.add(plane)
          return plane
        }
        const brand = printedPlane(0.52, 0.13, (c) => {
          c.fillStyle = '#444c42'
          c.font = 'bold 90px monospace'
          c.fillText('ORION', 10, 240)
          c.font = '45px monospace'
          c.fillText('PERSONAL COMPUTER', 10, 340)
        })
        brand.position.set(-0.75, 1.17, 0.62)
        const keyboardPrint = printedPlane(2.49, 0.71, (c) => {
          c.fillStyle = '#cbd2b8'
          c.font = '22px monospace'
          const rows = ['1234567890-=⌫', 'QWERTYUIOP[]', 'ASDFGHJKL;', 'ZXCVBNM,./']
          rows.forEach((row, r) =>
            Array.from(row).forEach((key, i) => c.fillText(key, 24 + i * 67, 75 + r * 101))
          )
        })
        keyboardPrint.rotation.x = -Math.PI / 2
        keyboardPrint.position.set(0, 0.729, 1.42)
        const disk = box(
          0.57,
          0.035,
          0.6,
          2.15,
          0.575,
          0.7,
          new THREE.MeshStandardMaterial({ color: '#182327', roughness: 0.65 })
        )
        disk.rotation.y = -0.2
        const diskLabel = printedPlane(0.4, 0.25, (c) => {
          c.fillStyle = '#c1b998'
          c.fillRect(0, 0, 1024, 512)
          c.fillStyle = '#3e453d'
          c.font = '80px monospace'
          c.fillText('FOLLOW THE', 70, 170)
          c.fillText('WHITE RABBIT', 70, 290)
        })
        diskLabel.rotation.set(-Math.PI / 2, 0, -0.2)
        diskLabel.position.set(2.15, 0.596, 0.74)
        const note = printedPlane(0.7, 0.85, (c) => {
          c.fillStyle = '#b6ad89'
          c.fillRect(0, 0, 1024, 512)
          c.fillStyle = '#354336'
          c.font = 'italic 50px serif'
          c.fillText('What is real?', 70, 130)
          c.font = '30px monospace'
          c.fillText('ideas / code / everyday life', 70, 220)
          c.strokeStyle = '#53604c'
          c.beginPath()
          c.moveTo(70, 260)
          c.lineTo(900, 260)
          c.stroke()
        })
        note.rotation.set(-Math.PI / 2, 0, 0.14)
        note.position.set(-2.7, 0.549, 1.18)
        // Window, rain, and distant buildings make a room beyond the monitor.
        box(2.65, 3, 0.07, 2.05, 2.8, -2.19, dark)
        box(
          2.45,
          2.8,
          0.02,
          2.05,
          2.8,
          -2.13,
          new THREE.MeshStandardMaterial({
            color: '#073325',
            emissive: '#092c24',
            emissiveIntensity: 0.4,
            roughness: 0.3,
          })
        )
        box(0.055, 2.9, 0.1, 2.05, 2.8, -2.05, edge)
        box(2.55, 0.06, 0.1, 2.05, 2.8, -2.05, edge)
        for (let i = 0; i < 7; i++) {
          const h = 0.5 + (i % 3) * 0.31
          box(0.27, h, 0.03, 0.94 + i * 0.34, 1.43 + h / 2, -2.09, dark)
          for (let j = 0; j < 3; j++)
            box(
              0.025,
              0.04,
              0.01,
              0.91 + i * 0.34,
              1.6 + j * 0.19,
              -2.065,
              new THREE.MeshStandardMaterial({
                color: '#6da383',
                emissive: '#315d42',
                emissiveIntensity: 1.5,
              })
            )
        }
        const rainGeometry = new THREE.BufferGeometry()
        const drops = new Float32Array(240 * 6)
        for (let i = 0; i < 240; i++) {
          const x = 0.85 + Math.random() * 2.4,
            y = 1.4 + Math.random() * 2.8
          drops.set([x, y, -2.01, x - 0.008, y + 0.055, -2.01], i * 6)
        }
        const rainPositions = new THREE.BufferAttribute(drops, 3)
        rainGeometry.setAttribute('position', rainPositions)
        const rain = new THREE.LineSegments(
          rainGeometry,
          new THREE.LineBasicMaterial({
            color: '#9ec5bd',
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
          })
        )
        scene.add(rain)
        // A task lamp and a mug give the workstation a human scale.
        cylinder(0.32, 0.05, -2.5, 0.58, 0.2, edge)
        cylinder(0.035, 1.8, -2.5, 1.49, 0.2, edge)
        const shade = new THREE.Mesh(
          new THREE.ConeGeometry(0.45, 0.38, 32, 1, true),
          new THREE.MeshStandardMaterial({
            color: '#25352e',
            metalness: 0.7,
            roughness: 0.3,
            side: THREE.DoubleSide,
          })
        )
        shade.position.set(-2.5, 2.43, 0.2)
        scene.add(shade)
        const bulb = new THREE.PointLight('#ffc88d', 1.8, 3, 2)
        bulb.position.set(-2.5, 2.24, 0.2)
        scene.add(bulb)
        const bulbSurface = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 16, 12),
          new THREE.MeshBasicMaterial({ color: '#ffe2b0' })
        )
        bulbSurface.position.copy(bulb.position)
        scene.add(bulbSurface)
        cylinder(0.19, 0.37, -1.95, 0.74, 1.35, beige)
        cylinder(
          0.16,
          0.008,
          -1.95,
          0.93,
          1.35,
          new THREE.MeshStandardMaterial({ color: '#0b100c' })
        )
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 10, 24), beige)
        handle.position.set(-2.17, 0.77, 1.35)
        scene.add(handle)
        for (let i = 0; i < 3; i++)
          box(
            0.85,
            0.1,
            0.62,
            2.75,
            0.61 + i * 0.11,
            0.25,
            new THREE.MeshStandardMaterial({ color: ['#394539', '#56674f', '#25382c'][i] })
          )
        let pointerX = 0,
          pointerY = 0,
          frame = 0,
          last = 0,
          lastCursorPhase = -1,
          lastRenderedState = ''
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        const base = new THREE.Vector3()
        function resize() {
          const w = canvas.clientWidth,
            h = canvas.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          base.set(w < 600 ? 0.4 : 3.3, w < 600 ? 2.8 : 3.15, w < 600 ? 11.8 : 8.2)
          closePosition.set(
            0,
            2.1,
            0.609 + Math.max(2.7, 1.3 / (Math.tan(THREE.MathUtils.degToRad(19.5)) * camera.aspect))
          )
          camera.position.copy(zoomRef.current ? closePosition : base)
          camera.lookAt(target)
        }
        const observer = new ResizeObserver(resize)
        observer.observe(canvas)
        resize()
        const raycaster = new THREE.Raycaster()
        function hitScreen(event: PointerEvent) {
          const r = canvas.getBoundingClientRect()
          raycaster.setFromCamera(
            new THREE.Vector2(
              ((event.clientX - r.left) / r.width) * 2 - 1,
              -((event.clientY - r.top) / r.height) * 2 + 1
            ),
            camera
          )
          return raycaster.intersectObject(screenMesh).length > 0
        }
        const onMove = (event: PointerEvent) => {
          pointerX = (event.clientX / window.innerWidth - 0.5) * 0.38
          pointerY = (event.clientY / window.innerHeight - 0.5) * 0.18
          canvas.style.cursor =
            hitScreen(event) || raycaster.intersectObjects([...monitorKnobs, shade, disk]).length
              ? 'pointer'
              : 'default'
        }
        const onClick = (event: PointerEvent) => {
          const screenHit = hitScreen(event)
          if (raycaster.intersectObject(shade).length) {
            lampOnRef.current = !lampOnRef.current
            setLampOn(lampOnRef.current)
          } else if (raycaster.intersectObject(disk).length) {
            window.open('https://huccct.github.io/vibe/', '_blank', 'noopener,noreferrer')
          } else if (raycaster.intersectObjects(monitorKnobs).length) {
            motionPausedRef.current = !motionPausedRef.current
            setMotionPaused(motionPausedRef.current)
          } else if (screenHit) {
            zoomRef.current = true
            setZoomed(true)
          } else if (zoomRef.current) {
            zoomRef.current = false
            setZoomed(false)
            canvas.focus()
          }
        }
        const onKey = (event: KeyboardEvent) => {
          if (event.ctrlKey || event.metaKey || event.altKey) return
          if (event.key === 'Escape') {
            zoomRef.current = false
            setZoomed(false)
            canvas.focus()
          }
          if (event.code === 'KeyL' && !event.repeat) {
            lampOnRef.current = !lampOnRef.current
            setLampOn(lampOnRef.current)
          }
          if (
            event.code === 'KeyP' &&
            !event.repeat &&
            !(event.target instanceof HTMLInputElement)
          ) {
            motionPausedRef.current = !motionPausedRef.current
            setMotionPaused(motionPausedRef.current)
          }
        }
        window.addEventListener('keydown', onKey)
        canvas.addEventListener('pointermove', onMove)
        canvas.addEventListener('click', onClick)
        function render(now: number) {
          frame = requestAnimationFrame(render)
          if (document.hidden || !canvas.clientWidth || now - last < 40) return
          const delta = last ? Math.min((now - last) / 1000, 0.1) : 0.04
          last = now
          screenMesh.visible = !(zoomRef.current && readingRef.current)
          lamp.intensity = lampOnRef.current ? 30 : 0
          bulb.intensity = lampOnRef.current ? 1.8 : 0
          bulbSurface.visible = lampOnRef.current
          const cursorPhase =
            reduced.matches || motionPausedRef.current ? 0 : Math.floor(now / 700) % 2
          if (cursorPhase !== lastCursorPhase) {
            drawScreen(cursorPhase * 700)
            lastCursorPhase = cursorPhase
          }
          if (!reduced.matches && !motionPausedRef.current) {
            for (let i = 0; i < 240; i++) {
              drops[i * 6 + 1] = drops[i * 6 + 1]! - 0.7 * delta
              if (drops[i * 6 + 1]! < 1.4) drops[i * 6 + 1] = 4.2
              drops[i * 6 + 4] = drops[i * 6 + 1]! + 0.055
            }
            rainPositions.needsUpdate = true
          }
          const mobileReading = readingRef.current && canvas.clientWidth < 600
          const nearPosition = mobileReading ? readingPosition : closePosition
          destination.copy(zoomRef.current ? nearPosition : base)
          if (!zoomRef.current && !reduced.matches && !motionPausedRef.current) {
            destination.x += pointerX
            destination.y -= pointerY
          }
          const step = reduced.matches ? 1 : 1 - Math.exp(-5 * delta)
          camera.position.lerp(destination, step)
          lookAt.lerp(zoomRef.current ? closeTarget : target, step)
          camera.lookAt(lookAt)
          camera.updateMatrixWorld()
          const panel = screenRef.current
          if (panel) {
            const settled = zoomRef.current && camera.position.distanceTo(nearPosition) < 0.025
            panel.style.visibility = settled ? 'visible' : 'hidden'
            panel.inert = !settled
            if (settled) {
              const top = screenTop.set(-1.045, 2.835, 0.615).project(camera)
              const bottom = screenBottom.set(1.045, 1.365, 0.615).project(camera)
              panel.style.left = `${mobileReading ? 14 : ((top.x + 1) * canvas.clientWidth) / 2}px`
              panel.style.top = `${mobileReading ? Math.max(72, ((1 - top.y) * canvas.clientHeight) / 2) : ((1 - top.y) * canvas.clientHeight) / 2}px`
              panel.style.width = `${mobileReading ? canvas.clientWidth - 28 : ((bottom.x - top.x) * canvas.clientWidth) / 2}px`
              panel.style.height = `${mobileReading ? canvas.clientHeight - 152 : ((top.y - bottom.y) * canvas.clientHeight) / 2}px`
              if (document.activeElement === canvas) panel.focus({ preventScroll: true })
            }
          }
          const renderState = `${lampOnRef.current}:${zoomRef.current}:${mobileReading}:${readingRef.current}:${canvas.width}:${canvas.height}`
          const moving =
            camera.position.distanceTo(destination) > 0.001 ||
            lookAt.distanceTo(zoomRef.current ? closeTarget : target) > 0.001
          if (
            moving ||
            (!reduced.matches && !motionPausedRef.current) ||
            renderState !== lastRenderedState
          ) {
            renderer.render(scene, camera)
            lastRenderedState = renderState
          }
        }
        function visibility() {
          cancelAnimationFrame(frame)
          last = 0
          if (!document.hidden) frame = requestAnimationFrame(render)
        }
        document.addEventListener('visibilitychange', visibility)
        const contextLost = (event: Event) => {
          event.preventDefault()
          setFailed(true)
          cancelAnimationFrame(frame)
        }
        canvas.addEventListener('webglcontextlost', contextLost)
        frame = requestAnimationFrame(render)
        setReady(true)
        cleanup = () => {
          cancelAnimationFrame(frame)
          observer.disconnect()
          document.removeEventListener('visibilitychange', visibility)
          canvas.removeEventListener('webglcontextlost', contextLost)
          canvas.removeEventListener('pointermove', onMove)
          canvas.removeEventListener('click', onClick)
          window.removeEventListener('keydown', onKey)
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
              object.geometry.dispose()
              const materials = Array.isArray(object.material) ? object.material : [object.material]
              materials.forEach((m) => m.dispose())
            }
          })
          texture.dispose()
          textures.forEach((texture) => texture.dispose())
          environmentTarget.dispose()
          renderer.dispose()
        }
      })
      .catch(() => {
        if (!disposed) setFailed(true)
      })
    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <div className="matrix-computer-world">
      <div
        className="matrix-room"
        data-zoomed={zoomed}
        data-reading={activePath !== null}
        hidden={inside}
      >
        <canvas
          ref={canvasRef}
          className="matrix-room-canvas"
          tabIndex={0}
          role="button"
          aria-label="老式电脑。点击屏幕或按回车靠近，Esc 退回桌前，P 暂停场景。"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleZoom(true)
            }
          }}
        />
        <header className="matrix-room-header">
          <Link href="/">
            ORION CHEN<span> / PERSONAL SPACE</span>
          </Link>
          <Link href="/classic">
            文字版 <ArrowUpRight size={13} />
          </Link>
        </header>
        <div className="matrix-room-caption">
          <span>某个深夜。你的电脑还亮着。</span>
          <p>Something is waiting for you.</p>
        </div>
        <div className="matrix-room-hint" role="status">
          {failed ? (
            <button onClick={() => setInside(true)}>场景无法显示 · 打开文字终端</button>
          ) : !ready ? (
            '正在打开房间…'
          ) : zoomed ? (
            'ESC 退回桌前 · P 暂停 · L 台灯'
          ) : (
            '屏幕进入 · 台灯开关 · 软盘里的秘密'
          )}
          {motionPaused && <span> · 环境已暂停</span>}
        </div>
        <div
          ref={screenRef}
          className="matrix-monitor-content"
          tabIndex={-1}
          aria-label="电脑屏幕中的博客"
          style={{ visibility: 'hidden' }}
          onClickCapture={openInMonitor}
        >
          <div className="matrix-monitor-top">
            ORION / PERSONAL TERMINAL <span>CONNECTED</span>
          </div>
          {activePath ? (
            <div className="matrix-reader">
              <div className="matrix-reader-bar">
                <button
                  onClick={() => {
                    setActivePath(null)
                    screenRef.current?.focus()
                  }}
                >
                  ← 返回终端
                </button>
                <a
                  href={activePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  独立阅读 ↗
                </a>
              </div>
              {frameLoading && (
                <p className="matrix-reader-loading" role="status">
                  正在读取记录…
                </p>
              )}
              <iframe
                ref={iframeRef}
                title="电脑中的内容阅读器"
                src={activePath}
                onLoad={prepareReader}
              />
            </div>
          ) : (
            <div className="matrix-monitor-scroll">
              <h1>
                Wake up, Orion<span>_</span>
              </h1>
              <p>代码、文字，以及屏幕之外的世界。</p>
              <nav aria-label="电脑中的导航">
                <Link href="/works">[ 程序 ]</Link>
                <Link href="/learning">[ 知识 ]</Link>
                <Link href="/about">[ 身份 ]</Link>
              </nav>
              <h2>~/writing / 最新传输</h2>
              {posts.map((post) => (
                <Link className="matrix-screen-post" href={`/blog/${post.slug}`} key={post.slug}>
                  <time>{post.date.slice(5, 10)}</time>
                  <span>{post.title}</span>
                </Link>
              ))}
              <Link className="matrix-screen-all" href="/blog">
                → 查看全部记录
              </Link>
              <a className="matrix-screen-rabbit" href="https://huccct.github.io/vibe/">
                Follow the white rabbit.
              </a>
            </div>
          )}
          <div className="matrix-monitor-bottom">
            <button
              onClick={() => {
                toggleZoom(false)
                canvasRef.current?.focus()
              }}
            >
              ← disconnect
            </button>
            <button
              aria-pressed={!lampOn}
              onClick={() => {
                lampOnRef.current = !lampOn
                setLampOn(!lampOn)
              }}
            >
              {lampOn ? 'lamp: on' : 'lamp: off'}
            </button>
            <button
              aria-pressed={motionPaused}
              onClick={() => {
                motionPausedRef.current = !motionPaused
                setMotionPaused(!motionPaused)
              }}
            >
              {motionPaused ? 'motion: off' : 'motion: on'}
            </button>
            <Link href="/reading">reading/</Link>
            <Link href="/guestbook">leave a message_</Link>
          </div>
        </div>
        <span className="matrix-room-corner">THE CONSTRUCT / 1999</span>
      </div>
      {inside && (
        <>
          <TerminalContent posts={posts} />
          <button
            className="matrix-back-desk"
            onClick={() => {
              setInside(false)
              requestAnimationFrame(() => canvasRef.current?.focus())
            }}
          >
            回到桌前
          </button>
        </>
      )}
    </div>
  )
}
