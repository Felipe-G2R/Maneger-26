export function ProgressBar({
  value,
  max = 100,
  color = '#6366F1',
  size = 'md',
  showLabel = true,
  animated = true,
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-fill ${animated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-dark-muted">
          <span>{value} / {max}</span>
          <span style={{ color }}>{percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
