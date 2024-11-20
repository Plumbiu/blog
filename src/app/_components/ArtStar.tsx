'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface Point {
  radius: number
  speed: number
  alpha: number
  duration: number
}

interface Star {
  orbitRadius: number
  radius: number
  orbitX: number
  orbitY: number
  timePassed: number
  speed: number
  alpha: number
}

function random(min: number, max?: number) {
  if (!max) {
    max = min
    min = 0
  }

  if (min > max) {
    let hold = max
    max = min
    min = hold
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

function ArtStar() {
  const ref = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')!
    if (!ctx) {
      return
    }
    let w = window.innerWidth
    let h = window.innerHeight
    if (w <= h || pathname.includes('/post')) {
      ctx.clearRect(0, 0, w, h)
      return
    }

    canvas.width = w
    canvas.height = h
    ctx.fillStyle = '#fff'
    const stars: Star[] = []
    const maxStars = 9600 * 1.5
    // Cache gradient
    const canvas2 = document.createElement('canvas')!
    const ctx2 = canvas2.getContext('2d')!

    const Canvas2Size = 100
    canvas2.width = Canvas2Size
    canvas2.height = Canvas2Size
    const half = Canvas2Size / 2
    const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#fefefe')
    gradient2.addColorStop(0.1, '#f8f8f8')
    gradient2.addColorStop(1, 'transparent')

    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    function draw(i: number) {
      const star = stars[i]
      if (!star) {
        return
      }
      const { timePassed, orbitRadius, orbitX, orbitY, alpha, radius, speed } =
        star
      const x = Math.sin(timePassed) * orbitRadius + orbitX
      const y = Math.cos(timePassed) * orbitRadius + orbitY

      const twinkle = random(10)
      if (twinkle === 1 && alpha > 0) {
        star.alpha -= 0.0001
      } else if (twinkle === 2 && alpha < 1) {
        star.alpha += 0.0001
      }

      ctx!.globalAlpha = star.alpha
      ctx!.drawImage(canvas2, x - radius / 2, y - radius / 2, radius, radius)
      star.timePassed += speed
    }

    function createStar(i: number) {
      const orbitRadius = i
      const radius = 1
      const orbitX = w / 2
      const orbitY = h / 2
      const timePassed = random(0, maxStars)
      const speed = random(orbitRadius) / 1500000
      const alpha = random(2, 10) / 10
      const star = {
        orbitRadius,
        radius,
        orbitX,
        orbitY,
        timePassed,
        speed,
        alpha,
      }
      return star
    }

    for (let i = 1; i < w; i++) {
      if (i < w / 4 && Math.random() < 0.95) {
        continue
      }
      const star = createStar(i)
      const num = i % 10
      const items: Star[] = []
      for (let j = 0; j < num; j++) {
        items.push(star)
      }
      stars.push(...items)
    }

    function animation() {
      w = window.innerWidth
      h = window.innerHeight
      ctx!.globalAlpha = 0.25
      ctx!.fillStyle = '#fff'
      ctx!.fillRect(0, 0, w, h)
      for (let i = 1; i < stars.length; i++) {
        draw(i)
      }

      window.requestAnimationFrame(animation)
    }

    animation()
  }, [pathname])

  return <canvas className="art" ref={ref} />
}

export default ArtStar
