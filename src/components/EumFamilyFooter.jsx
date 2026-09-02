// ⚠️ 자동 생성 파일 — 직접 수정 금지.
// 마스터: _eum-family/shared/EumFamilyFooter.jsx
// 갱신: node _eum-family/scripts/sync-eum-family.mjs
// 이음 패밀리 앱 푸터 — 3개 React 앱 공통 광고 카드.
// SSOT: 이 파일이 마스터. 사용처는 자동 생성됨.
//
// props:
//   currentApp : 'talentroad' | 'myrealid' | 'eumplay'
//   variant    : 'footer' (3개 모두 표시, 현재 앱 회색) | 'cta' (다른 2개만 강조). default 'footer'
//   size       : 'compact' (게임 화면 등 작은 영역) | 'normal' (대시보드 등). default 'normal'

import { EUM_FAMILY, buildEumFamilyUrl } from '../data/eumFamily'

const SIZE = {
  compact: {
    section: 'w-full mt-6 rounded-2xl p-4',
    headerMb: 'mb-3',
    heading: 'font-black text-sm mb-1',
    sub: 'text-[11px] leading-relaxed',
    cardPad: 'h-full rounded-xl p-2.5 flex flex-col items-center text-center transition-transform',
    emoji: { fontSize: 26, marginBottom: 4 },
    name: 'font-black text-[12px] leading-tight',
    tagline: 'text-[10px] mt-1 leading-snug',
    badge: 'mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider',
  },
  normal: {
    section: 'w-full mt-8 rounded-2xl p-5',
    headerMb: 'mb-4',
    heading: 'font-black text-base mb-1',
    sub: 'text-[12px] leading-relaxed',
    cardPad: 'h-full rounded-xl p-3 flex flex-col items-center text-center transition-transform',
    emoji: { fontSize: 30, marginBottom: 6 },
    name: 'font-black text-[13px] leading-tight',
    tagline: 'text-[11px] mt-1 leading-snug',
    badge: 'mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider',
  },
}

const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", emoji'

export default function EumFamilyFooter({ currentApp, variant = 'footer', size = 'normal' }) {
  const s = SIZE[size] || SIZE.normal
  const items = variant === 'cta' ? EUM_FAMILY.filter((app) => app.key !== currentApp) : EUM_FAMILY

  const heading = variant === 'cta' ? '✨ 이음 패밀리 다른 앱도 만나보세요' : '이음 패밀리 앱'
  const subText =
    variant === 'cta'
      ? '같은 E:UM 브랜드의 다른 도구들이에요. 마음에 드는 앱을 클릭해 보세요.'
      : '하나님과 사람을, 사람과 사람을 잇다 — E:UM'

  return (
    <section
      aria-label="이음 패밀리 앱"
      className={s.section}
      style={{
        /* ★재작업(2026-09-01, 오너 육안 피드백): 배경이 우측 하단으로 갈수록 진한 블루(#2F73F2)로
           바뀌어 그 위 카드 라벨이 흐려 보이는 문제 — 옅은 배경으로 통일, 진한 블루는 안 씀. */
        background: 'linear-gradient(150deg, #EAF3FF 0%, #DDEEFF 60%, #EAF3FF 100%)',
        border: '1px solid #DDEEFF',
        boxShadow: '0 8px 28px rgba(31,95,217,.12)',
      }}
    >
      <header className={s.headerMb}>
        <h3
          className={s.heading}
          style={{ color: '#101A3D' }}
        >
          {heading}
        </h3>
        <p className={s.sub} style={{ color: '#5C6A93' }}>
          {subText}
        </p>
      </header>

      <p
        className="mt-3 text-center text-[11px]"
        style={{ color: '#5C6A93' }}
      >
        오류 신고 · 문의 :{' '}
        <a
          href="mailto:lgh544092@gmail.com?subject=%5BE%3AUM%20%ED%8C%A8%EB%B0%80%EB%A6%AC%5D%20%EB%AC%B8%EC%9D%98%C2%B7%EC%98%A4%EB%A5%98%20%EC%A0%9C%EB%B3%B4"
          style={{
            color: '#1F5FD9',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          lgh544092@gmail.com
        </a>
      </p>

      <div className={`grid gap-2 ${items.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`} style={{ marginTop: 8 }}>
        {items.map((app) => {
          const isCurrent = app.key === currentApp
          const hasUrl = Boolean(app.url)
          const href = !isCurrent && hasUrl ? buildEumFamilyUrl(app, currentApp, variant) : undefined

          const card = (
            <div
              className={s.cardPad}
              style={{
                background: isCurrent
                  ? '#EAF3FF'
                  : hasUrl
                    ? 'linear-gradient(140deg, #EAF3FF, #EAF3FF)'
                    : '#F3F6FC',
                border: `1px solid ${isCurrent ? '#DDEEFF' : !hasUrl ? '#D7E5FA' : '#6FA7FF'}`,
              }}
            >
              <img
                src={`/icons-3d/${app.key === 'myrealid' ? 'camp' : app.key === 'eumplay' ? 'play' : app.key === 'eumschool' ? 'school' : app.key === 'eumphoto' ? 'photo' : 'talentroad'}.png`}
                alt={`${app.name} 아이콘`}
                style={{ width: s.emoji.fontSize, height: s.emoji.fontSize, marginBottom: s.emoji.marginBottom, objectFit: 'cover', borderRadius: 8 }}
              />
              <p
                className={s.name}
                style={{ color: '#101A3D' }}
              >
                {app.name}
              </p>
              <p
                className={s.tagline}
                style={{ color: '#5C6A93' }}
              >
                {app.tagline}
              </p>
              {isCurrent && (
                <span
                  className={s.badge}
                  style={{ background: '#EAF3FF', color: '#1F5FD9' }}
                >
                  현재 앱
                </span>
              )}
            </div>
          )

          return href ? (
            <a
              key={app.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${app.name} 열기 — ${app.tagline}`}
              className="block hover:scale-[1.03] active:scale-95 transition-transform"
            >
              {card}
            </a>
          ) : (
            <div key={app.key} aria-current="page">
              {card}
            </div>
          )
        })}
      </div>
    </section>
  )
}
