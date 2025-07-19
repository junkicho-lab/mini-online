const { Announcement, User } = require('../models');
const { Op } = require('sequelize');

// 공지사항 목록 조회
const getAnnouncements = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search } = req.query;

    // 검색 조건 설정
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const announcements = await Announcement.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [
        ['is_important', 'DESC'], // 중요 공지사항 우선
        ['created_at', 'DESC']    // 최신순
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 전체 개수 조회
    const totalCount = await Announcement.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        announcements,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalCount
        }
      }
    });
  } catch (error) {
    console.error('공지사항 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANNOUNCEMENT_LIST_ERROR',
        message: '공지사항 목록 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 특정 공지사항 조회
const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANNOUNCEMENT_NOT_FOUND',
          message: '공지사항을 찾을 수 없습니다.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        announcement
      }
    });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANNOUNCEMENT_GET_ERROR',
        message: '공지사항 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 새 공지사항 생성
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, isImportant } = req.body;

    // 입력 검증
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '제목과 내용은 필수 입력 항목입니다.'
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

    // 새 공지사항 생성
    const announcement = await Announcement.create({
      title,
      content,
      author_id: req.user.id,
      is_important: isImportant || false
    });

    // 작성자 정보와 함께 조회
    const createdAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        announcement: createdAnnouncement
      }
    });
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANNOUNCEMENT_CREATE_ERROR',
        message: '공지사항 생성 중 오류가 발생했습니다.'
      }
    });
  }
};

// 공지사항 수정
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isImportant } = req.body;

    // 공지사항 조회
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANNOUNCEMENT_NOT_FOUND',
          message: '공지사항을 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (작성자 또는 관리자만)
    if (!req.user.is_admin && announcement.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '공지사항을 수정할 권한이 없습니다.'
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

    // 업데이트할 데이터 준비
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isImportant !== undefined) updateData.is_important = isImportant;

    // 공지사항 업데이트
    await announcement.update(updateData);

    // 업데이트된 공지사항 조회
    const updatedAnnouncement = await Announcement.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: {
        announcement: updatedAnnouncement
      }
    });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANNOUNCEMENT_UPDATE_ERROR',
        message: '공지사항 수정 중 오류가 발생했습니다.'
      }
    });
  }
};

// 공지사항 삭제
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // 공지사항 조회
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANNOUNCEMENT_NOT_FOUND',
          message: '공지사항을 찾을 수 없습니다.'
        }
      });
    }

    // 권한 확인 (작성자 또는 관리자만)
    if (!req.user.is_admin && announcement.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '공지사항을 삭제할 권한이 없습니다.'
        }
      });
    }

    // 공지사항 삭제
    await announcement.destroy();

    res.json({
      success: true,
      data: {
        message: '공지사항이 삭제되었습니다.'
      }
    });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANNOUNCEMENT_DELETE_ERROR',
        message: '공지사항 삭제 중 오류가 발생했습니다.'
      }
    });
  }
};

// 최근 공지사항 조회 (대시보드용)
const getRecentAnnouncements = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const announcements = await Announcement.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }],
      order: [
        ['is_important', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        announcements
      }
    });
  } catch (error) {
    console.error('최근 공지사항 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RECENT_ANNOUNCEMENTS_ERROR',
        message: '최근 공지사항 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getRecentAnnouncements
};

