import React, { useState, useEffect } from 'react';

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '10:00',
    type: 'personal',
    category: 'meeting',
    location: '',
    is_all_day: false
  });

  // 테스트용 더미 데이터
  const dummySchedules = [
    {
      id: 1,
      title: '팀 회의',
      description: '주간 팀 회의입니다.',
      start_date: '2025-07-19',
      end_date: '2025-07-19',
      start_time: '10:00',
      end_time: '11:00',
      type: 'public',
      category: 'meeting',
      location: '회의실 A',
      is_all_day: false,
      created_at: '2025-07-19T00:00:00Z'
    },
    {
      id: 2,
      title: '프로젝트 마감',
      description: '미니 온라인 교무실 프로젝트 마감일입니다.',
      start_date: '2025-07-25',
      end_date: '2025-07-25',
      start_time: '',
      end_time: '',
      type: 'personal',
      category: 'deadline',
      location: '',
      is_all_day: true,
      created_at: '2025-07-19T00:00:00Z'
    },
    {
      id: 3,
      title: '학교 행사',
      description: '여름 축제 행사입니다.',
      start_date: '2025-07-30',
      end_date: '2025-07-30',
      start_time: '14:00',
      end_time: '18:00',
      type: 'public',
      category: 'event',
      location: '운동장',
      is_all_day: false,
      created_at: '2025-07-19T00:00:00Z'
    },
    {
      id: 4,
      title: '개인 약속',
      description: '개인적인 약속입니다.',
      start_date: '2025-07-22',
      end_date: '2025-07-22',
      start_time: '15:30',
      end_time: '17:00',
      type: 'personal',
      category: 'personal',
      location: '카페',
      is_all_day: false,
      created_at: '2025-07-19T00:00:00Z'
    },
    {
      id: 5,
      title: '중요 회의',
      description: '분기별 중요 회의입니다.',
      start_date: '2025-07-28',
      end_date: '2025-07-28',
      start_time: '09:00',
      end_time: '12:00',
      type: 'public',
      category: 'meeting',
      location: '대회의실',
      is_all_day: false,
      created_at: '2025-07-19T00:00:00Z'
    }
  ];

  // 컴포넌트 마운트 시 더미 데이터 로드
  useEffect(() => {
    setSchedules(dummySchedules);
  }, []);

  // 달력 관련 함수들
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 이전 달의 마지막 날들
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        schedules: getSchedulesForDate(prevDate)
      });
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        schedules: getSchedulesForDate(currentDate)
      });
    }

    // 다음 달의 첫 날들 (42개 칸을 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        schedules: getSchedulesForDate(nextDate)
      });
    }

    return days;
  };

  const getSchedulesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const scheduleDate = schedule.start_date;
      return scheduleDate === dateStr;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 모달 관련 함수들
  const openModal = (schedule = null, date = null) => {
    console.log('모달 열기:', schedule, date);
    
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        title: schedule.title,
        description: schedule.description || '',
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        start_time: schedule.start_time || '09:00',
        end_time: schedule.end_time || '10:00',
        type: schedule.type || 'personal',
        category: schedule.category || 'meeting',
        location: schedule.location || '',
        is_all_day: schedule.is_all_day || false
      });
    } else {
      setEditingSchedule(null);
      const selectedDateStr = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        start_date: selectedDateStr,
        end_date: selectedDateStr,
        start_time: '09:00',
        end_time: '10:00',
        type: 'personal',
        category: 'meeting',
        location: '',
        is_all_day: false
      });
    }
    setSelectedDate(date);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setSelectedDate(null);
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      start_time: '09:00',
      end_time: '10:00',
      type: 'personal',
      category: 'meeting',
      location: '',
      is_all_day: false
    });
  };

  // 폼 데이터 변경 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 일정 저장
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      alert('시작일과 종료일을 입력해주세요.');
      return;
    }

    try {
      const newSchedule = {
        id: editingSchedule ? editingSchedule.id : Date.now(),
        ...formData,
        created_at: new Date().toISOString()
      };

      if (editingSchedule) {
        // 수정
        setSchedules(prev => prev.map(schedule => 
          schedule.id === editingSchedule.id ? newSchedule : schedule
        ));
        alert('일정이 수정되었습니다.');
      } else {
        // 새로 추가
        setSchedules(prev => [...prev, newSchedule]);
        alert('일정이 등록되었습니다.');
      }
      
      closeModal();
    } catch (err) {
      console.error('일정 저장 실패:', err);
      alert('일정 저장에 실패했습니다.');
    }
  };

  // 일정 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      alert('일정이 삭제되었습니다.');
      if (viewingSchedule && viewingSchedule.id === id) {
        setViewingSchedule(null);
      }
    } catch (err) {
      console.error('일정 삭제 실패:', err);
      alert('일정 삭제에 실패했습니다.');
    }
  };

  // 상세보기 모달
  const openViewModal = (schedule) => {
    setViewingSchedule(schedule);
  };

  const closeViewModal = () => {
    setViewingSchedule(null);
  };

  // 카테고리별 색상
  const getCategoryColor = (category) => {
    const colors = {
      meeting: 'bg-blue-500',
      event: 'bg-green-500',
      deadline: 'bg-red-500',
      personal: 'bg-purple-500',
      holiday: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      meeting: 'text-blue-700',
      event: 'text-green-700',
      deadline: 'text-red-700',
      personal: 'text-purple-700',
      holiday: 'text-yellow-700',
      other: 'text-gray-700'
    };
    return colors[category] || colors.other;
  };

  const getCategoryBgColor = (category) => {
    const colors = {
      meeting: 'bg-blue-50 border-blue-200',
      event: 'bg-green-50 border-green-200',
      deadline: 'bg-red-50 border-red-200',
      personal: 'bg-purple-50 border-purple-200',
      holiday: 'bg-yellow-50 border-yellow-200',
      other: 'bg-gray-50 border-gray-200'
    };
    return colors[category] || colors.other;
  };

  const getCategoryName = (category) => {
    const names = {
      meeting: '회의',
      event: '행사',
      deadline: '마감일',
      personal: '개인',
      holiday: '휴일',
      other: '기타'
    };
    return names[category] || '기타';
  };

  const calendarDays = getDaysInMonth(currentDate);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">일정 관리</h1>
          <p className="text-gray-600">개인 및 공용 일정을 관리하세요</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* 보기 모드 선택 */}
          <div className="flex bg-white rounded-lg border shadow-sm">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              월
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              주
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              일
            </button>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새 일정
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* 캘린더 컨테이너 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 달력 헤더 */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">{formatDate(currentDate)}</h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors font-medium"
          >
            오늘
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((day, index) => (
            <div key={day} className={`p-4 text-center font-semibold ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}>
              <div className="text-sm">{day}</div>
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[140px] p-3 border-r border-b cursor-pointer hover:bg-blue-50 transition-colors relative ${
                !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
              } ${isToday(day.date) ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}
              onClick={() => openModal(null, day.date)}
            >
              {/* 날짜 표시 */}
              <div className={`text-lg font-semibold mb-2 ${
                !day.isCurrentMonth ? 'text-gray-400' : 
                isToday(day.date) ? 'text-blue-600' :
                day.date.getDay() === 0 ? 'text-red-600' :
                day.date.getDay() === 6 ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* 오늘 표시 */}
              {isToday(day.date) && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
              
              {/* 일정 표시 */}
              <div className="space-y-1">
                {day.schedules.slice(0, 3).map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`text-xs p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${getCategoryBgColor(schedule.category)} ${getCategoryTextColor(schedule.category)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewModal(schedule);
                    }}
                    title={`${schedule.title} ${schedule.location ? '• ' + schedule.location : ''}`}
                  >
                    <div className="font-medium truncate">
                      {!schedule.is_all_day && schedule.start_time && (
                        <span className="text-xs opacity-75 mr-1">
                          {schedule.start_time.slice(0, 5)}
                        </span>
                      )}
                      {schedule.title}
                    </div>
                    {schedule.location && (
                      <div className="text-xs opacity-75 truncate">
                        📍 {schedule.location}
                      </div>
                    )}
                  </div>
                ))}
                {day.schedules.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1 bg-gray-100 rounded">
                    +{day.schedules.length - 3}개 더
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 일정 요약 카드 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 오늘의 일정 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">오늘의 일정</h3>
            <div className="text-2xl">📅</div>
          </div>
          {schedules.filter(schedule => {
            const today = new Date().toISOString().split('T')[0];
            return schedule.start_date === today;
          }).length === 0 ? (
            <p className="text-gray-500 text-center py-4">오늘 예정된 일정이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {schedules.filter(schedule => {
                const today = new Date().toISOString().split('T')[0];
                return schedule.start_date === today;
              }).map((schedule) => (
                <div key={schedule.id} className={`p-3 rounded-lg border ${getCategoryBgColor(schedule.category)}`}>
                  <div className={`font-medium ${getCategoryTextColor(schedule.category)}`}>
                    {schedule.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {schedule.is_all_day ? '종일' : `${schedule.start_time?.slice(0, 5)} - ${schedule.end_time?.slice(0, 5)}`}
                    {schedule.location && ` • ${schedule.location}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 이번 주 일정 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">이번 주 일정</h3>
            <div className="text-2xl">📊</div>
          </div>
          <div className="space-y-2">
            {['meeting', 'event', 'deadline', 'personal'].map(category => {
              const count = schedules.filter(s => s.category === category).length;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                    <span className="text-sm text-gray-700">{getCategoryName(category)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}개</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">빠른 액션</h3>
            <div className="text-2xl">⚡</div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => openModal()}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 일정 추가
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              오늘로 이동
            </button>
          </div>
        </div>
      </div>

      {/* 일정 작성/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSchedule ? '일정 수정' : '새 일정 등록'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="일정 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일 *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일 *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="is_all_day"
                      checked={formData.is_all_day}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">종일 일정</span>
                  </label>
                </div>

                {!formData.is_all_day && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        시작 시간
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        종료 시간
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="meeting">회의</option>
                    <option value="event">행사</option>
                    <option value="deadline">마감일</option>
                    <option value="personal">개인</option>
                    <option value="holiday">휴일</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 범위
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="personal">개인</option>
                    <option value="public">공용</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    장소
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="장소를 입력하세요"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="일정에 대한 설명을 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingSchedule ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 일정 상세보기 모달 */}
      {viewingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">일정 상세보기</h2>
              <button 
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${getCategoryBgColor(viewingSchedule.category)}`}>
                <h3 className={`text-xl font-semibold flex items-center ${getCategoryTextColor(viewingSchedule.category)}`}>
                  <div className={`w-4 h-4 rounded-full mr-3 ${getCategoryColor(viewingSchedule.category)}`}></div>
                  {viewingSchedule.title}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  {getCategoryName(viewingSchedule.category)} • {viewingSchedule.type === 'public' ? '공용' : '개인'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">📅 날짜</div>
                    <div className="text-lg">
                      {viewingSchedule.start_date}
                      {viewingSchedule.start_date !== viewingSchedule.end_date && 
                        ` ~ ${viewingSchedule.end_date}`
                      }
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">⏰ 시간</div>
                    <div className="text-lg">
                      {viewingSchedule.is_all_day ? '종일' : 
                        `${viewingSchedule.start_time?.slice(0, 5)} - ${viewingSchedule.end_time?.slice(0, 5)}`
                      }
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {viewingSchedule.location && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">📍 장소</div>
                      <div className="text-lg">{viewingSchedule.location}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">🏷️ 카테고리</div>
                    <div className="text-lg">{getCategoryName(viewingSchedule.category)}</div>
                  </div>
                </div>
              </div>

              {viewingSchedule.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">📝 설명</div>
                  <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
                    {viewingSchedule.description}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  closeViewModal();
                  openModal(viewingSchedule);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                수정
              </button>
              <button
                onClick={() => {
                  closeViewModal();
                  handleDelete(viewingSchedule.id);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                삭제
              </button>
              <button
                onClick={closeViewModal}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;

