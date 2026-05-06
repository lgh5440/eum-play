/* 공용 Field — 항목 라벨·힌트·내용 통일 */

export default function Field({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <p
          className="text-[11px] font-black tracking-widest uppercase"
          style={{ color: '#94a3b8' }}>
          {label}
        </p>
      )}
      {children}
      {hint && !error && (
        <p className="text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-[11px] leading-relaxed" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </div>
  )
}
