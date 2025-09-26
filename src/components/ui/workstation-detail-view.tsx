"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, XCircle, Play, PauseCircle, StopCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [selectedParameters, setSelectedParameters] = useState<string[]>(
    workstation.importantPoints.map(point => point.name)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-blue-500" />;
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'stopped': return <StopCircle className="h-4 w-4 text-gray-500" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      default: return <StopCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'stopped': return 'text-gray-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const handleParameterToggle = (parameterName: string) => {
    setSelectedParameters(prev =>
      prev.includes(parameterName)
        ? prev.filter(name => name !== parameterName)
        : [...prev, parameterName]
    );
  };

  const handleSelectAll = () => {
    if (selectedParameters.length === workstation.importantPoints.length) {
      setSelectedParameters([]);
    } else {
      setSelectedParameters(workstation.importantPoints.map(point => point.name));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-2xl">{workstation.name}</CardTitle>
            {getStatusIcon(workstation.status)}
            <span className={`text-sm font-medium ${getStatusColor(workstation.status)}`}>
              {workstation.status === 'running' && '运行中'}
              {workstation.status === 'passed' && '老化通过'}
              {workstation.status === 'failed' && '老化失败'}
              {workstation.status === 'stopped' && '已停止'}
              {workstation.status === 'paused' && '已暂停'}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">运行时间</div>
              <div className="text-lg font-semibold">{workstation.uptime}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">当前温度</div>
              <div className="text-lg font-semibold">{workstation.temperature}°C</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">当前电压</div>
              <div className="text-lg font-semibold">{workstation.voltage}V</div>
            </div>
          </div>

          {/* 老化流程 */}
          {workstation.currentAgingProcess && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">当前老化流程</div>
              <Badge variant="secondary" className="text-sm">
                {workstation.currentAgingProcess}
              </Badge>
            </div>
          )}

          {/* 在线设备 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">在线设备</div>
            <div className="space-y-2">
              {workstation.onlineDevices.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">{device.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {device.ip}:{device.port} ({device.protocol})
                  </span>
                </div>
              ))}
              {workstation.onlineDevices.length === 0 && (
                <div className="text-sm text-muted-foreground italic">无在线设备</div>
              )}
            </div>
          </div>

          {/* 日志 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">操作日志</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {workstation.logs.map((log, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {log.timestamp}s: {log.content}
                </div>
              ))}
            </div>
          </div>

          {/* 曲线图显示区域 */}
          <div className="space-y-4">
            <div className="text-lg font-semibold">曲线图</div>
            
            {/* 图表展示区域 */}
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-sm mb-2">图表展示区域</div>
                <div className="text-xs">
                  {selectedParameters.length > 0 ? (
                    `显示参数: ${selectedParameters.join(', ')}`
                  ) : (
                    '请选择要显示的参数'
                  )}
                </div>
              </div>
            </div>

            {/* 参数选择 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">选择显示参数</Label>
                <Button variant="link" size="sm" onClick={handleSelectAll}>
                  {selectedParameters.length === workstation.importantPoints.length ? '取消全选' : '全选'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {workstation.importantPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`param-${point.name}`}
                      checked={selectedParameters.includes(point.name)}
                      onCheckedChange={() => handleParameterToggle(point.name)}
                    />
                    <Label htmlFor={`param-${point.name}`} className="text-sm cursor-pointer">
                      {point.name} ({point.unit})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDetailView;