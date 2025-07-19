# 미니 온라인 교무실 설치 가이드

## 목차
1. [시스템 요구사항](#시스템-요구사항)
2. [사전 준비사항](#사전-준비사항)
3. [설치 과정](#설치-과정)
4. [환경 설정](#환경-설정)
5. [서버 실행](#서버-실행)
6. [초기 설정](#초기-설정)
7. [배포 설정](#배포-설정)
8. [문제 해결](#문제-해결)

## 시스템 요구사항

### 최소 요구사항
- **운영체제**: Windows 10, macOS 10.15, Ubuntu 18.04 이상
- **메모리**: 4GB RAM 이상
- **저장공간**: 2GB 이상의 여유 공간
- **네트워크**: 인터넷 연결 (패키지 설치용)

### 권장 요구사항
- **운영체제**: Windows 11, macOS 12, Ubuntu 20.04 이상
- **메모리**: 8GB RAM 이상
- **저장공간**: 10GB 이상의 여유 공간
- **프로세서**: 멀티코어 프로세서

### 소프트웨어 요구사항
- **Node.js**: 18.0 이상
- **npm**: 9.0 이상 또는 **pnpm**: 8.0 이상
- **Git**: 최신 버전
- **웹 브라우저**: Chrome, Firefox, Safari, Edge 최신 버전

## 사전 준비사항

### 1. Node.js 설치
Node.js 공식 웹사이트(https://nodejs.org)에서 LTS 버전을 다운로드하여 설치합니다.

#### Windows
1. Node.js 설치 파일(.msi)을 다운로드합니다
2. 설치 파일을 실행하고 안내에 따라 설치합니다
3. 명령 프롬프트에서 설치 확인:
```cmd
node --version
npm --version
```

#### macOS
1. Node.js 설치 파일(.pkg)을 다운로드합니다
2. 설치 파일을 실행하고 안내에 따라 설치합니다
3. 터미널에서 설치 확인:
```bash
node --version
npm --version
```

#### Ubuntu/Linux
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 설치 확인
node --version
npm --version
```

### 2. pnpm 설치 (권장)
pnpm은 npm보다 빠르고 효율적인 패키지 매니저입니다.

```bash
npm install -g pnpm
```

### 3. Git 설치
Git 공식 웹사이트(https://git-scm.com)에서 운영체제에 맞는 버전을 다운로드하여 설치합니다.

## 설치 과정

### 1. 프로젝트 다운로드
```bash
# Git을 사용하여 프로젝트 클론
git clone <repository-url>
cd mini-office-system

# 또는 ZIP 파일 다운로드 후 압축 해제
# 압축 해제 후 해당 디렉토리로 이동
```

### 2. 백엔드 설치
```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 패키지 설치
npm install

# 또는 pnpm 사용
pnpm install
```

### 3. 프론트엔드 설치
```bash
# 프론트엔드 디렉토리로 이동
cd ../frontend/mini-office-frontend

# 의존성 패키지 설치
pnpm install

# 또는 npm 사용
npm install
```

## 환경 설정

### 1. 백엔드 환경 설정
백엔드 디렉토리에서 환경 설정 파일을 생성합니다.

```bash
cd backend
cp .env.example .env
```

`.env` 파일을 편집하여 다음 설정을 수정합니다:

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# 데이터베이스 설정
DB_PATH=./data/database.sqlite

# 파일 업로드 설정
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# 이메일 설정 (선택사항)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=미니 온라인 교무실 <your-email@gmail.com>

# CORS 설정
CORS_ORIGIN=http://localhost:5173
```

### 2. 프론트엔드 환경 설정
프론트엔드 디렉토리에서 환경 설정 파일을 생성합니다.

```bash
cd ../frontend/mini-office-frontend
```

`.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. 필요한 디렉토리 생성
```bash
# 백엔드 디렉토리로 이동
cd ../../backend

# 데이터베이스 및 업로드 디렉토리 생성
mkdir -p data uploads
```

## 서버 실행

### 1. 백엔드 서버 실행
```bash
# 백엔드 디렉토리에서
cd backend

# 개발 모드로 실행
npm run dev

# 또는 pnpm 사용
pnpm run dev
```

백엔드 서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:
```
🚀 미니 온라인 교무실 API 서버가 포트 3001에서 실행 중입니다.
📍 서버 주소: http://localhost:3001
🏥 헬스 체크: http://localhost:3001/api/health
```

### 2. 프론트엔드 서버 실행
새로운 터미널 창을 열고:

```bash
# 프론트엔드 디렉토리에서
cd frontend/mini-office-frontend

# 개발 모드로 실행
pnpm run dev

# 또는 npm 사용
npm run dev
```

프론트엔드 서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:
```
  Local:   http://localhost:5173/
  Network: use --host to expose
```

## 초기 설정

### 1. 데이터베이스 초기화
백엔드 서버가 처음 실행될 때 자동으로 데이터베이스 테이블이 생성됩니다.

### 2. 관리자 계정 생성
```bash
# 백엔드 디렉토리에서
cd backend
node scripts/init-admin.js
```

이 스크립트는 다음 관리자 계정을 생성합니다:
- **이메일**: admin@school.edu
- **비밀번호**: admin123!
- **권한**: 시스템 관리자

### 3. 시스템 접속 및 확인
1. 웹 브라우저에서 `http://localhost:5173`에 접속합니다
2. 생성된 관리자 계정으로 로그인합니다
3. 대시보드가 정상적으로 표시되는지 확인합니다

## 배포 설정

### 1. 프로덕션 빌드
```bash
# 프론트엔드 빌드
cd frontend/mini-office-frontend
pnpm run build

# 빌드된 파일은 dist/ 디렉토리에 생성됩니다
```

### 2. 프로덕션 환경 설정
프로덕션 환경에서는 다음 설정을 변경해야 합니다:

#### 백엔드 `.env` 파일:
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=production-secret-key-very-long-and-secure
CORS_ORIGIN=https://your-domain.com
```

#### 프론트엔드 `.env` 파일:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 3. 웹 서버 설정 (Nginx 예시)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 프론트엔드 정적 파일
    location / {
        root /path/to/mini-office-system/frontend/mini-office-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 프록시
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. 프로세스 관리 (PM2 사용)
```bash
# PM2 설치
npm install -g pm2

# 백엔드 서버를 PM2로 실행
cd backend
pm2 start src/app.js --name "mini-office-backend"

# PM2 프로세스 확인
pm2 list

# 시스템 재시작 시 자동 실행 설정
pm2 startup
pm2 save
```

## 문제 해결

### 1. 포트 충돌 문제
**증상**: `EADDRINUSE` 오류 발생

**해결방법**:
```bash
# 포트 사용 중인 프로세스 확인
lsof -ti:3001  # Linux/macOS
netstat -ano | findstr :3001  # Windows

# 프로세스 종료 후 다시 실행
```

### 2. 패키지 설치 오류
**증상**: `npm install` 또는 `pnpm install` 실패

**해결방법**:
```bash
# 캐시 정리
npm cache clean --force
# 또는
pnpm store prune

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 3. 데이터베이스 연결 오류
**증상**: 데이터베이스 연결 실패

**해결방법**:
1. `data/` 디렉토리가 존재하는지 확인
2. 디렉토리 권한 확인
3. `.env` 파일의 `DB_PATH` 설정 확인

### 4. CORS 오류
**증상**: 프론트엔드에서 API 호출 시 CORS 오류

**해결방법**:
1. 백엔드 `.env` 파일의 `CORS_ORIGIN` 설정 확인
2. 프론트엔드 `.env` 파일의 `VITE_API_URL` 설정 확인
3. 백엔드 서버 재시작

### 5. 파일 업로드 오류
**증상**: 파일 업로드 실패

**해결방법**:
1. `uploads/` 디렉토리 존재 및 권한 확인
2. 파일 크기 제한 확인 (기본 10MB)
3. 디스크 용량 확인

### 6. 로그 확인
문제 발생 시 다음 로그를 확인하세요:

```bash
# 백엔드 로그 (개발 모드)
# 터미널에서 직접 확인 가능

# PM2 로그 (프로덕션 모드)
pm2 logs mini-office-backend

# 브라우저 개발자 도구
# F12 키를 눌러 Console 탭에서 오류 확인
```

## 추가 지원

설치 과정에서 문제가 발생하거나 추가 도움이 필요한 경우:

1. **문서 확인**: README.md 및 사용자 매뉴얼 참조
2. **로그 분석**: 오류 메시지를 자세히 확인
3. **이슈 리포트**: 구체적인 오류 상황과 함께 이슈 등록

---

**설치 가이드 버전**: 1.0  
**최종 업데이트**: 2025년 7월 19일

