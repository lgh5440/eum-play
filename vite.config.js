import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages 배포 경로 — https://lgh5440.github.io/eum-play/
  base: '/eum-play/',
  server: {
    port: 5190,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-title-prefix',
      apply: 'serve',
      transformIndexHtml(html) {
        return html.replace(/<title>(.*?)<\/title>/, '<title>[DEV·플레이] $1</title>')
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // 이미 작성한 public/manifest.webmanifest 그대로 사용
      manifest: false,
      workbox: {
        // 모든 정적 자산 자동 캐싱 (앱 셸 + 데이터 + 이미지)
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,webmanifest}'],
        // 캐시 크기 한도 — 사진 dataUrl이 커도 우려 적음 (사진은 localStorage에 별도 저장)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // SPA 라우트 처리 — 모든 경로를 index.html로 (base 경로 반영)
        navigateFallback: '/eum-play/index.html',
        // 새 SW 활성화 시 즉시 적용 (자동 업데이트)
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        // 개발 모드에서도 SW 동작 확인 가능 (성능 영향 약간)
        enabled: false,
      },
      includeAssets: ['favicon.svg', 'manifest.webmanifest'],
    }),
  ],
})
