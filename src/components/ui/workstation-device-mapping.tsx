"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2,
  Link,
  Unlink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Workstation {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

interface Device {
  id: string;
  name: string;
  protocol: 'modbus' | 'can';
  status: 'connected' | 'disconnected';
}

interface WorkstationDeviceMapping {
  workstationId: string;
  deviceId: string;
  deviceType: 'temperature' | 'voltage' | 'current' | 'pressure' | 'humidity' | 'custom';
  role: 'primary' | 'secondary' | 'monitoring';
}

const WorkstationDeviceMapping = () => {
  const [workstations] = useState<Workstation[]>([
    { id: 'ws1', name: '工位 A1', location: '车间1', status: 'active' },
    { id: 'ws2', name: '工位 B2', location: '车间1', status: 'active' },
    { id: 'ws3', name: '工位 C3', location: '车间2', status: 'inactive' },
  ]);

  const [devices] = useState<Device[]>([
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus', status: 'connected' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus', status: 'connected' },
    { id: 'dev3', name: 'CAN 控制器 C3', protocol: 'can', status: 'disconnected' },
    { id: 'dev4', name: '湿度传感器 D4', protocol: 'modbus', status: 'connected' },
    { id: 'dev5', name: '压力传感器 E5', protocol: 'modbus', status: 'connected' },
  ]);

  const [mappings, setMappings] = useState<WorkstationDeviceMapping[]>([
    { workstationId: 'ws1', deviceId: 'dev1', deviceType: 'temperature', role: 'primary' },
    { workstationId: 'ws1', deviceId: 'dev2', deviceType: 'voltage', role: 'primary' },
    { workstationId: 'ws2', deviceId: 'dev4', deviceType: 'humidity', role: 'primary' },
    { workstationId: 'ws2', deviceId: 'dev5', deviceType: 'pressure', role: 'primary' },
  ]);

  const [newMapping, setNewMapping] = useState<Omit<WorkstationDeviceMapping, 'workstationId'>>({
    deviceId: '',
    deviceType: 'temperature',
    role: 'primary'
  });

  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('ws1');

  const addMapping = () => {
    if (newMapping.deviceId) {
      setMappings([
        ...mappings,
        { ...newMapping, workstationId: selectedWorkstation }
      ]);
      setNewMapping({
        deviceId: '',
        deviceType: 'temperature',
        role: 'primary'
      });
    }
  };

  const removeMapping = (deviceId: string) => {
    setMappings(mappings.filter(mapping => 
      !(mapping.workstationId === selectedWorkstation && mapping.deviceId === deviceId)
    ));
  };

  const getWorkstationName = (id: string) => {
    return workstations.find(ws => ws.id === id)?.name || id;
  };

  const getDeviceName = (id: string) => {
    return devices.find(dev => dev.id === id)?.name || id;
  };

  const getDeviceStatus = (id: string) => {
    return devices.find(dev => dev.id === id)?.status || 'disconnected';
  };

  const filteredMappings = mappings.filter(mapping => mapping.workstationId === selectedWorkstation);
  const availableDevices = devices.filter(device => 
    !filteredMappings.some(mapping => mapping.deviceId === device.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>工位-设备映射</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="workstationSelect">选择工位:</Label>
            <Select value={selectedWorkstation} onValueChange={setSelectedWorkstation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workstations.map(ws => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name} ({ws.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="deviceSelect">设备</Label>
              <Select 
                value={newMapping.deviceId} 
                onValueChange={(value) => setNewMapping({...newMapping, deviceId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择设备" />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceType">设备类型</Label>
              <Select 
                value={newMapping.deviceType} 
                onValueChange={(value) => setNewMapping({...newMapping, deviceType: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">温度</SelectItem>
                  <SelectItem value="voltage">电压</SelectItem>
                  <SelectItem value="current">电流</SelectItem>
                  <SelectItem value="pressure">压力</SelectItem>
                  <SelectItem value="humidity">湿度</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">角色</Label>
              <Select 
                value={newMapping.role} 
                onValueChange={(value) => setNewMapping({...newMapping, role: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">主要</SelectItem>
                  <SelectItem value="secondary">次要</SelectItem>
                  <SelectItem value="monitoring">监控</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addMapping} className="w-full" disabled={!newMapping.deviceId}>
                <Plus className="h-4 w-4 mr-2" />
                添加映射
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">当前映射 ({filteredMappings.length} 个设备)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备名称</TableHead>
                <TableHead>设备类型</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.deviceId}>
                  <TableCell>{getDeviceName(mapping.deviceId)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {mapping.deviceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mapping.role === 'primary' ? 'default' : 'secondary'}>
                      {mapping.role === 'primary' ? '主要' : mapping.role === 'secondary' ? '次要' : '监控'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getDeviceStatus(mapping.deviceId) === 'connected' ? 'default' : 'destructive'}>
                      {getDeviceStatus(mapping.deviceId) === 'connected' ? '在线' : '离线'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMapping(mapping.deviceId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">映射说明</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>主要设备</strong>: 参与老化流程控制的关键设备</li>
            <li>• <strong>次要设备</strong>: 辅助监控，不影响流程执行</li>
            <li>• <strong>监控设备</strong>: 仅用于数据记录和显示</li>
            <li>• 只有在线的设备才能启动对应的老化流程</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkstationDeviceMapping;