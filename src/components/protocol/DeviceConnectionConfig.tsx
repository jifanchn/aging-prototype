"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Wifi } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DeviceConfig {
  id: string;
  name: string;
  protocol: 'modbus-tcp' | 'modbus-rtu' | 'can';
  ip: string;
  port: number;
  slaveId: number;
  registerTableId: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface RegisterTable {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const DeviceConnectionConfig = () => {
  const [devices, setDevices] = useState<DeviceConfig[]>([
    {
      id: '1',
      name: '温度传感器 A1',
      protocol: 'modbus-tcp',
      ip: '192.168.1.101',
      port: 502,
      slaveId: 1,
      registerTableId: 'table1',
      status: 'connected'
    },
    {
      id: '2',
      name: '电压监测器 B2',
      protocol: 'modbus-tcp',
      ip: '192.168.1.102',
      port: 502,
      slaveId: 2,
      registerTableId: 'table2',
      status: 'disconnected'
    }
  ]);

  const [registerTables] = useState<RegisterTable[]>([
    {
      id: 'table1',
      name: '温度传感器寄存器表',
      description: '包含温度、湿度等寄存器定义',
      createdAt: '2025-08-10'
    },
    {
      id: 'table2',
      name: '电力监测寄存器表',
      description: '包含电压、电流、功率等寄存器定义',
      createdAt: '2025-08-11'
    },
    {
      id: 'table3',
      name: '通用设备寄存器表',
      description: '通用寄存器映射配置',
      createdAt: '2025-08-12'
    }
  ]);

  const [newDevice, setNewDevice] = useState<Omit<DeviceConfig, 'id' | 'status'>>({
    name: '',
    protocol: 'modbus-tcp',
    ip: '',
    port: 502,
    slaveId: 1,
    registerTableId: ''
  });

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.ip || !newDevice.registerTableId) {
      showError('请填写设备名称、IP地址和选择寄存器表');
      return;
    }

    const device: DeviceConfig = {
      id: `device-${Date.now()}`,
      ...newDevice,
      status: 'disconnected'
    };

    setDevices([...devices, device]);
    setNewDevice({
      name: '',
      protocol: 'modbus-tcp',
      ip: '',
      port: 502,
      slaveId: 1,
      registerTableId: ''
    });
    showSuccess('设备添加成功');
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
    showSuccess('设备删除成功');
  };

  const handleTestConnection = (id: string) => {
    // 模拟连接测试 - properly type the status
    const newStatus: 'connected' | 'error' = Math.random() > 0.5 ? 'connected' : 'error';
    const updatedDevices = devices.map(device => 
      device.id === id 
        ? { ...device, status: newStatus }
        : device
    );
    setDevices(updatedDevices);
    
    const device = updatedDevices.find(d => d.id === id);
    if (device?.status === 'connected') {
      showSuccess(`设备 ${device.name} 连接成功`);
    } else {
      showError(`设备 ${device?.name} 连接失败`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>添加新设备</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">设备名称 *</Label>
              <Input
                id="deviceName"
                placeholder="输入设备名称"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protocol">通信协议</Label>
              <Select
                value={newDevice.protocol}
                onValueChange={(value) => setNewDevice({ ...newDevice, protocol: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择协议" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modbus-tcp">Modbus TCP</SelectItem>
                  <SelectItem value="modbus-rtu">Modbus RTU</SelectItem>
                  <SelectItem value="can">CAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP 地址 *</Label>
              <Input
                id="ipAddress"
                placeholder="192.168.1.100"
                value={newDevice.ip}
                onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">端口号</Label>
              <Input
                id="port"
                type="number"
                value={newDevice.port}
                onChange={(e) => setNewDevice({ ...newDevice, port: parseInt(e.target.value) || 502 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slaveId">从站ID</Label>
              <Input
                id="slaveId"
                type="number"
                value={newDevice.slaveId}
                onChange={(e) => setNewDevice({ ...newDevice, slaveId: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerTable">寄存器表 *</Label>
              <Select
                value={newDevice.registerTableId}
                onValueChange={(value) => setNewDevice({ ...newDevice, registerTableId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择寄存器表" />
                </SelectTrigger>
                <SelectContent>
                  {registerTables.map(table => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddDevice} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            添加设备
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>设备列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备名称</TableHead>
                <TableHead>协议</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead>寄存器表</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.protocol.toUpperCase()}</TableCell>
                  <TableCell>{device.ip}:{device.port}</TableCell>
                  <TableCell>
                    {registerTables.find(t => t.id === device.registerTableId)?.name || '未配置'}
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center space-x-1 ${getStatusColor(device.status)}`}>
                      <Wifi className="h-4 w-4" />
                      <span>
                        {device.status === 'connected' ? '已连接' : 
                         device.status === 'disconnected' ? '未连接' : '连接错误'}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(device.id)}
                    >
                      测试连接
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDevice(device.id)}
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

export default DeviceConnectionConfig;