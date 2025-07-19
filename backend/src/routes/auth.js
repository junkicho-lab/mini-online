const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { login, logout, getCurrentUser } = require('../controllers/authController');

// 로그인
router.post('/login', login);

// 로그아웃 (인증 필요)
router.post('/logout', authenticateToken, logout);

// 현재 사용자 정보 조회 (인증 필요)
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;

