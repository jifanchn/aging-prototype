"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wifi, 
  TestTube,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviceConnection {
  id: string;
  name: string;
  protocol: 'modbus' | 'can';
  ipAddress?: string;
  port?: number;
  slaveId?: number;
  canInterface?: string;
  canBaudRate?: number;
  canId?: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastSeen?: string;
}

const DeviceConnectionConfig = () => {
  const [devices, setDevices] = useState<DeviceConnection[]>([
    {
      id: '1',
      name: '温度传感器 A1',
      protocol: 'modbus',
      ipAddress: '192.168.1.101',
      port: 502,
      slaveId: 1,
      status: 'connected',
      lastSeen: '2025-08-13 14:30:22'
    },
    {
      id: '2',
      name: '电压监测器 B2',
      protocol: 'modbus',
      ipAddress: '192.168.1.102',
      port: 502,
      slaveId: 2,
      status: 'connected',
      lastSeen: '2025-08-13 14:30:15'
    },
    {
      id: '3',
      name: 'CAN 控制器 C3',
      protocol: 'can',
      canInterface: 'can0',
      canBaudRate: 500000,
      canId: '0x123',
      status: 'disconnected',
      lastSeen: '2025-08-13 12:15:30'
    }
  ]);

  const [newDevice, setNewDevice] = useState<Omit<DeviceConnection, 'id' | 'status' | 'lastSeen'>>({
    name: '',
    protocol: 'modbus',
    ipAddress: '192.168.1.100',
    port: 502,
    slaveId: 1
  });

  const testConnection = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, status: 'connecting' } : device
    ));
    
    // Simulate connection test
    setTimeout(() => {
      setDevices(devices.map(device => 
        device.id === deviceId ? { ...device, status: 'connected', lastSeen: new Date().toLocaleString() } : device
      ));
    }, 1000);
  };

  const addDevice = () => {
    if (newDevice.name.trim()) {
      const device: DeviceConnection = {
        ...newDevice,
        id: Date.now().toString(),
        status: 'disconnected'
      };
      setDevices([...devices, device]);
      setNewDevice({
        name: '',
        protocol: 'modbus',
        ipAddress: '192.168.1.100',
        port: 502,
        slaveId: 1
      });
    }
  };

  const getStatusIcon = (status: DeviceConnection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: DeviceConnection['status']) => {
    switch (status) {
      case 'connected': return '已连接';
      case 'disconnected': return '已断开';
      case 'connecting': return '连接中...';
      case 'error': return '连接错误';
      default: return '未知';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wifi className="h-5 w-5" />
          <span>设备连接配置</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-3">添加新设备</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceName">设备名称</Label>
              <Input
                id="deviceName"
                value={newDevice.name}
                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                placeholder="温度传感器 A1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="protocol">协议类型</Label>
              <Select
                value={newDevice.protocol}
                onValueChange={(value) => setNewDevice({...newDevice, protocol: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择协议" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modbus">Modbus TCP</SelectItem>
                  <SelectItem value="can">CAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newDevice.protocol === 'modbus' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP 地址</Label>
                  <Input
                    id="ipAddress"
                    value={newDevice.ipAddress}
                    onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">端口</Label>
                  <Input
                    id="port"
                    type="number"
                    value={newDevice.port}
                    onChange={(e) => setNewDevice({...newDevice, port: parseInt(e.target.value) || 502})}
                    placeholder="502"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slaveId">从站ID</Label>
                  <Input
                    id="slaveId"
                    type="number"
                    value={newDevice.slaveId}
                    onChange={(e) => setNewDevice({...newDevice, slaveId: parseInt(e.target.value) || 1})}
                    placeholder="1"
                  />
                </div>
              </>
            )}
            
            {newDevice.protocol === 'can' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="canInterface">CAN 接口</Label>
                  <Input
                    id="canInterface"
                    value={newDevice.canInterface}
                    onChange={(e) => setNewDevice({...newDevice, canInterface: e.target.value})}
                    placeholder="can0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canBaudRate">波特率</Label>
                  <Select
                    value={newDevice.canBaudRate?.toString() || '500000'}
                    onValueChange={(value) => setNewDevice({...newDevice, canBaudRate: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择波特率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="125000">125 kbps</SelectItem>
                      <SelectItem value="250000">250 kbps</SelectItem>
                      <SelectItem value="500000">500 kbps</SelectItem>
                      <SelectItem value="1000000">1 Mbps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canId">CAN ID</Label>
                  <Input
                    id="canId"
                    value={newDevice.canId}
                    onChange={(e) => setNewDevice({...newDevice, canId: e.target.value})}
                    placeholder="0x123"
                  />
                </div>
              </>
            )}
            
            <div className="flex items-end">
              <Button onClick={addDevice} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                添加设备
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">已配置设备</h3>
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(device.status)}
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {device.protocol === 'modbus' 
                      ? `${device.ipAddress}:${device.port} (ID: ${device.slaveId})`
                      : `${device.canInterface} @ ${device.canBaudRate}bps (ID: ${device.canId})`
                    }
                  </div>
                  {device.lastSeen && (
                    <div className="text-xs text-muted-foreground">最后连接: {device.lastSeen}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={device.status === 'connected' ? 'default' : 'secondary'}>
                  {getStatusText(device.status)}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => testConnection(device.id)}
                >
                  <TestTube className="h-4 w-4 mr-1" />
                  Probe
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceConnectionConfig;