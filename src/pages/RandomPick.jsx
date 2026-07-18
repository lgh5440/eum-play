import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'

const ACCENT = ['#22d3ee','#a5b4fc','#34d399','#fbbf24','#f87171','#e879f9','#60a5fa','#fb923c']

export default function RandomPick() {
  const navigate      = useNavigate()
  const canvasRef     = useRef(null)
  const angleRef      = useRef(0)
  const namesRef      = useRef([])
  const nameInputRef  = useRef(null)
  const stopDataRef   = useRef(null)   // { targetAngle, winnerName }

  const [names, setNames]                     = useState([])
  const [phase, setPhase]                     = useState('idle')  // idle|spinning|stopping|done
  const [pickedName, setPickedName]           = useState(null)
  const [removeAfterPick, setRemoveAfterPick] = useState(false)
  const [remainNames, setRemainNames]         = useState([])
  const [isLandscape, setIsLandscape]         = useState(() => window.innerWidth > window.innerHeight)

  useEffect(() => { namesRef.current = names }, [names])
  // names 변경 시 remainNames 동기화 — derive 불가 (게임 중 별도 변경 이뤄짐)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setRemainNames([...names]) }, [names])
  useEffect(() => {
    const chk = () => setIsLandscape(window.innerWidth > window.innerHeight)
    window.addEventListener('resize', chk)
    window.addEventListener('orientationchange', chk)
    return () => { window.removeEventListener('resize', chk); window.removeEventListener('orientationchange', chk) }
  }, [])

  /* ───── Canvas 크기 ───── */
  const CW = Math.min(window.innerWidth - 16, 420)
  const CH = isLandscape ? Math.min(window.innerHeight - 60, 380) : 320
  // 가로 모드: 화면 너비의 45% 기준, 최소 320 ~ 최대 600
  const LCW = Math.max(320, Math.min(Math.floor(window.innerWidth * 0.45), 600))
  const LCH = Math.min(window.innerHeight - 80, 480)

  /* ───── drawDrum (안정 참조) ───── */
  const drawDrum = useCallback((angle, curPhase) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    ctx.clearRect(0, 0, W, H)

    /* 배경 */
    ctx.fillStyle = '#060a18'
    ctx.fillRect(0, 0, W, H)

    const list = namesRef.current
    const n    = list.length

    if (n === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.font = 'bold 15px sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('이름을 추가하세요', cx, cy)
    } else {
      const segAngle = (Math.PI * 2) / n
      const R = H * 0.44

      /* 세그먼트 수집 */
      const items = []
      for (let i = 0; i < n; i++) {
        let theta = i * segAngle - angle
        theta = theta - Math.round(theta / (Math.PI * 2)) * (Math.PI * 2)
        if (Math.abs(theta) > Math.PI * 0.70) continue
        items.push({
          name:  list[i],
          yOff:  Math.sin(theta) * R,
          z:     Math.cos(theta),
          isCtr: Math.abs(theta) < segAngle * 0.52,
          color: ACCENT[i % ACCENT.length],
        })
      }
      items.sort((a, b) => a.z - b.z)  /* 뒤→앞 */

      for (const { name, yOff, z, isCtr, color } of items) {
        const y     = cy + yOff
        const alpha = Math.max(0, z)
        const sc    = Math.abs(z)
        const rowH  = Math.max(16, 72 * sc)
        const fs    = Math.max(10, Math.min(52, 48 * sc))

        ctx.save()
        ctx.globalAlpha = alpha

        /* 중앙 행 강조 */
        if (isCtr) {
          /* 배경 */
          const grad = ctx.createLinearGradient(0, y - rowH / 2, W, y + rowH / 2)
          grad.addColorStop(0, `${color}33`)
          grad.addColorStop(0.5, `${color}18`)
          grad.addColorStop(1, `${color}33`)
          ctx.fillStyle = grad
          ctx.fillRect(0, y - rowH / 2, W, rowH)

          /* 양쪽 컬러 바 */
          ctx.fillStyle = color
          ctx.fillRect(0, y - rowH / 2, 5, rowH)
          ctx.fillRect(W - 5, y - rowH / 2, 5, rowH)
        }

        /* 텍스트 — 너무 길면 크기 자동 축소 */
        let currentFs = fs
        ctx.font = `bold ${currentFs}px sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        if (isCtr) {
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = color
          ctx.shadowBlur = curPhase === 'done' ? 32 : 18
        } else {
          ctx.fillStyle = `rgba(170,195,220,${alpha * 0.75})`
        }

        const maxW = W - 40
        while (ctx.measureText(name).width > maxW && currentFs > 10) {
          currentFs -= 1
          ctx.font = `bold ${currentFs}px sans-serif`
        }
        ctx.fillText(name, cx, y)
        ctx.restore()
      }
    }

    /* 위/아래 오버레이 */
    const fadePct = 0.32
    ;[[0, H * fadePct, '#060a18', 0], [H * (1 - fadePct), H, 0, '#060a18']].forEach(([y0, y1, c0, c1]) => {
      const g = ctx.createLinearGradient(0, y0, 0, y1)
      g.addColorStop(0, c0 || 'rgba(6,10,24,0)'); g.addColorStop(1, c1 || 'rgba(6,10,24,0)')
      ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0)
    })

    /* 측면 입체감 */
    ;[[0, W * 0.12, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0)'],
      [W * 0.88, W, 'rgba(0,0,0,0)', 'rgba(0,0,0,0.22)']
    ].forEach(([x0, x1, c0, c1]) => {
      const g = ctx.createLinearGradient(x0, 0, x1, 0)
      g.addColorStop(0, c0); g.addColorStop(1, c1)
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })

    /* 선택 기준선 */
    ctx.strokeStyle = curPhase === 'done' ? 'rgba(34,211,238,0.7)' : 'rgba(255,255,255,0.12)'
    ctx.lineWidth   = curPhase === 'done' ? 2 : 1
    ;[cy - 36, cy + 36].forEach(y => {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    })
  }, [])

  /* ───── 회전 애니메 (phase=spinning) ───── */
  useEffect(() => {
    if (phase !== 'spinning') return
    let id, last = performance.now()
    const SPEED = 0.008   // rad/ms — 빠른 속도

    const loop = (now) => {
      const dt = Math.min(now - last, 50)
      last = now
      angleRef.current += SPEED * dt
      drawDrum(angleRef.current, 'spinning')
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [phase, drawDrum])

  /* ───── 감속 정착 (phase=stopping) ───── */
  useEffect(() => {
    if (phase !== 'stopping' || !stopDataRef.current) return
    const { targetAngle, winnerName, winnerPoolIdx } = stopDataRef.current

    let id
    const startA  = angleRef.current
    const curMod  = ((startA % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    let dist      = ((targetAngle - curMod) + Math.PI * 2) % (Math.PI * 2)
    if (dist < 0.5) dist += Math.PI * 2   // 너무 가까우면 한 바퀴 추가
    const finalA  = startA + Math.PI * 2 * 3 + dist  // 3바퀴 + 나머지 (감속 후 정확한 위치)
    const dur     = 3200 + Math.random() * 800
    const t0      = performance.now()

    const decel = (now) => {
      const t     = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      const a     = startA + (finalA - startA) * eased
      angleRef.current = a
      drawDrum(a, 'stopping')
      if (t < 1) {
        id = requestAnimationFrame(decel)
      } else {
        angleRef.current = finalA
        drawDrum(finalA, 'done')
        setPickedName(winnerName)
        setPhase('done')
        if (removeAfterPick) setRemainNames(p => p.filter((_, i) => i !== winnerPoolIdx))
      }
    }
    id = requestAnimationFrame(decel)
    return () => cancelAnimationFrame(id)
  }, [phase, drawDrum, removeAfterPick])

  /* 이름 변경 / 화면 회전 시 정적 리드로우 */
  useEffect(() => {
    if (phase === 'spinning' || phase === 'stopping') return
    drawDrum(angleRef.current, phase)
  }, [names, phase, drawDrum, isLandscape])

  /* ───── 돌리기 / 멈추기 ───── */
  const startSpin = () => {
    const pool = removeAfterPick ? remainNames : names
    if (pool.length === 0) return
    setPickedName(null)
    setPhase('spinning')
  }

  const stopSpin = () => {
    if (phase !== 'spinning') return
    const pool         = removeAfterPick ? remainNames : names
    const winnerPoolIdx = Math.floor(Math.random() * pool.length)
    const winner        = pool[winnerPoolIdx]
    const list      = namesRef.current
    const n         = list.length
    const winnerIdx = list.indexOf(winner)
    const segAngle  = (Math.PI * 2) / n

    stopDataRef.current = { targetAngle: winnerIdx * segAngle, winnerName: winner, winnerPoolIdx }
    setPhase('stopping')
  }

  const reset = () => {
    setPhase('idle')
    setPickedName(null)
    setRemainNames([...names])
    angleRef.current = 0
    stopDataRef.current = null
    setTimeout(() => drawDrum(0, 'idle'), 0)
  }

  /* ── 입력 ── */
  const addName = () => {
    const v = nameInputRef.current?.value.trim()
    if (!v) return
    setNames(p => [...p, v])
    nameInputRef.current.value = ''
    nameInputRef.current.focus()
  }
  const removeName = idx => {
    if (phase === 'spinning' || phase === 'stopping') return
    setNames(p => p.filter((_, i) => i !== idx))
  }

  const pool      = removeAfterPick ? remainNames : names
  const poolEmpty = removeAfterPick && remainNames.length === 0

  /* ───── 가로 (TV) ───── */
  if (isLandscape) {
    return (
      <div className="fixed inset-0 flex items-center gap-4 px-4" style={{ background: '#060a18' }}>
        {/* 드럼 + 버튼 */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <canvas ref={canvasRef} width={LCW} height={LCH}
            style={{ display: 'block', borderRadius: 12,
              border: phase === 'done' ? '1px solid rgba(34,211,238,0.45)' : '1px solid rgba(255,255,255,0.06)',
              boxShadow: phase === 'done' ? '0 0 40px rgba(34,211,238,0.25)' : 'none',
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }} />

          {/* 멈춰 버튼 바로 아래 */}
          {phase === 'spinning' && (
            <button onClick={stopSpin}
              className="font-black text-lg rounded-2xl active:scale-95 transition-all"
              style={{ padding: '12px 40px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color:'#fff',
                boxShadow:'0 6px 28px rgba(239,68,68,0.6)', border:'1px solid rgba(239,68,68,0.5)' }}>
              ✋ 멈춰!
            </button>
          )}
          {phase === 'stopping' && (
            <div className="font-black text-base" style={{ color:'#fbbf24', padding:'12px 40px' }}>멈추는 중…</div>
          )}
          {(phase === 'idle' || phase === 'done') && (
            <button onClick={poolEmpty ? reset : startSpin} disabled={!poolEmpty && pool.length === 0}
              className="font-black text-lg rounded-2xl active:scale-95 transition-all"
              style={{ padding: '12px 40px',
                background: pool.length > 0 || poolEmpty
                  ? 'linear-gradient(135deg,#0891b2,#1d4ed8)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                boxShadow: pool.length > 0 ? '0 6px 28px rgba(6,182,212,0.45)' : 'none',
                border: '1px solid rgba(6,182,212,0.4)' }}>
              {poolEmpty ? '✓ 다시 시작' : phase === 'done' ? '🔁 다시 돌리기' : '🎲 돌리기!'}
            </button>
          )}

        </div>

        {/* 컨트롤 패널 */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight:'100vh', paddingBlock:16 }}>
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(10,16,35,0.8)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b' }}>←</button>
            <p className="text-[13px] font-black tracking-widest uppercase" style={{ color:'#64748b' }}>랜덤 뽑기</p>
            <button onClick={reset} className="text-[13px] font-bold px-2 py-1 rounded-lg"
              style={{ color:'#64748b', border:'1px solid rgba(255,255,255,0.07)' }}>초기화</button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={removeAfterPick}
              onChange={e => { setRemoveAfterPick(e.target.checked); reset() }} className="w-4 h-4" />
            <span className="text-xs font-bold" style={{ color:'#64748b' }}>뽑힌 이름 제외</span>
          </label>
          <p className="text-[13px] font-black tracking-widest uppercase" style={{ color:'#64748b' }}>
            참가자 ({pool.length}/{names.length})
          </p>
          <div className="flex gap-1.5">
            <input ref={nameInputRef} defaultValue="" placeholder="이름"
              aria-label="추가할 참가자 이름"
              onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && addName()}
              className="flex-1 rounded-xl px-3 py-1.5 text-xs font-bold"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', outline:'none' }} />
            <button onClick={addName} aria-label="참가자 추가" className="w-8 rounded-xl font-black"
              style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>+</button>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-52">
            {names.map((nm, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl"
                style={{ background: pickedName === nm ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.04)',
                  border: pickedName === nm ? '1px solid rgba(34,211,238,0.35)' : '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-xs font-bold truncate" style={{ color: pickedName === nm ? '#22d3ee' : '#94a3b8' }}>{nm}</span>
                <button onClick={() => removeName(i)} aria-label={`${nm} 제거`} className="ml-2 text-xs flex-shrink-0" style={{ color:'#64748b' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 세로 (모바일) ───── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
      <Header title="랜덤 뽑기" onBack={() => navigate('/')}
        right={
          <button onClick={reset} className="text-[13px] font-bold px-2.5 py-1.5 rounded-lg"
            style={{ color:'#64748b', border:'1px solid rgba(255,255,255,0.07)' }}>
            초기화
          </button>
        } />

      {/* 진행자 멘트 + 사용법 */}
      <VerseHeader gameId="random-pick" />
      <HowToCard gameId="random-pick" defaultOpen={false} />

      {/* 드럼 캔버스 — 서브컴포넌트 없이 직접 */}
      <canvas ref={canvasRef} width={CW} height={CH}
        style={{ display:'block', margin:'0 auto', borderRadius:12, flexShrink:0,
          border: phase === 'done' ? '1px solid rgba(34,211,238,0.45)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: phase === 'done' ? '0 0 50px rgba(34,211,238,0.3)' : 'none',
          transition:'border-color 0.4s, box-shadow 0.4s',
        }} />

      {/* 버튼 — 캔버스 바로 아래 */}
      <div className="px-4 mt-3">
        {phase === 'spinning' && (
          <button onClick={stopSpin}
            className="w-full py-5 rounded-2xl font-black text-2xl active:scale-95 transition-all"
            style={{ background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'#fff',
              boxShadow:'0 8px 40px rgba(239,68,68,0.6)', border:'1px solid rgba(239,68,68,0.5)' }}>
            ✋ 멈춰!
          </button>
        )}
        {phase === 'stopping' && (
          <div className="w-full py-5 rounded-2xl font-black text-xl text-center"
            style={{ background:'rgba(251,191,36,0.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.3)' }}>
            멈추는 중…
          </div>
        )}
        {(phase === 'idle' || phase === 'done') && (
          <button onClick={poolEmpty ? reset : startSpin} disabled={!poolEmpty && pool.length === 0}
            className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
            style={pool.length > 0 || poolEmpty ? {
              background:'linear-gradient(135deg,#0891b2,#1d4ed8)', color:'#fff',
              boxShadow:'0 8px 40px rgba(6,182,212,0.5)', border:'1px solid rgba(6,182,212,0.4)',
            } : { background:'rgba(255,255,255,0.04)', color:'#64748b', border:'1px solid rgba(255,255,255,0.08)' }}>
            {poolEmpty ? '✓ 다시 시작' : phase === 'done' ? '🔁 다시 돌리기' : '🎲 돌리기!'}
          </button>
        )}
      </div>


      {/* 하단 — 입력 영역 */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-6 gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeAfterPick}
            onChange={e => { setRemoveAfterPick(e.target.checked); reset() }} className="w-4 h-4" />
          <span className="text-xs font-bold" style={{ color:'#64748b' }}>뽑힌 이름 다음 추첨 제외</span>
        </label>

        <p className="text-[13px] font-black tracking-widest uppercase" style={{ color:'#64748b' }}>
          참가자 ({removeAfterPick ? `${remainNames.length}/` : ''}{names.length})
        </p>
        <div className="flex gap-1.5">
          <input ref={nameInputRef} defaultValue="" placeholder="이름 입력"
            aria-label="추가할 참가자 이름"
            onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && addName()}
            className="flex-1 rounded-xl px-3 py-2 text-sm font-bold"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', outline:'none' }} />
          <button onClick={addName} aria-label="참가자 추가" className="w-10 rounded-xl font-black text-xl"
            style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>+</button>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-40">
          {names.map((nm, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-xl"
              style={{ background: pickedName === nm ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.04)',
                border: pickedName === nm ? '1px solid rgba(34,211,238,0.35)' : '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-sm font-bold truncate" style={{ color: pickedName === nm ? '#22d3ee' : '#94a3b8' }}>{nm}</span>
              <button onClick={() => removeName(i)} aria-label={`${nm} 제거`} className="ml-2 text-xs flex-shrink-0" style={{ color:'#64748b' }}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
