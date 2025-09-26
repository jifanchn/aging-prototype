"use client";

import React, { useState, useMemo } from 'react';
import { 
  X,
  Play,
  CheckCircle,
  XCircle,
  StopCircle,
  PauseCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface AgingLog {
  id: string;
  sn: string;
  startTime: string;
  endTime: string | null;
  status: 'completed' | 'failed' | 'running';
  workstation: string;
  logs: Array<{
    timestamp: number;
    content: string;
  }>;
  importantPoints: Array<{
    name: string;
    value: number | boolean;
    unit: string;
    normalRange: [number, number];
  }>;
  allAvailablePoints: Array<{
    name: string;
    unit: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'failed': return 'bg-red-500';
    case 'running': return 'bg-blue-500';
    default: return 'bg-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'failed': return <XCircle className="h-4 w-4" />;
    case 'running': return <Play className="h-4 w-4" />;
    default: return <StopCircle className="h-4 w-4" />;
  }
};

// Generate mock time-series data for charts
const generateMockChartData = (log: AgingLog) => {
  const startTime = new Date(log.startTime).getTime();
  const endTime = log.endTime ? new Date(log.endTime).getTime() : Date.now();
  const duration = Math.max(180000, endTime - startTime); // At least 3 minutes
  const dataPoints = [];
  
  // Generate data points every 10 seconds
  const pointCount = Math.floor(duration / 10000) + 1;
  for (let i = 0; i < pointCount; i++) {
    const time = i * 10;
    const point: any = { time };
    
    // Temperature data (oscillates around 65)
    point.temperature = 25 + (40 * (1 - Math.exp(-time/120))) + (Math.sin(time / 30) * 2);
    
    // Voltage data (oscillates around 220)
    point.voltage = 220 + (Math.cos(time / 40) * 3);
    
    // Current data
    point.current = 2.0 + (Math.sin(time / 25) * 0.5);
    
    // Humidity data
    point.humidity = 45 + (Math.cos(time / 35) * 10);
    
    // Power data
    point.power = 480 + (Math.sin(time / 20) * 20);
    
    // Pressure data
    point.pressure = 1.2 + (Math.cos(time / 30) * 0.3);
    
    // Custom points
    point.custom_temp = point.temperature + 2;
    point.custom_volt = point.voltage - 5;
    
    dataPoints.push(point);
  }
  
  return dataPoints;
};

interface AnalyticsDetailViewProps {
  log: AgingLog;
  onClose: () => void;
}

const AnalyticsDetailView = ({ log, onClose }: AnalyticsDetailViewProps) => {
  const chartData = useMemo(() => generateMockChartData(log), [log]);
  const maxTime = chartData.length > 0 ? chartData[chartData.length - 1].time : 180;
  
  // Initialize with important points selected
  const [selectedPoints, setSelectedPoints] = useState<string[]>(
    log.importantPoints.map(point => point.name)
  );
  
  // Range slider state
  const [range, setRange] = useState<[number, number]>([0, Math.min(60, maxTime)]);

  const togglePointSelection = (pointName: string) => {
    if (selectedPoints.includes(pointName)) {
      setSelectedPoints(selectedPoints.filter(name => name !== pointName));
    } else {
      setSelectedPoints([...selectedPoints, pointName]);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    if (index === 0) {
      setRange([Math.min(value, range[1] - 10), range[1]]);
    } else {
      setRange([range[0], Math.max(value, range[0] + 10)]);
    }
  };

  // Filter chart data based on selected range
  const filteredChartData = chartData.filter(point => 
    point.time >= range[0] && point.time <= range[1]
  );

  // Get color for each parameter
  const getLineColor = (paramName: string) => {
    const colors = {
      'temperature': '#ef4444',
      'voltage': '#3b82f6',
      'current': '#10b981',
      'humidity': '#8b5cf6',
      'power': '#f59e0b',
      'pressure': '#06b6d4',
      'custom_temp': '#ec4899',
      'custom_volt': '#84cc16'
    };
    return colors[paramName as keyof typeof colors] || '#6b7280';
  };

  // Get all available points including important ones
  const allPoints = [...log.importantPoints.map(p => p.name), ...log.allAvailablePoints.map(p => p.name)];
  const uniquePoints = Array.from(new Set(allPoints));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`}></div>
            <h2 className="text-xl font-bold">老化日志详情 - {log.sn}</h2>
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
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>日志信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">状态:</span>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      {getStatusIcon(log.status)}
                      <span>
                        {log.status === 'completed' ? '成功' : 
                         log.status === 'failed' ? '失败' : '运行中'}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">工位:</span>
                    <span className="font-medium">{log.workstation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">开始时间:</span>
                    <span className="font-medium">{new Date(log.startTime).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">结束时间:</span>
                    <span className="font-medium">
                      {log.endTime ? new Date(log.endTime).toLocaleString('zh-CN') : '未结束'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">持续时间:</span>
                    <span className="font-medium">
                      {log.endTime 
                        ? `${Math.round((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 60000)} 分钟`
                        : '运行中'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>重要参数</CardTitle>
                </CardHeader>
                <CardContent>
                  {log.importantPoints.length > 0 ? (
                    <div className="space-y-2">
                      {log.importantPoints.map((point, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{point.name}</span>
                            <span className="text-right">
                              {typeof point.value === 'boolean' 
                                ? (point.value ? '是' : '否') 
                                : `${point.value}${point.unit}`}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            正常范围: {point.normalRange[0]} - {point.normalRange[1]} {point.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">无重要参数</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Curves Section with real charts */}
            <Card>
              <CardHeader>
                <CardTitle>曲线图</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredChartData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={filteredChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="time" 
                            label={{ value: '时间 (秒)', position: 'insideBottomRight', offset: -5 }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ value: '数值', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              const unit = log.allAvailablePoints.find(p => p.name === name)?.unit || 
                                           log.importantPoints.find(p => p.name === name)?.unit || '';
                              return [`${value}${unit}`, name];
                            }}
                            labelFormatter={(time) => `时间: ${time}s`}
                          />
                          
                          {/* Render lines for selected parameters */}
                          {selectedPoints.includes('temperature') && (
                            <Line 
                              type="monotone" 
                              dataKey="temperature" 
                              name="temperature" 
                              stroke={getLineColor('temperature')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('voltage') && (
                            <Line 
                              type="monotone" 
                              dataKey="voltage" 
                              name="voltage" 
                              stroke={getLineColor('voltage')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('current') && (
                            <Line 
                              type="monotone" 
                              dataKey="current" 
                              name="current" 
                              stroke={getLineColor('current')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('humidity') && (
                            <Line 
                              type="monotone" 
                              dataKey="humidity" 
                              name="humidity" 
                              stroke={getLineColor('humidity')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('power') && (
                            <Line 
                              type="monotone" 
                              dataKey="power" 
                              name="power" 
                              stroke={getLineColor('power')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('pressure') && (
                            <Line 
                              type="monotone" 
                              dataKey="pressure" 
                              name="pressure" 
                              stroke={getLineColor('pressure')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('custom_temp') && (
                            <Line 
                              type="monotone" 
                              dataKey="custom_temp" 
                              name="custom_temp" 
                              stroke={getLineColor('custom_temp')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('custom_volt') && (
                            <Line 
                              type="monotone" 
                              dataKey="custom_volt" 
                              name="custom_volt" 
                              stroke={getLineColor('custom_volt')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      无数据可显示
                    </div>
                  )}
                  
                  {/* Range slider for time navigation */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>时间范围: {range[0]}s - {range[1]}s</span>
                      <span>总时长: {maxTime}s</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max={maxTime}
                        value={range[0]}
                        onChange={(e) => handleRangeChange(e, 0)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max={maxTime}
                        value={range[1]}
                        onChange={(e) => handleRangeChange(e, 1)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0s</span>
                      <span>{maxTime}s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curve Selection with dropdown multi-select */}
            <Card>
              <CardHeader>
                <CardTitle>曲线选择</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>选择要显示的变量</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {selectedPoints.length > 0 
                            ? `${selectedPoints.length} 个变量已选中` 
                            : '选择变量'}
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>可用变量</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniquePoints.map((pointName) => (
                          <div key={pointName} className="flex items-center space-x-2 px-2 py-1 hover:bg-muted cursor-pointer">
                            <Checkbox
                              id={`point-${pointName}`}
                              checked={selectedPoints.includes(pointName)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPoints([...selectedPoints, pointName]);
                                } else {
                                  setSelectedPoints(selectedPoints.filter(name => name !== pointName));
                                }
                              }}
                            />
                            <Label htmlFor={`point-${pointName}`} className="text-sm cursor-pointer flex-1">
                              {pointName}
                            </Label>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    重要参数已默认选中，可添加其他可用变量
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Logs display */}
            <Card>
              <CardHeader>
                <CardTitle>运行日志</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-sm">
                  {log.logs && log.logs.length > 0 ? (
                    log.logs.map((logEntry, index) => (
                      <div key={index} className="flex">
                        <div className="w-20 flex-shrink-0 text-right pr-4 text-muted-foreground">
                          [{logEntry.timestamp.toString().padStart(5, '0')}s]
                        </div>
                        <div className="flex-1">
                          {logEntry.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground">无日志记录</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetailView;