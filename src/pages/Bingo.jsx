import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BINGO_CATEGORIES } from '../data/bingoData'
import { shuffle } from '../utils/chosung'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

export default function Bingo() {
  const navigate = useNavigate()

  const [mode, setMode]         = useState('cat')   // 'cat' | 'subject' | 'play'
  const [category, setCategory] = useState(null)
  const [theme, setTheme]       = useState(null)
  const [pool, setPool]         = useState([])
  const [called, setCalled]     = useState([])

  const goSubjects = (cat) => { setCategory(cat); setMode('subject') }

  const startGame = (subject) => {
    setTheme(subject)
    setPool(shuffle(subject.words))
    setCalled([])
    setMode('play')
  }

  const nextWord = () => {
    if (called.length < pool.length) {
      setCalled(c => [...c, pool[c.length]])
    }
  }

  const reshuffle = () => {
    setPool(shuffle(theme.words))
    setCalled([])
  }

  const back = () => {
    if (mode === 'play')         { setMode('subject') }
    else if (mode === 'subject') { setMode('cat'); setCategory(null) }
    else                         { navigate('/') }
  }

  /* ───── 화면 1 — 분류 선택 ───── */
  if (mode === 'cat') {
    return (
      <div className="min-h-screen" style={{ background: '#060a18' }}>
        <Header title="🎯 빙고 게임" onBack={back} />

        <VerseHeader gameId="bingo" />
        <HowToCard gameId="bingo" defaultOpen={false} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8', fontSize: 13 }}>
            분류를 선택하면 세부 주제가 나옵니다. 주제마다 빙고판 크기가 정해져 있습니다.
          </p>

          {/* 분류 카드 */}
          <div className="grid grid-cols-2 gap-2.5">
            {BINGO_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => goSubjects(cat)}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all gap-1.5 px-2 relative"
                style={{
                  background: cat.gradient,
                  boxShadow: `0 6px 20px ${cat.accent}33`,
                  border: `1px solid ${cat.accent}55`,
                }}>
                <span className="drop-shadow-lg" style={{ fontSize: 44 }}>{cat.emoji}</span>
                <p className="font-black text-white text-base leading-tight"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {cat.name}
                </p>
                <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  주제 {cat.subjects.length}종
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 화면 2 — 세부 주제 선택 ───── */
  if (mode === 'subject') {
    return (
      <div className="min-h-screen" style={{ background: '#060a18' }}>
        <Header title={`${category.emoji} ${category.name}`} onBack={back} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <p className="text-[12px] mb-4 leading-relaxed" style={{ color: '#94a3b8' }}>
            세부 주제를 선택하세요. 각 주제 카드에 <b style={{ color: '#cbd5e1' }}>빙고판 크기</b>가 표시됩니다.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {category.subjects.map(s => (
              <button key={s.id} onClick={() => startGame(s)}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all gap-1 px-2 relative"
                style={{
                  background: category.gradient,
                  boxShadow: `0 6px 20px ${category.accent}33`,
                  border: `1px solid ${category.accent}55`,
                }}>
                <span className="drop-shadow-lg" style={{ fontSize: 36 }}>{s.emoji}</span>
                <p className="font-black text-[13px] leading-tight text-center text-white"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {s.name}
                </p>
                <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  단어 {s.words.length}개
                </p>
                {/* 빙고 크기 배지 — 주제별 고정 */}
                <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                  {s.size}×{s.size}
                </span>
                {s.note && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.85)' }}>
                    {s.note}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 화면 3 — 게임 진행 ───── */
  const currentWord = called[called.length - 1]
  const remaining   = pool.length - called.length
  const progress    = (called.length / pool.length) * 100
  const size        = theme.size

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
      <Header title={`${theme.name} · ${size}×${size}`} onBack={back}
        right={
          <span className="text-xs font-black px-2 py-0.5 rounded-md"
            style={{ background: `${category.accent}1f`, color: category.accent, border: `1px solid ${category.accent}55` }}>
            {called.length} / {pool.length}
          </span>
        } />

      <div className="max-w-lg mx-auto w-full px-4 mb-2">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: category.gradient }} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {currentWord ? (
          <div className="text-center" key={currentWord + called.length}>
            <p className="text-[11px] font-black tracking-widest uppercase mb-3" style={{ color: '#64748b' }}>
              호명 단어
            </p>
            <p className="font-black leading-none drop-shadow-lg"
              style={{
                fontSize: currentWord.length > 5 ? 56 : currentWord.length > 3 ? 76 : 96,
                background: category.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 0 30px ${category.accent}99)`,
                animation: 'wordPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
              {currentWord}
            </p>
          </div>
        ) : (
          <div className="text-center px-6">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-[14px] font-bold mb-2" style={{ color: '#94a3b8' }}>
              학생들이 빙고판을 채울 시간을 주세요
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#64748b' }}>
              주제: <b style={{ color: category.accent }}>{theme.name}</b><br/>
              빙고판: {size}×{size} ({size*size}칸) · 단어 풀 {pool.length}개<br/>
              준비되면 <b style={{ color: '#94a3b8' }}>"시작!"</b>을 누르세요.
            </p>
          </div>
        )}
      </div>

      {called.length > 1 && (
        <div className="max-w-lg mx-auto w-full px-4 mb-3">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#64748b' }}>
            지금까지 호명 ({called.length - 1})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {called.slice(0, -1).map((w, i) => (
              <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: `${category.accent}1f`,
                  color: category.accent,
                  border: `1px solid ${category.accent}44`,
                }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto w-full px-4 pb-6 flex flex-col gap-2">
        {remaining > 0 ? (
          <button onClick={nextWord}
            className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
            style={{
              background: category.gradient,
              color: '#fff',
              boxShadow: `0 8px 40px ${category.accent}66`,
              border: `1px solid ${category.accent}66`,
            }}>
            🎯 {called.length === 0 ? '시작!' : '다음 단어'}
          </button>
        ) : (
          <div className="rounded-2xl py-4 text-center"
            style={{ background: `${category.accent}1a`, border: `1px solid ${category.accent}55` }}>
            <p className="font-black text-base" style={{ color: category.accent }}>
              ✓ 모든 단어 호명 완료
            </p>
          </div>
        )}

        {called.length > 0 && (
          <button onClick={reshuffle}
            className="w-full py-3 rounded-xl font-bold text-sm active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
            🔁 다시 셔플하고 시작
          </button>
        )}
      </div>

      <style>{`
        @keyframes wordPop {
          0%   { transform: scale(0.4) rotate(-8deg); opacity: 0; filter: blur(8px); }
          55%  { transform: scale(1.2) rotate(4deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
