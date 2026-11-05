import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGE_SIZE_OPTIONS } from '../utils/pagination'

export function usePageParams({ defaultSize = PAGE_SIZE_OPTIONS[0], defaultSort = 'id,asc' } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedPage = Number(searchParams.get('page'))
  const requestedSize = Number(searchParams.get('size'))

  const page = Number.isInteger(requestedPage) && requestedPage >= 1 ? requestedPage : 1
  const size = PAGE_SIZE_OPTIONS.includes(requestedSize) ? requestedSize : defaultSize
  const sort = searchParams.get('sort') ?? defaultSort
  const search = searchParams.get('search') ?? ''

  const update = useCallback(
    (changes) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
              next.delete(key)
            } else {
              next.set(key, String(value))
            }
          })
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return {
    page,
    size,
    sort,
    search,
    setPage: (value) => update({ page: value }),
    setSize: (value) => update({ size: value, page: 1 }),
    setSort: (value) => update({ sort: value, page: 1 }),
    setSearch: (value) => update({ search: value, page: 1 }),
  }
}
