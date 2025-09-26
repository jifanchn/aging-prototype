"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  StopCircle, 
  Pause,
  Clock,
  Thermometer,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgingProcessCardProps {
  id: number;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'stopped';
  progress: number;
  duration: string;
  temperature: string;
  voltage: string;
  onControlClick: (action: 'start' | 'pause' | 'stop' | 'resume') => void;
}

const AgingProcessCard = ({
  name,
  status,
  progress,
  duration,
  temperature,
  voltage,
  onControlClick
}: AgingProcessCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'stopped': return 'bg-gray-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running': return '运行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      case 'stopped': return '已停止';
      case 'paused': return '已暂停';
      default: return '未知';
    }
  };

  const getControlButton = () => {
    switch (status) {
      case 'running':
        return (
          <>
            <Button size="sm" variant="outline" onClick={() => onControlClick('pause')}>
              <Pause className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onControlClick('stop')}>
              <StopCircle className="h-4 w-4" />
            </Button>
          </>
        );
      case 'paused':
        return (
          <>
            <Button size="sm" onClick={() => onControlClick('resume')}>
              <Play className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onControlClick('stop')}>
              <StopCircle className="h-4 w-4" />
            </Button>
          </>
        );
      case 'stopped':
      case 'completed':
      case 'failed':
        return (
          <Button size="sm" onClick={() => onControlClick('start')}>
            <Play className="h-4 w-4" />
          </Button>
        );
      default:
        return null;
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
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>进度</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{temperature}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{voltage}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {getControlButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgingProcessCard;