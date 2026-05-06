/* 공용 Header — 뒤로 / 가운데 제목 / 우측 액션
 * 모든 페이지에서 동일한 위치·터치 영역 보장 (44×44px) */

export default function Header({ title, subtitle, onBack, right, sticky = false }) {
  return (
    <div
      className="max-w-lg mx-auto w-full px-4 pt-5 pb-3 flex items-center gap-2"
      style={{
        position: sticky ? 'sticky' : 'static',
        top: 0,
        zIndex: sticky ? 40 : undefined,
        background: sticky ? '#060a18' : undefined,
      }}>

      {/* 뒤로 버튼 — 44×44 터치 영역 */}
      {onBack ? (
        <button
          onClick={onBack}
          className="rounded-xl flex items-center justify-center text-lg shrink-0 active:scale-95"
          style={{
            width: 44, height: 44,
            background: 'rgba(10,16,35,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8',
          }}
          aria-label="뒤로">
          ←
        </button>
      ) : (
        <span style={{ width: 44, height: 44 }} className="shrink-0 inline-block" />
      )}

      {/* 가운데 제목 */}
      <div className="flex-1 min-w-0 text-center">
        <h1 className="text-xs font-black tracking-widest uppercase truncate m-0"
          style={{ color: '#94a3b8' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] mt-0.5 truncate" style={{ color: '#94a3b8' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* 우측 액션 자리 — 비어 있어도 자리 차지 (균형) */}
      <div className="shrink-0 flex items-center gap-1.5"
        style={{ minWidth: 44, minHeight: 44, justifyContent: 'flex-end' }}>
        {right}
      </div>
    </div>
  )
}
