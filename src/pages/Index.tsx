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
  Wifi,
  Link
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

// Mock data reflecting the correct relationships
const mockWorkstations = [
  { 
    id: 1, 
    name: "工位 A1", 
    status: "running", 
    devices: 2,
    availableProcesses: 2,
    onlineDevices: 2
  },
  { 
    id: 2, 
    name: "工位 B2", 
    status: "passed", 
    devices: 2,
    availableProcesses: 1,
    onlineDevices: 2
  },
  { 
    id: 3, 
    name: "工位 C3", 
    status: "failed", 
    devices: 1,
    availableProcesses: 0,
    onlineDevices: 0
  },
  { 
    id: 4, 
    name: "工位 D4", 
    status: "stopped", 
    devices: 3,
    availableProcesses: 1,
    onlineDevices: 2
  },
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
            <CardTitle className="text-sm font-medium">在线设备</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground">设备连接状态</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可用工位</CardTitle>
            <Link className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <p className="text-xs text-muted-foreground">满足设备要求</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">运行中流程</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">并行老化流程</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统健康</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">正常</div>
            <p className="text-xs text-muted-foreground">所有服务运行中</p>
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
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      {workstation.onlineDevices}/{workstation.devices} 设备在线
                    </Badge>
                    <Badge variant="outline">
                      {workstation.availableProcesses} 流程可用
                    </Badge>
                  </div>
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
          <CardTitle>设备-工位-老化关系管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wifi className="h-5 w-5 text-blue-500" />
                <span className="font-medium">设备配置</span>
              </div>
              <p className="text-sm text-muted-foreground">配置 Modbus/CAN 设备连接参数</p>
              <Button variant="outline" size="sm" className="mt-2">配置设备</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Link className="h-5 w-5 text-green-500" />
                <span className="font-medium">工位映射</span>
              </div>
              <p className="text-sm text-muted-foreground">将设备映射到工位</p>
              <Button variant="outline" size="sm" className="mt-2">管理映射</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-5 w-5 text-purple-500" />
                <span className="font-medium">老化配置</span>
              </div>
              <p className="text-sm text-muted-foreground">为工位配置老化流程</p>
              <Button variant="outline" size="sm" className="mt-2">配置流程</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>关系验证</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span>工位 A1 - 所有设备在线，2个流程可用</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span>工位 C3 - 设备离线，无法启动老化流程</span>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
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
              <h3 className="font-medium">设备总数</h3>
              <p className="text-2xl font-bold">10</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">工位总数</h3>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">老化流程</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>关系统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">设备-工位映射</h4>
              <p>8/10 设备已映射到工位</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">工位-老化映射</h4>
              <p>4/4 工位配置了老化流程</p>
            </div>
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
          <CardTitle>关系数据分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">设备-工位-老化关系图谱</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>配置有效性分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>• 工位 A1: 配置完整，运行正常</p>
            <p>• 工位 B2: 配置完整，运行正常</p>
            <p>• 工位 C3: 设备离线，配置无效</p>
            <p>• 工位 D4: 部分设备离线，流程受限</p>
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
        <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6">
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