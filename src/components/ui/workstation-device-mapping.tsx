"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  deviceTypeId: string;
}

interface WorkstationDeviceMapping {
  id: string;
  workstationId: string;
  deviceIds: string[]; // 支持多选设备
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
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus-tcp', ip: '192.168.1.101', status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus-tcp', ip: '192.168.1.102', status: 'disconnected', deviceTypeId: 'type2' },
    { id: 'dev3', name: '湿度传感器 C3', protocol: 'modbus-tcp', ip: '192.168.1.103', status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev4', name: '功率计 D4', protocol: 'modbus-tcp', ip: '192.168.1.104', status: 'connected', deviceTypeId: 'type2' },
    { id: 'dev5', name: '压力传感器 E5', protocol: 'modbus-tcp', ip: '192.168.1.105', status: 'connected', deviceTypeId: 'type3' }
  ]);

  const [mappings, setMappings] = useState<WorkstationDeviceMapping[]>([
    { id: 'map1', workstationId: 'ws1', deviceIds: ['dev1', 'dev2'], createdAt: '2025-08-10' },
    { id: 'map2', workstationId: 'ws2', deviceIds: ['dev3', 'dev4', 'dev5'], createdAt: '2025-08-11' },
    { id: 'map3', workstationId: 'ws3', deviceIds: ['dev1', 'dev3'], createdAt: '2025-08-12' }
  ]);

  const [newMapping, setNewMapping] = useState<Omit<WorkstationDeviceMapping, 'id' | 'createdAt'>>({
    workstationId: '',
    deviceIds: []
  });

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const handleAddMapping = () => {
    if (!newMapping.workstationId || selectedDevices.length === 0) {
      showError('请选择工位和至少一个设备');
      return;
    }

    // 检查是否已存在相同的工位映射
    const existingMapping = mappings.find(m => m.workstationId === newMapping.workstationId);
    if (existingMapping) {
      showError('该工位已存在设备映射，请编辑现有映射');
      return;
    }

    const mapping: WorkstationDeviceMapping = {
      id: `mapping-${Date.now()}`,
      workstationId: newMapping.workstationId,
      deviceIds: selectedDevices,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMappings([...mappings, mapping]);
    setNewMapping({ workstationId: '', deviceIds: [] });
    setSelectedDevices([]);
    showSuccess('工位设备映射添加成功');
  };

  const handleUpdateMapping = (workstationId: string) => {
    if (selectedDevices.length === 0) {
      showError('请至少选择一个设备');
      return;
    }

    setMappings(mappings.map(mapping => 
      mapping.workstationId === workstationId 
        ? { ...mapping, deviceIds: selectedDevices }
        : mapping
    ));
    
    setSelectedDevices([]);
    showSuccess('工位设备映射更新成功');
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
    showSuccess('工位设备映射删除成功');
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const getWorkstationName = (id: string) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getDeviceNames = (deviceIds: string[]) => {
    return deviceIds
      .map(id => devices.find(dev => dev.id === id)?.name || '未知设备')
      .join(', ');
  };

  const handleEditMapping = (mapping: WorkstationDeviceMapping) => {
    setNewMapping({ workstationId: mapping.workstationId, deviceIds: mapping.deviceIds });
    setSelectedDevices([...mapping.deviceIds]);
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
                onValueChange={(value) => {
                  setNewMapping({ ...newMapping, workstationId: value });
                  // 如果选择的工位已有映射，加载现有设备
                  const existing = mappings.find(m => m.workstationId === value);
                  if (existing) {
                    setSelectedDevices([...existing.deviceIds]);
                  } else {
                    setSelectedDevices([]);
                  }
                }}
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
          </div>

          <div className="space-y-2">
            <Label>选择设备 *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {devices.map(device => (
                <div key={device.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`device-${device.id}`}
                    checked={selectedDevices.includes(device.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDevices(prev => [...prev, device.id]);
                      } else {
                        setSelectedDevices(prev => prev.filter(id => id !== device.id));
                      }
                    }}
                  />
                  <Label htmlFor={`device-${device.id}`} className="text-sm">
                    {device.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleAddMapping} className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              添加映射
            </Button>
            {newMapping.workstationId && mappings.some(m => m.workstationId === newMapping.workstationId) && (
              <Button 
                variant="secondary" 
                onClick={() => handleUpdateMapping(newMapping.workstationId)} 
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                更新映射
              </Button>
            )}
          </div>
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
                <TableHead>关联设备</TableHead>
                <TableHead>设备数量</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-medium">{getWorkstationName(mapping.workstationId)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-xs truncate" title={getDeviceNames(mapping.deviceIds)}>
                      {getDeviceNames(mapping.deviceIds)}
                    </div>
                  </TableCell>
                  <TableCell>{mapping.deviceIds.length}</TableCell>
                  <TableCell>{mapping.createdAt}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMapping(mapping)}
                    >
                      编辑
                    </Button>
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
              <div className="text-sm text-muted-foreground">已映射工位</div>
              <div className="text-2xl font-bold">{mappings.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDeviceMapping;