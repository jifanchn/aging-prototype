"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2,
  Settings
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DeviceType {
  id: string;
  name: string;
  protocol: string;
  description: string;
}

interface ProcessDevice {
  id: string;
  deviceTypeId: string;
  alias: string;
}

interface AgingProcess {
  id: string;
  name: string;
  description: string;
  devices: ProcessDevice[];
  createdAt: string;
}

const ProcessManagementTab = () => {
  const [processes, setProcesses] = useState<AgingProcess[]>([
    { 
      id: 'proc1', 
      name: '高温老化流程 A', 
      description: '适用于高温环境下的设备老化测试',
      devices: [
        { id: 'dev1', deviceTypeId: 'type1', alias: 'DEV1' },
        { id: 'dev2', deviceTypeId: 'type2', alias: 'DEV2' }
      ],
      createdAt: '2025-08-10' 
    }
  ]);

  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: 'Agave TH', protocol: 'modbus-tcp', description: '温度湿度传感器' },
    { id: 'type2', name: '电压监测器', protocol: 'modbus-tcp', description: '用于监测电压' },
    { id: 'type3', name: '湿度传感器', protocol: 'modbus-tcp', description: '用于监测湿度' },
    { id: 'type4', name: '功率计', protocol: 'modbus-rtu', description: '用于监测功率' }
  ]);

  const [newProcess, setNewProcess] = useState({ name: '', description: '' });
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [processDevices, setProcessDevices] = useState<ProcessDevice[]>([]);
  const [newDevice, setNewDevice] = useState({ deviceTypeId: '', alias: '' });

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(dt => dt.id === id)?.name || '未知设备类型';
  };

  const handleAddProcess = () => {
    if (!newProcess.name.trim()) {
      showError('请输入流程名称');
      return;
    }

    const process: AgingProcess = {
      id: `proc-${Date.now()}`,
      name: newProcess.name,
      description: newProcess.description,
      devices: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProcesses([...processes, process]);
    setNewProcess({ name: '', description: '' });
    showSuccess('老化流程创建成功');
  };

  const handleDeleteProcess = (processId: string) => {
    if (window.confirm('确定要删除这个老化流程吗？')) {
      setProcesses(processes.filter(p => p.id !== processId));
      if (selectedProcessId === processId) {
        setSelectedProcessId(null);
        setProcessDevices([]);
      }
      showSuccess('老化流程删除成功');
    }
  };

  const handleSelectProcess = (process: AgingProcess) => {
    setSelectedProcessId(process.id);
    setProcessDevices(process.devices);
  };

  const handleAddDeviceToProcess = () => {
    if (!newDevice.deviceTypeId || !newDevice.alias.trim()) {
      showError('请选择设备类型并输入别名');
      return;
    }

    if (processDevices.some(d => d.alias === newDevice.alias)) {
      showError('别名已存在，请使用不同的别名');
      return;
    }

    const device: ProcessDevice = {
      id: `dev-${Date.now()}`,
      deviceTypeId: newDevice.deviceTypeId,
      alias: newDevice.alias
    };

    setProcessDevices([...processDevices, device]);
    
    // 更新流程中的设备列表
    if (selectedProcessId) {
      setProcesses(processes.map(p => 
        p.id === selectedProcessId 
          ? { ...p, devices: [...p.devices, device] }
          : p
      ));
    }

    setNewDevice({ deviceTypeId: '', alias: '' });
    showSuccess('设备添加成功');
  };

  const handleRemoveDevice = (deviceId: string) => {
    setProcessDevices(processDevices.filter(d => d.id !== deviceId));
    
    if (selectedProcessId) {
      setProcesses(processes.map(p => 
        p.id === selectedProcessId 
          ? { ...p, devices: p.devices.filter(d => d.id !== deviceId) }
          : p
      ));
    }
    
    showSuccess('设备移除成功');
  };

  return (
    <div className="space-y-6">
      {/* 流程列表 */}
      <Card>
        <CardHeader>
          <CardTitle>老化流程列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes.map(process => (
              <div key={process.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{process.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{process.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {process.devices.map(device => (
                        <span key={device.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {device.alias} ({getDeviceTypeName(device.deviceTypeId)})
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      创建时间: {process.createdAt}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectProcess(process)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      配置
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProcess(process.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 新建流程 */}
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
                placeholder="输入流程名称"
                value={newProcess.name}
                onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processDescription">流程描述</Label>
              <Input
                id="processDescription"
                placeholder="输入流程描述"
                value={newProcess.description}
                onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddProcess} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            创建流程
          </Button>
        </CardContent>
      </Card>

      {/* 设备配置（针对选中的流程） */}
      {selectedProcessId && (
        <Card>
          <CardHeader>
            <CardTitle>
              配置设备 - {processes.find(p => p.id === selectedProcessId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceTypeSelect">选择设备类型 *</Label>
                <select
                  id="deviceTypeSelect"
                  className="px-3 py-2 border rounded-md bg-background w-full"
                  value={newDevice.deviceTypeId}
                  onChange={(e) => setNewDevice({ ...newDevice, deviceTypeId: e.target.value })}
                >
                  <option value="">选择设备类型</option>
                  {deviceTypes.map(deviceType => (
                    <option key={deviceType.id} value={deviceType.id}>
                      {deviceType.name} ({deviceType.protocol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceAlias">设备别名 *</Label>
                <Input
                  id="deviceAlias"
                  placeholder="例如: DEV1, DEV2"
                  value={newDevice.alias}
                  onChange={(e) => setNewDevice({ ...newDevice, alias: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
            <Button 
              onClick={handleAddDeviceToProcess} 
              className="w-full"
              disabled={!newDevice.deviceTypeId || !newDevice.alias.trim()}
            >
              <Plus className="mr-2 h-4 w-4" />
              添加设备到流程
            </Button>

            {/* 已添加的设备列表 */}
            {processDevices.length > 0 && (
              <div className="mt-6">
                <Label>已添加的设备</Label>
                <div className="space-y-2 mt-2">
                  {processDevices.map(device => (
                    <div key={device.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div>
                        <span className="font-medium">{device.alias}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({getDeviceTypeName(device.deviceTypeId)})
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDevice(device.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessManagementTab;