"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  StopCircle, 
  CheckCircle, 
  XCircle,
  Wifi,
  Database
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const WorkstationDetailView = ({ workstation, onClose }: { workstation: Workstation; onClose: () => void }) => {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(workstation.status === 'running');

  // 默认全选所有数值类型的重要参数
  useEffect(() => {
    const numericPoints = workstation.importantPoints
      .filter(point => typeof point.value === 'number')
      .map(point => point.name);
    setSelectedPoints(numericPoints);
  }, [workstation.importantPoints]);

  // 生成模拟的历史数据用于图表
  const generateHistoricalData = () => {
    const data = [];
    const baseTime = Date.now() - 3600000; // 1小时前
    
    for (let i = 0; i <= 60; i++) {
      const timestamp = baseTime + (i * 60000); // 每分钟一个数据点
      const pointData: any = {
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      // 为每个重要参数生成模拟数据
      workstation.importantPoints.forEach(point => {
        if (typeof point.value === 'number') {
          // 生成一些波动的数据
          const baseValue = point.value;
          const variation = (Math.random() - 0.5) * (point.normalRange[1] - point.normalRange[0]) * 0.2;
          pointData[point.name] = Math.max(point.normalRange[0], Math.min(point.normalRange[1], baseValue + variation));
        }
      });
      
      data.push(pointData);
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  const togglePointSelection = (pointName: string) => {
    setSelectedPoints(prev => 
      prev.includes(pointName) 
        ? prev.filter(name => name !== pointName)
        : [...prev, pointName]
    );
  };

  const getStatusColor = () => {
    switch (workstation.status) {
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'stopped': return 'text-gray-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (workstation.status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'stopped': return <StopCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Pause className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>工位详情 - {workstation.name}</span>
            <span className={`flex items-center ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-2 capitalize">{workstation.status}</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">老化配置</div>
                <div className="font-medium">
                  {workstation.currentAgingProcess || '无激活配置'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">运行时间</div>
                <div className="font-medium">{workstation.uptime}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">在线设备</div>
                <div className="font-medium">
                  {workstation.onlineDevices.length > 0 
                    ? workstation.onlineDevices.map(d => d.name).join(', ') 
                    : '无在线设备'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">温度/电压</div>
                <div className="font-medium">{workstation.temperature}°C / {workstation.voltage}V</div>
              </div>
            </CardContent>
          </Card>

          {/* 曲线图表 - 显示在参数选择上方 */}
          <Card>
            <CardHeader>
              <CardTitle>重要参数趋势图</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPoints.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedPoints.map((pointName, index) => {
                        const point = workstation.importantPoints.find(p => p.name === pointName);
                        if (!point || typeof point.value !== 'number') return null;
                        
                        // 为不同参数设置不同颜色
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
                        return (
                          <Line
                            key={pointName}
                            type="monotone"
                            dataKey={pointName}
                            stroke={colors[index % colors.length]}
                            activeDot={{ r: 8 }}
                            name={pointName + (point.unit ? ` (${point.unit})` : '')}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  请选择要显示的重要参数
                </div>
              )}
            </CardContent>
          </Card>

          {/* 重要参数选择 */}
          <Card>
            <CardHeader>
              <CardTitle>重要参数选择</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workstation.importantPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`point-${index}`}
                      checked={selectedPoints.includes(point.name)}
                      onCheckedChange={() => togglePointSelection(point.name)}
                      disabled={typeof point.value !== 'number'} // 只能选择数值类型参数
                    />
                    <label htmlFor={`point-${index}`} className="text-sm font-medium">
                      {point.name} ({point.value}{point.unit})
                      {typeof point.value === 'number' && (
                        <span className="text-xs text-muted-foreground ml-2">
                          正常范围: {point.normalRange[0]}-{point.normalRange[1]}{point.unit}
                        </span>
                      )}
                      {typeof point.value !== 'number' && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (非数值参数，无法显示曲线)
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 日志 */}
          <Card>
            <CardHeader>
              <CardTitle>运行日志</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {workstation.logs.map((log, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-muted-foreground">{log.timestamp}s:</span> {log.content}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>关闭</Button>
          {workstation.status === 'running' && (
            <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
              <StopCircle className="h-4 w-4 mr-2" />
              停止
            </Button>
          )}
          {(workstation.status === 'stopped' || workstation.status === 'failed') && (
            <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
              <Play className="h-4 w-4 mr-2" />
              启动
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkstationDetailView;