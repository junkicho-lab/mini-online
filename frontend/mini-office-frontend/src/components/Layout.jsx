import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {
  Home,
  FileText,
  Calendar,
  Upload,
  Bell,
  Users,
  Settings,
  LogOut,
  Menu,
  School,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: '공지사항',
      href: '/announcements',
      icon: FileText,
      current: location.pathname.startsWith('/announcements')
    },
    {
      name: '일정 관리',
      href: '/schedules',
      icon: Calendar,
      current: location.pathname.startsWith('/schedules')
    },
    {
      name: '문서 관리',
      href: '/documents',
      icon: Upload,
      current: location.pathname.startsWith('/documents')
    },
    {
      name: '알림',
      href: '/notifications',
      icon: Bell,
      current: location.pathname.startsWith('/notifications')
    },
  ];

  // 관리자 전용 메뉴
  if (isAdmin()) {
    navigationItems.push({
      name: '사용자 관리',
      href: '/users',
      icon: Users,
      current: location.pathname.startsWith('/users')
    });
  }

  const NavLink = ({ item, mobile = false }) => {
    const Icon = item.icon;
    const baseClasses = mobile
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
    
    const activeClasses = item.current
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

    return (
      <Link
        to={item.href}
        className={`${baseClasses} ${activeClasses}`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* 모바일 메뉴 버튼 */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center gap-2 mb-6">
                <School className="h-6 w-6 text-primary" />
                <span className="font-bold">미니 온라인 교무실</span>
              </div>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink key={item.name} item={item} mobile />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* 로고 */}
          <div className="flex items-center gap-2 mr-6">
            <School className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:block">미니 온라인 교무실</span>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* 사용자 메뉴 */}
          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{user?.name}</span>
                  {isAdmin() && (
                    <Badge variant="secondary" className="hidden sm:block">관리자</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  프로필 설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;

