"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Workstation {
  id: string;
  name: string;
  description: string;
}

interface Device {
  id: string;
  name: string;
  protocol: string;
  ip: string;
  status: string;
  registerTableId: string;
}

interface WorkstationDeviceMapping {
  id: string;
  workstationId: string;
  deviceId: string;
  createdAt: string;
}

const WorkstationDeviceMapping = () => {
  const [workstations] = useState<Workstation[]>([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [devices] = useState<Device[]>([
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus-tcp', ip: '192.168.1.101', status: 'connected', registerTableId: 'table1' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus-tcp', ip: '192.168.1.102', status: 'disconnected', registerTableId: 'table2' },
    { id: 'dev3', name: '湿度传感器 C3', protocol: 'modbus-tcp', ip: '192.168.1.103', status: 'connected', registerTableId: 'table1' },
    { id: 'dev4', name: '功率计 D4', protocol: 'modbus-tcp', ip: '192.168.1.104', status: 'connected', registerTableId: 'table2' }
  ]);

  const [mappings, setMappings] = useState<WorkstationDeviceMapping[]>([
    { id: 'map1', workstationId: 'ws1', deviceId: 'dev1', createdAt: '2025-08-10' },
    { id: 'map2', workstationId: 'ws1', deviceId: 'dev2', createdAt: '2025-08-10' },
    { id: 'map3', workstationId: 'ws2', deviceId: 'dev3', createdAt: '2025-08-11' },
    { id: 'map4', workstationId: 'ws3', deviceId: 'dev4', createdAt: '2025-08-12' }
  ]);

  const [newMapping, setNewMapping] = useState<Omit<WorkstationDeviceMapping, 'id' | 'createdAt'>>({
    workstationId: '',
    deviceId: ''
  });

  const handleAddMapping = () => {
    if (!newMapping.workstationId || !newMapping.deviceId) {
      showError('请选择工位和设备');
      return;
    }

    // 检查是否已存在相同的映射
    const existingMapping = mappings.find(
      m => m.workstationId === newMapping.workstationId && m.deviceId === newMapping.deviceId
    );
    if (existingMapping) {
      showError('该设备已映射到此工位');
      return;
    }

    const mapping: WorkstationDeviceMapping = {
      id: `mapping-${Date.now()}`,
      ...newMapping,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMappings([...mappings, mapping]);
    setNewMapping({ workstationId: '', deviceId: '' });
    showSuccess('设备映射添加成功');
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
    showSuccess('设备映射删除成功');
  };

  const getWorkstationName = (id: string) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getDeviceName = (id: string) => {
    return devices.find(dev => dev.id === id)?.name || '未知设备';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>工位-设备映射</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <Select
                value={newMapping.workstationId}
                onValueChange={(value) => setNewMapping({ ...newMapping, workstationId: value })}
              >
                <SelectTrigger id="workstationSelect">
                  <SelectValue placeholder="选择工位" />
                </SelectTrigger>
                <SelectContent>
                  {workstations.map(workstation => (
                    <SelectItem key={workstation.id} value={workstation.id}>
                      {workstation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="deviceSelect" className="text-sm font-medium">选择设备 *</label>
              <Select
                value={newMapping.deviceId}
                onValueChange={(value) => setNewMapping({ ...newMapping, deviceId: value })}
              >
                <SelectTrigger id="deviceSelect">
                  <SelectValue placeholder="选择设备" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name} ({device.ip})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddMapping} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            添加映射
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>映射列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>工位</TableHead>
                <TableHead>设备</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-medium">{getWorkstationName(mapping.workstationId)}</TableCell>
                  <TableCell>{getDeviceName(mapping.deviceId)}</TableCell>
                  <TableCell>{mapping.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMapping(mapping.id)}
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

      <Card>
        <CardHeader>
          <CardTitle>映射统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">总工位数</div>
              <div className="text-2xl font-bold">{workstations.length}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">总设备数</div>
              <div className="text-2xl font-bold">{devices.length}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">映射关系</div>
              <div className="text-2xl font-bold">{mappings.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDeviceMapping;