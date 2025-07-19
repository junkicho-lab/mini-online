require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// 데이터베이스 설정
const { testConnection, syncDatabase } = require('./config/database');

// 라우터 import
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const announcementRoutes = require('./routes/announcements');
const documentRoutes = require('./routes/documents');
const scheduleRoutes = require('./routes/schedules');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 미들웨어
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 로깅 미들웨어
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙 (업로드된 파일들)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// 루트 경로
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: '미니 온라인 교무실 API 서버',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        announcements: '/api/announcements',
        documents: '/api/documents',
        schedules: '/api/schedules',
        notifications: '/api/notifications',
        health: '/api/health'
      }
    }
  });
});

// 404 에러 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.'
    }
  });
});

// 전역 에러 핸들러
app.use((error, req, res, next) => {
  console.error('전역 에러:', error);
  
  // Sequelize 에러 처리
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력 데이터가 유효하지 않습니다.',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      }
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: '중복된 데이터입니다.',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      }
    });
  }

  // 기본 에러 응답
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    }
  });
});

// 서버 시작 함수
const startServer = async () => {
  try {
    // 데이터베이스 연결 테스트
    await testConnection();
    
    // 데이터베이스 동기화
    await syncDatabase();
    
    // 서버 시작
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 미니 온라인 교무실 API 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📍 서버 주소: http://localhost:${PORT}`);
      console.log(`🏥 헬스 체크: http://localhost:${PORT}/api/health`);
      console.log(`📚 API 문서: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

// 프로세스 종료 시 정리 작업
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM 신호를 받았습니다. 서버를 종료합니다.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT 신호를 받았습니다. 서버를 종료합니다.');
  process.exit(0);
});

// 처리되지 않은 Promise 거부 처리
process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 Promise 거부:', reason);
  process.exit(1);
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
  console.error('처리되지 않은 예외:', error);
  process.exit(1);
});

// 서버 시작
startServer();

module.exports = app;

