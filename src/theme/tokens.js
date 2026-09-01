/* 공용 디자인 토큰
 * 모든 페이지·컴포넌트가 이 값들을 참조하도록 하면
 * 일관성·변경 폭이 한 곳에서 결정된다.
 */

export const colors = {
  // 배경
  bg:           '#F5F7FA',
  bgCard:       '#EAF3FF',
  bgCardSolid:  '#FFFFFF',
  bgInput:      '#EAF3FF',
  bgOverlay:    '#DDEEFF',

  // 텍스트 (밝은 톤 ~ 어두운 톤 — Tier 1 정본)
  heading:      '#101A3D',   // 제목 (h1급)
  text:         '#3A4568',   // 메인 일반 본문
  textMuted:    '#5C6A93',   // 부제·보조 본문
  textDim:      '#5C6A93',   // 어렴풋
  textGhost:    '#5C6A93',   // 매우 어렴풋 (라벨 등)
  gold:         '#FFD98C',   // 강조 골드 단색

  // 메인 액션 — 블루
  primary:      '#2F73F2',
  primaryDark:  '#1F5FD9',
  primaryDeep:  '#1F5FD9',

  // 보조 액션 — 인디고·블루 (밝은 배경에서 가독성 확보)
  secondary:        '#2F73F2',
  secondaryDeep:    '#1F5FD9',
  accent:           '#2F73F2',

  // 의미 색상 (밝은 배경에서 가독성 확보)
  warning:      '#B45309',   // 정보·경고 (amber-700)
  danger:       '#DC2626',   // 삭제·오류 (red-600)
  dangerDeep:   '#B91C1C',
  success:      '#15803D',   // 성공·맞춤 (green-700)
  successDeep:  '#166534',

  // 보더
  border:        '#DDEEFF',
  borderHover:   '#DDEEFF',
  borderActive:  '#DDEEFF',
  borderDashed:  '#DDEEFF',
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
  primary: '0 8px 40px #DDEEFF',
  danger:  '0 8px 40px rgba(239,68,68,0.6)',
  success: '0 8px 40px rgba(16,185,129,0.45)',
  warning: '0 8px 40px rgba(251,191,36,0.4)',
  card:    '0 4px 20px rgba(31,95,217,0.2)',   /* 정본 §8 "경계 뚜렷한 검정 그림자 금지" — 블루 톤으로 교체 */
}
