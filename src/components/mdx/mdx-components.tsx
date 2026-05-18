import Image, { type ImageProps } from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

type MDXImageProps = ComponentPropsWithoutRef<'img'> & {
  alt?: string
  src?: string
}

function MDXImage({ alt = '', src, ...props }: MDXImageProps) {
  if (!src) return null

  return (
    <Image
      {...(props as Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'>)}
      src={src}
      alt={alt}
      width={1200}
      height={675}
      className="my-6 rounded-md"
    />
  )
}

export const mdxComponents = {
  img: MDXImage,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="mt-8 mb-4 font-serif text-lg" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="mt-6 mb-3 font-serif text-base" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-[var(--color-accent)] underline-offset-4 hover:underline" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-[var(--color-border)] p-4"
      {...props}
    />
  ),
}
