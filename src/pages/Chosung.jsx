import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, QUESTIONS, TYPE_BADGE, getAnswer } from '../data/chosungQuestions'
import { HINTS } from '../data/chosungHints'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header } from '../components/ui'
import {
  toChosung, shuffle, randomChosung,
  loadProgress, markComplete, getSetState, getCategoryStats,
  resetCategory, resetAll,
  loadOptions, saveOptions,
  loadCustom, getMergedAnswers,
} from '../utils/chosung'

const LEVELS = ['상', '중', '하']
const LEVEL_COLOR = {
  '상': { txt: '#f87171', bg: 'rgba(248,113,113,0.10)', bd: 'rgba(248,113,113,0.35)' },
  '중': { txt: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  bd: 'rgba(251,191,36,0.35)' },
  '하': { txt: '#34d399', bg: 'rgba(52,211,153,0.10)',  bd: 'rgba(52,211,153,0.35)' },
}
const SET_SIZE = 10

/* 카테고리가 분류 구조인지 (성경) */
const isSubdivided = (cat) => !!cat?.subdivided
const isSubdividedKey = (catKey) => !!CATEGORIES.find(c => c.key === catKey)?.subdivided

/* 단계별 세트 키 배열 — 평면이면 [0,1,2,...], 분류면 ['인물','책',...] */
const setKeysOf = (custom, catKey, lv) => {
  if (isSubdividedKey(catKey)) {
    return Object.keys(QUESTIONS[catKey]?.[lv] || {})
  }
  const len = getMergedAnswers(QUESTIONS, custom, catKey, lv).length
  const cnt = Math.floor(len / SET_SIZE)
  return Array.from({ length: cnt }, (_, i) => i)
}

const allSetKeys = (custom, catKey) => ({
  '상': setKeysOf(custom, catKey, '상'),
  '중': setKeysOf(custom, catKey, '중'),
  '하': setKeysOf(custom, catKey, '하'),
})

export default function Chosung() {
  const navigate = useNavigate()

  const [progress, setProgress] = useState(loadProgress)
  const [custom, setCustom]     = useState(loadCustom)
  const [mode, setMode]         = useState('cat')   // cat | set | play | result | freePlay
  const [category, setCategory] = useState(null)    // CATEGORIES item
  const [level, setLevel]       = useState(null)
  const [setIdx, setSetIdx]     = useState(null)

  /* 자유 모드 — 임의 초성만 (단어 발견 카운트는 진행자가 별도로 관리) */
  const [freeChosung, setFreeChosung] = useState('')

  const [questions, setQuestions] = useState([])    // 셔플된 정답 배열 (10개)
  const [qIdx, setQIdx]           = useState(0)
  const [revealed, setRevealed]   = useState(false)
  const [hintShown, setHintShown] = useState(false)
  const [score, setScore]         = useState({ ok: 0, pass: 0 })

  /* 게임 옵션 (타이머 등) */
  const [options, setOptions] = useState(loadOptions)
  const [timeLeft, setTimeLeft] = useState(0)
  const tickRef = useRef(null)

  const updateOption = (patch) => {
    const next = { ...options, ...patch }
    setOptions(next); saveOptions(next)
  }

  const reload = () => { setProgress(loadProgress()); setCustom(loadCustom()) }

  /* ── 타이머: play 모드 + revealed 아님 + timerOn이면 카운트다운
   * 의도된 effect (모드·문제 변경 시 타이머 리셋·시작 — derive 불가) */
  useEffect(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
    if (mode !== 'play' || revealed || !options.timerOn) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(options.timerSec)
    tickRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(tickRef.current); tickRef.current = null
          setRevealed(true)   // 시간 만료 시 자동 정답 공개
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [mode, qIdx, revealed, options.timerOn, options.timerSec])

  /* ── 이동 ── */
  const pickCategory = (cat) => {
    setCategory(cat)
    if (cat.mode === 'free') {
      setFreeChosung(randomChosung(cat.length))
      setMode('freePlay')
    } else {
      setMode('set')
    }
  }

  /* 자유 모드 — 다음 초성 */
  const nextFreeChosung = () => {
    setFreeChosung(randomChosung(category.length))
  }

  const startSet = (lv, key) => {
    let slice
    if (isSubdivided(category)) {
      // 분류 카테고리 — key는 분류 이름 (string)
      slice = QUESTIONS[category.key]?.[lv]?.[key] || []
    } else {
      // 평면 카테고리 — key는 세트 인덱스 (number)
      const all = getMergedAnswers(QUESTIONS, custom, category.key, lv)
      slice = all.slice(key * SET_SIZE, (key + 1) * SET_SIZE)
    }
    if (slice.length === 0) return
    setLevel(lv); setSetIdx(key)
    setQuestions(shuffle(slice))
    setQIdx(0); setRevealed(false); setHintShown(false); setScore({ ok: 0, pass: 0 })
    setMode('play')
  }

  const judge = (correct) => {
    const newScore = { ok: score.ok + (correct ? 1 : 0), pass: score.pass + (correct ? 0 : 1) }
    setScore(newScore)
    if (qIdx + 1 < questions.length) {
      setQIdx(qIdx + 1); setRevealed(false); setHintShown(false)
    } else {
      markComplete(category.key, level, setIdx, newScore.ok)
      reload()
      setMode('result')
    }
  }

  const back = () => {
    if (mode === 'play')          { setMode('set') }
    else if (mode === 'freePlay') { setMode('cat'); setCategory(null) }
    else if (mode === 'result')   { setMode('set'); reload() }
    else if (mode === 'set')      { setMode('cat'); setCategory(null); reload() }
    else                          { navigate('/') }
  }

  /* ───── 화면 1 — 카테고리 선택 ───── */
  if (mode === 'cat') {
    return (
      <div className="min-h-screen" style={{ background: '#060a18' }}>
        <Header title="초성 게임" onBack={back}
          right={<TinyBtn onClick={() => { if (confirm('모든 진행 기록을 초기화할까요?')) { resetAll(); reload() } }}>전체 초기화</TinyBtn>} />

        <VerseHeader gameId="chosung" />
        <HowToCard gameId="chosung" defaultOpen={false} />

        <div className="max-w-lg mx-auto px-4 pb-6">
          <p className="mb-3 leading-relaxed" style={{ color: '#94a3b8', fontSize: 13 }}>
            카테고리를 선택하세요. 각 난이도당 한 세트 10문제로 진행되며,
            완료한 세트는 회색으로 표시되어 중복되지 않습니다.
          </p>

          {/* 게임 옵션 — 타이머 */}
          <div className="mb-4 p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2"
            style={{ background:'rgba(10,16,35,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={options.timerOn}
                onChange={e => updateOption({ timerOn: e.target.checked })}
                className="w-4 h-4" />
              <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>⏱ 타이머 사용</span>
            </label>
            {options.timerOn && (
              <div className="flex items-center gap-1">
                {[5, 7, 10, 15].map(sec => (
                  <button key={sec}
                    onClick={() => updateOption({ timerSec: sec })}
                    className="text-[11px] font-black px-2.5 py-1 rounded-lg"
                    style={{
                      background: options.timerSec === sec ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
                      color:      options.timerSec === sec ? '#fbbf24' : '#64748b',
                      border:     options.timerSec === sec ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    {sec}초
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(cat => {
              const isFree = cat.mode === 'free'
              const keys   = isFree ? null : allSetKeys(custom, cat.key)
              const stats  = isFree ? null : getCategoryStats(progress, cat.key, keys)
              return (
                <button key={cat.key} onClick={() => pickCategory(cat)}
                  className="rounded-2xl overflow-hidden text-left active:scale-95 transition-all flex flex-col"
                  style={{
                    background: 'rgba(10,16,35,0.7)',
                    border: `1px solid ${cat.color}55`,
                    boxShadow: `0 4px 20px ${cat.color}22`,
                  }}>
                  {/* 비주얼 영역 — 그라데이션 + 큰 이모지 */}
                  <div className="flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
                      aspectRatio: '16/9',
                      borderBottom: `1px solid ${cat.color}33`,
                    }}>
                    <span className="drop-shadow-lg" style={{ fontSize: 48 }}>{cat.emoji}</span>
                  </div>
                  {/* 본문 */}
                  <div className="p-3 flex flex-col gap-1.5">
                    <p className="font-black text-white text-sm leading-tight">{cat.label}</p>
                    {isFree ? (
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black" style={{ color: cat.color }}>🎲 자유 모드</p>
                        <p className="text-[10px]" style={{ color: '#64748b' }}>단어 찾기</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-[10px]" style={{ color: '#64748b' }}>
                          {stats.total}{cat.subdivided ? '종류' : '세트'}
                        </p>
                        <p className="text-[10px] font-black" style={{ color: cat.color }}>
                          {stats.done}/{stats.total} 완료
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ───── 화면 2 — 난이도/세트 선택 ───── */
  if (mode === 'set') {
    const keys = allSetKeys(custom, category.key)
    const subdivided = isSubdivided(category)

    return (
      <div className="min-h-screen" style={{ background: '#060a18' }}>
        <Header title={category.label} onBack={back}
          right={<TinyBtn onClick={() => { if (confirm('이 카테고리 진행 기록만 초기화할까요?')) { resetCategory(category.key); reload() } }}>초기화</TinyBtn>} />

        <div className="max-w-lg mx-auto px-4 pb-6 flex flex-col gap-5">
          {subdivided && (
            <p className="text-[12px] leading-relaxed text-center px-2" style={{ color: '#94a3b8' }}>
              난이도와 종류를 선택하세요. (예: <b style={{ color: '#34d399' }}>하 난이도 인물 게임</b>)
            </p>
          )}

          {LEVELS.map(lv => {
            const lvKeys = keys[lv] || []
            if (lvKeys.length === 0) return null
            const c = LEVEL_COLOR[lv]
            return (
              <div key={lv}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black"
                    style={{ background: c.bg, color: c.txt, border: `1px solid ${c.bd}` }}>
                    {lv}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: '#64748b' }}>
                    {lvKeys.length}{subdivided ? '종류' : '세트'} · {SET_SIZE}문제
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {lvKeys.map((k, i) => {
                    const st = getSetState(progress, category.key, lv, k)
                    const done = !!st?.done
                    const badge = subdivided ? TYPE_BADGE[k] : null
                    return (
                      <button key={k}
                        onClick={() => startSet(lv, k)}
                        className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 font-black active:scale-95 transition-all px-1 overflow-hidden relative"
                        style={{
                          background: done
                            ? 'rgba(255,255,255,0.04)'
                            : `linear-gradient(135deg, ${c.txt}26, ${c.txt}0d)`,
                          color: done ? '#64748b' : c.txt,
                          border: `1px solid ${done ? 'rgba(255,255,255,0.07)' : c.bd}`,
                          boxShadow: done ? 'none' : `0 4px 16px ${c.txt}1a`,
                        }}>
                        {subdivided ? (
                          <>
                            <span style={{ fontSize: 26 }} className="drop-shadow">{badge?.emoji || '∎'}</span>
                            <span className="text-[10px] font-bold mt-0.5">{badge?.label || k}</span>
                          </>
                        ) : (
                          <span className="text-xl drop-shadow">{i + 1}</span>
                        )}
                        {done && (
                          <span className="text-[9px] font-bold absolute bottom-1" style={{ color: '#64748b' }}>
                            ✓ {st.score ?? '–'}/{SET_SIZE}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ───── 화면 — 자유 모드 (단어 찾기) ───── */
  if (mode === 'freePlay') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
        <Header title={category.label} onBack={back} />

        <div className="max-w-lg w-full mx-auto px-4 pb-3">
          <p className="text-[12px] leading-relaxed text-center" style={{ color: '#94a3b8' }}>
            아래 초성으로 시작하는 <b style={{ color: category.color }}>{category.length}글자</b> 단어를
            가장 많이 찾는 사람이 승!
          </p>
        </div>

        {/* 큰 초성 */}
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="font-black tracking-[0.3em] leading-none text-white text-center"
            style={{
              fontSize: freeChosung.length > 4 ? 84 : 120,
              textShadow: `0 0 40px ${category.color}55`,
            }}>
            {freeChosung}
          </p>
        </div>

        {/* 다음 초성 — 메인 액션 */}
        <div className="max-w-lg w-full mx-auto px-4 pb-6">
          <button onClick={nextFreeChosung}
            className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
              color: '#fff',
              boxShadow: `0 8px 30px ${category.color}66`,
              border: `1px solid ${category.color}66`,
            }}>
            🎲 다음 초성
          </button>
        </div>
      </div>
    )
  }

  /* ───── 화면 3 — 게임 진행 ───── */
  if (mode === 'play') {
    const q       = questions[qIdx]
    const answer  = getAnswer(q)
    const subdivided = isSubdivided(category)
    /* 분류 카테고리는 세트 자체가 분류 (setIdx가 분류 키), 평면은 type 정보 없음 */
    const badge   = subdivided ? TYPE_BADGE[setIdx] : null
    const cho     = toChosung(answer)
    const c       = LEVEL_COLOR[level]
    const hint    = HINTS[category.key]?.[answer] || null

    const showTimer = options.timerOn && !revealed
    const urgent    = showTimer && timeLeft <= 3

    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
        <Header title={`${category.label} · ${level}`} onBack={back}
          right={
            <div className="flex items-center gap-1.5">
              {badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md"
                  style={{
                    background: `${c.txt}1f`,
                    color: c.txt,
                    border: `1px solid ${c.txt}55`,
                  }}>
                  {badge.emoji} {badge.label}
                </span>
              )}
              <span className="text-xs font-black" style={{ color: c.txt }}>
                {qIdx + 1} / {questions.length}
              </span>
            </div>
          } />

        {/* 진행 바 */}
        <div className="max-w-lg w-full mx-auto px-4">
          <div className="flex gap-1 mb-2">
            {questions.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full"
                style={{ background: i < qIdx ? c.txt : i === qIdx ? '#0891b2' : 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-widest" style={{ color: '#64748b' }}>
              {subdivided ? (TYPE_BADGE[setIdx]?.label || setIdx) : `세트 ${setIdx + 1}`} · 정답 {score.ok} · 패스 {score.pass}
            </p>
            {showTimer && (
              <p className="text-base font-black tabular-nums"
                style={{ color: urgent ? '#f87171' : '#fbbf24', transition: 'color 0.2s' }}>
                ⏱ {timeLeft}s
              </p>
            )}
          </div>
        </div>

        {/* 초성/정답 표시 */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="font-black tracking-[0.3em] leading-none"
              style={{
                fontSize: cho.length > 8 ? '40px' : cho.length > 5 ? '60px' : '90px',
                color: revealed ? 'rgba(255,255,255,0.25)' : '#fff',
                transition: 'color 0.3s, font-size 0.3s',
              }}>
              {cho}
            </p>
            {/* 힌트 표시 */}
            {hintShown && hint && !revealed && (
              <p className="mt-5 px-5 py-3 rounded-2xl text-sm font-bold inline-block max-w-md leading-relaxed"
                style={{ background:'rgba(251,191,36,0.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.3)' }}>
                💡 {hint}
              </p>
            )}
            {revealed && (
              <p className="mt-6 font-black"
                style={{
                  fontSize: answer.length > 10 ? '24px' : answer.length > 6 ? '34px' : '44px',
                  color: c.txt,
                  textShadow: `0 0 30px ${c.txt}66`,
                }}>
                {answer}
              </p>
            )}
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="max-w-lg w-full mx-auto px-4 pb-6 flex flex-col gap-2.5">
          {!revealed ? (
            <>
              {/* 힌트 버튼 — 힌트 데이터가 있을 때만 노출 */}
              {hint && !hintShown && (
                <button onClick={() => setHintShown(true)}
                  className="w-full py-3 rounded-xl font-bold text-sm active:scale-95"
                  style={{ background:'rgba(251,191,36,0.1)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.3)' }}>
                  💡 힌트 보기
                </button>
              )}
              <button onClick={() => setRevealed(true)}
                className="w-full py-5 rounded-2xl font-black text-xl active:scale-95"
                style={{ background:'linear-gradient(135deg,#0891b2,#1d4ed8)', color:'#fff',
                  boxShadow:'0 8px 40px rgba(6,182,212,0.5)', border:'1px solid rgba(6,182,212,0.4)' }}>
                👁 정답 공개
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => judge(false)}
                className="flex-1 py-5 rounded-2xl font-black text-xl active:scale-95"
                style={{ background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)' }}>
                ✗ 패스
              </button>
              <button onClick={() => judge(true)}
                className="flex-1 py-5 rounded-2xl font-black text-xl active:scale-95"
                style={{ background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff',
                  boxShadow:'0 8px 40px rgba(16,185,129,0.45)', border:'1px solid rgba(16,185,129,0.4)' }}>
                ✓ 맞춤
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ───── 화면 4 — 결과 ───── */
  const resultPct = Math.round((score.ok / questions.length) * 100)
  const c = LEVEL_COLOR[level]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
      <Header title="결과" onBack={back} />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[11px] font-black tracking-widest mb-3" style={{ color: c.txt }}>
            {category.label} · {level} · {isSubdivided(category)
              ? `${TYPE_BADGE[setIdx]?.emoji || ''} ${TYPE_BADGE[setIdx]?.label || setIdx}`
              : `세트 ${setIdx + 1}`}
          </p>
          <p className="font-black leading-none mb-3" style={{ fontSize: '110px', color: '#fff' }}>
            {score.ok}<span style={{ fontSize: '40px', color: '#64748b' }}>/{questions.length}</span>
          </p>
          <p className="text-2xl font-black" style={{ color: c.txt }}>
            {resultPct >= 80 ? '🎉 훌륭해요!' : resultPct >= 50 ? '👍 잘했어요!' : '💪 다시 도전!'}
          </p>
        </div>
      </div>

      <div className="max-w-lg w-full mx-auto px-4 pb-6 flex gap-2">
        <button onClick={() => setMode('set')}
          className="flex-1 py-4 rounded-2xl font-black"
          style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
          📋 다른 세트
        </button>
        <button onClick={() => { setMode('cat'); setCategory(null) }}
          className="flex-1 py-4 rounded-2xl font-black"
          style={{ background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)' }}>
          🔀 카테고리 변경
        </button>
      </div>
    </div>
  )
}

/* ── 공용 작은 컴포넌트 ── */

function TinyBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
      style={{ color:'#64748b', border:'1px solid rgba(255,255,255,0.07)' }}>
      {children}
    </button>
  )
}
