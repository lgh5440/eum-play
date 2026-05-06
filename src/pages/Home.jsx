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
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
          style={{ background: 'rgba(99,102,241,0.18)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.35)' }}
        >
          ✦ CHURCH ACTIVITY
        </div>
        <button
          onClick={() => navigate('/settings')}
          aria-label="설정 열기"
          className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5"
          style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
        >
          <span aria-hidden>⚙</span> 설정
        </button>
      </div>

      {/* 이음 로고 컴팩트 */}
      <div
        className="relative rounded-2xl p-4 mb-5 overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #0d1b3e 0%, #1a1050 45%, #1e3a8a 100%)',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 6px 24px rgba(99,102,241,0.18)',
        }}
      >
        <div className="absolute -top-10 -right-6 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(252,211,77,0.18), transparent 65%)' }} />

        <div className="relative z-10 flex items-center gap-3">
          {/* 왼쪽: 작은 황금 로고 */}
          <svg width="56" height="56" viewBox="0 0 220 220" fill="none" aria-hidden
            className="shrink-0"
            style={{ filter: 'drop-shadow(0 3px 12px rgba(252,211,77,0.4))' }}>
            <defs>
              <linearGradient id="eumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#fef3c7" />
                <stop offset="22%"  stopColor="#fcd34d" />
                <stop offset="50%"  stopColor="#d4a017" />
                <stop offset="78%"  stopColor="#a16207" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id="eumStarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
                <stop offset="20%" stopColor="#fef3c7" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#fcd34d" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#d4a017" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="eumStarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#fffbeb" />
                <stop offset="50%"  stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#d4a017" />
              </linearGradient>
            </defs>

            <ellipse cx="80"  cy="100" rx="48" ry="72" fill="none" stroke="url(#eumGold)" strokeWidth="20" />
            <ellipse cx="140" cy="100" rx="48" ry="72" fill="none" stroke="url(#eumGold)" strokeWidth="20" />
            <circle  cx="110" cy="100" r="55" fill="url(#eumStarGlow)" />
            <path d="M110,40 L115,95 L165,100 L115,105 L110,160 L105,105 L55,100 L105,95 Z"
              fill="url(#eumStarFill)" opacity="0.85" />
            <path d="M110,75 L112,98 L135,100 L112,102 L110,125 L108,102 L85,100 L108,98 Z"
              fill="#ffffff" />
            <circle cx="110" cy="100" r="3" fill="#ffffff" />
            <text x="110" y="200"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="28" fontWeight="700"
              fill="url(#eumGold)" letterSpacing="6">
              E:UM
            </text>
          </svg>

          {/* 오른쪽: 이름 + 설명 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-black leading-none tracking-tight"
                style={{
                  fontSize: 22,
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #a16207 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                이음
              </h1>
              <span className="font-black tracking-[0.25em]"
                style={{ fontSize: 11, color: 'rgba(252,211,77,0.75)' }}>
                E:UM
              </span>
            </div>
            <p className="text-[12px] leading-snug mt-1.5" style={{ color: 'rgba(255,255,255,0.82)' }}>
              하나님과 사람을, 사람과 사람을 잇다.<br/>
              교회 활동 도우미입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 게임 9종 — 3×3 그리드 */}
      <p className="text-[11px] font-black mb-3 tracking-widest uppercase" style={{ color: '#64748b' }}>
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
              background: game.gradient,
              boxShadow: `0 6px 20px ${game.accent}44`,
              border: `1px solid ${game.accent}55`,
            }}
          >
            <span aria-hidden className="drop-shadow-lg mb-1.5" style={{ fontSize: 42 }}>{game.emoji}</span>
            <p className="font-black text-white text-[12px] leading-tight text-center px-1.5"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {game.name}
            </p>
          </button>
        ))}
      </div>

      {/* 안내 카드 */}
      <Card style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
        <p className="text-[11px] font-black mb-1.5 tracking-wider uppercase" style={{ color: '#22d3ee' }}>
          💡 사용 안내
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
          말씀·찬양·교제 — 마음을 잇는 다양한 게임을 제공합니다.<br/>
          진행자 멘트와 사용법이 함께 들어 있어 초보자도 즉시 사용할 수 있습니다.
        </p>
      </Card>

      {/* 이음 패밀리 앱 광고 */}
      <EumFamilyFooter currentApp="eumplay" variant="footer" />

    </div>
  )
}
