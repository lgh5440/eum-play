import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES as CHOSUNG_CATEGORIES, QUESTIONS as CHOSUNG_SEED } from '../data/chosungQuestions'
import {
  loadCustom, addCustomQuestion, removeCustomQuestion, toChosung,
  resetAll as resetAllChosung,
} from '../utils/chosung'
import { resetAllPhotoProgress } from '../utils/photoLibrary'
import { Header, Field, Card } from '../components/ui'

const LEVELS = ['상', '중', '하']

export default function Settings() {
  const navigate = useNavigate()

  /* 초성 사용자 추가 문제 */
  const [chosungCustom, setChosungCustom] = useState(loadCustom)
  const [chosungCat, setChosungCat] = useState(
    (CHOSUNG_CATEGORIES.find(c => c.mode !== 'free' && !c.subdivided) || CHOSUNG_CATEGORIES[0]).key
  )
  const [chosungLevel, setChosungLevel] = useState('상')
  const [chosungInput, setChosungInput] = useState('')

  const customCats = CHOSUNG_CATEGORIES.filter(c => c.mode !== 'free' && !c.subdivided)

  const seedArr   = CHOSUNG_SEED[chosungCat]?.[chosungLevel] || []
  const customArr = chosungCustom[chosungCat]?.[chosungLevel] || []

  const handleAdd = () => {
    const v = chosungInput.trim()
    if (!v) return
    if (addCustomQuestion(chosungCat, chosungLevel, v)) {
      setChosungCustom(loadCustom())
      setChosungInput('')
    } else {
      alert('이미 같은 정답이 있어요')
    }
  }

  const handleRemove = (ans) => {
    removeCustomQuestion(chosungCat, chosungLevel, ans)
    setChosungCustom(loadCustom())
  }

  const handleResetAllChosung = () => {
    if (confirm('초성 게임의 모든 진행 기록을 초기화할까요?')) {
      resetAllChosung()
      alert('초성 게임 진행 기록이 초기화되었습니다.')
    }
  }

  const handleResetAllPhoto = async () => {
    if (confirm('사진 맞추기의 모든 진행 기록을 초기화할까요? (사진 자체는 유지됩니다)')) {
      await resetAllPhotoProgress()
      alert('사진 맞추기 진행 기록이 초기화되었습니다.')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#060a18' }}>
      <Header title="⚙️ 설정" onBack={() => navigate('/')} />

      <div className="max-w-lg mx-auto px-4 pb-6 flex flex-col gap-5">

        {/* ───── 초성 게임 — 사용자 정답 추가 ───── */}
        <Section title="🔤 초성 게임 — 정답 추가" color="#fbbf24">
          <p className="leading-relaxed mb-3" style={{ color: '#94a3b8', fontSize: 13 }}>
            사자성어·속담 카테고리를 제외하고, 직접 정답을 추가할 수 있습니다.
            추가한 문제는 이 디바이스에 저장되며 게임에 자동 포함됩니다.
          </p>

          <Field label="카테고리">
            <div className="flex gap-1.5 flex-wrap">
              {customCats.map(cat => (
                <button key={cat.key} onClick={() => setChosungCat(cat.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={chosungCat === cat.key
                    ? { background: `${cat.color}26`, color: cat.color, border: `1px solid ${cat.color}66` }
                    : { background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="난이도">
            <div className="flex gap-2">
              {LEVELS.map(lv => (
                <button key={lv} onClick={() => setChosungLevel(lv)}
                  className="flex-1 py-2 rounded-xl text-xs font-black"
                  style={chosungLevel === lv
                    ? { background: 'rgba(6,182,212,0.18)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.45)' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {lv}
                </button>
              ))}
            </div>
          </Field>

          <Field label="정답 입력">
            <div className="flex gap-2">
              <input
                id="chosung-answer-input"
                aria-label="추가할 정답 단어"
                value={chosungInput}
                onChange={e => setChosungInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleAdd()}
                placeholder="예: 광야공산"
                className="flex-1 rounded-xl px-3 py-2.5 text-sm font-bold"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', outline:'none' }} />
              <button onClick={handleAdd}
                aria-label="정답 추가"
                className="px-4 rounded-xl font-black text-sm"
                style={{ background:'linear-gradient(135deg,#0891b2,#1d4ed8)', color:'#fff' }}>
                +
              </button>
            </div>
          </Field>

          {/* 현재 풀 */}
          <div className="mt-2">
            <p className="text-[11px] font-black tracking-widest uppercase mb-2" style={{ color: '#64748b' }}>
              현재 풀 — 시드 {seedArr.length} + 추가 {customArr.length} = {seedArr.length + customArr.length}개
            </p>
            {customArr.length === 0 ? (
              <p className="leading-relaxed" style={{ color: '#64748b', fontSize: 12 }}>
                아직 추가한 문제가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {customArr.map(ans => (
                  <div key={ans} className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-black tracking-widest shrink-0" style={{ color: '#fbbf24' }}>
                        {toChosung(ans)}
                      </span>
                      <span className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>{ans}</span>
                    </div>
                    <button onClick={() => handleRemove(ans)}
                      className="ml-2 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0"
                      style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* ───── 진행 기록 초기화 ───── */}
        <Section title="🔁 진행 기록 초기화" color="#a5b4fc">
          <p className="leading-relaxed mb-3" style={{ color: '#94a3b8', fontSize: 13 }}>
            게임에서 누적된 완료 기록을 모두 지웁니다. (게임 데이터·사진 자체는 유지)
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={handleResetAllChosung}
              className="py-3 rounded-xl font-bold text-sm"
              style={{ background:'rgba(99,102,241,0.12)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
              🔤 초성 게임 진행 기록 초기화
            </button>
            <button onClick={handleResetAllPhoto}
              className="py-3 rounded-xl font-bold text-sm"
              style={{ background:'rgba(99,102,241,0.12)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)' }}>
              🖼 사진 맞추기 진행 기록 초기화
            </button>
          </div>
        </Section>

        {/* ───── 앱 정보 ───── */}
        <Section title="ℹ️ 앱 정보" color="#94a3b8">
          <p className="leading-relaxed" style={{ color: '#94a3b8', fontSize: 13 }}>
            <b style={{ color: '#fcd34d' }}>이음 (E:UM)</b> — 하나님과 사람을, 사람과 사람을 잇는 교회 활동 도우미
          </p>
        </Section>

      </div>
    </div>
  )
}

/* ── 서브 컴포넌트 ── */
function Section({ title, color, children }) {
  return (
    <Card className="flex flex-col gap-3" style={{ border: `1px solid ${color}22` }}>
      <p className="font-black tracking-widest" style={{ color, fontSize: 13 }}>
        {title}
      </p>
      {children}
    </Card>
  )
}
