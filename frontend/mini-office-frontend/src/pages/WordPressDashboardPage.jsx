import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import {
  Bell,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';

const WordPressDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notifications: 0,
    schedules: 0,
    announcements: 0,
    users: 0
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [notificationsRes, schedulesRes, announcementsRes, usersRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/schedules'),
        api.get('/announcements'),
        api.get('/users')
      ]);

      setStats({
        notifications: notificationsRes.data.filter(n => !n.isRead).length,
        schedules: schedulesRes.data.filter(s => {
          const today = new Date().toDateString();
          return new Date(s.startDate).toDateString() === today;
        }).length,
        announcements: announcementsRes.data.length,
        users: usersRes.data.length
      });

      setRecentAnnouncements(announcementsRes.data.slice(0, 5));
      setTodaySchedules(schedulesRes.data.filter(s => {
        const today = new Date().toDateString();
        return new Date(s.startDate).toDateString() === today;
      }).slice(0, 5));
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition-all hover:border-blue-300 group"
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            안녕하세요, {user?.name || '시스템 관리자'}님! 👋
          </h1>
          <p className="text-blue-100">
            오늘도 좋은 하루 되세요. 미니 온라인 교무실이 도움을 드리겠습니다.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="읽지 않은 알림"
          value={stats.notifications}
          icon={Bell}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          title="오늘의 일정"
          value={stats.schedules}
          icon={Calendar}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="최근 공지사항"
          value={stats.announcements}
          icon={FileText}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="사용자 관리"
          value={stats.users}
          icon={Users}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Announcements */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                최근 공지사항
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                모두 보기
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        announcement.priority === 'high' ? 'bg-red-500' :
                        announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">최근 공지사항이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                오늘의 일정
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                모두 보기
              </button>
            </div>
          </div>
          <div className="p-6">
            {todaySchedules.length > 0 ? (
              <div className="space-y-4">
                {todaySchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Clock className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {schedule.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(schedule.startDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">오늘 예정된 일정이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            빠른 액션
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="새 공지사항 작성"
              description="중요한 공지사항을 작성하고 게시하세요"
              icon={FileText}
              color="bg-blue-500"
              onClick={() => window.location.href = '/announcements'}
            />
            <QuickActionCard
              title="일정 등록"
              description="새로운 일정을 등록하고 관리하세요"
              icon={Calendar}
              color="bg-green-500"
              onClick={() => window.location.href = '/schedules'}
            />
            <QuickActionCard
              title="문서 업로드"
              description="중요한 문서를 업로드하고 공유하세요"
              icon={FileText}
              color="bg-purple-500"
              onClick={() => window.location.href = '/documents'}
            />
            <QuickActionCard
              title="사용자 관리"
              description="사용자 계정을 관리하고 권한을 설정하세요"
              icon={Users}
              color="bg-orange-500"
              onClick={() => window.location.href = '/users'}
            />
            <QuickActionCard
              title="알림 확인"
              description="읽지 않은 알림을 확인하고 관리하세요"
              icon={Bell}
              color="bg-red-500"
              onClick={() => window.location.href = '/notifications'}
            />
            <QuickActionCard
              title="시스템 설정"
              description="시스템 설정을 변경하고 관리하세요"
              icon={Activity}
              color="bg-gray-500"
              onClick={() => alert('시스템 설정 기능은 준비 중입니다.')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressDashboardPage;

