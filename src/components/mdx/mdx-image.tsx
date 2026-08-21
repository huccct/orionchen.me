'use client'

import Image, { type ImageProps } from 'next/image'
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/* eslint-disable @next/next/no-img-element */

export type MDXImageProps = ComponentPropsWithoutRef<'img'> & {
  alt?: string
  src?: string
}

export function isStandaloneImage(image: Pick<HTMLImageElement, 'closest'> | null) {
  return Boolean(image && !image.closest('a'))
}

function isLocalSrc(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//')
}

export function MDXImage({ alt = '', className, src, ...props }: MDXImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoomable, setZoomable] = useState(false)

  useEffect(() => setZoomable(isStandaloneImage(imageRef.current)), [])

  if (!src) return null

  const imageClassName = cn(
    'h-auto max-w-full rounded-md',
    zoomable ? 'my-0 transition-opacity group-hover:opacity-90' : 'my-6',
    className
  )
  const image = isLocalSrc(src) ? (
    <Image
      {...(props as Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'>)}
      ref={imageRef}
      src={src}
      alt={alt}
      width={1200}
      height={675}
      className={imageClassName}
    />
  ) : (
    <img {...props} ref={imageRef} src={src} alt={alt} className={imageClassName} loading="lazy" />
  )

  if (!zoomable) return image

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`查看原图：${alt || '图片'}`}
      title="点击查看原图"
      className="group my-6 block w-fit max-w-full cursor-zoom-in rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {image}
    </a>
  )
}
