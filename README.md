# Popup Market

React + TypeScript + Vite 기반의 팝업 마켓 프로젝트입니다.

## 🚀 프로젝트 소개

지역의 팝업 스토어를 발견하고 방문할 수 있는 웹 애플리케이션입니다. 사용자는 팝업 스토어를 탐색하고, 리뷰를 작성하며, 즐겨찾기에 추가할 수 있습니다. 판매자는 자신의 팝업 스토어를 등록하고 관리할 수 있습니다.

## ✨ 주요 기능

- 🔐 **인증 시스템**: 이메일/비밀번호 및 카카오 로그인 지원
- 🏪 **팝업 스토어 관리**: 스토어 등록, 수정, 삭제 기능
- 📍 **지도 통합**: Google Maps를 활용한 위치 기반 스토어 탐색
- ⭐ **리뷰 시스템**: 스토어에 대한 평점 및 리뷰 작성
- ❤️ **즐겨찾기**: 관심 있는 스토어 저장
- 🤝 **협업 모집**: 팝업 스토어 간 협업 제안 및 수락

## Supabase 설정

이 프로젝트는 Supabase MCP를 사용하여 데이터베이스와 연결됩니다.

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_SUPABASE_URL=https://oaypyevjwtfoualfmjwq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

익명 키(anon key)는 Supabase 대시보드의 Settings > API에서 확인할 수 있습니다.

### Supabase 클라이언트 사용

```typescript
import { supabase } from '@/lib/supabase'

// 예시: 데이터 조회
const { data, error } = await supabase.from('table_name').select('*')
```

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```

## 📦 배포

### Vercel 배포

1. Vercel 대시보드에서 GitHub 저장소 연결
2. **환경 변수 설정** (필수):
   - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase Anonymous Key
3. Deploy 클릭

자세한 배포 가이드는 [.github/VERCEL_ENV_SETUP.md](.github/VERCEL_ENV_SETUP.md)를 참고하세요.

### 환경 변수 오류 해결

배포 후 "supabaseKey is required" 에러가 발생하면:
1. Vercel 대시보드 > Settings > Environment Variables 확인
2. `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY` 설정 확인
3. 재배포 (Redeploy) 실행

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
