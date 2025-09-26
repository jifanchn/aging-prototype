"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Settings,
  Plus
} from "lucide-react";
import WorkstationCard from "@/components/ui/workstation-card";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";
import { showSuccess } from "@/utils/toast";

interface Workstation {
  id: number;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'stopped';
  onlineDevices: Array<{
    ip: string;
    name: string;
    deviceType: string;
    port: number;
    protocol: string;
  }>;
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
      status: "stopped", 
      onlineDevices: [
        { ip: "192.168.1.109", name: "温度传感器 I9", deviceType: "温度传感器", port: 502, protocol: "modbus-tcp" }
      ],
      logs: [
        { timestamp: 0, content: "工位初始化完成" },
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
          <WorkstationCard
            key={workstation.id}
            id={workstation.id}
            name={workstation.name}
            status={workstation.status}
            onlineDevices={workstation.onlineDevices}
            logs={workstation.logs}
            onDetailsClick={() => handleViewDetails(workstation)}
            onActionClick={() => {
              const action = window.prompt('选择操作: start, stop, edit, delete');
              if (action) {
                switch(action.toLowerCase()) {
                  case 'start':
                    showSuccess(`工位 ${workstation.name} 启动成功`);
                    break;
                  case 'stop':
                    if (window.confirm(`确定要停止工位 ${workstation.name} 吗？`)) {
                      showSuccess(`工位 ${workstation.name} 停止成功`);
                    }
                    break;
                  case 'edit':
                    showSuccess(`编辑工位 ${workstation.name}`);
                    break;
                  case 'delete':
                    if (window.confirm(`确定要删除工位 ${workstation.name} 吗？删除后无法恢复！`)) {
                      showSuccess(`工位 ${workstation.name} 删除成功`);
                    }
                    break;
                  default:
                    break;
                }
              }
            }}
          />
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