/* 진행자 멘트용 말씀 카드
 * 각 게임 페이지의 진입 화면 상단에 표시.
 * 글자 크기·대비 강하게 설정해 진행자가 읽기 쉽도록.
 */
import { getGame } from '../data/gameInfo'

export default function VerseHeader({ gameId, className = '' }) {
  const game = getGame(gameId)
  const verse = game?.verse
  if (!verse) return null

  return (
    <div className={`max-w-lg mx-auto w-full px-4 mb-4 ${className}`}>
      <div className="rounded-2xl px-4 py-4"
        style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
          border: '1px solid #FDE68A',
          boxShadow: '0 4px 20px rgba(217,119,6,0.08)',
        }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 18 }}>📖</span>
          <p className="text-[12px] font-black tracking-widest uppercase"
            style={{ color: '#854D0E' }}>
            진행자 멘트 · 오늘의 말씀
          </p>
        </div>
        <p className="font-bold leading-relaxed"
          style={{ fontSize: 16, color: '#101A3D' }}>
          “{verse.text}”
        </p>
        <p className="text-right mt-2 font-black"
          style={{ fontSize: 13, color: '#78350F' }}>
          — {verse.ref}
        </p>
      </div>
    </div>
  )
}
