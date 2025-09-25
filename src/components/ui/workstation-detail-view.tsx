"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play,
  CheckCircle,
  XCircle,
  PauseCircle,
  StopCircle
} from "lucide-react";

interface Workstation {
  id: number;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'stopped' | 'paused';
  onlineDevices: Array<{
    ip: string;
    name: string;
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <Play className="h-4 w-4 mr-2 text-blue-500" />;
    case 'passed': return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
    case 'failed': return <XCircle className="h-4 w-4 mr-2 text-red-500" />;
    case 'stopped': return <StopCircle className="h-4 w-4 mr-2 text-gray-500" />;
    case 'paused': return <PauseCircle className="h-4 w-4 mr-2 text-yellow-500" />;
    default: return <PauseCircle className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

const WorkstationDetailView = ({ workstation, onClose }: { workstation: Workstation; onClose: () => void }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getStatusIcon(workstation.status)}
            {workstation.name} - 详细信息
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">状态</div>
                  <div className="font-medium capitalize">{workstation.status}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">运行时间</div>
                  <div className="font-medium">{workstation.uptime}</div>
                </div>
                {workstation.currentAgingProcess && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">当前老化配置</div>
                    <div className="font-medium text-blue-600">{workstation.currentAgingProcess}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 在线设备 */}
          <Card>
            <CardHeader>
              <CardTitle>在线设备</CardTitle>
            </CardHeader>
            <CardContent>
              {workstation.onlineDevices.length > 0 ? (
                <div className="space-y-2">
                  {workstation.onlineDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.ip}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">无在线设备</div>
              )}
            </CardContent>
          </Card>

          {/* 重要参数 */}
          <Card>
            <CardHeader>
              <CardTitle>重要参数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workstation.importantPoints.map((point, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm text-muted-foreground">{point.name}</div>
                    <div className="font-medium">
                      {typeof point.value === 'boolean' 
                        ? (point.value ? '正常' : '异常')
                        : `${point.value}${point.unit}`
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 完整日志 */}
          <Card>
            <CardHeader>
              <CardTitle>运行日志</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {workstation.logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-muted/20 rounded">
                    <div className="text-xs text-muted-foreground min-w-16">
                      {log.timestamp}s
                    </div>
                    <div className="text-sm flex-1">{log.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkstationDetailView;