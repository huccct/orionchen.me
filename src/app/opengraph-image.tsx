import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Orion Chen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        background: '#1a1a1a',
        color: '#f5f5f5',
        fontFamily: 'serif',
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 600 }}>Orion Chen</div>
      <div style={{ fontSize: 32, color: '#A0522D', marginTop: 16, fontFamily: 'monospace' }}>
        {`// orionchen.me`}
      </div>
    </div>,
    { ...size }
  )
}
