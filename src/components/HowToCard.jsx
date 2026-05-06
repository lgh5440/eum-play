/* 진행 방법 안내 카드 — 초보자용 단계별 설명
 * 기본 펼친 상태로 표시. 익숙해진 진행자는 탭하여 접을 수 있음. */
import { useState } from 'react'
import { getGame } from '../data/gameInfo'

export default function HowToCard({ gameId, defaultOpen = true, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  const game = getGame(gameId)
  const steps = game?.howTo
  if (!steps || steps.length === 0) return null

  return (
    <div className={`max-w-lg mx-auto w-full px-4 mb-4 ${className}`}>
      <div className="rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(14,116,144,0.04))',
          border: '1px solid rgba(34,211,238,0.32)',
          boxShadow: '0 4px 20px rgba(34,211,238,0.08)',
        }}>
        <button onClick={() => setOpen(!open)}
          className="w-full px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-all">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>📚</span>
            <p className="font-black tracking-widest uppercase"
              style={{ color: '#22d3ee', fontSize: 12 }}>
              진행 방법 (초보자 안내)
            </p>
          </div>
          <span style={{
            color: '#22d3ee',
            fontSize: 16,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}>
            ▼
          </span>
        </button>

        {open && (
          <ol className="px-4 pb-4 space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="font-black shrink-0 px-2 py-0.5 rounded-md"
                  style={{
                    color: '#22d3ee',
                    fontSize: 12,
                    background: 'rgba(34,211,238,0.15)',
                    border: '1px solid rgba(34,211,238,0.35)',
                    minWidth: 24,
                    textAlign: 'center',
                  }}>
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-0.5"
                  style={{ color: '#e2e8f0', fontSize: 14 }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
