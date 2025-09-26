"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play,
  CheckCircle,
  XCircle,
  PauseCircle,
  StopCircle,
  Info
} from "lucide-react";

interface WorkstationCardProps {
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
  infoMessage?: string;
  onDetailsClick: () => void;
  onActionClick: (action: 'start' | 'stop' | 'fail' | 'delete') => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <Play className="h-4 w-4 text-blue-500" />;
    case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'stopped': return <StopCircle className="h-4 w-4 text-gray-500" />;
    case 'paused': return <PauseCircle className="h-4 w-4 text-yellow-500" />;
    default: return <PauseCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'running': return 'border-l-blue-500';
    case 'passed': return 'border-l-green-500';
    case 'failed': return 'border-l-red-500';
    case 'stopped': return 'border-l-gray-500';
    case 'paused': return 'border-l-yellow-500';
    default: return 'border-l-gray-300';
  }
};

// 限制显示的设备数量，超出部分用...表示
const getLimitedDeviceTypes = (devices: WorkstationCardProps['onlineDevices'], limit = 3) => {
  if (devices.length <= limit) {
    return devices.map(device => device.deviceType);
  }
  return [...devices.slice(0, limit).map(device => device.deviceType), '...'];
};

const WorkstationCard = ({ 
  id, 
  name, 
  status, 
  onlineDevices,
  currentAgingProcess,
  logs,
  infoMessage,
  onDetailsClick, 
  onActionClick 
}: WorkstationCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${getStatusColorClass(status)}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          {getStatusIcon(status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 老化配置信息 */}
        {currentAgingProcess && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">老化配置:</span>
            <span className="font-medium text-blue-600">{currentAgingProcess}</span>
          </div>
        )}
        
        {/* 在线设备信息 - 显示设备类型，悬浮显示详细信息 */}
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">在线设备:</div>
          {onlineDevices.length > 0 ? (
            <div 
              className="flex flex-wrap gap-1 max-h-12 overflow-hidden"
              title={onlineDevices.map(device => 
                `${device.deviceType} (${device.ip}:${device.port}, ${device.protocol})`
              ).join('\n')}
            >
              {getLimitedDeviceTypes(onlineDevices).map((deviceType, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap"
                >
                  {deviceType}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">无在线设备</span>
          )}
        </div>

        {/* 信息行 - 由老化流程函数指定 */}
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">信息:</div>
          {infoMessage ? (
            <div className="text-xs bg-muted/30 p-2 rounded text-muted-foreground max-h-20 overflow-y-auto">
              {infoMessage}
            </div>
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </div>

        {/* 日志显示 */}
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">最新日志:</div>
          {logs.length > 0 && (
            <div 
              className="text-xs bg-muted/30 p-2 rounded text-muted-foreground max-h-20 overflow-y-auto"
              title={logs.map(log => `${log.timestamp}s: ${log.content}`).join('\n')}
            >
              {logs[logs.length - 1].timestamp}s: {logs[logs.length - 1].content}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onDetailsClick}
            className="flex-1"
          >
            详情
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              // 根据状态确定可用的操作
              const actions = [];
              if (status === 'stopped' || status === 'failed') {
                actions.push('start');
              }
              if (status === 'running' || status === 'paused') {
                actions.push('stop');
              }
              if (status === 'running') {
                actions.push('fail');
              }
              actions.push('delete');
              
              // 显示操作选择对话框
              const action = window.prompt(
                `选择操作:\n${actions.map(a => `- ${a}`).join('\n')}`
              );
              if (action && actions.includes(action)) {
                onActionClick(action as any);
              }
            }}
          >
            操作
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkstationCard;