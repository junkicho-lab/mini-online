const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  getSchedules, 
  getSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  getTodaySchedules
} = require('../controllers/scheduleController');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 오늘의 일정 조회 (대시보드용)
router.get('/today', getTodaySchedules);

// 일정 목록 조회
router.get('/', getSchedules);

// 새 일정 생성
router.post('/', createSchedule);

// 특정 일정 조회
router.get('/:id', getSchedule);

// 일정 수정 (생성자 또는 관리자만)
router.put('/:id', updateSchedule);

// 일정 삭제 (생성자 또는 관리자만)
router.delete('/:id', deleteSchedule);

module.exports = router;

