const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const buttonClasses = (variant = 'primary') =>
  `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]}`
