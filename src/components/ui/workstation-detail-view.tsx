"use client";

import React, { useState } from 'react';
import { 
  X,
  Play,
  CheckCircle,
  XCircle,
  StopCircle,
  PauseCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Workstation {
  id: number;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'stopped' | 'paused';
  onlineDevices: Array<{
    ip: string;
    name: string;
    deviceType: string;
    port: number;
    protocol: string;
  }>;
  currentAgingProcess?: string;
  logs: Array<{
    timestamp: number;
    content: string;
  }>;
  temperature: number;
  voltage: number;
  uptime: string;
  importantPoints: Array<{
    name: string;
    value: number | boolean;
    unit: string;
    normalRange: [number, number];
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'bg-blue-500';
    case 'passed': return 'bg-green-500';
    case 'failed': return 'bg-red-500';
    case 'stopped': return 'bg-gray-500';
    case 'paused': return 'bg-yellow-500';
    default: return 'bg-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <Play className="h-4 w-4" />;
    case 'passed': return <CheckCircle className="h-4 w-4" />;
    case 'failed': return <XCircle className="h-4 w-4" />;
    case 'stopped': return <StopCircle className="h-4 w-4" />;
    case 'paused': return <PauseCircle className="h-4 w-4" />;
    default: return <StopCircle className="h-4 w-4" />;
  }
};

interface WorkstationDetailViewProps {
  workstation: Workstation;
  onClose: () => void;
}

const WorkstationDetailView = ({ workstation, onClose }: WorkstationDetailViewProps) => {
  // Initialize all important points as selected by default
  const [selectedPoints, setSelectedPoints] = useState<string[]>(
    workstation.importantPoints.map(point => point.name)
  );

  const togglePointSelection = (pointName: string) => {
    if (selectedPoints.includes(pointName)) {
      setSelectedPoints(selectedPoints.filter(name => name !== pointName));
    } else {
      setSelectedPoints([...selectedPoints, pointName]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          {/* Adjusted title positioning - moved away from close button */}
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(workstation.status)}`}></div>
            <h2 className="text-xl font-bold">{workstation.name} 详情</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Fixed scrolling container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and Basic Info - Added mt-0 since it's the first element */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>状态信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">状态:</span>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      {getStatusIcon(workstation.status)}
                      <span>
                        {workstation.status === 'running' ? '运行中' : 
                         workstation.status === 'passed' ? '老化通过' : 
                         workstation.status === 'failed' ? '老化失败' : 
                         workstation.status === 'stopped' ? '已停止' : '已暂停'}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">老化配置:</span>
                    <span className="font-medium">
                      {workstation.currentAgingProcess || '无'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">运行时间:</span>
                    <span className="font-medium">{workstation.uptime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>设备信息</CardTitle>
                </CardHeader>
                <CardContent>
                  {workstation.onlineDevices.length > 0 ? (
                    <div className="space-y-2">
                      {workstation.onlineDevices.map((device, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{device.name}</div>
                          <div className="text-muted-foreground">
                            {device.ip}:{device.port} ({device.protocol})
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">无在线设备</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Curves Section - Renamed from "重要参数" to "曲线图" */}
            <Card>
              <CardHeader>
                <CardTitle>曲线图</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock curve charts - showing all by default */}
                  {workstation.importantPoints.map((point) => (
                    <div key={point.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{point.name} ({point.unit})</span>
                        <span className="text-sm font-mono">
                          当前值: {typeof point.value === 'boolean' ? (point.value ? '是' : '否') : point.value}
                        </span>
                      </div>
                      {/* Mock curve visualization */}
                      <div className="h-24 bg-muted rounded border flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">
                          {point.name} 曲线图 - 模拟数据
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Parameters Selection - Keep this section but it's now for curve selection */}
            <Card>
              <CardHeader>
                <CardTitle>曲线选择</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {workstation.importantPoints.map((point) => (
                    <Button
                      key={point.name}
                      variant={selectedPoints.includes(point.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePointSelection(point.name)}
                      className="text-xs"
                    >
                      {point.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  选择要显示的曲线（默认全选）
                </p>
              </CardContent>
            </Card>

            {/* Logs */}
            <Card>
              <CardHeader>
                <CardTitle>运行日志</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {workstation.logs.map((log, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-muted-foreground mr-2">[{log.timestamp}s]</span>
                      {log.content}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkstationDetailView;