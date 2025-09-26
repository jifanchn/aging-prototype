"use client";

import React, { useState, useMemo } from 'react';
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

// Generate mock time-series data for charts
const generateMockChartData = (workstation: Workstation) => {
  const maxTime = Math.max(180, ...workstation.logs.map(log => log.timestamp));
  const dataPoints = [];
  
  // Generate data points every 10 seconds
  for (let time = 0; time <= maxTime; time += 10) {
    const point: any = { time };
    
    // Temperature data (oscillates around current temp)
    const tempBase = workstation.temperature;
    point.temperature = tempBase + (Math.sin(time / 30) * 2);
    
    // Voltage data (oscillates around current voltage)
    const voltageBase = workstation.voltage;
    point.voltage = voltageBase + (Math.cos(time / 40) * 3);
    
    // Current data (if available)
    if (workstation.importantPoints.some(p => p.name === '电流')) {
      point.current = 2.0 + (Math.sin(time / 25) * 0.5);
    }
    
    // Humidity data (if available)
    if (workstation.importantPoints.some(p => p.name === '湿度')) {
      point.humidity = 45 + (Math.cos(time / 35) * 10);
    }
    
    // Power data (if available)
    if (workstation.importantPoints.some(p => p.name === '功率')) {
      point.power = 480 + (Math.sin(time / 20) * 20);
    }
    
    // Pressure data (if available)
    if (workstation.importantPoints.some(p => p.name === '压力')) {
      point.pressure = 1.2 + (Math.cos(time / 30) * 0.3);
    }
    
    dataPoints.push(point);
  }
  
  return dataPoints;
};

interface WorkstationDetailViewProps {
  workstation: Workstation;
  onClose: () => void;
}

const WorkstationDetailView = ({ workstation, onClose }: WorkstationDetailViewProps) => {
  const chartData = useMemo(() => generateMockChartData(workstation), [workstation]);
  const maxTime = chartData.length > 0 ? chartData[chartData.length - 1].time : 180;
  
  // Initialize all important points as selected by default
  const [selectedPoints, setSelectedPoints] = useState<string[]>(
    workstation.importantPoints.map(point => point.name)
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
      '温度': '#ef4444',
      '电压': '#3b82f6',
      '电流': '#10b981',
      '湿度': '#8b5cf6',
      '功率': '#f59e0b',
      '压力': '#06b6d4',
      '风扇转速': '#84cc16',
      '冷却液流量': '#ec4899'
    };
    return colors[paramName as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
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
            {/* Status and Basic Info */}
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
                              const paramName = name === 'temperature' ? '温度' : 
                                              name === 'voltage' ? '电压' :
                                              name === 'current' ? '电流' :
                                              name === 'humidity' ? '湿度' :
                                              name === 'power' ? '功率' :
                                              name === 'pressure' ? '压力' : name;
                              const unit = workstation.importantPoints.find(p => p.name === paramName)?.unit || '';
                              return [`${value}${unit}`, paramName];
                            }}
                            labelFormatter={(time) => `时间: ${time}s`}
                          />
                          
                          {/* Render lines for selected parameters */}
                          {selectedPoints.includes('温度') && (
                            <Line 
                              type="monotone" 
                              dataKey="temperature" 
                              name="温度" 
                              stroke={getLineColor('温度')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('电压') && (
                            <Line 
                              type="monotone" 
                              dataKey="voltage" 
                              name="电压" 
                              stroke={getLineColor('电压')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('电流') && (
                            <Line 
                              type="monotone" 
                              dataKey="current" 
                              name="电流" 
                              stroke={getLineColor('电流')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('湿度') && (
                            <Line 
                              type="monotone" 
                              dataKey="humidity" 
                              name="湿度" 
                              stroke={getLineColor('湿度')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('功率') && (
                            <Line 
                              type="monotone" 
                              dataKey="power" 
                              name="功率" 
                              stroke={getLineColor('功率')} 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          )}
                          {selectedPoints.includes('压力') && (
                            <Line 
                              type="monotone" 
                              dataKey="pressure" 
                              name="压力" 
                              stroke={getLineColor('压力')} 
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

            {/* Curve Selection */}
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

            {/* Logs - Fixed two-column alignment */}
            <Card>
              <CardHeader>
                <CardTitle>运行日志</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-sm">
                  {workstation.logs.map((log, index) => (
                    <div key={index} className="flex">
                      <div className="w-20 flex-shrink-0 text-right pr-4 text-muted-foreground">
                        [{log.timestamp.toString().padStart(5, '0')}s]
                      </div>
                      <div className="flex-1">
                        {log.content}
                      </div>
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