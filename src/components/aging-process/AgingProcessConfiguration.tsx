"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Settings } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface AgingProcess {
  id: string;
  name: string;
  description: string;
  duration: number; // 小时
  temperature: number;
  voltage: number;
  devices: string[]; // 设备ID数组
  createdAt: string;
}

interface Device {
  id: string;
  name: string;
  protocol: string;
  ip: string;
  status: string;
  registerTableId: string;
}

const AgingProcessConfiguration = () => {
  const [processes, setProcesses] = useState<AgingProcess[]>([
    {
      id: 'proc1',
      name: '高温老化流程 A',
      description: '适用于高温环境下的设备老化测试',
      duration: 4,
      temperature: 65,
      voltage: 220,
      devices: ['dev1', 'dev2'],
      createdAt: '2025-08-10'
    },
    {
      id: 'proc2',
      name: '标准老化流程 B',
      description: '标准条件下的设备老化测试',
      duration: 8,
      temperature: 55,
      voltage: 220,
      devices: ['dev3', 'dev4'],
      createdAt: '2025-08-11'
    }
  ]);

  const [devices] = useState<Device[]>([
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus-tcp', ip: '192.168.1.101', status: 'connected', registerTableId: 'table1' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus-tcp', ip: '192.168.1.102', status: 'disconnected', registerTableId: 'table2' },
    { id: 'dev3', name: '湿度传感器 C3', protocol: 'modbus-tcp', ip: '192.168.1.103', status: 'connected', registerTableId: 'table1' },
    { id: 'dev4', name: '功率计 D4', protocol: 'modbus-tcp', ip: '192.168.1.104', status: 'connected', registerTableId: 'table2' }
  ]);

  const [newProcess, setNewProcess] = useState<Omit<AgingProcess, 'id' | 'createdAt' | 'devices'>>({
    name: '',
    description: '',
    duration: 4,
    temperature: 65,
    voltage: 220
  });

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const handleAddProcess = () => {
    if (!newProcess.name || selectedDevices.length === 0) {
      showError('请输入流程名称并选择至少一个设备');
      return;
    }

    const process: AgingProcess = {
      id: `process-${Date.now()}`,
      ...newProcess,
      devices: selectedDevices,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProcesses([...processes, process]);
    setNewProcess({
      name: '',
      description: '',
      duration: 4,
      temperature: 65,
      voltage: 220
    });
    setSelectedDevices([]);
    showSuccess('老化流程添加成功');
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(process => process.id !== id));
    showSuccess('老化流程删除成功');
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const getDeviceNames = (deviceIds: string[]) => {
    return deviceIds
      .map(id => devices.find(d => d.id === id)?.name || '未知设备')
      .join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>新建老化流程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="processName">流程名称 *</Label>
              <Input
                id="processName"
                placeholder="高温老化流程"
                value={newProcess.name}
                onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">持续时间 (小时)</Label>
              <Input
                id="duration"
                type="number"
                value={newProcess.duration}
                onChange={(e) => setNewProcess({ ...newProcess, duration: parseInt(e.target.value) || 4 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">温度 (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={newProcess.temperature}
                onChange={(e) => setNewProcess({ ...newProcess, temperature: parseInt(e.target.value) || 65 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voltage">电压 (V)</Label>
              <Input
                id="voltage"
                type="number"
                value={newProcess.voltage}
                onChange={(e) => setNewProcess({ ...newProcess, voltage: parseInt(e.target.value) || 220 })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                placeholder="流程描述"
                value={newProcess.description}
                onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>选择设备 *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {devices.map(device => (
                <div key={device.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`device-${device.id}`}
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDeviceSelection(device.id)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`device-${device.id}`} className="text-sm">
                    {device.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddProcess} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            添加老化流程
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>老化流程列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>流程名称</TableHead>
                <TableHead>持续时间</TableHead>
                <TableHead>温度/电压</TableHead>
                <TableHead>关联设备</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">
                    <div>{process.name}</div>
                    <div className="text-xs text-muted-foreground">{process.description}</div>
                  </TableCell>
                  <TableCell>{process.duration} 小时</TableCell>
                  <TableCell>{process.temperature}°C / {process.voltage}V</TableCell>
                  <TableCell>
                    <div className="text-xs max-w-xs truncate" title={getDeviceNames(process.devices)}>
                      {getDeviceNames(process.devices)}
                    </div>
                  </TableCell>
                  <TableCell>{process.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProcess(process.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgingProcessConfiguration;