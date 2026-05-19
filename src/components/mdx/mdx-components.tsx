import Image, { type ImageProps } from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

/* eslint-disable @next/next/no-img-element */

type MDXImageProps = ComponentPropsWithoutRef<'img'> & {
  alt?: string
  src?: string
}

function isLocalSrc(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//')
}

function MDXImage({ alt = '', src, ...props }: MDXImageProps) {
  if (!src) return null

  if (!isLocalSrc(src)) {
    // External images (CDN, embedded references) bypass next/image so we don't
    // need to maintain a remotePatterns whitelist for every host that ever
    // appeared in a post.
    return (
      <img
        {...props}
        src={src}
        alt={alt}
        className="my-6 h-auto max-w-full rounded-md"
        loading="lazy"
      />
    )
  }

  return (
    <Image
      {...(props as Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'>)}
      src={src}
      alt={alt}
      width={1200}
      height={675}
      className="my-6 h-auto max-w-full rounded-md"
    />
  )
}

export const mdxComponents = {
  img: MDXImage,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-8 mb-4 scroll-mt-24 font-serif text-2xl text-balance" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-6 mb-3 scroll-mt-24 font-serif text-xl text-balance" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-accent break-words underline-offset-4 hover:underline" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="border-border bg-card my-4 max-w-full overflow-x-auto rounded-md border p-3 text-sm sm:p-4"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full min-w-max border-collapse text-sm" {...props} />
    </div>
  ),
}
