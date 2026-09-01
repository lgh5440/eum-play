import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

const PRESETS = [
  { label: '10초', secs: 10 },
  { label: '30초', secs: 30 },
  { label: '1분',  secs: 60 },
  { label: '2분',  secs: 120 },
  { label: '3분',  secs: 180 },
  { label: '5분',  secs: 300 },
]

export default function Timer() {
  const navigate = useNavigate()

  const [totalSecs, setTotalSecs] = useState(60)   // 설정 시간
  const [remaining, setRemaining] = useState(60)   // 남은 시간 (초)
  const [running, setRunning]     = useState(false)
  const [done, setDone]           = useState(false)
  const [customInput, setCustomInput] = useState('') // 직접 입력 (초)
  const intervalRef = useRef(null)

  /* 타이머 */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setDone(true)
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  /* 프리셋 선택 */
  const selectPreset = (secs) => {
    setRunning(false)
    setDone(false)
    setTotalSecs(secs)
    setRemaining(secs)
    setCustomInput('')
  }

  /* 직접 입력 적용 */
  const applyCustom = () => {
    const secs = parseInt(customInput)
    if (!secs || secs < 1) return
    selectPreset(secs)
  }

  /* 시작/일시정지 */
  const handleStartStop = () => {
    if (done) return
    setRunning(r => !r)
  }

  /* 리셋 */
  const handleReset = () => {
    setRunning(false)
    setDone(false)
    setRemaining(totalSecs)
  }

  /* 시간 포맷 */
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = totalSecs >= 60
    ? `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
    : `${String(remaining).padStart(2,'0')}`

  /* 진행률 & 색상 */
  const ratio = totalSecs > 0 ? remaining / totalSecs : 0
  const color  = done        ? '#DC2626'
               : ratio > 0.5 ? '#1F5FD9'
               : ratio > 0.2 ? '#B45309'
               :                '#DC2626'

  const handleBack = () => {
    if (running && !confirm('타이머가 동작 중입니다. 메인으로 나갈까요?')) return
    navigate('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-all duration-700"
      style={done ? { background: 'linear-gradient(160deg, #FEF2F2 0%, #FFFFFF 100%)' } : undefined}
    >
      <Header title="타이머" onBack={handleBack} />

      {/* 진행자 멘트 + 사용법 */}
      <VerseHeader gameId="timer" />
      <HowToCard gameId="timer" defaultOpen={false} />

      {/* 프리셋 버튼 */}
      <div className="px-5 pt-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {PRESETS.map(p => {
            const selected = totalSecs === p.secs && !customInput
            return (
              <button
                key={p.secs}
                onClick={() => selectPreset(p.secs)}
                aria-pressed={selected}
                aria-label={`${p.label} 타이머`}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={selected
                  ? { background: '#EAF3FF', color: '#1F5FD9', border: '1px solid #DDEEFF' }
                  : { background: '#EAF3FF', color: '#5C6A93', border: '1px solid #DDEEFF' }
                }
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* 직접 입력 */}
        <div className="flex gap-2 mt-2 justify-center">
          <input
            type="number"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="직접 입력 (초)"
            aria-label="사용자 지정 타이머 초 단위"
            min="1"
            className="rounded-xl px-3 py-1.5 text-xs text-center font-bold w-32"
            style={{
              background: '#EAF3FF',
              border: '1px solid #DDEEFF',
              color: '#3A4568',
              outline: 'none',
            }}
          />
          <button
            onClick={applyCustom}
            aria-label="사용자 지정 시간 적용"
            className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: '#EAF3FF', color: '#1F5FD9', border: '1px solid #DDEEFF' }}
          >적용</button>
        </div>
      </div>

      {/* 메인 타이머 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">

        {/* 원형 진행 표시 */}
        <div className="relative flex items-center justify-center">
          <svg
            width="280" height="280"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* 배경 원 */}
            <circle cx="140" cy="140" r="125"
              fill="none"
              stroke="#DDEEFF"
              strokeWidth="8"
            />
            {/* 진행 원 */}
            <circle cx="140" cy="140" r="125"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 125}`}
              strokeDashoffset={`${2 * Math.PI * 125 * (1 - ratio)}`}
              style={{
                transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s',
              }}
            />
          </svg>

          {/* 숫자 */}
          <div className="absolute text-center">
            {done ? (
              <div className="text-6xl font-black" style={{ color: '#DC2626' }}>종료!</div>
            ) : (
              <>
                <div
                  className="font-black leading-none"
                  style={{
                    fontSize: totalSecs >= 60 ? '72px' : '88px',
                    color: '#101A3D',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'color 0.5s',
                  }}
                >
                  {display}
                </div>
                {totalSecs >= 60 && (
                  <div className="text-sm font-bold mt-1" style={{ color: '#3A4568' }}>
                    {mins > 0 ? `${mins}분 ` : ''}{secs}초 남음
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="flex-1 py-5 rounded-2xl font-black text-base transition-all active:scale-95"
            style={{
              background: '#EAF3FF',
              border: '1px solid #DDEEFF',
              color: '#3A4568',
            }}
          >리셋</button>

          <button
            onClick={handleStartStop}
            disabled={done}
            className="flex-[2] py-5 rounded-2xl font-black text-xl transition-all active:scale-95"
            style={done ? {
              background: 'rgba(254,226,226,0.6)',
              color: '#DC2626',
              border: '1px solid #FECACA',
            } : running ? {
              background: '#FEF3C7',
              color: '#854D0E',
              border: '1px solid #FDE68A',
              boxShadow: '0 4px 20px rgba(217,119,6,0.2)',
            } : {
              background: 'linear-gradient(135deg, #1F5FD9, #2F73F2)',
              color: '#FFFFFF',
              boxShadow: '0 6px 30px rgba(37,99,235,0.3)',
              border: '1px solid #DDEEFF',
            }}
          >
            {done ? '종료' : running ? '일시정지' : '시작'}
          </button>
        </div>
      </div>
    </div>
  )
}
