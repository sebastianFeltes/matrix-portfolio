import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789'
const SIZE = 16

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let drops: number[] = []
    let raf = 0
    let last = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops = Array.from({ length: Math.ceil(width / SIZE) }, () => Math.random() * -50)
    }

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 50) return
      last = t
      const { width, height } = canvas.getBoundingClientRect()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#00ff66'
      ctx.font = `${SIZE}px "JetBrains Mono", monospace`
      drops.forEach((y, i) => {
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * SIZE, y * SIZE)
        drops[i] = y * SIZE > height && Math.random() > 0.975 ? 0 : y + 1
      })
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-20" />
}
