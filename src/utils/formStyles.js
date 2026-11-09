export const fieldClasses = (hasError) =>
  `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`
  