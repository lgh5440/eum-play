/* 초성 분리 + 진행 상태 localStorage helpers */

const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

/* '모세' → 'ㅁㅅ', '우공이산' → 'ㅇㄱㅇㅅ', 띄어쓰기/숫자/영어는 그대로 */
export function toChosung(s) {
  return [...(s || '')].map(ch => {
    const code = ch.charCodeAt(0)
    if (code >= 0xAC00 && code <= 0xD7A3) {
      return CHO[Math.floor((code - 0xAC00) / 588)]
    }
    return ch
  }).join('')
}

/* 임의 초성 생성 — 자유 모드(글자수만큼 무작위 자음 조합)
 * 너무 어려운 자음(ㄲㄸㅃㅆㅉ)은 빈도 낮춤 — 자주 쓰이는 자음 위주 */
const CHO_WEIGHTED = [
  'ㄱ','ㄱ','ㄴ','ㄴ','ㄷ','ㄷ','ㄹ','ㄹ','ㅁ','ㅁ',
  'ㅂ','ㅂ','ㅅ','ㅅ','ㅇ','ㅇ','ㅇ','ㅈ','ㅈ','ㅊ',
  'ㅋ','ㅌ','ㅍ','ㅎ','ㅎ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ',
]

export function randomChosung(length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += CHO_WEIGHTED[Math.floor(Math.random() * CHO_WEIGHTED.length)]
  }
  return s
}

/* 셔플 */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ─── 진행 기록 ─── */
const KEY = 'chosung:progress'

export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}
function saveProgress(p) { localStorage.setItem(KEY, JSON.stringify(p)) }

/* 한 세트 완료 표시 */
export function markComplete(category, level, setIdx, score) {
  const p = loadProgress()
  if (!p[category]) p[category] = {}
  if (!p[category][level]) p[category][level] = {}
  p[category][level][setIdx] = { done: true, score: score ?? null }
  saveProgress(p)
}

export function getSetState(progress, category, level, setIdx) {
  return progress?.[category]?.[level]?.[setIdx] || null
}

/* 카테고리/전체 초기화 */
export function resetCategory(category) {
  const p = loadProgress(); delete p[category]; saveProgress(p)
}
export function resetAll() { saveProgress({}) }

/* ─── 게임 옵션 (타이머 등) ─── */
const OPTKEY = 'chosung:options'
const DEFAULT_OPTIONS = { timerOn: false, timerSec: 7 }

export function loadOptions() {
  try {
    const o = JSON.parse(localStorage.getItem(OPTKEY) || '{}')
    return { ...DEFAULT_OPTIONS, ...o }
  } catch {
    return { ...DEFAULT_OPTIONS }
  }
}
export function saveOptions(o) { localStorage.setItem(OPTKEY, JSON.stringify(o)) }

/* ─── 사용자 추가 문제 (localStorage) ─── */
const CUSTOMKEY = 'chosung:custom'
/* 구조: { [categoryKey]: { 상: ['정답1', ...], 중: [...], 하: [...] } } */

export function loadCustom() {
  try { return JSON.parse(localStorage.getItem(CUSTOMKEY) || '{}') }
  catch { return {} }
}
function saveCustom(c) { localStorage.setItem(CUSTOMKEY, JSON.stringify(c)) }

export function addCustomQuestion(category, level, answer) {
  const t = (answer || '').trim()
  if (!t) return false
  const c = loadCustom()
  if (!c[category]) c[category] = {}
  if (!c[category][level]) c[category][level] = []
  if (c[category][level].includes(t)) return false   // 중복 방지
  c[category][level].push(t)
  saveCustom(c)
  return true
}

export function removeCustomQuestion(category, level, answer) {
  const c = loadCustom()
  if (!c[category]?.[level]) return
  c[category][level] = c[category][level].filter(a => a !== answer)
  if (c[category][level].length === 0) delete c[category][level]
  if (Object.keys(c[category] || {}).length === 0) delete c[category]
  saveCustom(c)
}

/* 시드 + 사용자 추가를 합친 풀 반환 */
export function getMergedAnswers(seed, custom, category, level) {
  const seedArr   = seed?.[category]?.[level] || []
  const customArr = custom?.[category]?.[level] || []
  return [...seedArr, ...customArr]
}

/* 카테고리 진행률: 완료 세트 수 / 전체 세트 수
 * levelSetKeys = { 상: [0,1,2,3,4] | ['인물','책',...], 중: [...], 하: [...] }
 * (number 배열·string 배열 둘 다 호환) */
export function getCategoryStats(progress, category, levelSetKeys) {
  let done = 0, total = 0
  for (const lv of ['상','중','하']) {
    const keys = levelSetKeys?.[lv] || []
    total += keys.length
    for (const k of keys) {
      if (progress?.[category]?.[lv]?.[k]?.done) done++
    }
  }
  return { done, total }
}
