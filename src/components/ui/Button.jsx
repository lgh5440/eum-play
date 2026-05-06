/* 공용 Button — variant × size로 모든 페이지 액션 통일
 * 메인 액션은 size="lg" / "xl", 보조는 "sm" / "md" 사용 */

const VARIANTS = {
  /* 메인 액션 — 시안 그라데이션 (시그니처) */
  primary: {
    background: 'linear-gradient(135deg,#0891b2,#1d4ed8)',
    color: '#fff',
    boxShadow: '0 8px 40px rgba(6,182,212,0.5)',
    border: '1px solid rgba(6,182,212,0.4)',
  },
  /* 위험 액션 — 정답 공개·중요 강조 */
  danger: {
    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
    color: '#fff',
    boxShadow: '0 8px 40px rgba(239,68,68,0.6)',
    border: '1px solid rgba(239,68,68,0.5)',
  },
  /* 성공 액션 — 맞춤·확인 */
  success: {
    background: 'linear-gradient(135deg,#10b981,#059669)',
    color: '#fff',
    boxShadow: '0 8px 40px rgba(16,185,129,0.45)',
    border: '1px solid rgba(16,185,129,0.4)',
  },
  /* 보조 액션 — 인디고 톤 (가벼운 강조) */
  secondary: {
    background: 'rgba(99,102,241,0.2)',
    color: '#a5b4fc',
    border: '1px solid rgba(99,102,241,0.3)',
  },
  /* 정보·경고 — 노랑 톤 */
  warning: {
    background: 'rgba(251,191,36,0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(251,191,36,0.3)',
  },
  /* 삭제 — 약한 빨강 (위험성 명확하지만 부드러움) */
  dangerSoft: {
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.25)',
  },
  /* 중립 — 회색 보조 */
  ghost: {
    background: 'rgba(255,255,255,0.04)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  /* 매우 약함 — 헤더 작은 액션 등 */
  subtle: {
    background: 'rgba(10,16,35,0.8)',
    color: '#64748b',
    border: '1px solid rgba(255,255,255,0.08)',
  },
}

const SIZES = {
  /* 미니 — 라벨·태그 (터치 부담 적은 보조) */
  xs:  { padding: '6px 10px',  fontSize: 11, borderRadius: 8,  minHeight: 28, fontWeight: 700 },
  /* 소 — 헤더 우측 액션, 카드 안 액션 */
  sm:  { padding: '8px 12px',  fontSize: 12, borderRadius: 10, minHeight: 36, fontWeight: 700 },
  /* 중 — 일반 액션 */
  md:  { padding: '12px 16px', fontSize: 13, borderRadius: 12, minHeight: 44, fontWeight: 700 },
  /* 대 — 페이지 메인 액션 */
  lg:  { padding: '16px 20px', fontSize: 15, borderRadius: 16, minHeight: 52, fontWeight: 800 },
  /* 특대 — 게임 시작·정답 공개 등 핵심 큰 액션 */
  xl:  { padding: '20px 24px', fontSize: 18, borderRadius: 18, minHeight: 60, fontWeight: 900 },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  style = {},
  children,
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  return (
    <button
      {...props}
      disabled={disabled}
      className={`active:scale-95 transition-all ${className}`}
      style={{
        ...s,
        ...v,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}>
      {children}
    </button>
  )
}
