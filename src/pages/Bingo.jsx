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
    if (mode === 'play') {
      if (called.length > 0 && !confirm('빙고 호명이 진행 중입니다. 주제 선택으로 돌아갈까요? (호명 기록이 초기화됩니다)')) return
      setMode('subject')
    }
    else if (mode === 'subject') { setMode('cat'); setCategory(null) }
    else                         { navigate('/') }
  }

  /* ───── 화면 1 — 분류 선택 ───── */
  if (mode === 'cat') {
    return (
      <div className="min-h-screen">
        <Header title="🎯 빙고 게임" onBack={back} />

        <VerseHeader gameId="bingo" />
        <HowToCard gameId="bingo" defaultOpen={false} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <div className="mb-4 p-3 rounded-2xl flex items-center gap-2.5"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <span className="text-xl" aria-hidden>📝</span>
            <p className="text-xs font-bold leading-relaxed" style={{ color: '#1E40AF' }}>
              진행 팁: 학생들에게 종이 빙고판과 필기도구를 미리 나눠준 후 주제를 선택해 호명하세요. (대형 화면 미러링 권장)
            </p>
          </div>
          <p className="mb-3 leading-relaxed" style={{ color: '#3A4568', fontSize: 13 }}>
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
                  style={{ textShadow: '0 1px 4px #1E2A45' }}>
                  {cat.name}
                </p>
                <p className="text-[13px] font-bold text-white/90"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
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
      <div className="min-h-screen">
        <Header title={`${category.emoji} ${category.name}`} onBack={back} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <p className="text-[12px] mb-4 leading-relaxed" style={{ color: '#3A4568' }}>
            세부 주제를 선택하세요. 각 주제 카드에 <b style={{ color: '#3A4568' }}>빙고판 크기</b>가 표시됩니다.
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
                  style={{ textShadow: '0 1px 4px #1E2A45' }}>
                  {s.name}
                </p>
                <p className="text-[13px] font-bold text-white/90"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  단어 {s.words.length}개
                </p>
                {/* 빙고 크기 배지 — 주제별 고정 */}
                <span className="absolute top-2 right-2 text-[13px] font-black px-2 py-0.5 rounded-md"
                  style={{ background: '#EFF6FF', color: '#101A3D', border: '1px solid #BFDBFE' }}>
                  {s.size}×{s.size}
                </span>
                {s.note && (
                  <span className="absolute top-2 left-2 text-[13px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
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
    <div className="min-h-screen flex flex-col">
      <Header title={`${theme.name} · ${size}×${size}`} onBack={back}
        right={
          <span className="text-xs font-black px-2 py-0.5 rounded-md"
            style={{ background: '#EFF6FF', color: '#101A3D', border: '1px solid #BFDBFE' }}>
            {called.length} / {pool.length}
          </span>
        } />

      <div className="max-w-lg mx-auto w-full px-4 mb-2">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E6EEF9' }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: category.gradient }} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {currentWord ? (
          <div className="text-center" key={currentWord + called.length}>
            <p className="text-[11px] font-black tracking-widest uppercase mb-3" style={{ color: '#5C6A93' }}>
              호명 단어
            </p>
            <p className="font-black leading-none drop-shadow-lg"
              style={{
                fontSize: currentWord.length > 5 ? 56 : currentWord.length > 3 ? 76 : 96,
                background: category.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `drop-shadow(0 4px 12px ${category.accent}44)`,
                animation: 'wordPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
              {currentWord}
            </p>
          </div>
        ) : (
          <div className="text-center px-6">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-[14px] font-bold mb-2" style={{ color: '#3A4568' }}>
              학생들이 빙고판을 채울 시간을 주세요
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#3A4568' }}>
              주제: <b style={{ color: '#101A3D' }}>{theme.name}</b><br/>
              빙고판: {size}×{size} ({size*size}칸) · 단어 풀 {pool.length}개<br/>
              준비되면 <b style={{ color: '#3A4568' }}>"시작!"</b>을 누르세요.
            </p>
          </div>
        )}
      </div>

      {called.length > 1 && (
        <div className="max-w-lg mx-auto w-full px-4 mb-3">
          <p className="text-[13px] font-black tracking-widest uppercase mb-2" style={{ color: '#5C6A93' }}>
            지금까지 호명 ({called.length - 1})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {called.slice(0, -1).map((w, i) => (
              <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: '#EFF6FF',
                  color: '#101A3D',
                  border: '1px solid #BFDBFE',
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
              color: '#FFFFFF',
              boxShadow: `0 8px 40px ${category.accent}66`,
              border: `1px solid ${category.accent}66`,
            }}>
            🎯 {called.length === 0 ? '시작!' : '다음 단어'}
          </button>
        ) : (
          <div className="rounded-2xl py-4 text-center"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <p className="font-black text-base" style={{ color: '#166534' }}>
              ✓ 모든 단어 호명 완료
            </p>
          </div>
        )}

        {called.length > 0 && (
          <button onClick={reshuffle}
            className="w-full py-3 rounded-xl font-bold text-sm active:scale-95"
            style={{
              background: '#EFF6FF',
              color: '#3A4568',
              border: '1px solid #E4ECF7',
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
