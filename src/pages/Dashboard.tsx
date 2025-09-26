"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play,
  CheckCircle,
  XCircle,
  StopCircle,
  Wifi,
  Link,
  AlertTriangle
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for workstations
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
    default: return <StopCircle className="h-4 w-4" />;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Calculate status counts
  const runningCount = mockWorkstations.filter(ws => ws.status === 'running').length;
  const passedCount = mockWorkstations.filter(ws => ws.status === 'passed').length;
  const failedCount = mockWorkstations.filter(ws => ws.status === 'failed').length;
  const stoppedCount = mockWorkstations.filter(ws => ws.status === 'stopped').length;

  const handleViewDetails = (workstationId: number) => {
    // Navigate to workstations page - the detail view will be handled by the WorkstationOverview component
    navigate('/workstations');
    // Note: In a real implementation, we would pass the workstation ID as a query parameter or state
    // and the WorkstationOverview component would open the detail view automatically
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
                    <Button 
                      size="sm" 
                      onClick={() => handleViewDetails(workstation.id)}
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
      
      <MadeWithDyad />
    </div>
  );
};

export default Dashboard;