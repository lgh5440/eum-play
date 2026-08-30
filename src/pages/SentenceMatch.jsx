import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MATCH_CATEGORIES } from '../data/matchData'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

const LEVELS = ['상', '중', '하']
const LEVEL_COLOR = {
  '상': { txt: '#9C6F0F', bg: 'rgba(248,113,113,0.10)', bd: 'rgba(248,113,113,0.45)' },
  '중': { txt: '#FFD98C', bg: 'rgba(251,191,36,0.10)',  bd: 'rgba(251,191,36,0.45)' },
  '하': { txt: '#3B82F6', bg: 'rgba(52,211,153,0.10)',  bd: 'rgba(52,211,153,0.45)' },
}

export default function SentenceMatch() {
  const navigate = useNavigate()

  const [mode, setMode]         = useState('cat')   // 'cat' | 'level' | 'list'
  const [category, setCategory] = useState(null)
  const [level, setLevel]       = useState(null)

  const back = () => {
    if (mode === 'list')      { setMode('level'); setLevel(null) }
    else if (mode === 'level'){ setMode('cat'); setCategory(null) }
    else                      { navigate('/') }
  }

  /* ───── 화면 1 — 카테고리 선택 ───── */
  if (mode === 'cat') {
    return (
      <div className="min-h-screen">
        <Header title="📜 문장 매칭" onBack={back} />

        <VerseHeader gameId="sentence-match" />
        <HowToCard gameId="sentence-match" defaultOpen={false} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <div className="rounded-2xl p-4 mb-4"
            style={{ background:'rgba(37,99,235,0.06)', border:'1px solid #EFF6FF' }}>
            <p className="text-[11px] font-black tracking-widest uppercase mb-2" style={{ color: '#3B82F6' }}>
              📖 진행 방법
            </p>
            <ol className="text-[13px] leading-relaxed space-y-1.5" style={{ color: '#3A4568' }}>
              <li>1. 진행자가 화면을 봅니다 (학생들에게 보여주지 않음).</li>
              <li>2. 앞부분을 학생들에게 천천히 읽습니다.</li>
              <li>3. 학생들이 뒷부분을 답합니다.</li>
              <li>4. 진행자가 정답·장절을 확인하고 안내합니다.</li>
            </ol>
          </div>

          <p className="text-[13px] font-black tracking-widest uppercase mb-2" style={{ color: '#5C6A93' }}>
            카테고리 선택
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {MATCH_CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => { setCategory(cat); setMode('level') }}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center active:scale-95 transition-all gap-1.5 px-2"
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
                  상·중·하 각 30문제
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 화면 2 — 난이도 선택 ───── */
  if (mode === 'level') {
    return (
      <div className="min-h-screen">
        <Header title={`${category.emoji} ${category.name}`} onBack={back} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <p className="text-[12px] mb-4 leading-relaxed" style={{ color: '#3A4568' }}>
            난이도를 선택하세요. 각 난이도당 <b style={{ color: '#3A4568' }}>30문제</b>가 준비되어 있습니다.
          </p>

          <div className="flex flex-col gap-2.5">
            {LEVELS.map(lv => {
              const c = LEVEL_COLOR[lv]
              const count = category.levels[lv]?.length || 0
              return (
                <button key={lv}
                  onClick={() => { setLevel(lv); setMode('list') }}
                  className="rounded-2xl p-4 flex items-center justify-between active:scale-95 transition-all"
                  style={{ background: c.bg, border: `1px solid ${c.bd}` }}>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-base font-black"
                      style={{ background: c.bd, color: '#FFFFFF' }}>
                      {lv}
                    </span>
                    <p className="font-black text-base" style={{ color: c.txt }}>
                      난이도 {lv}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: c.txt }}>
                    {count}문제
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 화면 3 — 30문제 목록 (진행자용) ───── */
  const items = category.levels[level] || []
  const c = LEVEL_COLOR[level]

  return (
    <div className="min-h-screen">
      <Header title={`${category.emoji} ${category.name} · ${level}`} onBack={back}
        right={
          <span className="text-xs font-black px-2 py-0.5 rounded-md"
            style={{ background: '#EFF6FF', color: '#101A3D', border: '1px solid #BFDBFE' }}>
            {items.length}문제
          </span>
        } />

      <div className="max-w-lg mx-auto px-4 pb-6">
        <p className="text-[11px] mb-3 leading-relaxed text-center" style={{ color: '#5C6A93' }}>
          앞부분 <b style={{ color: c.txt }}>/</b> 뒷부분 (장절)
        </p>

        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl px-3 py-2.5"
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderLeft: '3px solid #1D4ED8',
              }}>
              <div className="flex items-start gap-2">
                <span className="text-[13px] font-black tabular-nums shrink-0 mt-0.5"
                  style={{ color: '#1D4ED8', minWidth: 22 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[13px] leading-snug flex-1" style={{ color: '#3A4568' }}>
                  <span style={{ color: '#3A4568' }}>{item.left}</span>
                  <span className="mx-1.5 font-black" style={{ color: '#1D4ED8' }}>/</span>
                  <span style={{ color: '#3A4568' }}>{item.right}</span>
                  {item.ref && (
                    <span className="ml-1.5 text-[11px] font-bold whitespace-nowrap"
                      style={{ color: '#1D4ED8' }}>
                      ({item.ref})
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
