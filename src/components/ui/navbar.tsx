import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Monitor,
  Settings,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "仪表盘", href: "/", icon: Home },
  { name: "工位管理", href: "/workstations", icon: Monitor },
  { name: "协议管理", href: "/protocols", icon: Settings },
  { name: "老化流程", href: "/aging-processes", icon: FileText },
  { name: "数据分析", href: "/analytics", icon: FileText },
  { name: "系统管理", href: "/system", icon: Users },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'viewer': return '查看员';
      case 'operator': return '操作员';
      case 'maintainer': return '维护员';
      default: return role;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl">
              老化测试系统
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user.username} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-muted-foreground">
                  {getRoleDisplayName(user.role)}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}