export function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  gradient = false,
  gradientColors = 'from-primary-500 to-purple-600',
  onClick
}) {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  const bgClasses = gradient
    ? `bg-gradient-to-br ${gradientColors} text-white`
    : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border'
  const shadowClasses = gradient
    ? 'shadow-xl'
    : 'shadow-lg dark:shadow-none'
  const paddingClasses = padding ? 'p-6' : ''
  const hoverClasses = hover
    ? 'hover:shadow-xl hover:scale-[1.02] hover:border-primary-500/50 cursor-pointer'
    : ''

  return (
    <div
      className={`${baseClasses} ${bgClasses} ${shadowClasses} ${paddingClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
