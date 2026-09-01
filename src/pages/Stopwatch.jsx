import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

export default function Stopwatch() {
  const navigate  = useNavigate()
  const [time, setTime]       = useState(0)
  const [running, setRunning] = useState(false)
  const [isLandscape, setIsLandscape] = useState(
    () => window.innerWidth > window.innerHeight
  )
  const intervalRef = useRef(null)
  const startRef    = useRef(0)
  const savedRef    = useRef(0)

  /* 방향 감지 */
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight)
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  /* 타이머 */
  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - savedRef.current
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startRef.current)
      }, 10)
    } else {
      clearInterval(intervalRef.current)
      savedRef.current = time
    }
    return () => clearInterval(intervalRef.current)
    // running false로 바뀌는 시점의 time을 저장해야 하므로 deps에 time 미포함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const handleStart = () => setRunning(true)
  const handleStop  = () => setRunning(false)
  const handleReset = () => {
    setRunning(false)
    setTime(0)
    savedRef.current = 0
  }

  /* 시간 포맷 */
  const ms   = Math.floor((time % 1000) / 10)
  const secs = Math.floor(time / 1000) % 60
  const mins = Math.floor(time / 60000)
  const display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}:${String(ms).padStart(2,'0')}`

  const mainColor = running ? '#1F5FD9' : time > 0 ? '#DC2626' : '#101A3D'
  const glow      = running ? '0 0 40px rgba(37,99,235,0.2)' : 'none'

  const handleBack = () => {
    if (running && !confirm('스톱워치가 측정 중입니다. 메인으로 나갈까요?')) return
    navigate('/')
  }

  /* ───── 가로 (TV·모니터·태블릿) ───── */
  if (isLandscape) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
      >
        {/* 뒤로 버튼 — 좌상단 */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center text-lg z-10"
          style={{ background: '#EAF3FF', border: '1px solid #DDEEFF', color: '#3A4568' }}
        >←</button>

        {/* 시간 — 화면 꽉 채움 */}
        <div
          className="font-black leading-none tracking-tight select-none"
          style={{
            fontSize: 'clamp(80px, 18vw, 180px)',
            fontVariantNumeric: 'tabular-nums',
            color: mainColor,
            letterSpacing: '-0.03em',
            transition: 'color 0.3s',
          }}
        >
          {display}
        </div>

        {/* 버튼 — 우측 하단 */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl font-black text-base transition-all active:scale-95"
            style={{
              background: '#EAF3FF',
              border: '1px solid #DDEEFF',
              color: '#3A4568',
            }}
          >리셋</button>

          {!running ? (
            <button
              onClick={handleStart}
              className="px-10 py-3 rounded-2xl font-black text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1F5FD9, #2F73F2)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                border: '1px solid #DDEEFF',
              }}
            >시작</button>
          ) : (
            <button
              onClick={handleStop}
              className="px-10 py-3 rounded-2xl font-black text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #9A3412, #C2410C)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(194,65,12,0.3)',
                border: '1px solid #DDEEFF',
              }}
            >정지</button>
          )}
        </div>
      </div>
    )
  }

  /* ───── 세로 (모바일 기본) ───── */
  return (
    <div
      className="min-h-screen flex flex-col"
    >
      <Header title="스톱워치" onBack={handleBack} />

      {/* 진행자 멘트 + 사용법 */}
      <VerseHeader gameId="stopwatch" />
      <HowToCard gameId="stopwatch" defaultOpen={false} />

      {/* 메인 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-12">
        <div
          className="font-black tracking-tight text-center select-none"
          style={{
            fontSize: 'clamp(72px, 20vw, 160px)',
            fontVariantNumeric: 'tabular-nums',
            color: mainColor,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textShadow: glow,
            transition: 'color 0.3s, text-shadow 0.3s',
          }}
        >
          {display}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="flex-1 py-5 rounded-2xl font-black text-lg transition-all active:scale-95"
            style={{
              background: '#EAF3FF',
              border: '1px solid #DDEEFF',
              color: '#3A4568',
            }}
          >리셋</button>

          {!running ? (
            <button
              onClick={handleStart}
              className="flex-[2] py-5 rounded-2xl font-black text-xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #1F5FD9, #2F73F2)',
                color: '#FFFFFF',
                boxShadow: '0 6px 30px rgba(37,99,235,0.3)',
                border: '1px solid #DDEEFF',
              }}
            >시작</button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-[2] py-5 rounded-2xl font-black text-xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #9A3412, #C2410C)',
                color: '#FFFFFF',
                boxShadow: '0 6px 30px rgba(194,65,12,0.3)',
                border: '1px solid #DDEEFF',
              }}
            >정지</button>
          )}
        </div>
      </div>
    </div>
  )
}
