# 미니 온라인 교무실 웹앱

## 프로젝트 개요

미니 온라인 교무실은 교육기관의 업무 효율성을 높이기 위해 개발된 웹 기반 교무 관리 시스템입니다. 교직원들이 공지사항, 일정, 문서, 알림 등을 효율적으로 관리할 수 있도록 설계되었습니다.

## 주요 기능

### 🔐 사용자 인증 및 권한 관리
- JWT 기반 안전한 로그인/로그아웃
- 관리자/일반 사용자 권한 구분
- 비밀번호 암호화 저장

### 📢 공지사항 관리
- 공지사항 작성, 수정, 삭제
- 중요 공지사항 표시
- 카테고리별 분류
- 첨부파일 지원

### 📅 일정 관리
- 개인/공용 일정 등록
- 일정 유형별 분류 (회의, 행사, 업무 등)
- 캘린더 뷰 제공
- 일정 알림 기능

### 📁 문서 관리
- 파일 업로드/다운로드
- 문서 카테고리 분류
- 검색 기능
- 접근 권한 관리

### 🔔 알림 시스템
- 실시간 알림 표시
- 읽음/안읽음 상태 관리
- 알림 유형별 분류

### 👥 사용자 관리 (관리자 전용)
- 사용자 계정 생성/수정/삭제
- 권한 설정
- 사용자 활동 모니터링

## 기술 스택

### 백엔드
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **SQLite** - 데이터베이스
- **Sequelize** - ORM
- **JWT** - 인증
- **bcrypt** - 비밀번호 암호화
- **multer** - 파일 업로드

### 프론트엔드
- **React** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **shadcn/ui** - UI 컴포넌트
- **Lucide React** - 아이콘
- **Axios** - HTTP 클라이언트

## 시스템 요구사항

- Node.js 18.0 이상
- npm 또는 pnpm
- 최신 웹 브라우저 (Chrome, Firefox, Safari, Edge)

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd mini-office-system
```

### 2. 백엔드 설정
```bash
cd backend
npm install
cp .env.example .env
# .env 파일에서 필요한 설정 수정
npm run dev
```

### 3. 프론트엔드 설정
```bash
cd frontend/mini-office-frontend
pnpm install
# 또는 npm install
pnpm run dev
# 또는 npm run dev
```

### 4. 초기 관리자 계정 생성
```bash
cd backend
node scripts/init-admin.js
```

## 기본 계정 정보

- **이메일**: admin@school.edu
- **비밀번호**: admin123!
- **권한**: 시스템 관리자

## API 문서

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자 관리 API
- `GET /api/users` - 사용자 목록 조회
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 정보 수정
- `DELETE /api/users/:id` - 사용자 삭제

### 공지사항 API
- `GET /api/announcements` - 공지사항 목록
- `GET /api/announcements/:id` - 공지사항 상세
- `POST /api/announcements` - 공지사항 작성
- `PUT /api/announcements/:id` - 공지사항 수정
- `DELETE /api/announcements/:id` - 공지사항 삭제

### 일정 관리 API
- `GET /api/schedules` - 일정 목록
- `GET /api/schedules/:id` - 일정 상세
- `POST /api/schedules` - 일정 등록
- `PUT /api/schedules/:id` - 일정 수정
- `DELETE /api/schedules/:id` - 일정 삭제

### 문서 관리 API
- `GET /api/documents` - 문서 목록
- `POST /api/documents` - 문서 업로드
- `GET /api/documents/:id/download` - 문서 다운로드
- `DELETE /api/documents/:id` - 문서 삭제

### 알림 API
- `GET /api/notifications` - 알림 목록
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리

## 프로젝트 구조

```
mini-office-system/
├── backend/                 # 백엔드 서버
│   ├── src/
│   │   ├── controllers/     # 컨트롤러
│   │   ├── models/          # 데이터 모델
│   │   ├── routes/          # 라우터
│   │   ├── middleware/      # 미들웨어
│   │   ├── config/          # 설정 파일
│   │   └── app.js          # 메인 애플리케이션
│   ├── scripts/            # 유틸리티 스크립트
│   ├── uploads/            # 업로드된 파일
│   ├── data/               # 데이터베이스 파일
│   └── package.json
├── frontend/               # 프론트엔드
│   └── mini-office-frontend/
│       ├── src/
│       │   ├── components/  # React 컴포넌트
│       │   ├── pages/       # 페이지 컴포넌트
│       │   ├── contexts/    # React 컨텍스트
│       │   ├── lib/         # 유틸리티 라이브러리
│       │   └── App.jsx     # 메인 앱 컴포넌트
│       └── package.json
└── docs/                   # 프로젝트 문서
```

## 보안 고려사항

- JWT 토큰 기반 인증
- 비밀번호 bcrypt 해싱
- CORS 설정으로 도메인 제한
- 파일 업로드 크기 제한
- SQL 인젝션 방지 (Sequelize ORM 사용)
- XSS 방지를 위한 입력 검증

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋합니다 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시합니다 (`git push origin feature/새기능`)
5. Pull Request를 생성합니다

## 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**개발자**: Manus AI  
**버전**: 1.0.0  
**최종 업데이트**: 2025년 7월 19일

