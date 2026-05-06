import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

const ROLL_DURATION = 1500
const FRAME_INTERVAL = 60

const rollDie = () => Math.floor(Math.random() * 6) + 1
const rollYut = () => Array.from({ length: 4 }, () => Math.random() < 0.5)

const yutNameOf = (sticks) => {
  const flat = sticks.filter(s => s).length
  return ({ 1: '도', 2: '개', 3: '걸', 4: '윷', 0: '모' })[flat]
}

const YUT_INFO = {
  '도': { steps: 1, again: false, color: '#94a3b8', emoji: '🐖', desc: '돼지' },
  '개': { steps: 2, again: false, color: '#a5b4fc', emoji: '🐕', desc: '개' },
  '걸': { steps: 3, again: false, color: '#fbbf24', emoji: '🐑', desc: '양' },
  '윷': { steps: 4, again: true,  color: '#f87171', emoji: '🐄', desc: '소' },
  '모': { steps: 5, again: true,  color: '#a78bfa', emoji: '🐎', desc: '말' },
}

export default function Dice() {
  const navigate = useNavigate()

  const [mode, setMode]               = useState('dice')
  const [diceCount, setDiceCount]     = useState(2)
  const [diceValues, setDiceValues]   = useState([1, 1])
  const [yutSticks, setYutSticks]     = useState([true, true, true, true])
  const [yutName, setYutName]         = useState(null)
  const [rolling, setRolling]         = useState(false)
  const [showResult, setShowResult]   = useState(false)
  const [burstKey, setBurstKey]       = useState(0)   // confetti 트리거

  const intervalRef = useRef(null)
  const timeoutRef  = useRef(null)

  const cleanup = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (timeoutRef.current)  { clearTimeout(timeoutRef.current);    timeoutRef.current  = null }
  }
  useEffect(() => () => cleanup(), [])

  const switchMode = (m) => {
    if (rolling) return
    cleanup()
    setMode(m); setRolling(false); setShowResult(false); setYutName(null)
  }

  const setCount = (n) => {
    if (rolling) return
    setDiceCount(n); setShowResult(false)
  }

  const roll = () => {
    if (rolling) return
    cleanup()
    setRolling(true); setShowResult(false); setYutName(null)

    intervalRef.current = setInterval(() => {
      if (mode === 'dice') {
        setDiceValues(Array.from({ length: diceCount }, rollDie))
      } else {
        setYutSticks(rollYut())
      }
    }, FRAME_INTERVAL)

    timeoutRef.current = setTimeout(() => {
      cleanup()
      if (mode === 'dice') {
        setDiceValues(Array.from({ length: diceCount }, rollDie))
      } else {
        const final = rollYut()
        setYutSticks(final)
        setYutName(yutNameOf(final))
      }
      setRolling(false)
      setShowResult(true)
      setBurstKey(k => k + 1)
    }, ROLL_DURATION)
  }

  const back = () => navigate('/')

  /* 결과 색상 / 배경 글로우 */
  const sum = diceValues.slice(0, diceCount).reduce((a, b) => a + b, 0)
  const yutColor = yutName ? YUT_INFO[yutName].color : '#fb923c'
  const isBigDice = mode === 'dice' && diceCount === 2 && (sum === 12 || sum === 2)
  const isBigYut  = mode === 'yut' && (yutName === '윷' || yutName === '모')
  const explosive = showResult && (isBigDice || isBigYut)
  const glowColor = mode === 'dice' ? '#fb923c' : yutColor

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#060a18' }}>

      {/* ───── 배경 라이트 (결과 확정 시 부드럽게 ON) ───── */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${glowColor}40, transparent 55%)`,
          opacity: showResult ? 1 : (rolling ? 0.35 : 0),
        }} />

      <div className="relative z-10">
        <Header title={mode === 'dice' ? '🎲 주사위 굴리기' : '🎴 윷놀이'} onBack={back} />
      </div>

      {/* 진행자 멘트 + 사용법 */}
      <div className="relative z-10">
        <VerseHeader gameId="dice" />
        <HowToCard gameId="dice" defaultOpen={false} />
      </div>

      {/* 모드 토글 */}
      <div className="max-w-lg mx-auto w-full px-4 mb-3 relative z-10">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl"
          style={{ background:'rgba(10,16,35,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <ModeBtn active={mode === 'dice'} onClick={() => switchMode('dice')} color="#fb923c">🎲 주사위</ModeBtn>
          <ModeBtn active={mode === 'yut'} onClick={() => switchMode('yut')} color="#fbbf24">🎴 윷놀이</ModeBtn>
        </div>
      </div>

      {/* 주사위 개수 토글 */}
      {mode === 'dice' && (
        <div className="max-w-lg mx-auto w-full px-4 mb-3 relative z-10">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: '#64748b' }}>
            주사위 개수
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map(n => (
              <button key={n} onClick={() => setCount(n)} disabled={rolling}
                className="py-2.5 rounded-xl font-black text-sm active:scale-95 transition-all"
                style={{
                  background: diceCount === n ? 'linear-gradient(135deg,#dc2626,#9a3412)' : 'rgba(255,255,255,0.04)',
                  color: diceCount === n ? '#fff' : '#94a3b8',
                  border: `1px solid ${diceCount === n ? 'rgba(251,146,60,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  opacity: rolling ? 0.5 : 1,
                }}>
                {n}개
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 결과 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 relative z-10">
        {mode === 'dice' ? (
          <DiceArea values={diceValues.slice(0, diceCount)} rolling={rolling} showResult={showResult} count={diceCount} sum={sum} />
        ) : (
          <YutArea sticks={yutSticks} rolling={rolling} showResult={showResult} name={yutName} />
        )}
      </div>

      {/* 컨페티 — 결과 확정 시 1회 */}
      {showResult && <Confetti key={burstKey} explosive={explosive} color={glowColor} />}

      {/* 굴리기 버튼 */}
      <div className="max-w-lg mx-auto w-full px-4 pb-6 relative z-10">
        <button onClick={roll} disabled={rolling}
          className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
          style={{
            background: mode === 'dice'
              ? 'linear-gradient(135deg,#dc2626,#9a3412)'
              : 'linear-gradient(135deg,#d97706,#92400e)',
            color: '#fff',
            boxShadow: mode === 'dice'
              ? '0 8px 40px rgba(251,146,60,0.4)'
              : '0 8px 40px rgba(251,191,36,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            opacity: rolling ? 0.7 : 1,
            animation: rolling ? 'btnPulse 0.6s ease-in-out infinite' : 'none',
          }}>
          {rolling ? '✦ 굴리는 중…' : (mode === 'dice' ? '🎲 굴리기!' : '🎴 던지기!')}
        </button>
      </div>

      {/* ───── 글로벌 스타일시트 ───── */}
      <style>{`
        @keyframes spin3d {
          0%   { transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25%  { transform: translateY(-22px) rotateX(360deg) rotateY(180deg) rotateZ(45deg); }
          50%  { transform: translateY(-30px) rotateX(720deg) rotateY(360deg) rotateZ(90deg); }
          75%  { transform: translateY(-15px) rotateX(1080deg) rotateY(540deg) rotateZ(135deg); }
          100% { transform: translateY(0) rotateX(1440deg) rotateY(720deg) rotateZ(180deg); }
        }
        @keyframes yutSpin {
          0%   { transform: translateY(0) rotateZ(0deg) rotateX(0deg); }
          30%  { transform: translateY(-26px) rotateZ(540deg) rotateX(180deg); }
          60%  { transform: translateY(-32px) rotateZ(900deg) rotateX(360deg); }
          85%  { transform: translateY(-12px) rotateZ(1260deg) rotateX(540deg); }
          100% { transform: translateY(0) rotateZ(1440deg) rotateX(720deg); }
        }
        @keyframes pop {
          0%   { transform: scale(0.4) rotate(-20deg); opacity: 0; filter: blur(8px); }
          55%  { transform: scale(1.25) rotate(8deg); opacity: 1; filter: blur(0); }
          75%  { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes popBig {
          0%   { transform: scale(0.3) rotate(-30deg); opacity: 0; filter: blur(10px); }
          50%  { transform: scale(1.4) rotate(10deg); opacity: 1; filter: blur(0); }
          70%  { transform: scale(0.85) rotate(-5deg); }
          90%  { transform: scale(1.08) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
          50%      { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        @keyframes confettiFly {
          0%   { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--cx)), calc(-50% + var(--cy))) rotate(720deg); opacity: 0; }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 8px 40px rgba(251,146,60,0.4); }
          50%      { box-shadow: 0 8px 60px rgba(251,146,60,0.7); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 16px var(--glow)); }
          50%      { filter: drop-shadow(0 0 36px var(--glow)); }
        }
      `}</style>
    </div>
  )
}

/* ───── 주사위 영역 ───── */
function DiceArea({ values, rolling, showResult, count, sum }) {
  const isBig = count === 2 && (sum === 12 || sum === 2)
  return (
    <>
      <div className="flex gap-4" style={{ perspective: '800px' }}>
        {values.map((v, i) => <DiceBox key={i} value={v} rolling={rolling} index={i} />)}
      </div>
      {showResult && count === 2 && (
        <div className="text-center relative" key={`sum-${sum}`}>
          <Sparkles count={6} color="#fb923c" />
          <p className="text-[11px] font-black tracking-widest uppercase mb-1" style={{ color: '#64748b' }}>
            합계
          </p>
          <p className="font-black leading-none relative inline-block"
            style={{
              fontSize: 72, color: '#fb923c',
              textShadow: '0 0 50px rgba(251,146,60,0.7)',
              animation: isBig ? 'popBig 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
            {sum}
          </p>
        </div>
      )}
    </>
  )
}

/* 주사위 박스 — 도트 패턴 + 3D 회전 */
const DOT_POSITIONS = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [3, 1], [1, 3], [3, 3]],
  5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]],
  6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]],
}
function DiceBox({ value, rolling, index }) {
  const dots = DOT_POSITIONS[value] || []
  return (
    <div className="rounded-2xl relative"
      style={{
        width: 110, height: 110,
        background: 'linear-gradient(135deg,#fafafa 0%,#e4e4e7 50%,#a1a1aa 100%)',
        border: '2px solid #52525b',
        boxShadow: rolling
          ? `0 0 35px rgba(251,146,60,0.7), 0 8px 25px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.18)`
          : `0 14px 35px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.18)`,
        animation: rolling
          ? `spin3d 0.7s linear infinite ${index * 0.08}s`
          : showAnim(index),
        transformStyle: 'preserve-3d',
        padding: 14,
      }}>
      <div className="w-full h-full grid"
        style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' }}>
        {Array.from({ length: 9 }).map((_, idx) => {
          const col = (idx % 3) + 1
          const row = Math.floor(idx / 3) + 1
          const has = dots.some(([c, r]) => c === col && r === row)
          return (
            <div key={idx} className="flex items-center justify-center">
              {has && (
                <div className="rounded-full"
                  style={{
                    width: 16, height: 16,
                    background: 'radial-gradient(circle at 35% 35%, #475569, #0f172a)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.3)',
                  }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
const showAnim = (i) => `pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s both`

/* ───── 윷 영역 ───── */
function YutArea({ sticks, rolling, showResult, name }) {
  const info = name ? YUT_INFO[name] : null
  return (
    <>
      <div className="flex flex-col gap-3 w-full max-w-md items-center" style={{ perspective: '900px' }}>
        {sticks.map((flat, i) => <YutStick key={i} flat={flat} rolling={rolling} index={i} />)}
      </div>
      {showResult && info && (
        <div className="text-center relative" key={`yut-${name}`}>
          <Sparkles count={info.again ? 10 : 6} color={info.color} />
          <p className="text-[11px] font-black tracking-widest uppercase mb-1" style={{ color: '#64748b' }}>
            결과
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-1 relative">
            <span style={{
              fontSize: 52,
              animation: 'pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
            }}>{info.emoji}</span>
            <p className="font-black leading-none relative inline-block"
              style={{
                fontSize: 96, color: info.color,
                textShadow: `0 0 50px ${info.color}aa, 0 0 20px ${info.color}cc`,
                ['--glow']: info.color + '99',
                animation: info.again
                  ? 'popBig 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), glowPulse 1.4s ease-in-out 0.7s infinite'
                  : 'pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
              {name}
            </p>
          </div>
          <p className="text-sm font-bold" style={{ color: '#94a3b8' }}>
            ({info.desc}) · {info.steps}칸 이동
          </p>
          {info.again && (
            <p className="mt-3 px-4 py-2 rounded-full inline-block text-sm font-black"
              style={{
                background:'rgba(251,191,36,0.15)', color:'#fbbf24',
                border:'1px solid rgba(251,191,36,0.4)',
                animation: 'pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both',
              }}>
              ✨ 한 번 더 던지세요!
            </p>
          )}
        </div>
      )}
    </>
  )
}

function YutStick({ flat, rolling, index }) {
  return (
    <div className="rounded-full flex items-center justify-center font-black"
      style={{
        width: '100%',
        maxWidth: 420,
        minWidth: 280,
        height: 64,
        background: flat
          ? 'linear-gradient(180deg,#fbe8b6 0%,#d6c08e 50%,#a8884d 100%)'
          : 'linear-gradient(180deg,#7a5638 0%,#5a3e25 50%,#2d1b0e 100%)',
        border: `3px solid ${flat ? '#9a7d4a' : '#1a0e06'}`,
        boxShadow: rolling
          ? '0 0 36px rgba(251,191,36,0.75), 0 10px 24px rgba(0,0,0,0.55), inset 0 -5px 10px rgba(0,0,0,0.32)'
          : '0 12px 28px rgba(0,0,0,0.6), inset 0 -5px 10px rgba(0,0,0,0.32)',
        animation: rolling
          ? `yutSpin 0.8s linear infinite ${index * 0.08}s`
          : `pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s both`,
        transformStyle: 'preserve-3d',
        color: flat ? '#7a6238' : '#d6b888',
        fontSize: 16,
        letterSpacing: '0.2em',
      }}>
      {flat ? '◇ 평평한 면 (앞)' : '● 둥근 면 (뒤)'}
    </div>
  )
}

/* ───── 스파클 (별 6~10개 주변에서 반짝) ───── */
/* eslint-disable react-hooks/purity -- Sparkles·Confetti는 의도된 랜덤 비주얼 효과 */

function Sparkles({ count = 6, color = '#fbbf24' }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => {
    const angle  = (i / count) * Math.PI * 2 + Math.random() * 0.5
    const dist   = 70 + Math.random() * 60
    const x      = Math.cos(angle) * dist
    const y      = Math.sin(angle) * dist
    const delay  = Math.random() * 0.5
    const size   = 12 + Math.random() * 10
    return { x, y, delay, size }
  }), [count])
  return (
    <div className="absolute pointer-events-none" style={{ inset: 0 }}>
      {items.map((s, i) => (
        <span key={i} className="absolute"
          style={{
            top: '50%', left: '50%',
            transform: `translate(${s.x}px, ${s.y}px)`,
            fontSize: s.size,
            color,
            textShadow: `0 0 12px ${color}`,
            animation: `sparkle 1.4s ease-in-out ${s.delay}s infinite`,
          }}>
          ✦
        </span>
      ))}
    </div>
  )
}

/* ───── 컨페티 (결과 확정 시 폭발 — 일반 16개 / 큰 결과 32개) ───── */
function Confetti({ explosive, color }) {
  const items = useMemo(() => {
    const COLORS = ['#fb923c', '#fbbf24', '#22d3ee', '#a78bfa', '#34d399', '#f87171', color]
    const count = explosive ? 36 : 18
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6
      const dist  = (explosive ? 200 : 130) + Math.random() * 80
      const x     = Math.cos(angle) * dist
      const y     = Math.sin(angle) * dist - 30
      const dur   = 0.9 + Math.random() * 0.7
      const c     = COLORS[i % COLORS.length]
      const w     = 6 + Math.random() * 6
      const h     = 10 + Math.random() * 10
      return { x, y, dur, c, w, h }
    })
  }, [explosive, color])
  return (
    <div className="fixed pointer-events-none" style={{ inset: 0, zIndex: 20 }}>
      {items.map((p, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            top: '50%', left: '50%',
            width: p.w, height: p.h,
            background: p.c,
            boxShadow: `0 0 8px ${p.c}`,
            ['--cx']: `${p.x}px`,
            ['--cy']: `${p.y}px`,
            animation: `confettiFly ${p.dur}s ease-out forwards`,
          }} />
      ))}
    </div>
  )
}

/* eslint-enable react-hooks/purity */

/* 모드 토글 버튼 */
function ModeBtn({ active, onClick, color, children }) {
  return (
    <button onClick={onClick}
      aria-pressed={active}
      className="py-2.5 rounded-xl font-black text-sm active:scale-95 transition-all"
      style={{
        background: active ? `linear-gradient(135deg, ${color}33, ${color}11)` : 'transparent',
        color: active ? color : '#94a3b8',
        border: `1px solid ${active ? color + '66' : 'transparent'}`,
      }}>
      {children}
    </button>
  )
}
