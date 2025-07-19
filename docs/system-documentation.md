# 미니 온라인 교무실 시스템 문서

## 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [데이터베이스 설계](#데이터베이스-설계)
3. [API 명세서](#api-명세서)
4. [보안 구현](#보안-구현)
5. [성능 최적화](#성능-최적화)
6. [모니터링 및 로깅](#모니터링-및-로깅)
7. [백업 및 복구](#백업-및-복구)
8. [확장성 고려사항](#확장성-고려사항)

## 시스템 아키텍처

### 전체 아키텍처
미니 온라인 교무실은 3계층 아키텍처를 기반으로 설계되었습니다:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│     Layer       │    │     Layer       │    │     Layer       │
│                 │    │                 │    │                 │
│  React Frontend │◄──►│ Express.js API  │◄──►│ SQLite Database │
│                 │    │                 │    │                 │
│  - Components   │    │ - Controllers   │    │ - User Data     │
│  - Pages        │    │ - Middleware    │    │ - Content Data  │
│  - Contexts     │    │ - Routes        │    │ - File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 기술 스택

#### 프론트엔드
- **React 18**: 사용자 인터페이스 라이브러리
- **Vite**: 빌드 도구 및 개발 서버
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리
- **Axios**: HTTP 클라이언트
- **React Router**: 클라이언트 사이드 라우팅

#### 백엔드
- **Node.js**: 서버 런타임 환경
- **Express.js**: 웹 애플리케이션 프레임워크
- **Sequelize**: ORM (Object-Relational Mapping)
- **SQLite**: 경량 데이터베이스
- **JWT**: JSON Web Token 인증
- **bcrypt**: 비밀번호 해싱
- **multer**: 파일 업로드 처리
- **helmet**: 보안 헤더 설정
- **cors**: Cross-Origin Resource Sharing

### 디렉토리 구조

```
mini-office-system/
├── backend/                    # 백엔드 애플리케이션
│   ├── src/
│   │   ├── config/            # 설정 파일
│   │   │   └── database.js    # 데이터베이스 설정
│   │   ├── controllers/       # 비즈니스 로직 컨트롤러
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── announcementController.js
│   │   │   ├── documentController.js
│   │   │   ├── scheduleController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/        # 미들웨어
│   │   │   ├── auth.js        # 인증 미들웨어
│   │   │   └── upload.js      # 파일 업로드 미들웨어
│   │   ├── models/           # 데이터 모델
│   │   │   ├── User.js
│   │   │   ├── Announcement.js
│   │   │   ├── Document.js
│   │   │   ├── Schedule.js
│   │   │   ├── Notification.js
│   │   │   └── index.js       # 모델 관계 정의
│   │   ├── routes/           # API 라우터
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── announcements.js
│   │   │   ├── documents.js
│   │   │   ├── schedules.js
│   │   │   └── notifications.js
│   │   └── app.js            # 메인 애플리케이션
│   ├── scripts/              # 유틸리티 스크립트
│   │   └── init-admin.js     # 초기 관리자 생성
│   ├── data/                 # 데이터베이스 파일
│   ├── uploads/              # 업로드된 파일
│   ├── .env                  # 환경 변수
│   └── package.json
├── frontend/                 # 프론트엔드 애플리케이션
│   └── mini-office-frontend/
│       ├── src/
│       │   ├── components/   # 재사용 가능한 컴포넌트
│       │   │   ├── Layout.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── contexts/     # React 컨텍스트
│       │   │   └── AuthContext.jsx
│       │   ├── lib/          # 유틸리티 라이브러리
│       │   │   └── api.js    # API 통신 함수
│       │   ├── pages/        # 페이지 컴포넌트
│       │   │   ├── LoginPage.jsx
│       │   │   └── DashboardPage.jsx
│       │   ├── App.jsx       # 메인 앱 컴포넌트
│       │   └── main.jsx      # 애플리케이션 진입점
│       ├── .env              # 환경 변수
│       └── package.json
└── docs/                     # 프로젝트 문서
    ├── user-manual.md
    ├── installation-guide.md
    └── system-documentation.md
```

## 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Users    │    │  Announcements  │    │   Documents     │
├─────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)     │    │ id (PK)         │    │ id (PK)         │
│ name        │    │ title           │    │ title           │
│ email       │    │ content         │    │ description     │
│ password    │    │ category        │    │ filename        │
│ department  │    │ priority        │    │ originalName    │
│ role        │    │ authorId (FK)   │    │ fileSize        │
│ phone       │    │ createdAt       │    │ mimeType        │
│ isActive    │    │ updatedAt       │    │ category        │
│ createdAt   │    └─────────────────┘    │ uploaderId (FK) │
│ updatedAt   │                           │ createdAt       │
└─────────────┘                           │ updatedAt       │
       │                                  └─────────────────┘
       │                                           │
       │    ┌─────────────────┐                   │
       │    │   Schedules     │                   │
       │    ├─────────────────┤                   │
       │    │ id (PK)         │                   │
       │    │ title           │                   │
       │    │ description     │                   │
       │    │ startDate       │                   │
       │    │ endDate         │                   │
       │    │ type            │                   │
       │    │ isPublic        │                   │
       │    │ creatorId (FK)  │                   │
       │    │ createdAt       │                   │
       │    │ updatedAt       │                   │
       │    └─────────────────┘                   │
       │             │                            │
       │             │                            │
       └─────────────┼────────────────────────────┘
                     │
       ┌─────────────────┐
       │  Notifications  │
       ├─────────────────┤
       │ id (PK)         │
       │ title           │
       │ message         │
       │ type            │
       │ isRead          │
       │ userId (FK)     │
       │ createdAt       │
       │ updatedAt       │
       └─────────────────┘
```

### 테이블 상세 명세

#### Users 테이블
| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|-------------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 사용자 고유 ID |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 주소 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| department | VARCHAR(100) | NULL | 소속 부서 |
| role | ENUM | NOT NULL, DEFAULT 'user' | 사용자 권한 (admin, user) |
| phone | VARCHAR(20) | NULL | 전화번호 |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | 계정 활성화 상태 |
| createdAt | DATETIME | NOT NULL | 생성일시 |
| updatedAt | DATETIME | NOT NULL | 수정일시 |

#### Announcements 테이블
| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|-------------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 공지사항 고유 ID |
| title | VARCHAR(255) | NOT NULL | 공지사항 제목 |
| content | TEXT | NOT NULL | 공지사항 내용 |
| category | VARCHAR(50) | NOT NULL | 카테고리 (일반, 긴급, 행사) |
| priority | VARCHAR(20) | NOT NULL, DEFAULT 'normal' | 우선순위 (normal, important, urgent) |
| authorId | INTEGER | FOREIGN KEY | 작성자 ID |
| createdAt | DATETIME | NOT NULL | 생성일시 |
| updatedAt | DATETIME | NOT NULL | 수정일시 |

#### Documents 테이블
| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|-------------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 문서 고유 ID |
| title | VARCHAR(255) | NULL | 문서 제목 |
| description | TEXT | NULL | 문서 설명 |
| filename | VARCHAR(255) | NOT NULL | 저장된 파일명 |
| originalName | VARCHAR(255) | NOT NULL | 원본 파일명 |
| fileSize | INTEGER | NOT NULL | 파일 크기 (bytes) |
| mimeType | VARCHAR(100) | NOT NULL | MIME 타입 |
| category | VARCHAR(50) | NOT NULL | 문서 카테고리 |
| uploaderId | INTEGER | FOREIGN KEY | 업로더 ID |
| createdAt | DATETIME | NOT NULL | 생성일시 |
| updatedAt | DATETIME | NOT NULL | 수정일시 |

#### Schedules 테이블
| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|-------------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 일정 고유 ID |
| title | VARCHAR(255) | NOT NULL | 일정 제목 |
| description | TEXT | NULL | 일정 설명 |
| startDate | DATETIME | NOT NULL | 시작 일시 |
| endDate | DATETIME | NOT NULL | 종료 일시 |
| type | VARCHAR(50) | NOT NULL | 일정 유형 (meeting, event, task, personal) |
| isPublic | BOOLEAN | NOT NULL, DEFAULT false | 공개 여부 |
| creatorId | INTEGER | FOREIGN KEY | 생성자 ID |
| createdAt | DATETIME | NOT NULL | 생성일시 |
| updatedAt | DATETIME | NOT NULL | 수정일시 |

#### Notifications 테이블
| 컬럼명 | 데이터 타입 | 제약조건 | 설명 |
|--------|-------------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 알림 고유 ID |
| title | VARCHAR(255) | NOT NULL | 알림 제목 |
| message | TEXT | NOT NULL | 알림 내용 |
| type | VARCHAR(50) | NOT NULL | 알림 유형 (announcement, schedule, document, system) |
| isRead | BOOLEAN | NOT NULL, DEFAULT false | 읽음 여부 |
| userId | INTEGER | FOREIGN KEY | 수신자 ID |
| createdAt | DATETIME | NOT NULL | 생성일시 |
| updatedAt | DATETIME | NOT NULL | 수정일시 |

### 인덱스 설계
성능 최적화를 위한 인덱스 설정:

```sql
-- Users 테이블
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Announcements 테이블
CREATE INDEX idx_announcements_author ON announcements(authorId);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_created ON announcements(createdAt);

-- Documents 테이블
CREATE INDEX idx_documents_uploader ON documents(uploaderId);
CREATE INDEX idx_documents_category ON documents(category);

-- Schedules 테이블
CREATE INDEX idx_schedules_creator ON schedules(creatorId);
CREATE INDEX idx_schedules_date ON schedules(startDate, endDate);
CREATE INDEX idx_schedules_public ON schedules(isPublic);

-- Notifications 테이블
CREATE INDEX idx_notifications_user ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(isRead);
CREATE INDEX idx_notifications_type ON notifications(type);
```

## API 명세서

### 인증 API

#### POST /api/auth/login
사용자 로그인

**요청**:
```json
{
  "email": "admin@school.edu",
  "password": "admin123!"
}
```

**응답**:
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "시스템 관리자",
      "email": "admin@school.edu",
      "role": "admin",
      "department": "관리부"
    }
  }
}
```

#### POST /api/auth/logout
사용자 로그아웃

**요청**: 헤더에 Authorization: Bearer {token}

**응답**:
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

#### GET /api/auth/me
현재 사용자 정보 조회

**요청**: 헤더에 Authorization: Bearer {token}

**응답**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "시스템 관리자",
    "email": "admin@school.edu",
    "role": "admin",
    "department": "관리부"
  }
}
```

### 사용자 관리 API

#### GET /api/users
사용자 목록 조회 (관리자 전용)

**쿼리 파라미터**:
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `search`: 검색어 (이름 또는 이메일)

**응답**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "시스템 관리자",
        "email": "admin@school.edu",
        "role": "admin",
        "department": "관리부",
        "isActive": true,
        "createdAt": "2025-07-19T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

#### POST /api/users
새 사용자 생성 (관리자 전용)

**요청**:
```json
{
  "name": "홍길동",
  "email": "hong@school.edu",
  "password": "password123!",
  "department": "교무부",
  "role": "user",
  "phone": "010-1234-5678"
}
```

#### PUT /api/users/:id
사용자 정보 수정

**요청**:
```json
{
  "name": "홍길동",
  "department": "교무부",
  "phone": "010-1234-5678"
}
```

#### DELETE /api/users/:id
사용자 삭제 (관리자 전용)

### 공지사항 API

#### GET /api/announcements
공지사항 목록 조회

**쿼리 파라미터**:
- `page`: 페이지 번호
- `limit`: 페이지당 항목 수
- `category`: 카테고리 필터
- `priority`: 우선순위 필터

#### POST /api/announcements
공지사항 작성

**요청**:
```json
{
  "title": "중요 공지사항",
  "content": "공지사항 내용입니다.",
  "category": "일반",
  "priority": "important"
}
```

### 일정 관리 API

#### GET /api/schedules
일정 목록 조회

**쿼리 파라미터**:
- `startDate`: 조회 시작 날짜
- `endDate`: 조회 종료 날짜
- `type`: 일정 유형 필터

#### POST /api/schedules
일정 등록

**요청**:
```json
{
  "title": "회의",
  "description": "월례 회의",
  "startDate": "2025-07-20T09:00:00.000Z",
  "endDate": "2025-07-20T10:00:00.000Z",
  "type": "meeting",
  "isPublic": true
}
```

### 문서 관리 API

#### GET /api/documents
문서 목록 조회

#### POST /api/documents
문서 업로드

**요청**: multipart/form-data
- `file`: 업로드할 파일
- `title`: 문서 제목 (선택)
- `description`: 문서 설명 (선택)
- `category`: 문서 카테고리

#### GET /api/documents/:id/download
문서 다운로드

### 알림 API

#### GET /api/notifications
알림 목록 조회

#### PUT /api/notifications/:id/read
알림 읽음 처리

#### PUT /api/notifications/read-all
모든 알림 읽음 처리

## 보안 구현

### 인증 및 권한 관리

#### JWT (JSON Web Token)
- **토큰 생성**: 로그인 성공 시 JWT 토큰 발급
- **토큰 검증**: 모든 보호된 API 요청에서 토큰 검증
- **토큰 만료**: 24시간 후 자동 만료
- **리프레시**: 클라이언트에서 토큰 갱신 처리

#### 비밀번호 보안
- **해싱**: bcrypt를 사용한 비밀번호 해싱 (salt rounds: 12)
- **복잡성**: 최소 8자, 대소문자, 숫자, 특수문자 포함
- **변경 주기**: 정기적인 비밀번호 변경 권장

#### 권한 관리
- **역할 기반**: admin, user 역할 구분
- **API 보호**: 관리자 전용 API 접근 제한
- **리소스 접근**: 사용자별 리소스 접근 권한 확인

### 입력 검증 및 보안

#### 입력 검증
- **데이터 타입**: 모든 입력 데이터 타입 검증
- **길이 제한**: 문자열 길이 제한 설정
- **형식 검증**: 이메일, 전화번호 등 형식 검증
- **SQL 인젝션**: Sequelize ORM 사용으로 방지

#### 파일 업로드 보안
- **파일 크기**: 최대 10MB 제한
- **파일 타입**: 허용된 MIME 타입만 업로드
- **파일명**: UUID를 사용한 안전한 파일명 생성
- **저장 위치**: 웹 루트 외부 디렉토리에 저장

#### CORS 설정
- **허용 도메인**: 특정 도메인만 API 접근 허용
- **HTTP 메서드**: 필요한 메서드만 허용
- **헤더 제한**: 허용된 헤더만 사용

### 보안 헤더

#### Helmet.js 사용
```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## 성능 최적화

### 데이터베이스 최적화

#### 인덱스 활용
- 자주 조회되는 컬럼에 인덱스 생성
- 복합 인덱스를 통한 쿼리 성능 향상
- 정기적인 인덱스 통계 업데이트

#### 쿼리 최적화
- N+1 문제 해결을 위한 eager loading 사용
- 불필요한 컬럼 조회 방지 (SELECT 최적화)
- 페이지네이션을 통한 대용량 데이터 처리

### 프론트엔드 최적화

#### 코드 분할
- React.lazy()를 사용한 컴포넌트 지연 로딩
- 라우트별 코드 분할
- 번들 크기 최적화

#### 캐싱 전략
- HTTP 캐시 헤더 설정
- 브라우저 캐시 활용
- API 응답 캐싱

#### 이미지 최적화
- 적절한 이미지 포맷 사용
- 이미지 압축 및 리사이징
- 지연 로딩 구현

### 백엔드 최적화

#### 미들웨어 최적화
- 불필요한 미들웨어 제거
- 미들웨어 실행 순서 최적화
- 조건부 미들웨어 적용

#### 메모리 관리
- 메모리 누수 방지
- 가비지 컬렉션 최적화
- 적절한 메모리 할당

## 모니터링 및 로깅

### 로깅 시스템

#### 로그 레벨
- **ERROR**: 시스템 오류 및 예외
- **WARN**: 경고 메시지
- **INFO**: 일반 정보
- **DEBUG**: 디버깅 정보

#### 로그 형식
```javascript
{
  "timestamp": "2025-07-19T00:00:00.000Z",
  "level": "INFO",
  "message": "User login successful",
  "userId": 1,
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

#### 로그 저장
- 파일 기반 로깅
- 로그 로테이션 설정
- 장기 보관을 위한 압축

### 성능 모니터링

#### 메트릭 수집
- API 응답 시간
- 데이터베이스 쿼리 시간
- 메모리 사용량
- CPU 사용률

#### 알림 설정
- 임계값 초과 시 알림
- 시스템 다운 감지
- 오류율 모니터링

## 백업 및 복구

### 데이터베이스 백업

#### 정기 백업
```bash
# 일일 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/database"
DB_PATH="./data/database.sqlite"

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# SQLite 백업
sqlite3 $DB_PATH ".backup $BACKUP_DIR/database_$DATE.sqlite"

# 압축
gzip $BACKUP_DIR/database_$DATE.sqlite

# 30일 이전 백업 파일 삭제
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

#### 백업 검증
- 백업 파일 무결성 검사
- 복구 테스트 수행
- 백업 로그 기록

### 파일 백업

#### 업로드 파일 백업
```bash
# 파일 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/files"
UPLOAD_DIR="./uploads"

# rsync를 사용한 증분 백업
rsync -av --delete $UPLOAD_DIR/ $BACKUP_DIR/current/
rsync -av $UPLOAD_DIR/ $BACKUP_DIR/archive_$DATE/
```

### 복구 절차

#### 데이터베이스 복구
1. 서비스 중지
2. 백업 파일 압축 해제
3. 기존 데이터베이스 파일 교체
4. 서비스 재시작
5. 데이터 무결성 확인

#### 파일 복구
1. 백업 파일 위치 확인
2. 필요한 파일 복사
3. 권한 설정 확인
4. 애플리케이션 재시작

## 확장성 고려사항

### 수평 확장

#### 로드 밸런싱
- Nginx를 사용한 로드 밸런서 구성
- 세션 스토어 외부화 (Redis)
- 무상태 애플리케이션 설계

#### 데이터베이스 확장
- 읽기 전용 복제본 구성
- 데이터베이스 샤딩 고려
- 캐시 레이어 도입 (Redis)

### 수직 확장

#### 하드웨어 업그레이드
- CPU 및 메모리 증설
- SSD 스토리지 사용
- 네트워크 대역폭 확장

#### 소프트웨어 최적화
- 데이터베이스 튜닝
- 애플리케이션 프로파일링
- 병목 지점 식별 및 개선

### 마이크로서비스 전환

#### 서비스 분리
- 인증 서비스
- 공지사항 서비스
- 파일 관리 서비스
- 알림 서비스

#### API 게이트웨이
- 단일 진입점 제공
- 라우팅 및 로드 밸런싱
- 인증 및 권한 관리

### 클라우드 마이그레이션

#### 컨테이너화
- Docker를 사용한 애플리케이션 컨테이너화
- Kubernetes를 통한 오케스트레이션
- CI/CD 파이프라인 구축

#### 클라우드 서비스 활용
- 관리형 데이터베이스 서비스
- 객체 스토리지 서비스
- CDN 서비스

---

**시스템 문서 버전**: 1.0  
**최종 업데이트**: 2025년 7월 19일  
**작성자**: Manus AI

