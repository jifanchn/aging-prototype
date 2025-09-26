"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Play,
  StopCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";

// Mock data for workstations with full details
const mockWorkstations = [
  { 
    id: 1, 
    name: "工位 A1", 
    status: "running", 
    devices: 2,
    availableProcesses: 2,
    onlineDevices: 2,
    onlineDevicesDetails: [
      { ip: "192.168.1.101", name: "温度传感器 A1", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" },
      { ip: "192.168.1.102", name: "电压监测器 B2", deviceType: "电压监测器", port: 502, protocol: "modbus-tcp" }
    ],
    currentAgingProcess: "高温老化流程 A",
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
    onlineDevicesDetails: [
      { ip: "192.168.1.103", name: "温度传感器 C3", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" },
      { ip: "192.168.1.104", name: "电压监测器 D4", deviceType: "电压监测器", port: 502, protocol: "modbus-tcp" },
      { ip: "192.168.1.105", name: "湿度传感器 E5", deviceType: "湿度传感器", port: 502, protocol: "modbus-tcp" }
    ],
    currentAgingProcess: "标准老化流程 B",
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
    onlineDevicesDetails: [],
    currentAgingProcess: "快速老化流程 C",
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
    onlineDevicesDetails: [
      { ip: "192.168.1.106", name: "温度传感器 F6", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" }
    ],
    currentAgingProcess: undefined,
    logs: [
      { timestamp: 0, content: "工位初始化完成" },
      { timestamp: 5, content: "部分设备离线" },
      { timestamp: 10, content: "等待设备连接" },
      { timestamp: 15, content: "工位处于待机状态" }
    ],
    temperature: 25.0,
    voltage: 220,
    uptime: "0h 0m",
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

const OperatorDashboard = () => {
  const [selectedWorkstation, setSelectedWorkstation] = useState<any>(null);
  
  // 统计工位状态
  const runningCount = mockWorkstations.filter(ws => ws.status === 'running').length;
  const passedCount = mockWorkstations.filter(ws => ws.status === 'passed').length;
  const failedCount = mockWorkstations.filter(ws => ws.status === 'failed').length;
  const stoppedCount = mockWorkstations.filter(ws => ws.status === 'stopped').length;
  
  const handleViewDetails = (workstation: any) => {
    setSelectedWorkstation(workstation);
  };

  const handleCloseDetails = () => {
    setSelectedWorkstation(null);
  };
  
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">工作中</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runningCount}</div>
              <p className="text-xs text-muted-foreground">正在运行的工位</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成功</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedCount}</div>
              <p className="text-xs text-muted-foreground">老化完成的工位</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">失败</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failedCount}</div>
              <p className="text-xs text-muted-foreground">老化失败的工位</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">工位总数</CardTitle>
              <Monitor className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWorkstations.length}</div>
              <p className="text-xs text-muted-foreground">所有工位</p>
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
                <div key={workstation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(workstation.status)}`}></div>
                    <span className="font-medium">{workstation.name}</span>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {workstation.onlineDevices}/{workstation.devices} 设备在线
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {workstation.availableProcesses} 流程可用
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(workstation.status)}
                    <Button 
                      size="sm" 
                      variant="outline"
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
    </>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <OperatorDashboard />
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;