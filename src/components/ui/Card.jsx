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
        background: '#EAF3FF',
        border: active
          ? '1px solid #DDEEFF'
          : '1px solid #DDEEFF',
        boxShadow: active ? '0 4px 16px rgba(37,99,235,0.12)' : undefined,
        padding: PADS[padding],
        transition: hover ? 'border-color 0.2s, box-shadow 0.2s' : undefined,
        ...style,
      }}>
      {children}
    </div>
  )
}
