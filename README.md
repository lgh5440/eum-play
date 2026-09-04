<!-- as-of: 2026-09-04 @ 643c9604e37e37ac7cc9a40dc1e53ed93262cbd7 -->
# 이음 플레이

교회 소그룹, 수련회, 친교 시간에서 바로 사용할 수 있는 진행자용 웹 게임 모음입니다.

## 주요 기능

- 스톱워치
- 타이머
- 랜덤 뽑기
- 사진 맞추기
- 초성 게임
- 주사위 / 윷놀이
- 빙고
- 단어 릴레이
- 문장 매칭

## 기술 스택

- React
- Vite
- Tailwind CSS
- React Router
- vite-plugin-pwa
- idb-keyval

## 실행

```bash
npm install
npm run dev
```

개발 서버 기본 포트는 `5190`입니다.

## 점검 명령

```bash
npm run lint
npm run build
npm audit
```

## 배포

GitHub Pages 하위 경로 배포를 기준으로 설정되어 있습니다.

- Base path: `/eum-play/`
- 배포 URL: `https://lgh5440.github.io/eum-play/`
- SPA fallback: `public/404.html`
- PWA manifest: `public/manifest.webmanifest`

## 데이터 저장

- 초성 게임 진행 기록과 옵션은 `localStorage`를 사용합니다.
- 사진 맞추기 사진 라이브러리와 진행 기록은 `IndexedDB`를 사용합니다.
- 기존 사진 맞추기 `localStorage` 데이터는 최초 실행 시 `IndexedDB`로 마이그레이션됩니다.
