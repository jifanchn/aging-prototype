"use client";

import React from 'react';
import { 
  Monitor, 
  Settings, 
  Cpu, 
  BarChart3,
  Users,
  Home,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: '仪表板', icon: Home, path: '/' },
    { name: '工位管理', icon: Monitor, path: '/workstations' },
    { name: '协议管理', icon: Cpu, path: '/protocols' },
    { name: '老化流程', icon: Settings, path: '/aging-processes' },
    { name: '数据分析', icon: BarChart3, path: '/analytics' },
    { name: '系统管理', icon: Users, path: '/system' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Button 
              variant="ghost" 
              className="text-xl font-bold"
              onClick={() => navigate('/')}
            >
              老化管理系统
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>系统运行正常</span>
              </div>
            </div>
            
            {/* Mobile menu dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={isActive(item.path) ? "bg-accent" : ""}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;