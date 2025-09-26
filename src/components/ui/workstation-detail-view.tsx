"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface WorkstationDetailViewProps {
  workstation: Workstation;
  onClose: () => void;
}

const WorkstationDetailView = ({ workstation, onClose }: WorkstationDetailViewProps) => {
  // Initialize all important points as selected by default
  const [selectedPoints, setSelectedPoints] = useState<Record<string, boolean>>(
    workstation.importantPoints.reduce((acc, point) => {
      acc[point.name] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const togglePointSelection = (pointName: string) => {
    setSelectedPoints(prev => ({
      ...prev,
      [pointName]: !prev[pointName]
    }));
  };

  // Mock data for curve chart - in a real app this would come from API
  const mockChartData = workstation.importantPoints.map(point => {
    // Generate mock data points for the chart
    const data = [];
    for (let i = 0; i <= 60; i += 5) {
      // Random value within a reasonable range around the current value
      const value = typeof point.value === 'number' 
        ? point.value + (Math.random() - 0.5) * (point.normalRange[1] - point.normalRange[0]) * 0.2
        : point.value ? 1 : 0;
      data.push({ time: i, value });
    }
    return { name: point.name, data, unit: point.unit };
  });

  // Get badge variant based on status (using only valid variants)
  const getBadgeVariant = () => {
    switch (workstation.status) {
      case 'running':
        return 'default';
      case 'passed':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'paused':
        return 'secondary';
      case 'stopped':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Get status text for display
  const getStatusText = () => {
    switch (workstation.status) {
      case 'running':
        return '运行中';
      case 'passed':
        return '老化通过';
      case 'failed':
        return '老化失败';
      case 'paused':
        return '已暂停';
      case 'stopped':
        return '已停止';
      default:
        return '未知';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl">{workstation.name} 详情</CardTitle>
            <Badge variant={getBadgeVariant()}>
              {getStatusText()}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 工位基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">基本信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">老化配置:</span>
                  <span>{workstation.currentAgingProcess || '无'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">运行时间:</span>
                  <span>{workstation.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">温度:</span>
                  <span>{workstation.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">电压:</span>
                  <span>{workstation.voltage}V</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">在线设备</h3>
              <div className="space-y-2">
                {workstation.onlineDevices.length > 0 ? (
                  workstation.onlineDevices.map((device, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{device.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {device.ip}:{device.port} ({device.protocol})
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">无在线设备</div>
                )}
              </div>
            </div>
          </div>
          
          {/* 曲线图 - renamed from "重要参数" */}
          <div>
            <h3 className="font-medium mb-4">曲线图</h3>
            <div className="bg-muted/30 rounded-lg p-4 min-h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">曲线图展示区域</p>
                <p className="text-xs text-muted-foreground">
                  {mockChartData.filter(chart => selectedPoints[chart.name]).map(chart => chart.name).join(', ')}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  在实际应用中，这里会显示所选参数的实时曲线图
                </div>
              </div>
            </div>
          </div>
          
          {/* 重要参数选择 - now at the bottom */}
          <div>
            <h3 className="font-medium mb-3">重要参数选择</h3>
            <div className="flex flex-wrap gap-2">
              {workstation.importantPoints.map((point) => (
                <div key={point.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`point-${point.name}`}
                    checked={selectedPoints[point.name] || false}
                    onChange={() => togglePointSelection(point.name)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`point-${point.name}`} className="text-sm">
                    {point.name} ({point.unit})
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 日志 */}
          <div>
            <h3 className="font-medium mb-2">运行日志</h3>
            <div className="bg-muted/30 rounded-lg p-4 max-h-40 overflow-y-auto">
              {workstation.logs.map((log, index) => (
                <div key={index} className="text-sm py-1 border-b border-muted last:border-0">
                  <span className="text-muted-foreground mr-2">[{log.timestamp}s]</span>
                  {log.content}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDetailView;