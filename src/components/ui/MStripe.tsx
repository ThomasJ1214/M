interface MStripeProps {
  vertical?: boolean
  className?: string
  width?: number | string
}

export function MStripe({ vertical = false, className = '', width = 3 }: MStripeProps) {
  if (vertical) {
    return (
      <div
        className={`m-stripe-divider ${className}`}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: '100%',
          background: 'linear-gradient(180deg, #1C69D4, #6B2D8B, #C1001F)',
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={`m-stripe-divider ${className}`}
      style={{ height: typeof width === 'number' ? `${width}px` : width }}
      aria-hidden="true"
    />
  )
}
