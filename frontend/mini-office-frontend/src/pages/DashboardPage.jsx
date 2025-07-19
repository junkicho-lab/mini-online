import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Bell,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    unreadNotifications: 0,
    todaySchedules: 0,
    recentAnnouncements: 1,
    totalUsers: 6
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'announcement',
      title: '새로운 공지사항이 등록되었습니다',
      time: '2시간 전',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'schedule',
      title: '내일 교직원 회의 일정이 추가되었습니다',
      time: '4시간 전',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'user',
      title: '새로운 사용자가 등록되었습니다',
      time: '1일 전',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'document',
      title: '문서 3개가 업로드되었습니다',
      time: '2일 전',
      icon: FileText,
      color: 'text-orange-600'
    }
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      title: '새 공지사항 작성',
      description: '학교 공지사항을 작성하고 게시하세요',
      icon: FileText,
      color: 'bg-blue-500',
      path: '/announcements'
    },
    {
      id: 2,
      title: '일정 등록',
      description: '새로운 일정을 캘린더에 추가하세요',
      icon: Calendar,
      color: 'bg-green-500',
      path: '/schedules'
    },
    {
      id: 3,
      title: '문서 업로드',
      description: '중요한 문서를 업로드하고 관리하세요',
      icon: Plus,
      color: 'bg-purple-500',
      path: '/documents'
    },
    {
      id: 4,
      title: '사용자 관리',
      description: '시스템 사용자를 관리하고 권한을 설정하세요',
      icon: Users,
      color: 'bg-orange-500',
      path: '/users'
    }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% 지난 주 대비
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ action }) => {
    const Icon = action.icon;
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${action.color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, {user?.name || '시스템 관리자'}님! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              오늘도 좋은 하루 되세요. 미니 온라인 교무실이 도움을 드리겠습니다.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">오늘</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="읽지 않은 알림"
          value={stats.unreadNotifications}
          icon={Bell}
          color="bg-red-500"
          change={-12}
        />
        <StatCard
          title="오늘의 일정"
          value={stats.todaySchedules}
          icon={Calendar}
          color="bg-blue-500"
          change={5}
        />
        <StatCard
          title="최근 공지사항"
          value={stats.recentAnnouncements}
          icon={FileText}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="전체 사용자"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
          change={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                최근 활동
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                모두 보기
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              시스템 상태
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">서버 상태</span>
                </div>
                <span className="text-sm text-green-600 font-medium">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">데이터베이스</span>
                </div>
                <span className="text-sm text-green-600 font-medium">연결됨</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">백업 상태</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">대기 중</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">보안 상태</span>
                </div>
                <span className="text-sm text-green-600 font-medium">안전</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            빠른 액션
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

