/* 공용 EmptyState — 데이터/사진/문제가 없을 때 표시
 * 빈 화면 대신 "다음에 무엇을 할 수 있는지" 안내 */

export default function EmptyState({ icon = '📭', title, description, action, dashed = true }) {
  return (
    <div
      className="rounded-2xl py-14 px-6 text-center"
      style={{
        background: 'rgba(10,16,35,0.7)',
        border: dashed
          ? '2px dashed rgba(99,102,241,0.3)'
          : '1px solid rgba(255,255,255,0.07)',
      }}>
      <div className="text-5xl mb-3" aria-hidden>{icon}</div>
      {title && (
        <p className="font-black text-base" style={{ color: '#a5b4fc' }}>
          {title}
        </p>
      )}
      {description && (
        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#94a3b8' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
