import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  FileText,
  Calendar,
  FolderOpen,
  Bell,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User
} from 'lucide-react';

const WordPressLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: Home, path: '/dashboard' },
    { id: 'announcements', label: '공지사항', icon: FileText, path: '/announcements' },
    { id: 'schedules', label: '일정 관리', icon: Calendar, path: '/schedules' },
    { id: 'documents', label: '문서 관리', icon: FolderOpen, path: '/documents' },
    { id: 'notifications', label: '알림', icon: Bell, path: '/notifications' },
    { id: 'users', label: '사용자 관리', icon: Users, path: '/users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Bar */}
      <div className="bg-gray-900 text-white h-8 flex items-center justify-between px-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span>미니 온라인 교무실</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">0</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">새로 추가</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">안녕하세요, {user?.name || 'admin'}님</span>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                    active ? 'bg-blue-600 border-r-4 border-blue-400' : ''
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isSidebarOpen && (
                    <span className="ml-3 text-sm">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {isSidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || '시스템 관리자'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.role || '관리자'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {menuItems.find(item => isActive(item.path))?.label || '대시보드'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Screen Options */}
                <div className="relative">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                    <span>화면 옵션</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
                
                {/* Help */}
                <div className="relative">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                    <span>도움말</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressLayout;

