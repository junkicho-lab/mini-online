# 미니 온라인 교무실 웹앱 프로젝트 분석 및 설계

**작성자**: Manus AI  
**작성일**: 2025년 7월 18일  
**버전**: 1.0  

## 1. 프로젝트 개요

### 1.1 프로젝트 목적 및 범위

미니 온라인 교무실 웹앱은 중학교의 단일 부서인 교무기획부를 대상으로 하는 간소화된 디지털 교무 관리 시스템입니다. 이 프로젝트는 복잡한 다부서 구조나 고급 기능 대신, 교사들이 일상적으로 수행하는 핵심 업무에만 집중하여 실용적이고 사용하기 쉬운 솔루션을 제공하는 것을 목표로 합니다.

첨부된 요구사항 문서들을 분석한 결과, 이 시스템은 다음과 같은 핵심 가치를 추구합니다:

**단순성**: 복잡한 기능보다는 꼭 필요한 기능만을 선별하여 구현함으로써 학습 곡선을 최소화하고 사용자 적응을 용이하게 합니다.

**실용성**: 교육 현장의 실제 요구사항에 기반하여 즉시 활용 가능한 기능들로 구성되어 있습니다.

**접근성**: IT 전문 지식이 없는 교사들도 쉽게 설치하고 사용할 수 있도록 설계되었습니다.

### 1.2 핵심 기능 분석

문서 분석을 통해 도출된 핵심 기능들은 다음과 같습니다:

**대시보드 기능**: 로그인 후 가장 먼저 보이는 화면으로, 최근 공지사항 5개와 오늘의 일정을 한눈에 확인할 수 있습니다. 빠른 작업 버튼을 통해 주요 기능에 즉시 접근할 수 있도록 설계되었습니다.

**공지사항 관리**: 교무 관련 공지사항을 작성, 수정, 삭제할 수 있으며, 중요한 공지사항은 별도로 구분하여 표시됩니다. 모든 사용자가 공지사항을 작성할 수 있어 정보 공유를 활성화합니다.

**문서 관리**: PDF, DOC, XLS, 이미지 파일 등을 업로드하고 관리할 수 있습니다. "공문", "회의자료", "양식", "기타"의 4가지 카테고리로 분류하며, 간단한 키워드 검색 기능을 제공합니다.

**일정 관리**: 학교의 다양한 행사와 업무 일정을 등록하고 월별 캘린더 형태로 확인할 수 있습니다. 일정 유형별로 색상을 구분하여 시각적 구분을 용이하게 합니다.

**사용자 관리**: 기본적인 로그인 인증과 프로필 관리 기능을 제공하며, 관리자는 사용자 추가/삭제 권한을 가집니다.

**알림 시스템**: 새로운 공지사항, 문서 업로드, 당일 일정에 대해 시스템 내 알림과 이메일 알림을 제공합니다.

## 2. 기술 아키텍처 설계

### 2.1 전체 시스템 아키텍처

미니 온라인 교무실은 단순성과 안정성을 최우선으로 하는 모놀리식 아키텍처를 채택합니다. 이는 소규모 사용자 그룹(5-10명)에게 충분한 성능을 제공하면서도 설치와 유지보수의 복잡성을 최소화하기 위한 선택입니다.

**3계층 아키텍처**:
- **프레젠테이션 계층**: React 기반 SPA (Single Page Application)
- **비즈니스 로직 계층**: Node.js + Express.js RESTful API 서버
- **데이터 계층**: SQLite 데이터베이스 + 로컬 파일 시스템

이러한 구조는 각 계층 간의 명확한 분리를 통해 유지보수성을 높이면서도, 단일 서버 배포를 통해 운영 복잡성을 줄입니다.

### 2.2 기술 스택 선정

**프론트엔드 기술 스택**:
- **React 18**: 컴포넌트 기반 UI 개발을 위한 메인 프레임워크
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트 라이브러리
- **CSS Modules**: 컴포넌트별 스타일 격리
- **React Hooks**: useState, useEffect, useContext만 사용하여 복잡성 최소화

**백엔드 기술 스택**:
- **Node.js 18 LTS**: 안정성이 검증된 런타임 환경
- **Express.js 4.x**: 간단하고 유연한 웹 프레임워크
- **Sequelize**: SQLite ORM으로 데이터베이스 추상화
- **JWT (jsonwebtoken)**: 사용자 인증을 위한 토큰 기반 인증
- **bcrypt**: 비밀번호 해싱
- **Multer**: 파일 업로드 처리
- **Nodemailer**: 이메일 발송

**데이터베이스 및 저장소**:
- **SQLite 3**: 파일 기반 관계형 데이터베이스
- **로컬 파일 시스템**: 업로드된 파일 저장

### 2.3 배포 및 운영 환경

**컨테이너화**: Docker를 사용하여 일관된 배포 환경 제공
**운영 체제**: Ubuntu 20.04 LTS 권장
**최소 하드웨어**: CPU 2코어, RAM 4GB, 저장공간 50GB
**네트워크**: 10Mbps 이상 안정적인 인터넷 연결

## 3. 데이터베이스 설계

### 3.1 데이터베이스 스키마

데이터베이스는 단순성과 효율성을 고려하여 최소한의 테이블로 구성됩니다. 복잡한 관계나 과도한 정규화보다는 이해하기 쉽고 관리하기 편한 구조를 우선시합니다.

**users 테이블**:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**announcements 테이블**:
```sql
CREATE TABLE announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

**documents 테이블**:
```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    uploader_id INTEGER NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);
```

**schedules 테이블**:
```sql
CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    schedule_type VARCHAR(50) NOT NULL,
    creator_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);
```

**notifications 테이블**:
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 3.2 데이터 관계 및 제약조건

모든 외래키 관계는 users 테이블을 중심으로 구성되며, 데이터 무결성을 위해 적절한 제약조건을 설정합니다. 사용자 삭제 시에는 소프트 삭제 방식을 적용하여 관련 데이터의 일관성을 유지합니다.

## 4. API 설계

### 4.1 RESTful API 설계 원칙

모든 API는 RESTful 원칙을 따르되, 복잡한 고급 기능보다는 단순성과 일관성에 중점을 둡니다. 표준 HTTP 메서드(GET, POST, PUT, DELETE)를 의미에 맞게 사용하며, 일관된 JSON 응답 형태를 제공합니다.

**성공 응답 형태**:
```json
{
  "success": true,
  "data": {...}
}
```

**오류 응답 형태**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### 4.2 주요 API 엔드포인트

**인증 관련 API**:
- `POST /api/auth/login` - 사용자 로그인
- `POST /api/auth/logout` - 사용자 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보 조회

**사용자 관리 API**:
- `GET /api/users` - 사용자 목록 조회 (관리자만)
- `POST /api/users` - 새 사용자 생성 (관리자만)
- `PUT /api/users/:id` - 사용자 정보 수정
- `PUT /api/users/:id/password` - 비밀번호 변경

**공지사항 관리 API**:
- `GET /api/announcements` - 공지사항 목록 조회
- `GET /api/announcements/:id` - 특정 공지사항 조회
- `POST /api/announcements` - 새 공지사항 생성
- `PUT /api/announcements/:id` - 공지사항 수정
- `DELETE /api/announcements/:id` - 공지사항 삭제

**문서 관리 API**:
- `GET /api/documents` - 문서 목록 조회
- `GET /api/documents/:id` - 특정 문서 정보 조회
- `POST /api/documents` - 새 문서 업로드
- `GET /api/documents/:id/download` - 문서 다운로드
- `PUT /api/documents/:id` - 문서 정보 수정
- `DELETE /api/documents/:id` - 문서 삭제

**일정 관리 API**:
- `GET /api/schedules` - 일정 목록 조회
- `GET /api/schedules/:id` - 특정 일정 조회
- `POST /api/schedules` - 새 일정 생성
- `PUT /api/schedules/:id` - 일정 수정
- `DELETE /api/schedules/:id` - 일정 삭제

**알림 관리 API**:
- `GET /api/notifications` - 알림 목록 조회
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리

## 5. 프론트엔드 설계

### 5.1 컴포넌트 구조

React 애플리케이션은 단순하고 직관적인 컴포넌트 구조를 가집니다. 복잡한 컴포넌트 계층이나 고급 패턴보다는 이해하기 쉽고 유지보수하기 편한 구조를 우선시합니다.

**컴포넌트 계층 구조**:
```
App
├── AuthContext (전역 인증 상태 관리)
├── Router
│   ├── LoginPage
│   └── AuthenticatedApp
│       ├── Layout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── MainContent
│       ├── Dashboard
│       ├── Announcements
│       │   ├── AnnouncementList
│       │   ├── AnnouncementDetail
│       │   └── AnnouncementForm
│       ├── Documents
│       │   ├── DocumentList
│       │   ├── DocumentUpload
│       │   └── DocumentDetail
│       ├── Schedules
│       │   ├── Calendar
│       │   ├── ScheduleForm
│       │   └── ScheduleDetail
│       └── Profile
└── Common Components
    ├── Button
    ├── Input
    ├── Modal
    ├── Loading
    └── Notification
```

### 5.2 상태 관리 전략

복잡한 상태 관리 라이브러리 대신 React의 기본 기능만을 사용합니다:

**전역 상태**: AuthContext를 통한 사용자 인증 정보 관리
**로컬 상태**: useState와 useReducer를 사용한 컴포넌트별 상태 관리
**서버 상태**: useEffect를 사용한 API 데이터 관리

### 5.3 UI/UX 설계 원칙

**디자인 시스템**:
- 주 색상: 파란색 계열 (#2563eb)
- 보조 색상: 회색 계열
- 타이포그래피: 시스템 기본 폰트 사용
- 간격: 8px 기준 그리드 시스템

**반응형 디자인**:
- 데스크톱: 1024px 이상
- 태블릿: 768px-1023px
- 모바일: 767px 이하

**접근성 고려사항**:
- 키보드 네비게이션 지원
- 적절한 색상 대비 유지
- ARIA 레이블 제공
- 의미 있는 HTML 구조 사용

## 6. 보안 설계

### 6.1 인증 및 권한 관리

**JWT 기반 인증**:
- 로그인 성공 시 JWT 토큰 발급
- 토큰 만료 시간: 24시간
- 클라이언트 로컬 스토리지에 토큰 저장
- API 요청 시 Authorization 헤더에 Bearer 토큰 포함

**비밀번호 보안**:
- bcrypt를 사용한 해시화 (솔트 라운드: 10)
- 최소 8자 이상 비밀번호 요구
- 복잡성 요구사항은 권장 수준으로 설정

**권한 관리**:
- 관리자와 일반 사용자 두 가지 역할
- API 레벨에서 권한 검사 수행
- 프론트엔드 UI 제어는 보조적 수단으로 활용

### 6.2 데이터 보호

**통신 암호화**: HTTPS를 통한 모든 클라이언트-서버 간 통신 암호화
**파일 업로드 보안**: 허용된 파일 확장자 제한, 파일 크기 제한 (10MB)
**입력 검증**: 클라이언트와 서버 사이드 이중 검증

### 6.3 보안 취약점 방어

**SQL 인젝션 방어**: Sequelize ORM의 매개변수화된 쿼리 사용
**XSS 방어**: React의 기본 XSS 방어 기능 활용
**CSRF 방어**: SameSite 쿠키 속성 설정

## 7. 성능 및 최적화

### 7.1 성능 요구사항

소규모 사용자 그룹을 대상으로 하므로 높은 성능보다는 안정성과 사용성에 중점을 둡니다:

- 동시 사용자: 최대 5명
- 응답 시간: 일반 페이지 로딩 5초 이내, API 응답 3초 이내
- 파일 업로드: 5MB 파일 기준 1분 이내
- 데이터 규모: 문서 1,000개, 일정 500개, 사용자 20명까지 지원

### 7.2 최적화 전략

**프론트엔드 최적화**:
- 코드 스플리팅을 통한 초기 로딩 시간 단축
- 이미지 최적화 및 지연 로딩
- 브라우저 캐싱 활용

**백엔드 최적화**:
- 데이터베이스 인덱스 최적화
- API 응답 캐싱
- 파일 업로드 진행률 표시

## 8. 테스트 전략

### 8.1 테스트 접근 방식

핵심 기능의 안정성을 보장하면서도 과도한 테스트 복잡성을 피하는 실용적 접근 방식을 채택합니다:

**단위 테스트**: 핵심 비즈니스 로직과 유틸리티 함수 테스트
**통합 테스트**: 데이터베이스 연동, API 호출, 파일 업로드 기능 테스트
**E2E 테스트**: 주요 사용자 여정 테스트 (로그인, 공지사항 작성, 문서 업로드, 일정 등록)

### 8.2 테스트 도구

- **백엔드**: Jest, Supertest
- **프론트엔드**: Jest, React Testing Library
- **E2E**: Playwright 또는 Cypress

## 9. 배포 및 운영

### 9.1 배포 전략

**Docker 컨테이너화**:
- 단일 컨테이너에 모든 서비스 포함
- 간단한 docker-compose.yml 설정
- 환경 변수를 통한 설정 관리

**자동 설치 스크립트**:
- Docker 설치부터 서비스 시작까지 자동화
- 초기 관리자 계정 설정 가이드
- 기본 데이터 초기화

### 9.2 백업 및 복구

**자동 백업 시스템**:
- 일일 데이터베이스 백업
- 주간 업로드 파일 백업
- 30일간 백업 파일 보관

**복구 절차**:
- 단계별 복구 가이드 문서화
- 백업 파일을 사용한 데이터 복원
- 시스템 재설치 절차

## 10. 개발 일정 및 마일스톤

### 10.1 개발 단계별 일정

**Phase 1: 프로젝트 분석 및 설계 (완료)**
- 요구사항 분석
- 기술 아키텍처 설계
- 데이터베이스 스키마 설계
- API 설계

**Phase 2: 데이터베이스 설계 및 백엔드 API 구현**
- SQLite 데이터베이스 구현
- Express.js 서버 설정
- 인증 시스템 구현
- 각 모듈별 API 구현

**Phase 3: 프론트엔드 개발**
- React 프로젝트 설정
- 컴포넌트 개발
- API 연동
- 반응형 디자인 구현

**Phase 4: 통합 테스트 및 보안 구현**
- 전체 시스템 통합 테스트
- 보안 기능 강화
- 성능 최적화

**Phase 5: 배포 및 문서화**
- Docker 컨테이너화
- 배포 스크립트 작성
- 사용자 매뉴얼 작성
- 최종 테스트 및 검증

이상으로 미니 온라인 교무실 웹앱의 프로젝트 분석 및 설계를 완료합니다. 다음 단계에서는 이 설계를 바탕으로 실제 구현을 진행하겠습니다.

