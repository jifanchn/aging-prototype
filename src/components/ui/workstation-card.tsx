"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  StopCircle, 
  CheckCircle, 
  XCircle,
  Monitor
} from "lucide-react";

interface WorkstationCardProps {
  id: number;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'stopped';
  deviceCount: number;
  onDetailsClick: () => void;
  onActionClick: () => void;
}

const WorkstationCard = ({
  name,
  status,
  deviceCount,
  onDetailsClick,
  onActionClick
}: WorkstationCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'stopped': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running': return '运行中';
      case 'passed': return '老化通过';
      case 'failed': return '老化失败';
      case 'stopped': return '已停止';
      default: return '未知';
    }
  };

  const getActionButtonText = () => {
    switch (status) {
      case 'running': return '停止';
      case 'stopped': return '启动';
      default: return '重新开始';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <Badge variant={status === 'running' ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{deviceCount} 设备</span>
            </div>
            <Button variant="outline" size="sm" onClick={onDetailsClick}>
              详情
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              className="flex-1"
              size="sm"
              onClick={onActionClick}
            >
              {getActionButtonText()}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkstationCard;