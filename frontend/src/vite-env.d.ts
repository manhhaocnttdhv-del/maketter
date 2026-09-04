/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'bootstrap' {
  export class Carousel {
    constructor(element: Element | string, options?: Record<string, unknown>)
    static getOrCreateInstance(element: Element | string, options?: Record<string, unknown>): Carousel
    static getInstance(element: Element | string): Carousel | null
    cycle(): void
    pause(): void
    prev(): void
    next(): void
    to(index: number): void
    dispose(): void
  }
}

declare module 'virtual:source-images' {
  export interface SourceImage {
    path: string
    url: string
    name: string
    source: 'public' | 'src'
  }

  export const sourceImages: SourceImage[]
  export default sourceImages
}

