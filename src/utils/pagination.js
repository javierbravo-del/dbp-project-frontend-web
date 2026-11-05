export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const getPageNumbers = (currentPage, totalPages, windowSize = 5) => {
  const end = Math.min(totalPages, Math.max(1, currentPage - Math.floor(windowSize / 2)) + windowSize - 1)
  const start = Math.max(1, end - windowSize + 1)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}