const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: '이메일과 비밀번호를 입력해주세요.'
        }
      });
    }

    // 사용자 조회
    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
      });
    }

    // 비밀번호 검증
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.'
        }
      });
    }

    // JWT 토큰 생성
    const token = generateToken(user.id);

    // 성공 응답
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.is_admin
        }
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: '로그인 처리 중 오류가 발생했습니다.'
      }
    });
  }
};

// 로그아웃 (클라이언트에서 토큰 삭제)
const logout = async (req, res) => {
  try {
    // 로그아웃 로그 기록 (선택사항)
    console.log(`사용자 ${req.user.email}이 로그아웃했습니다.`);
    
    res.json({
      success: true,
      data: {
        message: '성공적으로 로그아웃되었습니다.'
      }
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: '로그아웃 처리 중 오류가 발생했습니다.'
      }
    });
  }
};

// 현재 사용자 정보 조회
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.is_active) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          isAdmin: user.is_admin,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_INFO_ERROR',
        message: '사용자 정보 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

module.exports = {
  login,
  logout,
  getCurrentUser
};

