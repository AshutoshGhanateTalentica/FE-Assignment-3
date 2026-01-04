import { useEffect, useRef } from 'react'

export function useDebouncedEffect(effect: () => void, deps: any[], delay = 200) {
  const t = useRef<number | null>(null)

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current)
    t.current = window.setTimeout(() => effect(), delay)
    return () => {
      if (t.current) window.clearTimeout(t.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
