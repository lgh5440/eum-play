import { useNavigate } from 'react-router-dom'
import { GAMES } from '../data/gameInfo'
import { Card } from '../components/ui'
import EumFamilyFooter from '../components/EumFamilyFooter'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-4">

      {/* 상단 배지 */}
      <div className="flex items-center justify-between mb-5">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-black tracking-widest uppercase"
          style={{ background: 'rgba(37,99,235,0.1)', color: '#1F5FD9', border: '1px solid #DDEEFF' }}
        >
          ✦ CHURCH ACTIVITY
        </div>
        <button
          onClick={() => navigate('/settings')}
          aria-label="설정 열기"
          className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"
          style={{ background: '#EAF3FF', color: '#1F5FD9', border: '1px solid #DDEEFF' }}
        >
          <span aria-hidden>⚙</span> 설정
        </button>
      </div>

      {/* 이음 로고 컴팩트 */}
      <div
        className="relative rounded-2xl p-4 mb-5 overflow-hidden"
        style={{
          /* ★재작업(2026-09-01, 오너 육안 피드백): 배경이 우측으로 갈수록 진한 블루(#2F73F2)로
             바뀌면서 그 위의 "이음" 잉크색 텍스트(#101A3D)가 흐려 보이는 문제 — eum-card 기준대로
             옅은 배경(전부 파스텔 톤)+가는 블루 테두리로 전환, 큰 면적 진한 블루 채움 금지. */
          background: 'linear-gradient(150deg, #EAF3FF 0%, #DDEEFF 60%, #EAF3FF 100%)',
          border: '1px solid #DDEEFF',
          boxShadow: '0 6px 24px rgba(31,95,217,.12)',
        }}
      >
        <div className="absolute -top-10 -right-6 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(252,211,77,0.18), transparent 65%)' }} />

        <div className="relative z-10 flex items-center gap-3">
          {/* 왼쪽: 이음(E:UM) 공식 로고 — 이음 패밀리 통일 */}
          <img
            src={`${import.meta.env.BASE_URL}eum-logo.png`}
            alt="E:UM"
            width="56"
            height="56"
            className="shrink-0 object-contain"
            style={{ filter: 'drop-shadow(0 3px 12px rgba(252,211,77,0.4))' }}
          />

          {/* 오른쪽: 이름 + 설명 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-black leading-none tracking-tight"
                style={{
                  fontSize: 22,
                  color: '#101A3D',
                }}>
                이음
              </h1>
              <span className="font-black tracking-[0.25em]"
                style={{ fontSize: 11, color: '#5C6A93' }}>
                E:UM
              </span>
            </div>
            <p className="text-[12px] leading-snug mt-1.5" style={{ color: '#5C6A93' }}>
              하나님과 사람을, 사람과 사람을 잇다.<br/>
              교회 활동 도우미입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 게임 9종 — 3×3 그리드 */}
      <p className="text-[11px] font-black mb-3 tracking-widest uppercase" style={{ color: '#3A4568' }}>
        🎲 게임 모음
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => navigate(game.route)}
            aria-label={`${game.name} 게임 시작`}
            className="aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center active:scale-95 transition-all relative"
            style={{
              /* ★오너 지시(2026-09-01): "게임모음 네모 테두리 무지개색, 바탕은 흰색" — 이음 패밀리
                 공통 브랜드 요소인 무지개 테두리를 게임 타일에도 확대 적용. eum-card .frame과 동일한
                 무지개 값, DOM 구조 변경 없이 단일 요소로 같은 시각효과를 내는 표준 CSS 기법
                 (padding-box에 흰 배경, border-box에 무지개 그라데이션, border는 투명 처리) 사용 —
                 rounded-2xl(border-radius)과 함께 써도 모서리가 깨지지 않는다. */
              background: 'linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg, #FF9AD8, #FFD98C, #8CC7FF, #18DDEB, #B98CFF) border-box',
              border: '3px solid transparent',
              boxShadow: '0 4px 12px rgba(31,95,217,.15)',
            }}
          >
            <span aria-hidden className="drop-shadow-lg mb-1.5" style={{ fontSize: 42 }}>{game.emoji}</span>
            <p className="font-black text-[12px] leading-tight text-center px-1.5"
              style={{ color: '#101A3D' }}>
              {game.name}
            </p>
            {game.id === 'photo-guess' && (
              <span className="absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md text-white/95"
                style={{ background: 'rgba(0,0,0,0.35)' }}>
                사전등록
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 안내 카드 */}
      <Card style={{ background: '#EAF3FF', border: '1px solid #DDEEFF' }}>
        <p className="text-[11px] font-black mb-1.5 tracking-wider uppercase" style={{ color: '#1F5FD9' }}>
          💡 사용 안내
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#3A4568' }}>
          말씀·찬양·교제 — 마음을 잇는 다양한 게임을 제공합니다.<br/>
          진행자 멘트와 사용법이 함께 들어 있어 초보자도 즉시 사용할 수 있습니다.
        </p>
      </Card>

      {/* 이음 패밀리 앱 광고 */}
      <EumFamilyFooter currentApp="eumplay" variant="footer" size="compact" />

    </div>
  )
}
