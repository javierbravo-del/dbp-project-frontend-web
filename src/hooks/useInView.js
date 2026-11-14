import { useEffect, useRef, useState } from 'react'

/**
 * Devuelve una ref y un booleano que pasa a true cuando el elemento
 * entra en pantalla (IntersectionObserver). Se usa para la clase "reveal".
 */
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
