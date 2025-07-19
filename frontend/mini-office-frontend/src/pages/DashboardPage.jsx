import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Bell, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { announcementAPI, scheduleAPI, notificationAPI } from '../lib/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    recentAnnouncements: [],
    todaySchedules: [],
    unreadNotifications: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [announcementsRes, schedulesRes, notificationsRes] = await Promise.all([
          announcementAPI.getRecentAnnouncements(5),
          scheduleAPI.getTodaySchedules(),
          notificationAPI.getUnreadCount()
        ]);

        setDashboardData({
          recentAnnouncements: announcementsRes.data.announcements || [],
          todaySchedules: schedulesRes.data.schedules || [],
          unreadNotifications: notificationsRes.data.unreadCount || 0,
          loading: false
        });
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM 형식으로 변환
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          안녕하세요, {user?.name}님! 👋
        </h1>
        <p className="text-blue-100">
          오늘도 좋은 하루 되세요. 미니 온라인 교무실에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">읽지 않은 알림</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              새로운 알림이 있습니다
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘의 일정</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.todaySchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              오늘 예정된 일정
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 공지사항</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recentAnnouncements.length}</div>
            <p className="text-xs text-muted-foreground">
              최근 게시된 공지사항
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용자 권한</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.isAdmin ? '관리자' : '일반'}
            </div>
            <p className="text-xs text-muted-foreground">
              현재 계정 권한
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 공지사항 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              최근 공지사항
            </CardTitle>
            <CardDescription>
              최근에 게시된 공지사항을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        {announcement.is_important && (
                          <Badge variant="destructive" className="text-xs">중요</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {announcement.author?.name} • {formatDate(announcement.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>최근 공지사항이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 오늘의 일정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              오늘의 일정
            </CardTitle>
            <CardDescription>
              오늘 예정된 일정을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.todaySchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{schedule.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {schedule.start_time && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(schedule.start_time)}
                            {schedule.end_time && ` - ${formatTime(schedule.end_time)}`}
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {schedule.schedule_type}
                        </Badge>
                      </div>
                      {schedule.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {schedule.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>오늘 예정된 일정이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
          <CardDescription>
            자주 사용하는 기능에 빠르게 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">공지사항</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">일정 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">문서 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span className="text-sm">알림</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

