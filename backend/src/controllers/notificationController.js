const { Notification, User } = require('../models');

// 사용자의 알림 목록 조회
const getNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    // 검색 조건 설정
    const whereClause = {
      user_id: req.user.id
    };

    if (unreadOnly === 'true') {
      whereClause.is_read = false;
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [
        ['is_read', 'ASC'],  // 읽지 않은 알림 우선
        ['created_at', 'DESC'] // 최신순
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 전체 개수와 읽지 않은 개수 조회
    const totalCount = await Notification.count({
      where: { user_id: req.user.id }
    });
    
    const unreadCount = await Notification.count({
      where: { 
        user_id: req.user.id,
        is_read: false
      }
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: totalCount,
          unread: unreadCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalCount
        }
      }
    });
  } catch (error) {
    console.error('알림 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_LIST_ERROR',
        message: '알림 목록 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 특정 알림을 읽음 상태로 변경
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // 알림 조회 및 권한 확인
    const notification = await Notification.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: '알림을 찾을 수 없습니다.'
        }
      });
    }

    // 읽음 상태로 변경
    await notification.update({ is_read: true });

    res.json({
      success: true,
      data: {
        message: '알림이 읽음 상태로 변경되었습니다.'
      }
    });
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_READ_ERROR',
        message: '알림 읽음 처리 중 오류가 발생했습니다.'
      }
    });
  }
};

// 모든 알림을 읽음 상태로 변경
const markAllAsRead = async (req, res) => {
  try {
    // 사용자의 모든 읽지 않은 알림을 읽음 상태로 변경
    const [updatedCount] = await Notification.update(
      { is_read: true },
      {
        where: {
          user_id: req.user.id,
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        message: `${updatedCount}개의 알림이 읽음 상태로 변경되었습니다.`,
        updatedCount
      }
    });
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'NOTIFICATION_READ_ALL_ERROR',
        message: '모든 알림 읽음 처리 중 오류가 발생했습니다.'
      }
    });
  }
};

// 읽지 않은 알림 개수 조회
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.count({
      where: {
        user_id: req.user.id,
        is_read: false
      }
    });

    res.json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('읽지 않은 알림 개수 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UNREAD_COUNT_ERROR',
        message: '읽지 않은 알림 개수 조회 중 오류가 발생했습니다.'
      }
    });
  }
};

// 알림 생성 유틸리티 함수 (다른 컨트롤러에서 사용)
const createNotification = async (userId, title, message, type) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      title,
      message,
      notification_type: type
    });
    return notification;
  } catch (error) {
    console.error('알림 생성 오류:', error);
    throw error;
  }
};

// 모든 사용자에게 알림 생성 (시스템 알림용)
const createNotificationForAllUsers = async (title, message, type) => {
  try {
    // 활성 사용자 목록 조회
    const activeUsers = await User.findAll({
      where: { is_active: true },
      attributes: ['id']
    });

    // 각 사용자에게 알림 생성
    const notifications = await Promise.all(
      activeUsers.map(user => 
        Notification.create({
          user_id: user.id,
          title,
          message,
          notification_type: type
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('전체 사용자 알림 생성 오류:', error);
    throw error;
  }
};

// 특정 사용자들에게 알림 생성
const createNotificationForUsers = async (userIds, title, message, type) => {
  try {
    const notifications = await Promise.all(
      userIds.map(userId => 
        Notification.create({
          user_id: userId,
          title,
          message,
          notification_type: type
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('특정 사용자 알림 생성 오류:', error);
    throw error;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createNotification,
  createNotificationForAllUsers,
  createNotificationForUsers
};

