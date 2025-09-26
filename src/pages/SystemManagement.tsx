"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff,
  Check,
  X,
  Lock
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer' | 'operator' | 'maintainer';
  canChangePassword: boolean;
}

const SystemManagement = () => {
  // Mock current user - in a real app this would come from auth context
  const currentUserRole = 'admin'; // This would be dynamic in a real app
  
  const [users] = useState<User[]>([
    { id: '1', username: 'admin', role: 'admin', canChangePassword: false }, // Admin password cannot be changed
    { id: '2', username: 'viewer', role: 'viewer', canChangePassword: true },
    { id: '3', username: 'operator', role: 'operator', canChangePassword: true },
    { id: '4', username: 'maintainer', role: 'maintainer', canChangePassword: true }
  ]);

  const [passwords, setPasswords] = useState<Record<string, { password: string; confirmPassword: string; showPassword: boolean }>>({
    '2': { password: '', confirmPassword: '', showPassword: false },
    '3': { password: '', confirmPassword: '', showPassword: false },
    '4': { password: '', confirmPassword: '', showPassword: false }
  });

  const togglePasswordVisibility = (userId: string) => {
    setPasswords(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        showPassword: !prev[userId].showPassword
      }
    }));
  };

  const handlePasswordChange = (userId: string, field: 'password' | 'confirmPassword', value: string) => {
    setPasswords(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleSavePassword = (user: User) => {
    // Only admin can change passwords
    if (currentUserRole !== 'admin') {
      showError('只有管理员可以修改密码');
      return;
    }

    // Admin password cannot be changed
    if (user.role === 'admin') {
      showError('管理员密码由系统维护，不可修改');
      return;
    }

    const userPassword = passwords[user.id];
    
    // Validate password
    if (!userPassword.password) {
      showError('请输入新密码');
      return;
    }
    
    if (userPassword.password.length < 6) {
      showError('密码长度至少6位');
      return;
    }
    
    if (userPassword.password !== userPassword.confirmPassword) {
      showError('两次输入的密码不一致');
      return;
    }
    
    // In a real app, this would call an API to update the password
    console.log(`Updating password for user: ${user.username}`);
    
    // Reset password fields after successful save
    setPasswords(prev => ({
      ...prev,
      [user.id]: { password: '', confirmPassword: '', showPassword: false }
    }));
    
    showSuccess(`用户 ${user.username} 的密码修改成功`);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'viewer': return '查看员';
      case 'operator': return '操作员';
      case 'maintainer': return '维护员';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">系统管理</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>用户密码管理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-lg">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleDisplayName(user.role)}</p>
                    </div>
                    {user.role !== 'admin' && currentUserRole === 'admin' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        可修改
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        系统维护
                      </span>
                    )}
                  </div>
                  
                  {user.role === 'admin' ? (
                    <div className="text-sm text-muted-foreground">
                      <p>管理员密码由系统维护，不可通过界面修改</p>
                    </div>
                  ) : currentUserRole === 'admin' ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`password-${user.id}`}>新密码</Label>
                        <div className="relative">
                          <Input
                            id={`password-${user.id}`}
                            type={passwords[user.id]?.showPassword ? "text" : "password"}
                            value={passwords[user.id]?.password || ''}
                            onChange={(e) => handlePasswordChange(user.id, 'password', e.target.value)}
                            placeholder="输入新密码"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            onClick={() => togglePasswordVisibility(user.id)}
                          >
                            {passwords[user.id]?.showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`confirm-password-${user.id}`}>确认新密码</Label>
                        <div className="relative">
                          <Input
                            id={`confirm-password-${user.id}`}
                            type={passwords[user.id]?.showPassword ? "text" : "password"}
                            value={passwords[user.id]?.confirmPassword || ''}
                            onChange={(e) => handlePasswordChange(user.id, 'confirmPassword', e.target.value)}
                            placeholder="再次输入新密码"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            onClick={() => togglePasswordVisibility(user.id)}
                          >
                            {passwords[user.id]?.showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => handleSavePassword(user)}
                          disabled={!passwords[user.id]?.password}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          保存密码
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p>只有管理员可以修改密码</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default SystemManagement;