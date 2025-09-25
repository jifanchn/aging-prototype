"use client";

import React from 'react';
import { 
  Monitor, 
  Settings, 
  Cpu, 
  BarChart3,
  Users,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NavigationMenu = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: '仪表板', icon: Home, path: '/' },
    { name: '工位管理', icon: Monitor, path: '/workstations' },
    { name: '协议管理', icon: Cpu, path: '/protocols' },
    { name: '老化流程', icon: Settings, path: '/aging-processes' },
    { name: '数据分析', icon: BarChart3, path: '/analytics' },
    { name: '系统管理', icon: Users, path: '/system' },
  ];

  return (
    <nav className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => navigate(item.path)}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;