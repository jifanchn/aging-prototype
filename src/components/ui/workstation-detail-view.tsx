"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor, 
  Settings, 
  Play, 
  StopCircle,
  Thermometer,
  Zap,
  Wifi,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WorkstationDetailProps {
  workstation: {
    id: number;
    name: string;
    status: 'running' | 'passed' | 'failed' | 'stopped';
    deviceCount: number;
    temperature: number;
    voltage: number;
    uptime: string;
    importantPoints: Array<{
      name: string;
      value: number | boolean;
      unit: string;
      normalRange: [number, number];
    }>;
  };
  onClose: () => void;
}

const WorkstationDetailView = ({ workstation, onClose }: WorkstationDetailProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = () => {
    switch (workstation.status) {
      case 'running': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'stopped': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (workstation.status) {
      case 'running': return '运行中';
      case 'passed': return '老化通过';
      case 'failed': return '老化失败';
      case 'stopped': return '已停止';
      default: return '未知';
    }
  };

  // Helper function to check if a point is within normal range
  const isPointNormal = (point: { value: number | boolean; normalRange: [number, number] }) => {
    if (typeof point.value === 'boolean') {
      return point.value; // For boolean, true means normal
    }
    return point.value >= point.normalRange[0] && point.value <= point.normalRange[1];
  };

  // Mock graphics data for important points
  const renderGraphics = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workstation.importantPoints.map((point, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{point.name}</h3>
              <Badge variant={isPointNormal(point) ? 'default' : 'destructive'}>
                {typeof point.value === 'boolean' ? (point.value ? '正常' : '异常') : 
                 isPointNormal(point) ? '正常' : '异常'}
              </Badge>
            </div>
            <div className="text-2xl font-bold mb-2">
              {typeof point.value === 'boolean' ? (point.value ? '✓' : '✗') : `${point.value}${point.unit}`}
            </div>
            {typeof point.value === 'number' && (
              <div className="space-y-1">
                <Progress 
                  value={((point.value - point.normalRange[0]) / (point.normalRange[1] - point.normalRange[0])) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{point.normalRange[0]}{point.unit}</span>
                  <span>{point.normalRange[1]}{point.unit}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{workstation.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <Badge variant={workstation.status === 'running' ? 'default' : 'secondary'}>
                {getStatusText()}
              </Badge>
              <span className="text-sm text-muted-foreground">{workstation.deviceCount} 设备</span>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="graphics">图形监控</TabsTrigger>
              <TabsTrigger value="devices">设备列表</TabsTrigger>
              <TabsTrigger value="logs">日志</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">温度</span>
                    </div>
                    <div className="text-2xl font-bold">{workstation.temperature}°C</div>
                    <Progress value={workstation.temperature} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">电压</span>
                    </div>
                    <div className="text-2xl font-bold">{workstation.voltage}V</div>
                    <Progress value={(workstation.voltage / 240) * 100} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">运行时间</span>
                    </div>
                    <div className="text-2xl font-bold">{workstation.uptime}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">连接状态</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-green-500">已连接</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="graphics" className="mt-4">
              {renderGraphics()}
            </TabsContent>
            
            <TabsContent value="devices" className="mt-4">
              <div className="space-y-2">
                {[...Array(workstation.deviceCount)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>设备 {i + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">正常</Badge>
                      <Button variant="ghost" size="sm">详情</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="logs" className="mt-4">
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2025-08-13 14:30:22</span>
                    <Badge variant="default">INFO</Badge>
                  </div>
                  <p className="text-sm mt-1">老化流程启动成功</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2025-08-13 14:25:15</span>
                    <Badge variant="secondary">WARN</Badge>
                  </div>
                  <p className="text-sm mt-1">温度传感器读数波动</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2025-08-13 14:20:00</span>
                    <Badge variant="default">INFO</Badge>
                  </div>
                  <p className="text-sm mt-1">设备连接建立</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            {workstation.status === 'running' && (
              <Button variant="destructive">
                <StopCircle className="h-4 w-4 mr-2" />
                停止老化
              </Button>
            )}
            {workstation.status !== 'running' && (
              <Button>
                <Play className="h-4 w-4 mr-2" />
                启动老化
              </Button>
            )}
            <Button variant="outline">导出报告</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDetailView;