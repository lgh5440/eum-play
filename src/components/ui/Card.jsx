/* 공용 Card — 모든 페이지의 정보 블록 일관 처리 */

const PADS = { none: 0, xs: 8, sm: 12, md: 16, lg: 20 }

export default function Card({
  children,
  padding = 'md',
  active = false,
  hover = false,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      {...props}
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(10,16,35,0.7)',
        border: active
          ? '1px solid rgba(34,211,238,0.45)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: active ? '0 0 30px rgba(34,211,238,0.2)' : undefined,
        padding: PADS[padding],
        transition: hover ? 'border-color 0.2s, box-shadow 0.2s' : undefined,
        ...style,
      }}>
      {children}
    </div>
  )
}
