const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount 
} = require('../controllers/notificationController');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 읽지 않은 알림 개수 조회
router.get('/unread-count', getUnreadCount);

// 모든 알림을 읽음 상태로 변경
router.put('/read-all', markAllAsRead);

// 알림 목록 조회
router.get('/', getNotifications);

// 특정 알림을 읽음 상태로 변경
router.put('/:id/read', markAsRead);

module.exports = router;

