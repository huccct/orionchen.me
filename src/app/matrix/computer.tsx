'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
type Post = { title: string; slug: string; date: string }

function subscribeSmallScreen(update: () => void) {
  const media = window.matchMedia('(max-width: 700px)')
  media.addEventListener('change', update)
  return () => media.removeEventListener('change', update)
}
const smallScreenSnapshot = () => window.matchMedia('(max-width: 700px)').matches
const serverScreenSnapshot = () => false
const clientSnapshot = () => true
const subscribeHydration = () => () => {}

export function terminalMessage(elapsed: number) {
  return 'Wake up, Orion.'.slice(0, Math.max(1, Math.floor(elapsed / 110) + 1))
}

const terminalRoutes: Record<string, string> = {
  blog: '/blog',
  'ls --all': '/blog',
  works: '/works',
  about: '/about',
  reading: '/reading',
  map: '/learning',
  guestbook: '/guestbook',
}
export function terminalRoute(command: string) {
  const key = command.trim().toLowerCase()
  return Object.hasOwn(terminalRoutes, key) ? terminalRoutes[key] : null
}

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

export function MatrixComputer({ posts }: { posts: Post[] }) {
  const smallScreen = useSyncExternalStore(
    subscribeSmallScreen,
    smallScreenSnapshot,
    serverScreenSnapshot
  )
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useSyncExternalStore(subscribeHydration, clientSnapshot, serverScreenSnapshot)
  const daylight = hydrated && resolvedTheme === 'light'
  const daylightRef = useRef(false)
  useEffect(() => {
    daylightRef.current = daylight
  }, [daylight])
  const lightingControl = (
    <button
      type="button"
      className="matrix-lighting-toggle"
      aria-label={daylight ? '切换到黑夜' : '切换到白天'}
      onClick={() => setTheme(daylight ? 'dark' : 'light')}
    >
      {daylight ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
    </button>
  )
  const [roomRequested, setRoomRequested] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(false)
  const [zoomed, setZoomed] = useState(false)
  const [readerExpanded, setReaderExpanded] = useState(false)
  const commandRef = useRef<HTMLInputElement>(null)
  const [command, setCommand] = useState('')
  const [transcript, setTranscript] = useState<{ command: string; output: string }[]>([])
  const [showIntro, setShowIntro] = useState(true)
  const toggleZoom = (value: boolean) => {
    zoomRef.current = value
    setZoomed(value)
    if (!value) setReaderExpanded(false)
  }
  const motionPausedRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [activePath, setActivePath] = useState<string | null>(null)
  const [frameLoading, setFrameLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lampOnRef = useRef(true)

  function runCommand(raw: string) {
    const value = raw.trim().toLowerCase()
    if (!value) return
    setCommand('')
    const path = terminalRoute(value)
    if (path && value !== 'blog') {
      setFrameLoading(true)
      setActivePath(path)
      return
    }
    if (value === 'clear') {
      setTranscript([])
      setShowIntro(false)
      commandRef.current?.focus()
      return
    }
    if (value === 'exit') {
      if (smallScreen && !failed) setRoomRequested(true)
      toggleZoom(false)
      canvasRef.current?.focus()
      return
    }
    const article = /^open ([1-9]\d*)$/.exec(value)
    if (article && posts[Number(article[1]) - 1]) {
      setFrameLoading(true)
      setActivePath(`/blog/${posts[Number(article[1]) - 1]!.slug}`)
      return
    }
    let output = ''
    switch (value) {
      case 'help':
      case 'blog':
        break
      case 'classic':
      case 'rabbit':
        break
      case 'whoami':
        output =
          '我是 Orion，一个不只关心技术的工程师。\n写代码，记录生活，也慢慢开始拍纪录片。\n输入 about 可以继续了解我。'
        break
      case 'day':
      case 'night':
        setTheme(value === 'day' ? 'light' : 'dark')
        output = value === 'day' ? '天亮了。' : '夜深了。'
        break
      case 'lamp':
        lampOnRef.current = !lampOnRef.current
        output = lampOnRef.current ? '台灯亮了。' : '台灯关了。'
        break
      default:
        output = `没有找到指令「${raw.trim()}」。输入 help 查看可用指令。`
    }
    setTranscript((lines) => [...lines.slice(-19), { command: raw.trim(), output }])
    commandRef.current?.focus()
  }

  useEffect(() => {
    commandRef.current?.scrollIntoView({ block: 'nearest' })
  }, [transcript])

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
      :root, html.dark { color-scheme:dark; --background:#07100b; --foreground:#b5d9bc; --muted:#202622; --muted-foreground:#a9b4ac; --border:#303a33; --accent:#a1c8ac; --card:#19201b; }
      html, body { background:#07100b!important; color:#b5d9bc!important; font-size:16px; font-family:ui-monospace, monospace!important; scrollbar-width:thin; scrollbar-color:#536358 #07100b; }
      body::before, .site-header, .site-footer, .detail-navigation { display:none!important; }
      body > main { padding:32px 24px 64px!important; max-width:100%!important; }
      article[data-page='post'] { max-width:680px!important; }
      h1, h2, h3, .prose { font-family:ui-monospace, monospace!important; }
      h1 { font-size:30px!important; line-height:1.5!important; } h2 { font-size:23px!important; }
      .prose { font-size:17px!important; line-height:1.95!important; } .prose p { color:#b5d9bc!important; }
      a { color:#a1c8ac; } pre { background:#1a211c!important; } ::selection {background:#9fbaaa;color:#07100b;}
      @media(max-width:700px) { body > main {padding:20px 8px 48px!important;} h1 {font-size:25px!important;} .prose {font-size:16px!important;} }
    `
    doc.head.appendChild(style)
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setActivePath(null)
        setReaderExpanded(false)
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
          setReaderExpanded(false)
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
    if (zoomRef.current || smallScreen || failed) frame.focus()
  }

  useEffect(() => {
    if (smallScreenSnapshot() && !roomRequested) {
      screenRef.current?.removeAttribute('inert')
      return
    }
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
          screenRef.current?.removeAttribute('inert')
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap
        renderer.shadowMap.autoUpdate = false
        renderer.shadowMap.needsUpdate = true
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#070d0b')
        scene.fog = new THREE.FogExp2('#070d0b', 0.032)
        const environment = new RoomEnvironment()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const environmentTarget = pmrem.fromScene(environment, 0.04)
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
        const destination = new THREE.Vector3()
        const ambient = new THREE.HemisphereLight('#bac3c9', '#24221e', 0.5)
        scene.add(ambient)
        const lamp = new THREE.SpotLight('#ffd19a', 30, 9, 0.95, 0.9, 2)
        lamp.position.set(-2.5, 2.28, 0.3)
        lamp.target.position.set(-0.3, 0.55, 0.9)
        lamp.castShadow = true
        lamp.shadow.mapSize.set(1024, 1024)
        lamp.shadow.bias = -0.0002
        lamp.shadow.normalBias = 0.025
        scene.add(lamp, lamp.target)
        const rim = new THREE.PointLight('#91aaa5', 3.5, 9, 2)
        rim.position.set(2.2, 3.5, -1.7)
        scene.add(rim)
        const daylightSource = new THREE.DirectionalLight('#fff1d4', 0)
        daylightSource.position.set(3, 5, -1)
        daylightSource.castShadow = true
        daylightSource.shadow.mapSize.set(1024, 1024)
        daylightSource.shadow.normalBias = 0.04
        scene.add(daylightSource)
        const nightSky = new THREE.Color('#070d0b')
        const daySky = new THREE.Color('#a4b9b5')
        let lightLevel = daylightRef.current ? 1 : 0
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
        function drawScreen(message: string, cursorPhase: number) {
          ctx.fillStyle = '#07100b'
          ctx.fillRect(0, 0, 1024, 768)
          ctx.fillStyle = '#8deda4'
          ctx.shadowColor = '#36c86a'
          ctx.shadowBlur = 5
          ctx.font = '42px monospace'
          ctx.fillText(message, 70, 315)
          if (cursorPhase === 0) ctx.fillRect(70 + ctx.measureText(message).width + 8, 280, 20, 39)
          ctx.shadowBlur = 0
          texture.needsUpdate = true
        }
        box(2.65, 0.12, 0.82, 0, 0.62, 1.45, beige)
        const keyboardKeys: InstanceType<typeof THREE.Mesh>[] = []
        for (let row = 0; row < 5; row++)
          for (let col = 0; col < 15; col++) {
            if (row === 4 && col > 3 && col < 10) continue
            keyboardKeys.push(
              box(0.135, 0.045, 0.105, -1.18 + col * 0.166, 0.703, 1.16 + row * 0.14, edge)
            )
          }
        keyboardKeys.push(box(0.98, 0.045, 0.105, -0.03, 0.703, 1.72, edge))
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
        // Window, rain, and distant buildings make a room beyond the monitor.
        box(2.65, 3, 0.07, 2.05, 2.8, -2.19, dark)
        const windowPane = box(
          2.45,
          2.8,
          0.02,
          2.05,
          2.8,
          -2.13,
          new THREE.MeshStandardMaterial({
            color: '#0a1614',
            emissive: '#0a1715',
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
            opacity: 0.16,
            depthWrite: false,
          })
        )
        scene.add(rain)
        // The task lamp grounds the workstation in the room.
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
        let pointerX = 0,
          pointerY = 0,
          frame = 0,
          last = 0,
          lastScreenState = '',
          terminalElapsed = 0,
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
            0.609 +
              Math.max(
                1.47 / (2 * Math.tan(THREE.MathUtils.degToRad(19.5))),
                2.09 / (2 * Math.tan(THREE.MathUtils.degToRad(19.5)) * camera.aspect)
              ) *
                1.26
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
            hitScreen(event) ||
            raycaster.intersectObjects([...monitorKnobs, ...keyboardKeys, shade]).length
              ? 'pointer'
              : 'default'
        }
        const onClick = (event: PointerEvent) => {
          const screenHit = hitScreen(event)
          if (raycaster.intersectObject(shade).length) {
            lampOnRef.current = !lampOnRef.current
          } else if (raycaster.intersectObjects(monitorKnobs).length) {
            motionPausedRef.current = !motionPausedRef.current
          } else if (screenHit || raycaster.intersectObjects(keyboardKeys).length) {
            zoomRef.current = true
            setZoomed(true)
            canvas.focus()
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
          if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement ||
            (event.target instanceof HTMLElement && event.target.isContentEditable)
          )
            return
          if (event.code === 'KeyL' && !event.repeat) {
            lampOnRef.current = !lampOnRef.current
          }
          if (event.code === 'KeyP' && !event.repeat) {
            motionPausedRef.current = !motionPausedRef.current
          }
        }
        window.addEventListener('keydown', onKey)
        canvas.addEventListener('pointermove', onMove)
        canvas.addEventListener('click', onClick)
        const glassTop = new THREE.Vector3()
        const glassBottom = new THREE.Vector3()
        function render(now: number) {
          frame = requestAnimationFrame(render)
          if (document.hidden || !canvas.clientWidth || now - last < 40) return
          const delta = last ? Math.min((now - last) / 1000, 0.1) : 0.04
          last = now
          const lightTarget = daylightRef.current ? 1 : 0
          if (Math.abs(lightTarget - lightLevel) > 0.01) renderer.shadowMap.needsUpdate = true
          lightLevel +=
            (lightTarget - lightLevel) * (reduced.matches ? 1 : 1 - Math.exp(-4 * delta))
          ambient.intensity = 0.5 + lightLevel * 1.6
          daylightSource.intensity = lightLevel * 2.8
          rim.intensity = 3.5 + lightLevel * 12
          scene.environmentIntensity = 0.16 + lightLevel * 0.6
          ;(scene.background as InstanceType<typeof THREE.Color>)
            .copy(nightSky)
            .lerp(daySky, lightLevel)
          ;(scene.fog as InstanceType<typeof THREE.FogExp2>).color.copy(
            scene.background as InstanceType<typeof THREE.Color>
          )
          const windowMaterial = windowPane.material as InstanceType<
            typeof THREE.MeshStandardMaterial
          >
          windowMaterial.color.setRGB(
            0.04 + lightLevel * 0.46,
            0.08 + lightLevel * 0.57,
            0.07 + lightLevel * 0.59
          )
          windowMaterial.emissive.copy(windowMaterial.color)
          windowMaterial.emissiveIntensity = 0.4 + lightLevel * 0.5
          rain.visible = lightLevel < 0.6
          lamp.intensity = lampOnRef.current ? 30 - lightLevel * 22 : 0
          bulb.intensity = lampOnRef.current ? 1.8 : 0
          bulbSurface.visible = lampOnRef.current
          const cursorPhase =
            reduced.matches || motionPausedRef.current ? 0 : Math.floor(now / 700) % 2
          if (!motionPausedRef.current && !zoomRef.current) terminalElapsed += delta * 1000
          const message = reduced.matches ? 'Wake up, Orion.' : terminalMessage(terminalElapsed)
          const screenState = `${message}:${cursorPhase}`
          if (screenState !== lastScreenState) {
            drawScreen(message, cursorPhase)
            lastScreenState = screenState
          }
          if (!reduced.matches && !motionPausedRef.current) {
            for (let i = 0; i < 240; i++) {
              drops[i * 6 + 1] = drops[i * 6 + 1]! - 0.7 * delta
              if (drops[i * 6 + 1]! < 1.4) drops[i * 6 + 1] = 4.2
              drops[i * 6 + 4] = drops[i * 6 + 1]! + 0.055
            }
            rainPositions.needsUpdate = true
          }
          const nearPosition = closePosition
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
            if (settled) {
              glassTop.set(-1.045, 2.835, 0.609).project(camera)
              glassBottom.set(1.045, 1.365, 0.609).project(camera)
              panel.style.setProperty(
                '--screen-left',
                `${((glassTop.x + 1) * canvas.clientWidth) / 2}px`
              )
              panel.style.setProperty(
                '--screen-top',
                `${((1 - glassTop.y) * canvas.clientHeight) / 2}px`
              )
              panel.style.setProperty(
                '--screen-width',
                `${((glassBottom.x - glassTop.x) * canvas.clientWidth) / 2}px`
              )
              panel.style.setProperty(
                '--screen-height',
                `${((glassTop.y - glassBottom.y) * canvas.clientHeight) / 2}px`
              )
            }
            panel.style.visibility = settled ? 'visible' : 'hidden'
            panel.inert = !settled
            if (settled) {
              if (document.activeElement === canvas)
                (commandRef.current ?? panel).focus({ preventScroll: true })
            }
          }
          const renderState = `${daylightRef.current}:${lampOnRef.current}:${zoomRef.current}:${canvas.width}:${canvas.height}`
          const moving =
            camera.position.distanceTo(destination) > 0.001 ||
            lookAt.distanceTo(zoomRef.current ? closeTarget : target) > 0.001
          if (
            moving ||
            Math.abs(lightTarget - lightLevel) > 0.001 ||
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
          screenRef.current?.removeAttribute('inert')
          cancelAnimationFrame(frame)
        }
        canvas.addEventListener('webglcontextlost', contextLost)
        frame = requestAnimationFrame(render)
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
        if (!disposed) {
          setFailed(true)
          screenRef.current?.removeAttribute('inert')
        }
      })
    return () => {
      disposed = true
      cleanup()
    }
  }, [smallScreen, roomRequested])

  return (
    <div className="matrix-computer-world">
      <div
        className="matrix-room"
        data-daylight={daylight}
        data-zoomed={zoomed}
        data-reading={activePath !== null}
        data-expanded={readerExpanded && activePath !== null}
        data-direct={(smallScreen && !roomRequested) || failed}
        data-room-requested={roomRequested}
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
        {smallScreen && (
          <header className="matrix-room-header">
            <button
              aria-label="返回内容"
              onClick={() => {
                setRoomRequested(false)
                toggleZoom(false)
              }}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          </header>
        )}
        <div className="matrix-room-hint">{lightingControl}</div>
        <div
          ref={screenRef}
          className="matrix-monitor-content"
          tabIndex={-1}
          aria-label="电脑屏幕中的博客"
          style={{ visibility: 'hidden' }}
          onClickCapture={openInMonitor}
        >
          {activePath ? (
            <div className="matrix-reader">
              <div className="matrix-reader-bar">
                <button
                  onClick={() => {
                    setActivePath(null)
                    setReaderExpanded(false)
                    screenRef.current?.focus()
                  }}
                >
                  [esc] terminal
                </button>
                <button onClick={() => setReaderExpanded(!readerExpanded)}>
                  {readerExpanded ? '[−] restore' : '[+] expand'}
                </button>
                <a
                  href={activePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  [↗] open
                </a>
              </div>
              {frameLoading && (
                <p className="matrix-reader-loading" role="status">
                  loading…
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
            <div className="matrix-terminal">
              {showIntro && (
                <>
                  <h1>Wake up, Orion.</h1>
                  <p className="matrix-terminal-hint">
                    Type <button onClick={() => runCommand('help')}>help</button> to begin.
                  </p>
                </>
              )}
              <div
                className="matrix-terminal-log"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                {transcript.map((line, index) => {
                  const value = line.command.trim().toLowerCase()
                  return (
                    <div key={index}>
                      <p className="matrix-command-echo">orion@home:~ $ {line.command}</p>
                      {value === 'help' ? (
                        <div className="matrix-command-list" aria-label="可用指令">
                          {[
                            ['blog', '文章'],
                            ['works', '作品'],
                            ['whoami', '我是谁'],
                            ['about', '详细介绍'],
                            ['reading', '阅读'],
                            ['map', '知识地图'],
                            ['guestbook', '留言'],
                            ['classic', '文字版'],
                            ['rabbit', '跟随白兔'],
                            ['day', '白天'],
                            ['night', '黑夜'],
                            ['lamp', '台灯'],
                            ['clear', '清屏'],
                            ['exit', '退出房间'],
                          ].map(([name, description]) => (
                            <button key={name} onClick={() => runCommand(name!)}>
                              <span>{name}</span>
                              <span>{description}</span>
                            </button>
                          ))}
                        </div>
                      ) : value === 'blog' ? (
                        <div className="matrix-terminal-posts" aria-label="文章目录">
                          {posts.map((post, index) => (
                            <Link href={`/blog/${post.slug}`} key={post.slug}>
                              <span>{String(index + 1).padStart(2, '0')}</span>
                              <span>{post.title}</span>
                            </Link>
                          ))}
                          <p>输入 open 1 阅读，或点击标题。</p>
                          <Link href="/blog">ls --all　全部文章</Link>
                        </div>
                      ) : ['classic', 'rabbit'].includes(value) ? (
                        <a
                          href={value === 'classic' ? '/classic' : 'https://huccct.github.io/vibe/'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {value === 'classic' ? 'open /classic ↗' : 'Follow the white rabbit. ↗'}
                        </a>
                      ) : (
                        <p>{line.output}</p>
                      )}
                    </div>
                  )
                })}
              </div>
              <form
                className="matrix-command"
                onSubmit={(event) => {
                  event.preventDefault()
                  runCommand(command)
                }}
              >
                <label htmlFor="matrix-command">orion@home:~ $</label>
                <input
                  ref={commandRef}
                  id="matrix-command"
                  aria-label="终端指令"
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={120}
                  enterKeyHint="go"
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing) {
                      if (event.key === 'Enter') event.preventDefault()
                      return
                    }
                    if (event.key === 'ArrowUp' && transcript.length) {
                      event.preventDefault()
                      setCommand(transcript.at(-1)?.command ?? '')
                    }
                    if (event.key === 'Escape') {
                      event.stopPropagation()
                      toggleZoom(false)
                      canvasRef.current?.focus()
                    }
                  }}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
