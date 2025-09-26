"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">FlexAge</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link 
              to="/workstations" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/workstations") ? "text-primary" : "text-muted-foreground"
              )}
            >
              工位管理
            </Link>
            <Link 
              to="/protocols" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/protocols") ? "text-primary" : "text-muted-foreground"
              )}
            >
              协议通信
            </Link>
            <Link 
              to="/aging-processes" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/aging-processes") ? "text-primary" : "text-muted-foreground"
              )}
            >
              老化流程
            </Link>
            <Link 
              to="/analytics" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/analytics") ? "text-primary" : "text-muted-foreground"
              )}
            >
              数据分析
            </Link>
            <Link 
              to="/system" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/system") ? "text-primary" : "text-muted-foreground"
              )}
            >
              系统管理
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;