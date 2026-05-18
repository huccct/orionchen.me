import { allPosts } from 'content-collections'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Orion Chen writing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function PostOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = allPosts.find((item) => item.slug === slug)

  if (!post) return new Response('not found', { status: 404 })

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#1a1a1a',
        color: '#f5f5f5',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 600, fontFamily: 'serif', maxWidth: 1000 }}>
        {post.title}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'monospace',
          fontSize: 24,
          color: '#A0522D',
        }}
      >
        <span>{`// ${post.date}`}</span>
        <span>orionchen.me</span>
      </div>
    </div>,
    { ...size }
  )
}
