import { useEffect, useState } from 'react'

/** Anima un entero de 0 a `target`. Respeta prefers-reduced-motion. */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || target === 0) {
      setValue(target)
      return
    }

    let raf = 0
    let start = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
