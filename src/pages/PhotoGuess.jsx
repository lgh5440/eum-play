import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  initPhotoStore, loadLibrary, addPhoto, removePhoto, compressImage,
  loadPhotoProgress, markPhotoPlayed, resetAllPhotoProgress, getPhotoStoreError,
} from '../utils/photoLibrary'
import VerseHeader from '../components/VerseHeader'
import HowToCard from '../components/HowToCard'
import { Header, Field, EmptyState } from '../components/ui'

/* 단계별 노출 면적(%) — 면적 N% 노출 ⇒ scale = 1/√(N/100)
 * 1단계 0.1%(약 1.6배) → 8단계 100%(1배)로 등비수열, 각 단계 ≈ 2.68배 점진 */
const scaleFor = (pct) => 1 / Math.sqrt(pct / 100)
const STAGES   = [0.1, 0.3, 0.7, 2, 5, 14, 37, 100].map(pct => ({ pct, scale: scaleFor(pct) }))
const MAX_STAGE = STAGES.length

/* 노출 위치 안전 영역 (가장자리 잘림 방지) */
const randomCenter = () => ({
  cx: 25 + Math.random() * 50,
  cy: 25 + Math.random() * 50,
})

export default function PhotoGuess() {
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  /* mode: 'library' | 'addForm' | 'play' */
  const [mode, setMode]            = useState('library')
  const [ready, setReady]          = useState(false)
  const [library, setLibrary]      = useState([])
  const [progress, setProgress]    = useState({})
  const [shownAnswers, setShownAnswers] = useState(() => new Set())  // 정답 보임 카드 id 집합
  const [loadError, setLoadError]       = useState(null)

  /* IndexedDB 초기화 (마이그레이션 + 캐시 채움) */
  useEffect(() => {
    initPhotoStore()
      .catch(err => { console.error('[photo] init failed unexpectedly', err) })
      .finally(() => {
        setLibrary(loadLibrary())
        setProgress(loadPhotoProgress())
        setLoadError(getPhotoStoreError())
        setReady(true)
      })
  }, [])

  /* 사진 추가 폼 */
  const [pendingDataUrl, setPendingDataUrl] = useState(null)
  const [pendingName, setPendingName]       = useState('')
  const [pendingAnswer, setPendingAnswer]   = useState('')
  const [compressing, setCompressing]       = useState(false)

  /* 게임 진행 */
  const [currentPhoto, setCurrentPhoto] = useState(null)
  const [stage, setStage]               = useState(1)
  const [pos, setPos]                   = useState({ cx: 50, cy: 50 })
  const [revealed, setRevealed]         = useState(false)

  const reload = () => { setLibrary(loadLibrary()); setProgress(loadPhotoProgress()) }

  const toggleAnswer = (id) => {
    setShownAnswers(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  /* ───── 파일 선택 → 압축 → 폼 모드 ───── */
  const handleFile = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try {
      setCompressing(true)
      const dataUrl = await compressImage(f, 1024, 0.8)
      setPendingDataUrl(dataUrl)
      setPendingName(f.name.replace(/\.[^.]+$/, '').slice(0, 30))
      setPendingAnswer('')
      setMode('addForm')
    } catch (err) {
      alert('이미지를 불러오지 못했어요: ' + err.message)
    } finally {
      setCompressing(false)
    }
  }

  /* 라이브러리에 저장 */
  const savePending = async () => {
    if (!pendingDataUrl) return
    await addPhoto({ name: pendingName.trim(), dataUrl: pendingDataUrl, answer: pendingAnswer.trim() })
    setPendingDataUrl(null); setPendingName(''); setPendingAnswer('')
    reload()
    setMode('library')
  }

  const cancelPending = () => {
    setPendingDataUrl(null); setPendingName(''); setPendingAnswer('')
    setMode('library')
  }

  const deletePhoto = async (id) => {
    if (!confirm('이 사진을 삭제할까요?')) return
    await removePhoto(id)
    reload()
  }

  /* ───── 게임 시작/진행 ───── */
  const startGame = (photo) => {
    setCurrentPhoto(photo)
    setPos(randomCenter())
    setStage(1)
    setRevealed(false)
    setMode('play')
  }

  const reveal = async () => {
    setRevealed(true)
    if (currentPhoto?.id) {
      await markPhotoPlayed(currentPhoto.id)
      setProgress(loadPhotoProgress())
    }
  }

  const nextStage = () => {
    if (stage < MAX_STAGE) setStage(s => s + 1)
    else reveal()
  }

  const replaySame = () => {           /* 같은 사진, 위치만 새로 */
    setPos(randomCenter())
    setStage(1)
    setRevealed(false)
  }

  const backToLibrary = () => {
    setMode('library'); setCurrentPhoto(null)
  }

  /* 헤더 뒤로가기 */
  const back = () => {
    if (mode === 'play')         backToLibrary()
    else if (mode === 'addForm') cancelPending()
    else                         navigate('/')
  }

  /* ──────────── 화면 1 — 라이브러리 ──────────── */
  if (mode === 'library') {
    if (!ready) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#060a18' }}>
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🖼</div>
            <p className="font-bold" style={{ color: '#94a3b8', fontSize: 14 }}>사진 라이브러리 불러오는 중…</p>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
        <Header title="📷 사진 맞추기" onBack={back}
          right={<TinyBtn onClick={() => fileRef.current?.click()} disabled={compressing}>
            {compressing ? '처리중…' : '+ 사진 추가'}
          </TinyBtn>} />

        <VerseHeader gameId="photo-guess" />
        <HowToCard gameId="photo-guess" defaultOpen={false} />

        <div className="max-w-lg mx-auto w-full px-4 pb-6 flex-1">
          {loadError && (
            <div className="mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <p style={{ color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                저장된 사진 라이브러리를 불러오지 못했어요. 이 브라우저의 저장공간 설정을 확인해 주세요
                (시크릿/프라이빗 모드에서는 사진이 저장되지 않을 수 있어요).
              </p>
            </div>
          )}
          <p className="mb-4 leading-relaxed" style={{ color: '#94a3b8', fontSize: 13 }}>
            진행 전에 사진과 정답을 미리 등록해 두세요. 게임 시작 시 화면 일부만 강하게 확대되어 보이고,
            8단계로 점점 전체가 드러납니다.
          </p>

          {library.length === 0 ? (
            <EmptyState
              icon="🖼"
              title="등록된 사진이 없어요"
              description='오른쪽 상단 "+ 사진 추가"로 등록' />
          ) : (
            <>
              {/* 진행 통계 + 모두 다시 */}
              {(() => {
                const playedCount = library.filter(p => progress[p.id]?.played).length
                if (playedCount === 0) return null
                return (
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[11px] font-bold" style={{ color:'#64748b' }}>
                      진행 완료 {playedCount} / {library.length}
                    </span>
                    <button
                      onClick={async () => {
                        if (confirm('진행 완료 표시를 모두 초기화할까요? (사진은 그대로 유지됩니다)')) {
                          await resetAllPhotoProgress()
                          reload()
                        }
                      }}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ background:'rgba(99,102,241,0.1)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.25)' }}>
                      🔁 모두 다시
                    </button>
                  </div>
                )
              })()}

              <div className="grid grid-cols-2 gap-2.5">
                {library.map(photo => {
                  const played    = !!progress[photo.id]?.played
                  const ansShown  = shownAnswers.has(photo.id)
                  return (
                    <div key={photo.id} className="rounded-2xl overflow-hidden relative"
                      style={{
                        background:'rgba(10,16,35,0.7)',
                        border: played ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.07)',
                        opacity: played ? 0.7 : 1,
                      }}>
                      {/* 진행 완료 배지 */}
                      {played && (
                        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[13px] font-black"
                          style={{ background:'rgba(34,211,238,0.18)', color:'#22d3ee', border:'1px solid rgba(34,211,238,0.45)' }}>
                          ✓ 완료
                        </div>
                      )}

                      <button onClick={() => startGame(photo)}
                        className="block w-full aspect-square flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                        {/* 라이트 효과 */}
                        <div className="absolute -top-12 -right-8 w-32 h-32 rounded-full pointer-events-none"
                          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25), transparent 65%)' }} />
                        <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full pointer-events-none"
                          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 65%)' }} />
                        <div className="text-center relative z-10">
                          <div className="text-4xl mb-1 drop-shadow-lg">🔍</div>
                          <p className="text-[13px] font-black tracking-widest uppercase" style={{ color:'rgba(255,255,255,0.55)' }}>
                            가려짐
                          </p>
                        </div>
                      </button>

                      <div className="p-2.5 flex flex-col gap-1">
                        <p className="text-xs font-bold truncate" style={{ color:'#e2e8f0' }}>
                          {photo.name || '제목 없음'}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <button onClick={() => toggleAnswer(photo.id)}
                            className="text-[13px] truncate text-left flex-1 py-0.5"
                            style={{ color: ansShown ? '#22d3ee' : '#64748b' }}>
                            {photo.answer
                              ? (ansShown ? `정답: ${photo.answer}` : '🔒 정답 숨김 (탭)')
                              : '정답 미설정'}
                          </button>
                          <button onClick={() => deletePhoto(photo.id)}
                            className="text-[13px] font-bold px-2 py-1 rounded-lg shrink-0"
                            style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
          style={{ display: 'none' }} />
      </div>
    )
  }

  /* ──────────── 화면 2 — 사진 추가 폼 ──────────── */
  if (mode === 'addForm') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
        <Header title="새 사진 등록" onBack={back} />

        <div className="max-w-lg mx-auto w-full px-4 pb-6 flex flex-col gap-4">
          {pendingDataUrl && (
            <div className="rounded-2xl overflow-hidden"
              style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
              <img src={pendingDataUrl} alt="등록할 사진 미리보기"
                style={{ display:'block', width:'100%', maxHeight:'40vh', objectFit:'contain', background:'#000' }} />
            </div>
          )}

          <Field label="사진 이름 (메모용)">
            <input value={pendingName}
              onChange={e => setPendingName(e.target.value)}
              placeholder="예: 우리 교회 입구"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-bold"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', outline:'none' }} />
          </Field>

          <Field label="정답 — 학생들이 맞춰야 할 답">
            <input value={pendingAnswer}
              onChange={e => setPendingAnswer(e.target.value)}
              placeholder="예: 교회 종탑"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-bold"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', outline:'none' }} />
          </Field>

          <div className="flex gap-2 mt-2">
            <button onClick={cancelPending}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm"
              style={{ background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)' }}>
              취소
            </button>
            <button onClick={savePending} disabled={!pendingDataUrl}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm"
              style={{ background:'linear-gradient(135deg,#0891b2,#1d4ed8)', color:'#fff',
                boxShadow:'0 4px 20px rgba(6,182,212,0.4)', border:'1px solid rgba(6,182,212,0.4)' }}>
              💾 라이브러리에 저장
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ──────────── 화면 3 — 게임 진행 ──────────── */
  const photo  = currentPhoto
  const cur    = revealed ? STAGES[MAX_STAGE - 1] : STAGES[stage - 1]
  const scale  = cur.scale
  const pct    = cur.pct
  const origin = `${pos.cx}% ${pos.cy}%`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#060a18' }}>
      <Header title={photo?.name || '사진 맞추기'} onBack={back}
        right={
          <span className="text-xs font-black tracking-widest" style={{ color: revealed ? '#22d3ee' : '#fbbf24' }}>
            {revealed ? '정답 공개' : `${stage} / ${MAX_STAGE} 단계`}
          </span>
        } />

      {/* 사진 영역 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden relative"
          style={{
            background: '#000',
            border: revealed ? '1px solid rgba(34,211,238,0.45)' : '1px solid rgba(255,255,255,0.06)',
            boxShadow: revealed ? '0 0 50px rgba(34,211,238,0.3)' : 'none',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}>
          {photo && (
            <img src={photo.dataUrl}
              alt={revealed ? (photo.answer || photo.name || '공개된 사진') : '가려진 사진의 일부'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${scale})`,
                transformOrigin: origin,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
          )}

          {/* 단계 인디케이터 — 좌하단 */}
          <div className="absolute left-3 bottom-3 right-3 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {STAGES.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < stage ? (revealed ? '#22d3ee' : '#0891b2') : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <span className="text-[13px] font-black tracking-widest px-2 py-0.5 rounded-md"
              style={{ background:'rgba(0,0,0,0.5)', color:'#fff' }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* 정답 표시 */}
      {revealed && (
        <div className="max-w-lg w-full mx-auto px-4 mb-2 text-center">
          <p className="font-black text-3xl"
            style={{ color: '#22d3ee', textShadow: '0 0 30px rgba(34,211,238,0.4)' }}>
            {photo?.answer || '정답 미설정'}
          </p>
        </div>
      )}

      {/* 컨트롤 */}
      <div className="max-w-lg w-full mx-auto px-4 pb-6 pt-3 flex flex-col gap-2">
        {/* 위치 새로 굴리기 — 단계는 그대로, 노출 위치만 랜덤 변경 */}
        {!revealed && (
          <button onClick={() => setPos(randomCenter())}
            className="w-full py-2.5 rounded-xl font-bold text-xs active:scale-95"
            style={{ background:'rgba(99,102,241,0.15)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
            🎲 다른 위치 보기
          </button>
        )}
        {!revealed && stage < MAX_STAGE && (
          <button onClick={nextStage}
            className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
            style={{ background:'linear-gradient(135deg,#0891b2,#1d4ed8)', color:'#fff',
              boxShadow:'0 8px 40px rgba(6,182,212,0.5)', border:'1px solid rgba(6,182,212,0.4)' }}>
            ➕ 다음 단계
          </button>
        )}
        {!revealed && stage === MAX_STAGE && (
          <button onClick={reveal}
            className="w-full py-5 rounded-2xl font-black text-xl active:scale-95 transition-all"
            style={{ background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'#fff',
              boxShadow:'0 8px 40px rgba(239,68,68,0.6)', border:'1px solid rgba(239,68,68,0.5)' }}>
            🎉 정답 공개!
          </button>
        )}
        {revealed && (
          <div className="flex gap-2">
            <button onClick={replaySame}
              className="flex-1 py-4 rounded-2xl font-black text-base active:scale-95"
              style={{ background:'rgba(99,102,241,0.2)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
              🔁 같은 사진 (위치 변경)
            </button>
            <button onClick={backToLibrary}
              className="flex-1 py-4 rounded-2xl font-black text-base active:scale-95"
              style={{ background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.1)' }}>
              📂 라이브러리
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 공용 작은 컴포넌트 ── */
function TinyBtn({ onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
      style={{ color: disabled ? 'rgba(100,116,139,0.5)' : '#22d3ee',
        background: 'rgba(6,182,212,0.1)',
        border: '1px solid rgba(6,182,212,0.25)' }}>
      {children}
    </button>
  )
}
