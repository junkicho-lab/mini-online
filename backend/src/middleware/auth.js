const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: '인증 토큰이 필요합니다.'
        }
      });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 정보 조회
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_USER',
          message: '유효하지 않은 사용자입니다.'
        }
      });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다.'
        }
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'EXPIRED_TOKEN',
          message: '토큰이 만료되었습니다.'
        }
      });
    } else {
      console.error('인증 미들웨어 오류:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: '인증 처리 중 오류가 발생했습니다.'
        }
      });
    }
  }
};

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: '관리자 권한이 필요합니다.'
      }
    });
  }
  next();
};

// 소유자 또는 관리자 권한 확인 미들웨어
const requireOwnerOrAdmin = (userIdField = 'author_id') => {
  return (req, res, next) => {
    const resourceUserId = req.resource ? req.resource[userIdField] : null;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다.'
        }
      });
    }

    if (req.user.is_admin || req.user.id === resourceUserId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '해당 리소스에 대한 권한이 없습니다.'
        }
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin
};

