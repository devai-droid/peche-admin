# Peche Admin - Claude 참고 정보

## 배포

- 운영: `STAGE=prod make shoot` (orval → webpack build → S3 sync → CloudFront 무효화)
- 운영 서버: https://admin.pecheskin.clinic
- AWS 프로파일: `--profile peche --region ap-northeast-2`

## 로컬 개발

- `STAGE=local make run` → http://localhost:8087
- 백엔드: http://localhost:3007 (peche-backend docker compose)

<!-- sync-docs:start -->

## 기술 스택

- React 18, TypeScript 5, Webpack 5
- 상태관리: Recoil 0.7 (글로벌) + TanStack React Query 4 (서버)
- 폼: React Hook Form 7 + Zod 3
- 스타일: Tailwind CSS 3 + twin.macro 3 + Emotion 11 + MUI 5
- API: Axios + Orval 6 (OpenAPI → React Query 훅 자동생성)
- 토스트: react-toastify 9
- 패키지 매니저: yarn

## 아키텍처

```
src/
├── pages/
│   ├── top-menu/        # 로그인, 회원가입
│   ├── sidebar-menu/    # 기능 페이지 (40+)
│   │   ├── products/    # 시술 상품 CRUD
│   │   ├── reservations/# 예약 관리
│   │   ├── staffs/      # 직원 관리
│   │   ├── events/      # 이벤트 관리
│   │   └── ...
│   └── home/            # 대시보드
├── routers/             # 라우트 정의 + with-auth 가드
├── design-system/       # UI 컴포넌트 (Button, Modal, Dropdown 등)
├── features/
│   ├── auth/            # useLogin, useLogout
│   └── user/            # useMe, useNeedLogin
├── lib/
│   ├── api/             # HTTP 클라이언트 (customInstance)
│   ├── hooks/           # useToken (Recoil atom + localStorage)
│   ├── orval/           # 자동생성 API 클라이언트 (수정 금지)
│   ├── recoil/          # atom 정의 (theme, sidebar, token)
│   ├── service/         # LocalStorage 서비스
│   ├── constants/       # 쿼리 키, localStorage 키
│   └── types/           # 공유 타입
├── theme/               # MUI 테마 설정
└── styles/              # 글로벌 SCSS, Tailwind
```

## 코딩 규칙

- 임포트: `@/` 별칭 사용 (tsconfig + webpack alias)
- 파일명: `kebab-case.page.tsx`, `kebab-case.component.tsx`, `use-kebab-case.ts`
- 컴포넌트: 함수형, PascalCase, default export
- 스타일: twin.macro (`tw.div\`flex\``) + MUI sx prop + SCSS modules
- 상태: Recoil atom (토큰, 사이드바), React Query (서버), useState (로컬)
- 포맷: 쌍따옴표, 세미콜론 없음, trailing comma, 100자 폭
- React Query: `retry: false`, 에러 시 토스트 표시

## 금지사항

- `src/lib/orval/` 파일 직접 수정 금지 — `make orval`로 재생성
- orval 생성 파일은 TypeScript 체크/ESLint 제외 설정됨
- `orval.config.js`는 CJS 문법 (`module.exports`) 사용 필수

## 주요 결합

- `lib/hooks/use-token.ts` → Recoil atom + localStorage, 인증 전반에서 사용
- `lib/api/http-client.ts` → orval customInstance + axiosClient, 모든 API의 기반
- `lib/orval/model/` → 자동생성 타입, 전 페이지에서 사용
- `features/auth/hooks/use-auth.ts` ↔ `features/user/hooks/use-user.ts` (로그인/유저 연동)
- `routers/with-auth.component.tsx` → 인증 필요 페이지 가드
- 환경변수: `env/.env.{STAGE}` → webpack DefinePlugin → `process.env.*`

## 제약사항

- orval config: `input.target`에 백엔드 URL 필요, `validation: false` 설정됨
- Makefile orval 타겟: `BACKEND_API_URL` 환경변수로 URL 전달
- `STAGE` 환경변수: local, dev, prod 구분
- 404 에러: `/product-backup/` 엔드포인트는 의도적으로 무시 처리됨

<!-- sync-docs:end -->
