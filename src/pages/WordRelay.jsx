import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RELAY_THEMES } from '../data/relayThemes'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

export default function WordRelay() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(() => new Set())

  const toggle = (id) => {
    setOpen(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  return (
    <div className="min-h-screen">
      <Header title="🔗 단어 릴레이" onBack={() => navigate('/')} />

      <VerseHeader gameId="word-relay" />
      <HowToCard gameId="word-relay" defaultOpen={false} />

      <div className="max-w-lg mx-auto px-4 pb-6 flex flex-col gap-4">

        {/* 게임 설명 */}
        <div className="rounded-2xl p-4"
          style={{ background:'#FEF3C7', border:'1px solid #FDE68A' }}>
          <p className="text-[11px] font-black tracking-widest uppercase mb-2" style={{ color: '#854D0E' }}>
            📖 게임 방법
          </p>
          <ol className="text-[13px] leading-relaxed space-y-1.5" style={{ color: '#3A4568' }}>
            <li>1. 모두 함께 볼 주제를 하나 정합니다.</li>
            <li>2. 한 사람씩 차례로 주제에 맞는 단어를 외칩니다.</li>
            <li>3. 막히거나 같은 단어를 외치면 <b style={{ color:'#DC2626' }}>탈락!</b></li>
            <li>4. 마지막까지 남는 사람이 승리합니다.</li>
          </ol>
        </div>

        {/* 주제 목록 */}
        <div>
          <p className="text-[13px] font-black tracking-widest uppercase mb-2 px-1" style={{ color: '#5C6A93' }}>
            주제 목록 (탭하면 단어 펼치기)
          </p>
          <div className="flex flex-col gap-2">
            {RELAY_THEMES.map(t => {
              const isOpen = open.has(t.id)
              const hasAnswers = Array.isArray(t.answers) && t.answers.length > 0
              return (
                <div key={t.id} className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${t.accent}33` }}>
                  <button onClick={() => toggle(t.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 active:scale-[0.99] transition-all text-left"
                    style={{ background: t.gradient }}>
                    <span className="drop-shadow-lg shrink-0" style={{ fontSize: 28 }}>{t.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-[15px] leading-tight">{t.name}</p>
                      <p className="text-[11px] mt-0.5 truncate text-white/90"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        {t.goal ? `${t.goal}개` : '자유'} · {t.hint}
                      </p>
                    </div>
                    <span className="text-white text-base shrink-0"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-3"
                      style={{ background: '#EFF6FF', borderTop: `1px solid #BFDBFE` }}>
                      {hasAnswers ? (
                        <div className="flex flex-wrap gap-1.5">
                          {t.answers.map((w, i) => (
                            <span key={i} className="text-[12px] font-bold px-2 py-1 rounded-md"
                              style={{
                                background: '#DBEAFE',
                                color: '#101A3D',
                                border: '1px solid #BFDBFE',
                              }}>
                              {w}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] py-1.5 leading-relaxed" style={{ color: '#3A4568' }}>
                          자유 주제 — 학생들이 알고 있는 모든 <b style={{ color: '#1D4ED8' }}>{t.name}</b> 단어를 차례로 외치면 됩니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
