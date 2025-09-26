"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Settings,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  PauseCircle,
  StopCircle,
  MoreVertical
} from "lucide-react";
import WorkstationCard from "@/components/ui/workstation-card";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";
import { showSuccess } from "@/utils/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const WorkstationOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  const mockWorkstations: Workstation[] = [
    { 
      id: 1, 
      name: "工位 A1", 
      status: "running", 
      onlineDevices: [
        { ip: "192.168.1.101", name: "温度传感器 A1", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" },
        { ip: "192.168.1.102", name: "电压监测器 B2", deviceType: "电压监测器", port: 502, protocol: "modbus-tcp" }
      ],
      currentAgingProcess: "高温老化流程 A",
      logs: [
        { timestamp: 0, content: "工位启动成功" },
        { timestamp: 15, content: "设备连接正常" },
        { timestamp: 30, content: "开始执行高温老化流程 A" },
        { timestamp: 45, content: "温度达到设定值 65°C" },
        { timestamp: 60, content: "电压稳定在 220V" }
      ],
      temperature: 65.5,
      voltage: 220,
      uptime: "2h 15m",
      importantPoints: [
        { name: "温度", value: 65.5, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 220, unit: "V", normalRange: [210, 230] },
        { name: "电流", value: 2.3, unit: "A", normalRange: [2, 3] },
        { name: "运行状态", value: true, unit: "", normalRange: [1, 1] }
      ]
    },
    { 
      id: 2, 
      name: "工位 B2", 
      status: "passed", 
      onlineDevices: [
        { ip: "192.168.1.103", name: "温度传感器 C3", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" },
        { ip: "192.168.1.104", name: "电压监测器 D4", deviceType: "电压监测器", port: 502, protocol: "modbus-tcp" },
        { ip: "192.168.1.105", name: "湿度传感器 E5", deviceType: "湿度传感器", port: 502, protocol: "modbus-tcp" }
      ],
      currentAgingProcess: "标准老化流程 B",
      logs: [
        { timestamp: 0, content: "工位启动成功" },
        { timestamp: 20, content: "所有设备在线" },
        { timestamp: 40, content: "开始执行标准老化流程 B" },
        { timestamp: 120, content: "老化测试完成，结果通过" },
        { timestamp: 180, content: "工位停止运行" }
      ],
      temperature: 70.2,
      voltage: 219,
      uptime: "4h 30m",
      importantPoints: [
        { name: "温度", value: 70.2, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 219, unit: "V", normalRange: [210, 230] },
        { name: "湿度", value: 45, unit: "%", normalRange: [30, 60] },
        { name: "运行状态", value: false, unit: "", normalRange: [1, 1] }
      ]
    },
    { 
      id: 3, 
      name: "工位 C3", 
      status: "failed", 
      onlineDevices: [],
      currentAgingProcess: "快速老化流程 C",
      logs: [
        { timestamp: 0, content: "工位启动成功" },
        { timestamp: 10, content: "检测到设备离线" },
        { timestamp: 25, content: "无法启动快速老化流程 C" },
        { timestamp: 30, content: "老化测试失败 - 设备连接异常" },
        { timestamp: 35, content: "工位进入失败状态" }
      ],
      temperature: 58.1,
      voltage: 210,
      uptime: "1h 20m",
      importantPoints: [
        { name: "温度", value: 58.1, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 210, unit: "V", normalRange: [210, 230] },
        { name: "压力", value: 1.2, unit: "bar", normalRange: [1, 2] },
        { name: "运行状态", value: true, unit: "", normalRange: [1, 1] }
      ]
    },
    { 
      id: 4, 
      name: "工位 D4", 
      status: "stopped", 
      onlineDevices: [
        { ip: "192.168.1.106", name: "温度传感器 F6", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" }
      ],
      currentAgingProcess: undefined,
      logs: [
        { timestamp: 0, content: "工位初始化完成" },
        { timestamp: 5, content: "部分设备离线" },
        { timestamp: 10, content: "等待设备连接" },
        { timestamp: 15, content: "工位处于待机状态" }
      ],
      temperature: 25.0,
      voltage: 220,
      uptime: "0h 0m",
      importantPoints: [
        { name: "温度", value: 25.0, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 220, unit: "V", normalRange: [210, 230] },
        { name: "风扇转速", value: 0, unit: "RPM", normalRange: [1000, 3000] },
        { name: "运行状态", value: false, unit: "", normalRange: [1, 1] }
      ]
    },
    { 
      id: 5, 
      name: "工位 E5", 
      status: "running", 
      onlineDevices: [
        { ip: "192.168.1.107", name: "温度传感器 G7", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" },
        { ip: "192.168.1.108", name: "功率计 H8", deviceType: "功率计", port: 502, protocol: "modbus-tcp" }
      ],
      currentAgingProcess: "高温老化流程 A",
      logs: [
        { timestamp: 0, content: "工位启动成功" },
        { timestamp: 12, content: "设备连接正常" },
        { timestamp: 28, content: "开始执行高温老化流程 A" },
        { timestamp: 42, content: "温度上升中，当前 62°C" },
        { timestamp: 55, content: "功率输出正常，485W" }
      ],
      temperature: 68.3,
      voltage: 221,
      uptime: "3h 10m",
      importantPoints: [
        { name: "温度", value: 68.3, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 221, unit: "V", normalRange: [210, 230] },
        { name: "功率", value: 485, unit: "W", normalRange: [400, 600] },
        { name: "运行状态", value: true, unit: "", normalRange: [1, 1] }
      ]
    },
    { 
      id: 6, 
      name: "工位 F6", 
      status: "paused", 
      onlineDevices: [
        { ip: "192.168.1.109", name: "温度传感器 I9", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" }
      ],
      currentAgingProcess: "低温老化流程 D",
      logs: [
        { timestamp: 0, content: "工位启动成功" },
        { timestamp: 18, content: "设备连接正常" },
        { timestamp: 35, content: "开始执行低温老化流程 D" },
        { timestamp: 50, content: "检测到异常，暂停老化流程" },
        { timestamp: 55, content: "等待用户确认继续操作" }
      ],
      temperature: 26.5,
      voltage: 219,
      uptime: "0h 0m",
      importantPoints: [
        { name: "温度", value: 26.5, unit: "°C", normalRange: [60, 75] },
        { name: "电压", value: 219, unit: "V", normalRange: [210, 230] },
        { name: "冷却液流量", value: 0, unit: "L/min", normalRange: [2, 5] },
        { name: "运行状态", value: false, unit: "", normalRange: [1, 1] }
      ]
    },
  ];

  const filteredWorkstations = mockWorkstations.filter(ws => {
    const matchesSearch = ws.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ws.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (workstation: Workstation) => {
    setSelectedWorkstation(workstation);
  };

  const handleCloseDetails = () => {
    setSelectedWorkstation(null);
  };

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

  // 限制显示的设备数量，超出部分用...表示
  const getLimitedDeviceTypes = (devices: Workstation['onlineDevices'], limit = 3) => {
    if (devices.length <= limit) {
      return devices.map(device => device.deviceType);
    }
    return [...devices.slice(0, limit).map(device => device.deviceType), '...'];
  };

  const getAvailableActions = (workstation: Workstation) => {
    const actions = [];
    
    if (workstation.status === 'stopped' || workstation.status === 'failed') {
      actions.push({ 
        label: '启动', 
        icon: <Play className="h-3 w-3 mr-2" />,
        action: () => showSuccess(`工位 ${workstation.name} 启动成功`),
        className: 'text-green-600 hover:bg-green-50'
      });
    }
    
    if (workstation.status === 'running') {
      actions.push({ 
        label: '暂停', 
        icon: <PauseCircle className="h-3 w-3 mr-2" />,
        action: () => showSuccess(`工位 ${workstation.name} 暂停成功`),
        className: 'text-yellow-600 hover:bg-yellow-50'
      });
    }
    
    if (workstation.status === 'paused') {
      actions.push({ 
        label: '继续', 
        icon: <Play className="h-3 w-3 mr-2" />,
        action: () => showSuccess(`工位 ${workstation.name} 继续成功`),
        className: 'text-blue-600 hover:bg-blue-50'
      });
    }
    
    if (workstation.status === 'running' || workstation.status === 'paused') {
      actions.push({ 
        label: '停止', 
        icon: <StopCircle className="h-3 w-3 mr-2" />,
        action: () => {
          if (window.confirm(`确定要停止工位 ${workstation.name} 吗？`)) {
            showSuccess(`工位 ${workstation.name} 停止成功`);
          }
        },
        className: 'text-red-600 hover:bg-red-50'
      });
    }
    
    // 添加编辑和删除选项
    actions.push({ 
      label: '编辑', 
      icon: <MoreVertical className="h-3 w-3 mr-2" />,
      action: () => showSuccess(`编辑工位 ${workstation.name}`),
      className: 'text-blue-600 hover:bg-blue-50'
    });
    
    actions.push({ 
      label: '删除', 
      icon: <MoreVertical className="h-3 w-3 mr-2" />,
      action: () => {
        if (window.confirm(`确定要删除工位 ${workstation.name} 吗？删除后无法恢复！`)) {
          showSuccess(`工位 ${workstation.name} 删除成功`);
        }
      },
      className: 'text-red-600 hover:bg-red-50'
    });
    
    return actions;
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索工位名称..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">所有状态</option>
                <option value="running">运行中</option>
                <option value="passed">老化通过</option>
                <option value="failed">老化失败</option>
                <option value="stopped">已停止</option>
                <option value="paused">已暂停</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkstations.map((workstation) => (
          <Card key={workstation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workstation.name}</CardTitle>
                {getStatusIcon(workstation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 老化配置信息 - 始终显示占位符确保对齐 */}
              <div className="flex items-center space-x-2 text-sm min-h-6">
                <span className="text-muted-foreground">老化配置:</span>
                {workstation.currentAgingProcess ? (
                  <span className="font-medium text-blue-600">{workstation.currentAgingProcess}</span>
                ) : (
                  <span className="text-muted-foreground italic">无激活配置</span>
                )}
              </div>
              
              {/* 在线设备信息 - 显示设备类型，悬浮显示详细信息 */}
              <div className="space-y-1 min-h-12">
                <div className="text-sm text-muted-foreground">在线设备:</div>
                {workstation.onlineDevices.length > 0 ? (
                  <div 
                    className="flex flex-wrap gap-1 max-h-12 overflow-hidden"
                    title={workstation.onlineDevices.map(device => 
                      `${device.deviceType} (${device.ip}:${device.port}, ${device.protocol})`
                    ).join('\n')}
                  >
                    {getLimitedDeviceTypes(workstation.onlineDevices).map((deviceType, index) => (
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

              {/* 日志显示 */}
              <div className="space-y-1 min-h-16">
                <div className="text-sm text-muted-foreground">最新日志:</div>
                {workstation.logs.length > 0 && (
                  <div 
                    className="text-xs bg-muted/30 p-2 rounded text-muted-foreground max-h-20 overflow-y-auto"
                    title={workstation.logs.map(log => `${log.timestamp}s: ${log.content}`).join('\n')}
                  >
                    {workstation.logs[workstation.logs.length - 1].timestamp}s: {workstation.logs[workstation.logs.length - 1].content}
                  </div>
                )}
              </div>

              {/* 操作按钮 - 固定黑色操作按钮 with white text on hover */}
              <div className="flex flex-wrap gap-2 pt-2 min-h-12">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleViewDetails(workstation)}
                  className="flex-1 min-w-0"
                >
                  详情
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-black text-white hover:bg-gray-800 hover:text-white flex-1 min-w-0"
                    >
                      操作
                      <MoreVertical className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {getAvailableActions(workstation).map((action, index) => (
                      <DropdownMenuItem 
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          action.action();
                        }}
                        className={action.className}
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkstations.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium text-foreground">没有找到工位</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            尝试调整搜索条件或创建新的工位
          </p>
          <div className="mt-6">
            <Button onClick={() => showSuccess('创建工位功能')}>
              <Plus className="mr-2 h-4 w-4" />
              创建工位
            </Button>
          </div>
        </div>
      )}

      {selectedWorkstation && (
        <WorkstationDetailView 
          workstation={selectedWorkstation} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default WorkstationOverview;