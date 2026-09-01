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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-5" aria-hidden>⚠️</div>
        <p className="font-black mb-2" style={{ color: '#DC2626', fontSize: 22 }}>
          문제가 발생했습니다
        </p>
        <p className="leading-relaxed mb-5" style={{ color: '#3A4568', fontSize: 14 }}>
          앱에서 예상치 못한 오류가 발생했어요.<br />
          다시 시도하거나 홈으로 돌아가 주세요.
        </p>

        {/* 개발자용 에러 상세 (접힌 상태) */}
        {error && (
          <details className="text-left mb-5 rounded-xl px-3 py-2 cursor-pointer"
            style={{ background:'rgba(254,226,226,0.5)', border:'1px solid #FECACA' }}>
            <summary className="font-bold" style={{ color:'#B91C1C', fontSize: 11, letterSpacing: '0.08em' }}>
              ▸ 에러 정보 (개발자용)
            </summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all"
              style={{ color:'#7F1D1D', fontSize: 10, lineHeight: 1.5 }}>
              {String(error?.message || error)}
              {error?.stack ? '\n\n' + error.stack : ''}
            </pre>
          </details>
        )}

        <div className="flex gap-2">
          <button onClick={reset}
            className="flex-1 py-3.5 rounded-xl font-black active:scale-95"
            style={{ background:'#EAF3FF', color:'#1F5FD9', border:'1px solid #DDEEFF' }}>
            🔄 다시 시도
          </button>
          <button onClick={() => { window.location.href = import.meta.env.BASE_URL }}
            className="flex-1 py-3.5 rounded-xl font-black"
            style={{
              background:'linear-gradient(135deg,#2F73F2,#2F73F2)',
              color:'#FFFFFF',
              boxShadow:'0 4px 20px #DDEEFF',
              border:'1px solid #DDEEFF',
            }}>
            🏠 홈으로
          </button>
        </div>
      </div>
    </div>
  )
}
