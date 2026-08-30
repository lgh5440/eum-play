/* 공용 EmptyState — 데이터/사진/문제가 없을 때 표시
 * 빈 화면 대신 "다음에 무엇을 할 수 있는지" 안내 */

export default function EmptyState({ icon = '📭', title, description, action, dashed = true }) {
  return (
    <div
      className="rounded-2xl py-14 px-6 text-center"
      style={{
        background: '#EFF6FF',
        border: dashed
          ? '2px dashed #BFDBFE'
          : '1px solid #E4ECF7',
      }}>
      <div className="text-5xl mb-3" aria-hidden>{icon}</div>
      {title && (
        <p className="font-black text-base" style={{ color: '#101A3D' }}>
          {title}
        </p>
      )}
      {description && (
        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#5C6A93' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
