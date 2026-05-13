/* 단어 릴레이 — 주제 카드 + 진행자 참고용 단어 풀(answers)
 * 신앙 주제는 정확한 풀이 있어 진행자가 검증용으로 펼쳐 볼 수 있음.
 * 일반 주제는 자유로워 풀 없음. */

export const RELAY_THEMES = [
  /* ─── 신앙 ─── */
  {
    id: 'jesus_names', name: '예수님의 이름', emoji: '✝️',
    gradient: 'linear-gradient(135deg,#0891b2,#1d4ed8)', accent: '#22d3ee',
    goal: 15, hint: '예수님의 호칭들',
    answers: ['예수','그리스도','메시아','임마누엘','어린양','독생자','세상의빛','생명의떡','선한목자','다윗의자손','하나님의아들','인자','구원자','만왕의왕','알파와오메가'],
  },
  {
    id: 'beatitudes', name: '산상수훈 8복', emoji: '⛰️',
    gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', accent: '#fbbf24',
    goal: 8, hint: '마 5:3-12',
    answers: ['심령이 가난한 자','애통하는 자','온유한 자','의에 주리고 목마른 자','긍휼히 여기는 자','마음이 청결한 자','화평하게 하는 자','의를 위해 박해받는 자'],
  },
  {
    id: 'disciples_12', name: '12제자', emoji: '👥',
    gradient: 'linear-gradient(135deg,#6366f1,#4338ca)', accent: '#a5b4fc',
    goal: 12, hint: '예수님의 12사도',
    answers: ['베드로','안드레','야고보','요한','빌립','바돌로매','마태','도마','알패오의야고보','다대오','시몬','가룟유다'],
  },
  {
    id: 'tribes_12', name: '12지파', emoji: '🏛',
    gradient: 'linear-gradient(135deg,#ca8a04,#78350f)', accent: '#fbbf24',
    goal: 12, hint: '야곱의 12아들',
    answers: ['르우벤','시므온','레위','유다','단','납달리','갓','아셀','잇사갈','스불론','요셉','베냐민'],
  },
  {
    id: 'fruit_of_spirit', name: '성령의 9가지 열매', emoji: '🍇',
    gradient: 'linear-gradient(135deg,#10b981,#047857)', accent: '#34d399',
    goal: 9, hint: '갈 5:22-23',
    answers: ['사랑','희락','화평','오래참음','자비','양선','충성','온유','절제'],
  },
  {
    id: 'commandments', name: '십계명', emoji: '📜',
    gradient: 'linear-gradient(135deg,#a16207,#78350f)', accent: '#fcd34d',
    goal: 10, hint: '시내산에서 받은 계명',
    answers: ['하나님 외에 다른 신X','우상 만들지 말라','이름 망령되이 X','안식일 거룩히','부모 공경','살인 X','간음 X','도둑질 X','거짓증거 X','탐심 X'],
  },
  {
    id: 'bible_nt', name: '신약 27권', emoji: '📖',
    gradient: 'linear-gradient(135deg,#0891b2,#1d4ed8)', accent: '#22d3ee',
    goal: 27, hint: '신약 책 이름',
    answers: ['마태복음','마가복음','누가복음','요한복음','사도행전','로마서','고린도전서','고린도후서','갈라디아서','에베소서','빌립보서','골로새서','데살로니가전서','데살로니가후서','디모데전서','디모데후서','디도서','빌레몬서','히브리서','야고보서','베드로전서','베드로후서','요한일서','요한이서','요한삼서','유다서','요한계시록'],
  },
  {
    id: 'bible_ot', name: '구약 39권', emoji: '📚',
    gradient: 'linear-gradient(135deg,#dc2626,#7f1d1d)', accent: '#f87171',
    goal: 39, hint: '구약 책 이름',
    answers: ['창세기','출애굽기','레위기','민수기','신명기','여호수아','사사기','룻기','사무엘상','사무엘하','열왕기상','열왕기하','역대상','역대하','에스라','느헤미야','에스더','욥기','시편','잠언','전도서','아가','이사야','예레미야','예레미야애가','에스겔','다니엘','호세아','요엘','아모스','오바댜','요나','미가','나훔','하박국','스바냐','학개','스가랴','말라기'],
  },

  /* ─── 일반 (자유 주제 — 정해진 정답 풀 X) ─── */
  {
    id: 'animals', name: '동물', emoji: '🦁',
    gradient: 'linear-gradient(135deg,#84cc16,#3f6212)', accent: '#a3e635',
    goal: null, hint: '아무 동물',
  },
  {
    id: 'fruits', name: '과일', emoji: '🍎',
    gradient: 'linear-gradient(135deg,#e11d48,#9f1239)', accent: '#fb7185',
    goal: null, hint: '아무 과일',
  },
  {
    id: 'foods', name: '음식', emoji: '🍔',
    gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', accent: '#fcd34d',
    goal: null, hint: '아무 음식',
  },
  {
    id: 'kr_cities', name: '한국 도시', emoji: '🏙',
    gradient: 'linear-gradient(135deg,#06b6d4,#0e7490)', accent: '#22d3ee',
    goal: null, hint: '서울·부산 등',
  },
  {
    id: 'sports', name: '운동·스포츠', emoji: '⚽',
    gradient: 'linear-gradient(135deg,#0ea5e9,#0c4a6e)', accent: '#38bdf8',
    goal: null, hint: '아무 스포츠',
  },
  {
    id: 'jobs', name: '직업', emoji: '💼',
    gradient: 'linear-gradient(135deg,#7c3aed,#4c1d95)', accent: '#a78bfa',
    goal: null, hint: '아무 직업',
  },
]
