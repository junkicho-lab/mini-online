const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  getAnnouncements, 
  getAnnouncement, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  getRecentAnnouncements
} = require('../controllers/announcementController');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 최근 공지사항 조회 (대시보드용)
router.get('/recent', getRecentAnnouncements);

// 공지사항 목록 조회
router.get('/', getAnnouncements);

// 새 공지사항 생성
router.post('/', createAnnouncement);

// 특정 공지사항 조회
router.get('/:id', getAnnouncement);

// 공지사항 수정 (작성자 또는 관리자만)
router.put('/:id', updateAnnouncement);

// 공지사항 삭제 (작성자 또는 관리자만)
router.delete('/:id', deleteAnnouncement);

module.exports = router;

