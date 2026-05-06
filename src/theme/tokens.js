/* 공용 디자인 토큰
 * 모든 페이지·컴포넌트가 이 값들을 참조하도록 하면
 * 일관성·변경 폭이 한 곳에서 결정된다.
 */

export const colors = {
  // 배경
  bg:           '#060a18',
  bgCard:       'rgba(10,16,35,0.7)',
  bgCardSolid:  '#0a1228',
  bgInput:      'rgba(255,255,255,0.04)',
  bgOverlay:    'rgba(0,0,0,0.7)',

  // 텍스트 (밝은 톤 ~ 어두운 톤)
  text:         '#e2e8f0',   // 메인 본문
  textMuted:    '#94a3b8',   // 보조
  textDim:      '#64748b',   // 어렴풋
  textGhost:    '#64748b',   // 매우 어렴풋 (라벨 등)

  // 메인 액션 — 시안
  primary:      '#22d3ee',
  primaryDark:  '#0891b2',
  primaryDeep:  '#1d4ed8',

  // 보조 액션 — 인디고·보라
  secondary:        '#a5b4fc',
  secondaryDeep:    '#6366f1',
  accent:           '#a78bfa',

  // 의미 색상
  warning:      '#fbbf24',   // 정보·경고 (정답 노출 등)
  danger:       '#f87171',   // 삭제·오류
  dangerDeep:   '#dc2626',
  success:      '#34d399',   // 성공·맞춤
  successDeep:  '#10b981',

  // 보더
  border:        'rgba(255,255,255,0.07)',
  borderHover:   'rgba(255,255,255,0.12)',
  borderActive:  'rgba(34,211,238,0.45)',
  borderDashed:  'rgba(99,102,241,0.3)',
}

/* 여백 — 4px 배수 */
export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32,
}

/* 라운드 */
export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, full: 9999,
}

/* 폰트 크기 — 모바일 가독성 기준 (본문 13px 권장) */
export const fontSize = {
  micro: 10,
  xs: 11,
  sm: 12,
  base: 13,    // 본문 기본
  md: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 44,
  display: 60,
}

/* 폰트 굵기 */
export const fontWeight = {
  normal: 500,
  semibold: 600,
  bold: 700,
  black: 900,
}

/* 터치 영역 — Apple HIG / Material 권장 최소 44~48px */
export const touchTarget = 48

/* 그림자 (강조 액션용) */
export const shadow = {
  primary: '0 8px 40px rgba(6,182,212,0.5)',
  danger:  '0 8px 40px rgba(239,68,68,0.6)',
  success: '0 8px 40px rgba(16,185,129,0.45)',
  warning: '0 8px 40px rgba(251,191,36,0.4)',
  card:    '0 4px 20px rgba(0,0,0,0.2)',
}
