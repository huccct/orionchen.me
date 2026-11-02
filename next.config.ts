import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      { source: '/blog/nestjs-mental-model', destination: '/learning/nestjs', permanent: true },
      { source: '/projects', destination: '/works', permanent: true },
      { source: '/resume', destination: '/about', permanent: true },
    ]
  },
}

export default withContentCollections(nextConfig)
