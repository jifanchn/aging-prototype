"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Settings, 
  Users, 
  BarChart3,
  Play,
  StopCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PauseCircle,
  Home
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import NavigationMenu from "@/components/ui/navigation-menu";

// Mock data for demonstration
const mockWorkstations = [
  { id: 1, name: "工位 A1", status: "running", devices: 12 },
  { id: 2, name: "工位 B2", status: "passed", devices: 8 },
  { id: 3, name: "工位 C3", status: "failed", devices: 5 },
  { id: 4, name: "工位 D4", status: "stopped", devices: 15 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'bg-blue-500';
    case 'passed': return 'bg-green-500';
    case 'failed': return 'bg-red-500';
    case 'stopped': return 'bg-gray-500';
    default: return 'bg-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <Play className="h-4 w-4" />;
    case 'passed': return <CheckCircle className="h-4 w-4" />;
    case 'failed': return <XCircle className="h-4 w-4" />;
    case 'stopped': return <StopCircle className="h-4 w-4" />;
    default: return <PauseCircle className="h-4 w-4" />;
  }
};

const OperatorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运行中工位</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">老化通过</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">老化失败</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">-1 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">连接设备</CardTitle>
            <Monitor className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">out of 300</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>工位监控</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWorkstations.map((workstation) => (
              <div key={workstation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(workstation.status)}`}></div>
                  <span className="font-medium">{workstation.name}</span>
                  <Badge variant="secondary">{workstation.devices} devices</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(workstation.status)}
                  <Button size="sm">详情</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EngineerDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>设备配置管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-16">
              <Settings className="mr-2 h-4 w-4" />
              设备配置向导
            </Button>
            <Button className="h-16">
              <Monitor className="mr-2 h-4 w-4" />
              混合流程配置器
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>工位关系管理</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">管理工位 ↔ 老化配置 ↔ 设备的多层映射关系</p>
          <div className="mt-4">
            <Button>编辑关系</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>系统监控中心</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">CPU 使用率</h3>
              <p className="text-2xl font-bold">45%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">内存使用</h3>
              <p className="text-2xl font-bold">2.1 GB</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">活跃连接</h3>
              <p className="text-2xl font-bold">287/300</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>批量操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">批量导入工位</Button>
            <Button variant="outline">批量导入配置</Button>
            <Button variant="outline">批量导入设备</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AnalystDashboard = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>数据分析仪表板</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">图表展示区域</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>质量追溯</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>老化失败统计: 3次 (本周)</p>
            <p>平均老化时间: 4.2小时</p>
            <p>设备故障率: 1.2%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Index = () => {
  const [activeRole, setActiveRole] = useState('operator');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'operator': return <Monitor className="h-4 w-4" />;
      case 'engineer': return <Settings className="h-4 w-4" />;
      case 'admin': return <Users className="h-4 w-4" />;
      case 'analyst': return <BarChart3 className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const renderDashboard = () => {
    switch (activeRole) {
      case 'operator': return <OperatorDashboard />;
      case 'engineer': return <EngineerDashboard />;
      case 'admin': return <AdminDashboard />;
      case 'analyst': return <AnalystDashboard />;
      default: return <OperatorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">老化管理系统</h1>
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm">系统运行正常</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <NavigationMenu />
        
        <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6 mt-4">
          <TabsList>
            <TabsTrigger value="operator" className="flex items-center space-x-2">
              {getRoleIcon('operator')}
              <span>操作员</span>
            </TabsTrigger>
            <TabsTrigger value="engineer" className="flex items-center space-x-2">
              {getRoleIcon('engineer')}
              <span>工程师</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              {getRoleIcon('admin')}
              <span>管理员</span>
            </TabsTrigger>
            <TabsTrigger value="analyst" className="flex items-center space-x-2">
              {getRoleIcon('analyst')}
              <span>分析师</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {renderDashboard()}
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;