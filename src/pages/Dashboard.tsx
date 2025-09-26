"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play,
  CheckCircle,
  XCircle,
  StopCircle,
  AlertTriangle
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Badge } from "@/components/ui/badge";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";

interface Workstation {
  id: number;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'stopped' | 'paused';
  devices: number;
  availableProcesses: number;
  onlineDevices: number;
  logs: Array<{
    timestamp: number;
    content: string;
  }>;
  temperature: number;
  voltage: number;
  uptime: string;
  currentAgingProcess?: string;
  importantPoints: Array<{
    name: string;
    value: number | boolean;
    unit: string;
    normalRange: [number, number];
  }>;
}

// Mock data for workstations with logs
const mockWorkstations: Workstation[] = [
  { 
    id: 1, 
    name: "工位 A1", 
    status: "running", 
    devices: 2,
    availableProcesses: 2,
    onlineDevices: 2,
    logs: [
      { timestamp: 0, content: "工位启动成功" },
      { timestamp: 15, content: "设备连接正常" },
      { timestamp: 30, content: "开始执行高温老化流程 A" },
      { timestamp: 45, content: "温度达到设定值 65°C" },
      { timestamp: 60, content: "电压稳定在 220V" }
    ],
    temperature: 65.5,
    voltage: 220,
    uptime: "2h 15m",
    currentAgingProcess: "高温老化流程 A",
    importantPoints: [
      { name: "温度", value: 65.5, unit: "°C", normalRange: [60, 75] },
      { name: "电压", value: 220, unit: "V", normalRange: [210, 230] },
      { name: "电流", value: 2.3, unit: "A", normalRange: [2, 3] },
      { name: "运行状态", value: true, unit: "", normalRange: [1, 1] }
    ]
  },
  { 
    id: 2, 
    name: "工位 B2", 
    status: "passed", 
    devices: 2,
    availableProcesses: 1,
    onlineDevices: 2,
    logs: [
      { timestamp: 0, content: "工位启动成功" },
      { timestamp: 20, content: "所有设备在线" },
      { timestamp: 40, content: "开始执行标准老化流程 B" },
      { timestamp: 120, content: "老化测试完成，结果通过" },
      { timestamp: 180, content: "工位停止运行" }
    ],
    temperature: 70.2,
    voltage: 219,
    uptime: "4h 30m",
    currentAgingProcess: "标准老化流程 B",
    importantPoints: [
      { name: "温度", value: 70.2, unit: "°C", normalRange: [60, 75] },
      { name: "电压", value: 219, unit: "V", normalRange: [210, 230] },
      { name: "湿度", value: 45, unit: "%", normalRange: [30, 60] },
      { name: "运行状态", value: false, unit: "", normalRange: [1, 1] }
    ]
  },
  { 
    id: 3, 
    name: "工位 C3", 
    status: "failed", 
    devices: 1,
    availableProcesses: 0,
    onlineDevices: 0,
    logs: [
      { timestamp: 0, content: "工位启动成功" },
      { timestamp: 10, content: "检测到设备离线" },
      { timestamp: 25, content: "无法启动快速老化流程 C" },
      { timestamp: 30, content: "老化测试失败 - 设备连接异常" },
      { timestamp: 35, content: "工位进入失败状态" }
    ],
    temperature: 58.1,
    voltage: 210,
    uptime: "1h 20m",
    currentAgingProcess: "快速老化流程 C",
    importantPoints: [
      { name: "温度", value: 58.1, unit: "°C", normalRange: [60, 75] },
      { name: "电压", value: 210, unit: "V", normalRange: [210, 230] },
      { name: "压力", value: 1.2, unit: "bar", normalRange: [1, 2] },
      { name: "运行状态", value: true, unit: "", normalRange: [1, 1] }
    ]
  },
  { 
    id: 4, 
    name: "工位 D4", 
    status: "stopped", 
    devices: 3,
    availableProcesses: 1,
    onlineDevices: 2,
    logs: [
      { timestamp: 0, content: "工位初始化完成" },
      { timestamp: 5, content: "部分设备离线" },
      { timestamp: 10, content: "等待设备连接" },
      { timestamp: 15, content: "工位处于待机状态" }
    ],
    temperature: 25.0,
    voltage: 220,
    uptime: "0h 0m",
    currentAgingProcess: undefined,
    importantPoints: [
      { name: "温度", value: 25.0, unit: "°C", normalRange: [60, 75] },
      { name: "电压", value: 220, unit: "V", normalRange: [210, 230] },
      { name: "风扇转速", value: 0, unit: "RPM", normalRange: [1000, 3000] },
      { name: "运行状态", value: false, unit: "", normalRange: [1, 1] }
    ]
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
    default: return <StopCircle className="h-4 w-4" />;
  }
};

const Dashboard = () => {
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);
  
  // Calculate status counts
  const runningCount = mockWorkstations.filter(ws => ws.status === 'running').length;
  const passedCount = mockWorkstations.filter(ws => ws.status === 'passed').length;
  const failedCount = mockWorkstations.filter(ws => ws.status === 'failed').length;
  const stoppedCount = mockWorkstations.filter(ws => ws.status === 'stopped').length;

  const handleViewDetails = (workstation: Workstation) => {
    setSelectedWorkstation(workstation);
  };

  const handleCloseDetails = () => {
    setSelectedWorkstation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">老化管理系统 - 仪表盘</h1>
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm">系统运行正常</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">运行中</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runningCount}</div>
              <p className="text-xs text-muted-foreground">工位正在运行</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedCount}</div>
              <p className="text-xs text-muted-foreground">工位老化通过</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">失败</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedCount}</div>
              <p className="text-xs text-muted-foreground">工位老化失败</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已停止</CardTitle>
              <StopCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stoppedCount}</div>
              <p className="text-xs text-muted-foreground">工位已停止</p>
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
                    <div className="flex flex-col">
                      <span className="font-medium">{workstation.name}</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        最新日志: {workstation.logs.length > 0 ? 
                          `${workstation.logs[workstation.logs.length - 1].timestamp}s: ${workstation.logs[workstation.logs.length - 1].content}` 
                          : '无日志'}
                      </div>
                    </div>
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
                    <Button 
                      size="sm" 
                      onClick={() => handleViewDetails(workstation)}
                    >
                      详情
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedWorkstation && (
        <WorkstationDetailView 
          workstation={selectedWorkstation} 
          onClose={handleCloseDetails} 
        />
      )}
      
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;