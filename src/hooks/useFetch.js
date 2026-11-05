import { useCallback, useEffect, useState } from 'react'

export function useFetch(fetcher) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({
    data: null,
    error: null,
    fetcher: null,
    reloadCount: -1,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetcher(controller.signal)
      .then((data) => setResult({ data, error: null, fetcher, reloadCount }))
      .catch((error) => {
        if (error.code === 'ERR_CANCELED') return
        setResult((previous) => ({ ...previous, error, fetcher, reloadCount }))
      })

    return () => controller.abort()
  }, [fetcher, reloadCount])

  const refetch = useCallback(() => setReloadCount((count) => count + 1), [])
  const isLoading = result.fetcher !== fetcher || result.reloadCount !== reloadCount

  return {
    data: result.data,
    error: isLoading ? null : result.error,
    isLoading,
    refetch,
  }
}
