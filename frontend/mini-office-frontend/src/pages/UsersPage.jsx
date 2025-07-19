import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, view
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // 더미 데이터
  const dummyUsers = [
    {
      id: 1,
      name: '김관리자',
      email: 'admin@school.edu',
      phone: '010-1234-5678',
      role: 'admin',
      status: 'active',
      department: '교무실',
      position: '시스템 관리자',
      joinDate: '2023-01-15',
      lastLogin: '2025-07-19 08:30',
      permissions: ['all']
    },
    {
      id: 2,
      name: '박부장',
      email: 'manager@school.edu',
      phone: '010-2345-6789',
      role: 'manager',
      status: 'active',
      department: '교무부',
      position: '교무부장',
      joinDate: '2023-03-20',
      lastLogin: '2025-07-19 07:45',
      permissions: ['announcements', 'schedules', 'documents', 'users_view']
    },
    {
      id: 3,
      name: '이선생',
      email: 'teacher1@school.edu',
      phone: '010-3456-7890',
      role: 'user',
      status: 'active',
      department: '국어과',
      position: '교사',
      joinDate: '2023-09-01',
      lastLogin: '2025-07-18 16:20',
      permissions: ['announcements_view', 'schedules', 'documents_view']
    },
    {
      id: 4,
      name: '최교사',
      email: 'teacher2@school.edu',
      phone: '010-4567-8901',
      role: 'user',
      status: 'inactive',
      department: '수학과',
      position: '교사',
      joinDate: '2024-02-15',
      lastLogin: '2025-07-15 14:30',
      permissions: ['announcements_view', 'schedules', 'documents_view']
    },
    {
      id: 5,
      name: '정부장',
      email: 'manager2@school.edu',
      phone: '010-5678-9012',
      role: 'manager',
      status: 'active',
      department: '학생부',
      position: '학생부장',
      joinDate: '2023-06-10',
      lastLogin: '2025-07-19 09:15',
      permissions: ['announcements', 'schedules', 'documents', 'users_view']
    },
    {
      id: 6,
      name: '한선생',
      email: 'teacher3@school.edu',
      phone: '010-6789-0123',
      role: 'user',
      status: 'active',
      department: '영어과',
      position: '교사',
      joinDate: '2024-03-01',
      lastLogin: '2025-07-19 08:00',
      permissions: ['announcements_view', 'schedules', 'documents_view']
    }
  ];

  // 권한 정의
  const rolePermissions = {
    admin: {
      name: '관리자',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: ShieldCheck,
      permissions: [
        'announcements_full', 'schedules_full', 'documents_full', 
        'notifications_full', 'users_full', 'system_settings'
      ],
      description: '모든 기능에 대한 완전한 권한'
    },
    manager: {
      name: '부장',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: Shield,
      permissions: [
        'announcements_full', 'schedules_full', 'documents_full',
        'notifications_manage', 'users_view'
      ],
      description: '대부분 기능의 관리 권한'
    },
    user: {
      name: '일반',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: User,
      permissions: [
        'announcements_view', 'schedules_personal', 'documents_view',
        'notifications_view'
      ],
      description: '기본적인 조회 및 개인 관리 권한'
    }
  };

  // 권한 상세 설명
  const permissionDetails = {
    announcements_full: '공지사항 전체 관리 (작성, 수정, 삭제)',
    announcements_view: '공지사항 조회만 가능',
    schedules_full: '모든 일정 관리 (개인/공용)',
    schedules_personal: '개인 일정만 관리 가능',
    documents_full: '문서 전체 관리 (업로드, 다운로드, 삭제)',
    documents_view: '문서 조회 및 다운로드만 가능',
    notifications_full: '알림 전체 관리',
    notifications_manage: '알림 발송 및 관리',
    notifications_view: '알림 조회만 가능',
    users_full: '사용자 전체 관리 (생성, 수정, 삭제, 권한 변경)',
    users_view: '사용자 조회만 가능',
    system_settings: '시스템 설정 관리'
  };

  useEffect(() => {
    // 더미 데이터 로드 시뮬레이션
    setTimeout(() => {
      setUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 모달 열기
  const openModal = (type, user = null) => {
    setModalType(type);
    setCurrentUser(user || {
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      department: '',
      position: '',
      password: ''
    });
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setShowPassword(false);
  };

  // 사용자 저장
  const handleSaveUser = () => {
    if (modalType === 'create') {
      const newUser = {
        ...currentUser,
        id: users.length + 1,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: '-',
        permissions: rolePermissions[currentUser.role].permissions
      };
      setUsers([...users, newUser]);
    } else if (modalType === 'edit') {
      setUsers(users.map(user => 
        user.id === currentUser.id 
          ? { ...currentUser, permissions: rolePermissions[currentUser.role].permissions }
          : user
      ));
    }
    closeModal();
  };

  // 사용자 삭제
  const handleDeleteUser = (userId) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // 사용자 상태 변경
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  // 선택된 사용자 관리
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  // 일괄 작업
  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' }
            : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'inactive' }
            : user
        ));
        break;
      case 'delete':
        if (window.confirm(`선택된 ${selectedUsers.length}명의 사용자를 삭제하시겠습니까?`)) {
          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
            <p className="text-gray-600">시스템 사용자를 관리하고 권한을 설정하세요</p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">관리자</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">부장</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'manager').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="이름, 이메일, 부서로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 권한</option>
            <option value="admin">관리자</option>
            <option value="manager">부장</option>
            <option value="user">일반</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              새 사용자 추가
            </button>
            
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length}명 선택됨
                </span>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  활성화
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  비활성화
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            총 {filteredUsers.length}명의 사용자
          </div>
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">사용자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">권한</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">부서/직책</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">최근 로그인</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = rolePermissions[user.role].icon;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${rolePermissions[user.role].color}`}>
                        <RoleIcon className="h-4 w-4" />
                        {rolePermissions[user.role].name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.department}</p>
                        <p className="text-sm text-gray-600">{user.position}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            활성
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            비활성
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{user.lastLogin}</p>
                      <p className="text-xs text-gray-500">가입: {user.joinDate}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('view', user)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="상세보기"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', user)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">검색 조건에 맞는 사용자가 없습니다</p>
            <p className="text-sm text-gray-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === 'create' && '새 사용자 추가'}
                  {modalType === 'edit' && '사용자 정보 수정'}
                  {modalType === 'view' && '사용자 상세 정보'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalType === 'view' ? (
                // 상세보기 모드
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{currentUser.name}</h3>
                      <p className="text-gray-600">{currentUser.email}</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mt-2 ${rolePermissions[currentUser.role].color}`}>
                        {React.createElement(rolePermissions[currentUser.role].icon, { className: "h-4 w-4" })}
                        {rolePermissions[currentUser.role].name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">기본 정보</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{currentUser.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{currentUser.department} / {currentUser.position}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">가입일: {currentUser.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">최근 로그인: {currentUser.lastLogin}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">권한 정보</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 mb-3">
                          {rolePermissions[currentUser.role].description}
                        </p>
                        <div className="space-y-2">
                          {rolePermissions[currentUser.role].permissions.map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700">
                                {permissionDetails[permission]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // 생성/수정 모드
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentUser.name}
                        onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        전화번호
                      </label>
                      <input
                        type="tel"
                        value={currentUser.phone}
                        onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        권한 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentUser.role}
                        onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="user">일반</option>
                        <option value="manager">부장</option>
                        <option value="admin">관리자</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        부서
                      </label>
                      <input
                        type="text"
                        value={currentUser.department}
                        onChange={(e) => setCurrentUser({...currentUser, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        직책
                      </label>
                      <input
                        type="text"
                        value={currentUser.position}
                        onChange={(e) => setCurrentUser({...currentUser, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {modalType === 'create' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentUser.password || ''}
                            onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상태
                      </label>
                      <select
                        value={currentUser.status}
                        onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                    </div>
                  </div>

                  {/* 권한 미리보기 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      선택된 권한: {rolePermissions[currentUser.role].name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {rolePermissions[currentUser.role].description}
                    </p>
                    <div className="space-y-2">
                      {rolePermissions[currentUser.role].permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {permissionDetails[permission]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {modalType !== 'view' && (
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalType === 'create' ? '추가' : '수정'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

