/* React Error Boundary — 자식 컴포넌트의 렌더 에러를 잡아 fallback UI 표시
 * (이벤트 핸들러·비동기 에러는 잡지 못함 — try/catch로 처리해야 함) */
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}

function ErrorFallback({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#060a18' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-5" aria-hidden>⚠️</div>
        <p className="font-black mb-2" style={{ color: '#f87171', fontSize: 22 }}>
          문제가 발생했습니다
        </p>
        <p className="leading-relaxed mb-5" style={{ color: '#94a3b8', fontSize: 14 }}>
          앱에서 예상치 못한 오류가 발생했어요.<br />
          다시 시도하거나 홈으로 돌아가 주세요.
        </p>

        {/* 개발자용 에러 상세 (접힌 상태) */}
        {error && (
          <details className="text-left mb-5 rounded-xl px-3 py-2 cursor-pointer"
            style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.22)' }}>
            <summary className="font-bold" style={{ color:'#f87171', fontSize: 11, letterSpacing: '0.08em' }}>
              ▸ 에러 정보 (개발자용)
            </summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all"
              style={{ color:'#fca5a5', fontSize: 10, lineHeight: 1.5 }}>
              {String(error?.message || error)}
              {error?.stack ? '\n\n' + error.stack : ''}
            </pre>
          </details>
        )}

        <div className="flex gap-2">
          <button onClick={reset}
            className="flex-1 py-3.5 rounded-xl font-black active:scale-95"
            style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.35)' }}>
            🔄 다시 시도
          </button>
          <button onClick={() => { window.location.href = '/' }}
            className="flex-1 py-3.5 rounded-xl font-black"
            style={{
              background:'linear-gradient(135deg,#0891b2,#1d4ed8)',
              color:'#fff',
              boxShadow:'0 4px 20px rgba(6,182,212,0.35)',
              border:'1px solid rgba(6,182,212,0.4)',
            }}>
            🏠 홈으로
          </button>
        </div>
      </div>
    </div>
  )
}
