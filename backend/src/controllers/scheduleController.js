const { Schedule, User } = require('../models');
const { Op } = require('sequelize');

// 일정 목록 조회
const getSchedules = async (req, res) => {
  try {
    const { startDate, endDate, type, limit = 50, offset = 0 } = req.query;

    // 검색 조건 설정
    const whereClause = {};
    
    // 날짜 범위 필터
    if (startDate && endDate) {
      whereClause.start_date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.start_date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.start_date = {
        [Op.lte]: endDate
      };
    }

    // 일정 유형 필터
    if (type && type !== 'all') {
      whereClause.schedule_type = type;
    }

    const schedules = await Schedule.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }],
      order: [
        ['start_date', 'ASC'],
        ['start_time', 'ASC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 전체 개수 조회
    const totalCount = await Schedule.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        schedules,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalCount
        }
      }
    });
  } catch (error) {
    console.error('일정 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_LIST_ERROR',
        message: '일정 목록 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 특정 일정 조회
const getSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCHEDULE_NOT_FOUND',
          message: '일정을 찾을 수 없습니다.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        schedule
      }
    });
  } catch (error) {
    console.error('일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_GET_ERROR',
        message: '일정 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 새 일정 생성
const createSchedule = async (req, res) => {
  try {
    const { title, description, startDate, startTime, endTime, location, scheduleType } = req.body;

    // 입력 검증
    if (!title || !startDate || !scheduleType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '제목, 시작 날짜, 일정 유형은 필수 입력 항목입니다.'
        }
      });
    }

    // 일정 유형 검증
    const validTypes = ['회의', '행사', '업무', '기타'];
    if (!validTypes.includes(scheduleType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SCHEDULE_TYPE',
          message: '유효하지 않은 일정 유형입니다.'
        }
      });
    }

    // 제목 길이 검증
    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_TOO_LONG',
          message: '제목은 255자를 초과할 수 없습니다.'
        }
      });
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_FORMAT',
          message: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
        }
      });
    }

    // 시간 형식 검증 (선택사항)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (startTime && !timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TIME_FORMAT',
          message: '시간 형식이 올바르지 않습니다. (HH:MM)'
        }
      });
    }
    if (endTime && !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TIME_FORMAT',
          message: '시간 형식이 올바르지 않습니다. (HH:MM)'
        }
      });
    }

    // 새 일정 생성
    const schedule = await Schedule.create({
      title,
      description: description || '',
      start_date: startDate,
      start_time: startTime || null,
      end_time: endTime || null,
      location: location || '',
      schedule_type: scheduleType,
      creator_id: req.user.id
    });

    // 생성자 정보와 함께 조회
    const createdSchedule = await Schedule.findByPk(schedule.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        schedule: createdSchedule
      }
    });
  } catch (error) {
    console.error('일정 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_CREATE_ERROR',
        message: '일정 생성 중 오류가 발생했습니다.'
      }
    });
  }
};

// 일정 수정
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, startTime, endTime, location, scheduleType } = req.body;

    // 일정 조회
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCHEDULE_NOT_FOUND',
          message: '일정을 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (생성자 또는 관리자만)
    if (!req.user.is_admin && schedule.creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '일정을 수정할 권한이 없습니다.'
        }
      });
    }

    // 입력 검증
    if (title && title.length > 255) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_TOO_LONG',
          message: '제목은 255자를 초과할 수 없습니다.'
        }
      });
    }

    if (scheduleType) {
      const validTypes = ['회의', '행사', '업무', '기타'];
      if (!validTypes.includes(scheduleType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_SCHEDULE_TYPE',
            message: '유효하지 않은 일정 유형입니다.'
          }
        });
      }
    }

    // 날짜 형식 검증
    if (startDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DATE_FORMAT',
            message: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'
          }
        });
      }
    }

    // 시간 형식 검증
    const timeRegex = /^\d{2}:\d{2}$/;
    if (startTime && !timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TIME_FORMAT',
          message: '시간 형식이 올바르지 않습니다. (HH:MM)'
        }
      });
    }
    if (endTime && !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TIME_FORMAT',
          message: '시간 형식이 올바르지 않습니다. (HH:MM)'
        }
      });
    }

    // 업데이트할 데이터 준비
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (startTime !== undefined) updateData.start_time = startTime;
    if (endTime !== undefined) updateData.end_time = endTime;
    if (location !== undefined) updateData.location = location;
    if (scheduleType !== undefined) updateData.schedule_type = scheduleType;

    // 일정 업데이트
    await schedule.update(updateData);

    // 업데이트된 일정 조회
    const updatedSchedule = await Schedule.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: {
        schedule: updatedSchedule
      }
    });
  } catch (error) {
    console.error('일정 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_UPDATE_ERROR',
        message: '일정 수정 중 오류가 발생했습니다.'
      }
    });
  }
};

// 일정 삭제
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // 일정 조회
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCHEDULE_NOT_FOUND',
          message: '일정을 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (생성자 또는 관리자만)
    if (!req.user.is_admin && schedule.creator_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '일정을 삭제할 권한이 없습니다.'
        }
      });
    }

    // 일정 삭제
    await schedule.destroy();

    res.json({
      success: true,
      data: {
        message: '일정이 삭제되었습니다.'
      }
    });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_DELETE_ERROR',
        message: '일정 삭제 중 오류가 발생했습니다.'
      }
    });
  }
};

// 오늘의 일정 조회 (대시보드용)
const getTodaySchedules = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

    const schedules = await Schedule.findAll({
      where: {
        start_date: today
      },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name']
      }],
      order: [['start_time', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        schedules
      }
    });
  } catch (error) {
    console.error('오늘의 일정 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TODAY_SCHEDULES_ERROR',
        message: '오늘의 일정 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

module.exports = {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTodaySchedules
};

