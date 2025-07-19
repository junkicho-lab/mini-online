const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  getUsers, 
  createUser, 
  updateUser, 
  changePassword, 
  deactivateUser 
} = require('../controllers/userController');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 사용자 목록 조회 (관리자만)
router.get('/', requireAdmin, getUsers);

// 새 사용자 생성 (관리자만)
router.post('/', requireAdmin, createUser);

// 사용자 정보 수정 (본인 또는 관리자)
router.put('/:id', updateUser);

// 비밀번호 변경 (본인만)
router.put('/:id/password', changePassword);

// 사용자 비활성화 (관리자만)
router.delete('/:id', requireAdmin, deactivateUser);

module.exports = router;

