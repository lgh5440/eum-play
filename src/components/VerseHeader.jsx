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
          background: 'linear-gradient(135deg, rgba(252,211,77,0.14), rgba(202,138,4,0.06))',
          border: '1px solid rgba(252,211,77,0.4)',
          boxShadow: '0 4px 20px rgba(252,211,77,0.12)',
        }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 18 }}>📖</span>
          <p className="text-[12px] font-black tracking-widest uppercase"
            style={{ color: '#fbbf24' }}>
            진행자 멘트 · 오늘의 말씀
          </p>
        </div>
        <p className="font-bold leading-relaxed"
          style={{ fontSize: 16, color: '#fffbeb' }}>
          “{verse.text}”
        </p>
        <p className="text-right mt-2 font-black"
          style={{ fontSize: 13, color: '#fcd34d' }}>
          — {verse.ref}
        </p>
      </div>
    </div>
  )
}
