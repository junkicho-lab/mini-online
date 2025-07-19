import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  Info, 
  Calendar, 
  FileText, 
  Users, 
  Settings,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // 더미 데이터
  const dummyNotifications = [
    {
      id: 1,
      title: '새로운 공지사항이 등록되었습니다',
      message: '2025년 1학기 교육과정 변경 안내가 등록되었습니다. 확인해주세요.',
      type: 'announcement',
      priority: 'high',
      isRead: false,
      createdAt: '2025-07-19T10:30:00Z',
      sender: '시스템 관리자',
      actionUrl: '/announcements/1'
    },
    {
      id: 2,
      title: '일정 알림: 교직원 회의',
      message: '오늘 오후 2시에 예정된 교직원 회의가 있습니다.',
      type: 'schedule',
      priority: 'medium',
      isRead: false,
      createdAt: '2025-07-19T09:00:00Z',
      sender: '일정 관리자',
      actionUrl: '/schedules/2'
    },
    {
      id: 3,
      title: '문서 승인 요청',
      message: '김선생님이 업로드한 "수업계획서.pdf" 문서의 승인이 필요합니다.',
      type: 'document',
      priority: 'medium',
      isRead: true,
      createdAt: '2025-07-19T08:15:00Z',
      sender: '김선생',
      actionUrl: '/documents/3'
    },
    {
      id: 4,
      title: '새 사용자 등록',
      message: '이선생님이 시스템에 새로 등록되었습니다.',
      type: 'user',
      priority: 'low',
      isRead: true,
      createdAt: '2025-07-18T16:45:00Z',
      sender: '시스템',
      actionUrl: '/users/4'
    },
    {
      id: 5,
      title: '시스템 업데이트 완료',
      message: '미니 온라인 교무실 시스템이 v2.1.0으로 업데이트되었습니다.',
      type: 'system',
      priority: 'low',
      isRead: false,
      createdAt: '2025-07-18T14:20:00Z',
      sender: '시스템',
      actionUrl: '/settings'
    },
    {
      id: 6,
      title: '마감일 알림: 성적 입력',
      message: '1학기 성적 입력 마감일이 3일 남았습니다.',
      type: 'deadline',
      priority: 'high',
      isRead: false,
      createdAt: '2025-07-18T12:00:00Z',
      sender: '학사 관리자',
      actionUrl: '/grades'
    },
    {
      id: 7,
      title: '공지사항 수정됨',
      message: '"여름방학 일정 안내" 공지사항이 수정되었습니다.',
      type: 'announcement',
      priority: 'low',
      isRead: true,
      createdAt: '2025-07-17T15:30:00Z',
      sender: '교무부',
      actionUrl: '/announcements/7'
    },
    {
      id: 8,
      title: '일정 취소: 학부모 상담',
      message: '7월 20일 예정된 학부모 상담이 취소되었습니다.',
      type: 'schedule',
      priority: 'medium',
      isRead: true,
      createdAt: '2025-07-17T11:15:00Z',
      sender: '상담부',
      actionUrl: '/schedules/8'
    }
  ];

  // 컴포넌트 마운트 시 더미 데이터 로드
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(dummyNotifications);
      setFilteredNotifications(dummyNotifications);
      setLoading(false);
    }, 500);
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = notifications;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터링
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.type === filterType);
    }

    // 상태 필터링
    if (filterStatus === 'unread') {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(notification => notification.isRead);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterType, filterStatus]);

  // 알림 타입별 아이콘
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'user':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      case 'deadline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}일 전`;
    }
  };

  // 알림 읽음 처리
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 알림 읽지 않음 처리
  const markAsUnread = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  // 알림 삭제
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setSelectedNotifications(prev => prev.filter(selectedId => selectedId !== id));
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // 개별 선택/해제
  const toggleSelect = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 선택된 알림 일괄 읽음 처리
  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(notification =>
        selectedNotifications.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  // 선택된 알림 일괄 삭제
  const deleteSelected = () => {
    setNotifications(prev =>
      prev.filter(notification => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
  };

  // 통계 계산
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">알림 관리</h1>
        </div>
        <p className="text-gray-600">시스템 알림을 확인하고 관리하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 알림</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">읽지 않은 알림</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">읽은 알림</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount - unreadCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="알림 제목, 내용, 발신자로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 타입 필터 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">모든 타입</option>
            <option value="announcement">공지사항</option>
            <option value="schedule">일정</option>
            <option value="document">문서</option>
            <option value="user">사용자</option>
            <option value="system">시스템</option>
            <option value="deadline">마감일</option>
          </select>

          {/* 상태 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">모든 상태</option>
            <option value="unread">읽지 않음</option>
            <option value="read">읽음</option>
          </select>
        </div>
      </div>

      {/* 일괄 작업 버튼 */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
          <span className="text-blue-700 font-medium">
            {selectedNotifications.length}개 알림이 선택됨
          </span>
          <div className="flex gap-2">
            <button
              onClick={markSelectedAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              읽음 처리
            </button>
            <button
              onClick={deleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      )}

      {/* 알림 목록 */}
      <div className="bg-white rounded-lg shadow">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">
              알림 목록 ({filteredNotifications.length}개)
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              모두 읽음
            </button>
          </div>
        </div>

        {/* 알림 리스트 */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">알림을 불러오는 중...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">표시할 알림이 없습니다.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                } ${getPriorityColor(notification.priority)} border-l-4`}
              >
                <div className="flex items-start gap-4">
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelect(notification.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />

                  {/* 아이콘 */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {notification.sender}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority === 'high' ? '높음' :
                             notification.priority === 'medium' ? '보통' : '낮음'}
                          </span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-1 ml-4">
                        {notification.isRead ? (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            title="읽지 않음으로 표시"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                            title="읽음으로 표시"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 페이지네이션 (향후 구현) */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              이전
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</span>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

