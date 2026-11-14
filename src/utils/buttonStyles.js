const VARIANTS = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] shadow-sm',
  secondary:
    'border border-gray-300 bg-white text-gray-800 hover:border-brand-500 hover:text-brand-700 active:scale-[0.98]',
  ghost: 'text-brand-600 hover:bg-brand-50 active:scale-[0.98]',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
}

export const buttonClasses = (variant = 'primary') =>
  `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${VARIANTS[variant]}`
