/* 사진 맞추기 — 진행자 사진 라이브러리 (IndexedDB) + 이미지 압축
 * - localStorage → IndexedDB 자동 마이그레이션 (기존 등록 사진 보존)
 * - 메모리 캐시로 동기 read 인터페이스 유지 (initPhotoStore 후 사용)
 * - 변경(add/remove/markPlayed)은 async — UI에서 await 필요 */
import { get, set } from 'idb-keyval'

const LIB_KEY      = 'photoguess:library'
const PROGRESS_KEY = 'photoguess:progress'

/* 메모리 캐시 — 컴포넌트가 동기적으로 읽도록 */
let _libCache      = []
let _progressCache = {}
let _ready         = false
let _lastInitError = null

/* ─── 초기화 (앱 시작 시 한 번) ───
 * 1) localStorage에 기존 데이터 있으면 IndexedDB로 옮기고 localStorage 비움
 * 2) IndexedDB에서 데이터 읽어 메모리 캐시 채움 */
export async function initPhotoStore() {
  if (_ready) return

  // 마이그레이션: 라이브러리
  try {
    const lsRaw = localStorage.getItem(LIB_KEY)
    if (lsRaw) {
      const oldLib = JSON.parse(lsRaw)
      const idbLib = (await get(LIB_KEY)) || []
      if (Array.isArray(oldLib) && oldLib.length > 0 && idbLib.length === 0) {
        await set(LIB_KEY, oldLib)
        console.info(`[photo] migrated ${oldLib.length} photos: localStorage → IndexedDB`)
      }
      localStorage.removeItem(LIB_KEY)
    }
  } catch { /* 마이그레이션 실패해도 진행 */ }

  // 마이그레이션: 진행 기록
  try {
    const lsProg = localStorage.getItem(PROGRESS_KEY)
    if (lsProg) {
      const oldProg = JSON.parse(lsProg)
      const idbProg = (await get(PROGRESS_KEY)) || {}
      if (oldProg && Object.keys(oldProg).length > 0 && Object.keys(idbProg).length === 0) {
        await set(PROGRESS_KEY, oldProg)
      }
      localStorage.removeItem(PROGRESS_KEY)
    }
  } catch { /* 무시 */ }

  _lastInitError = null
  try {
    _libCache      = (await get(LIB_KEY)) || []
    _progressCache = (await get(PROGRESS_KEY)) || {}
  } catch (err) {
    // IndexedDB 접근 실패(사파리 시크릿모드, 저장공간 권한 등) — 빈 라이브러리로 계속 진행.
    // _ready를 여기서도 true로 세팅하지 않으면 "불러오는 중…" 화면에서 영원히 멈춘다.
    console.error('[photo] IndexedDB read failed, starting with empty library', err)
    _libCache      = []
    _progressCache = {}
    _lastInitError = err
  }
  _ready = true
}

/** initPhotoStore()가 실패로 빈 라이브러리로 대체됐는지 확인 (UI 경고용). */
export function getPhotoStoreError() { return _lastInitError }

/* ─── 라이브러리 — 동기 read (캐시) ─── */
export function loadLibrary() { return _libCache }

/* ─── 라이브러리 — 비동기 변경 ─── */
export async function addPhoto({ name, dataUrl, answer }) {
  const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const photo = { id, name: name || '', dataUrl, answer: answer || '', createdAt: Date.now() }
  _libCache = [photo, ..._libCache]
  await set(LIB_KEY, _libCache)
  return id
}

export async function removePhoto(id) {
  _libCache = _libCache.filter(p => p.id !== id)
  await set(LIB_KEY, _libCache)
  // 진행 기록도 함께 정리
  if (_progressCache[id]) {
    const next = { ..._progressCache }
    delete next[id]
    _progressCache = next
    await set(PROGRESS_KEY, _progressCache)
  }
}

export async function updatePhoto(id, patch) {
  _libCache = _libCache.map(p => (p.id === id ? { ...p, ...patch } : p))
  await set(LIB_KEY, _libCache)
}

/* ─── 진행 기록 — 동기 read / 비동기 write ─── */
export function loadPhotoProgress() { return _progressCache }

export async function markPhotoPlayed(id) {
  _progressCache = { ..._progressCache, [id]: { played: true, playedAt: Date.now() } }
  await set(PROGRESS_KEY, _progressCache)
}

export async function resetAllPhotoProgress() {
  _progressCache = {}
  await set(PROGRESS_KEY, _progressCache)
}

/* ─── 이미지 압축 — 변동 없음 ─── */
export function compressImage(file, maxSize = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('no file'))
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read error'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('image load error'))
      img.onload = () => {
        let { width, height } = img
        const ratio = Math.min(maxSize / width, maxSize / height, 1)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
