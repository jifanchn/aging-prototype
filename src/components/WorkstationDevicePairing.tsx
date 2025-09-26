"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Edit,
  Trash2,
  X
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DeviceType {
  id: string;
  name: string;
  protocol: string;
  description: string;
}

interface Workstation {
  id: string;
  name: string;
  description: string;
}

interface DeviceInstance {
  id: string;
  deviceTypeId: string;
  ip: string;
  port: number;
  name?: string;
}

interface DevicePairing {
  id: string;
  workstationId: string;
  deviceInstances: DeviceInstance[];
  createdAt: string;
}

const WorkstationDevicePairing = () => {
  const [workstations] = useState<Workstation[]>([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: '温度传感器', protocol: 'modbus-tcp', description: '用于监测温度' },
    { id: 'type2', name: '电压监测器', protocol: 'modbus-tcp', description: '用于监测电压' },
    { id: 'type3', name: '湿度传感器', protocol: 'modbus-tcp', description: '用于监测湿度' },
    { id: 'type4', name: '功率计', protocol: 'modbus-rtu', description: '用于监测功率' }
  ]);

  const [pairings, setPairings] = useState<DevicePairing[]>([
    { 
      id: 'pair1', 
      workstationId: 'ws1', 
      deviceInstances: [
        { id: 'dev1', deviceTypeId: 'type1', ip: '192.168.1.101', port: 502, name: '温度传感器 A1' },
        { id: 'dev2', deviceTypeId: 'type2', ip: '192.168.1.102', port: 502, name: '电压监测器 B2' }
      ], 
      createdAt: '2025-08-10' 
    },
    { 
      id: 'pair2', 
      workstationId: 'ws2', 
      deviceInstances: [
        { id: 'dev3', deviceTypeId: 'type1', ip: '192.168.1.103', port: 502, name: '温度传感器 C3' },
        { id: 'dev4', deviceTypeId: 'type2', ip: '192.168.1.104', port: 502, name: '电压监测器 D4' },
        { id: 'dev5', deviceTypeId: 'type3', ip: '192.168.1.105', port: 502, name: '湿度传感器 E5' }
      ], 
      createdAt: '2025-08-11' 
    }
  ]);

  const [newPairing, setNewPairing] = useState({ workstationId: '', deviceTypeId: '', ip: '', port: 502 });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPairingId, setEditingPairingId] = useState('');
  const [editingDeviceId, setEditingDeviceId] = useState('');

  const getWorkstationName = (id: string) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(dt => dt.id === id)?.name || '未知设备类型';
  };

  const handleAddDeviceToPairing = () => {
    if (!newPairing.workstationId || !newPairing.deviceTypeId || !newPairing.ip) {
      showError('请填写完整信息');
      return;
    }

    const existingPairing = pairings.find(p => p.workstationId === newPairing.workstationId);
    
    if (isEditing && editingDeviceId) {
      // 编辑现有设备实例
      setPairings(pairings.map(pairing => {
        if (pairing.id === editingPairingId) {
          return {
            ...pairing,
            deviceInstances: pairing.deviceInstances.map(device => 
              device.id === editingDeviceId 
                ? { 
                    ...device, 
                    deviceTypeId: newPairing.deviceTypeId, 
                    ip: newPairing.ip, 
                    port: newPairing.port,
                    name: `${getDeviceTypeName(newPairing.deviceTypeId)} ${newPairing.ip.split('.').pop()}`
                  }
                : device
            )
          };
        }
        return pairing;
      }));
      showSuccess('设备实例更新成功');
    } else {
      // 添加新设备实例
      const deviceInstance: DeviceInstance = {
        id: `dev-${Date.now()}`,
        deviceTypeId: newPairing.deviceTypeId,
        ip: newPairing.ip,
        port: newPairing.port,
        name: `${getDeviceTypeName(newPairing.deviceTypeId)} ${newPairing.ip.split('.').pop()}`
      };

      if (existingPairing) {
        // 更新现有配对
        setPairings(pairings.map(pairing => 
          pairing.id === existingPairing.id 
            ? { ...pairing, deviceInstances: [...pairing.deviceInstances, deviceInstance] }
            : pairing
        ));
      } else {
        // 创建新配对
        const newPairingObj: DevicePairing = {
          id: `pairing-${Date.now()}`,
          workstationId: newPairing.workstationId,
          deviceInstances: [deviceInstance],
          createdAt: new Date().toISOString().split('T')[0]
        };
        setPairings([...pairings, newPairingObj]);
      }
      showSuccess('设备实例添加成功');
    }

    // 重置表单
    resetForm();
  };

  const resetForm = () => {
    setNewPairing({ workstationId: '', deviceTypeId: '', ip: '', port: 502 });
    setIsEditing(false);
    setEditingPairingId('');
    setEditingDeviceId('');
  };

  const handleEditDevice = (pairingId: string, device: DeviceInstance) => {
    setNewPairing({ 
      workstationId: pairings.find(p => p.id === pairingId)?.workstationId || '', 
      deviceTypeId: device.deviceTypeId, 
      ip: device.ip, 
      port: device.port 
    });
    setIsEditing(true);
    setEditingPairingId(pairingId);
    setEditingDeviceId(device.id);
  };

  const handleDeleteDevice = (pairingId: string, deviceId: string) => {
    if (window.confirm('确定要删除这个设备实例吗？')) {
      setPairings(pairings.map(pairing => {
        if (pairing.id === pairingId) {
          const updatedDevices = pairing.deviceInstances.filter(d => d.id !== deviceId);
          if (updatedDevices.length === 0) {
            // 如果没有设备了，删除整个配对
            return null;
          }
          return { ...pairing, deviceInstances: updatedDevices };
        }
        return pairing;
      }).filter(Boolean) as DevicePairing[]);
      showSuccess('设备实例删除成功');
    }
  };

  const handleDeletePairing = (pairingId: string) => {
    if (window.confirm('确定要删除这个工位的所有设备配对吗？')) {
      setPairings(pairings.filter(p => p.id !== pairingId));
      showSuccess('工位设备配对删除成功');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? '编辑设备实例' : '添加设备实例到工位'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.workstationId}
                onChange={(e) => setNewPairing({ ...newPairing, workstationId: e.target.value })}
                disabled={isEditing}
              >
                <option value="">选择工位</option>
                {workstations.map(workstation => (
                  <option key={workstation.id} value={workstation.id}>
                    {workstation.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="deviceTypeSelect" className="text-sm font-medium">选择设备类型 *</label>
              <select
                id="deviceTypeSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.deviceTypeId}
                onChange={(e) => setNewPairing({ ...newPairing, deviceTypeId: e.target.value })}
              >
                <option value="">选择设备类型</option>
                {deviceTypes.map(deviceType => (
                  <option key={deviceType.id} value={deviceType.id}>
                    {deviceType.name} ({deviceType.protocol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ipAddress" className="text-sm font-medium">IP 地址 *</label>
              <input
                id="ipAddress"
                type="text"
                className="px-3 py-2 border rounded-md bg-background w-full"
                placeholder="192.168.1.xxx"
                value={newPairing.ip}
                onChange={(e) => setNewPairing({ ...newPairing, ip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="port" className="text-sm font-medium">端口 *</label>
              <input
                id="port"
                type="number"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.port}
                onChange={(e) => setNewPairing({ ...newPairing, port: parseInt(e.target.value) || 502 })}
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleAddDeviceToPairing} className="flex-1" disabled={!newPairing.workstationId || !newPairing.deviceTypeId || !newPairing.ip}>
              {isEditing ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? '更新设备' : '添加设备'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={resetForm} className="flex-1">
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>工位-设备配对列表</CardTitle>
        </CardHeader>
        <CardContent>
          {pairings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无工位-设备配对，请先创建配对
            </div>
          ) : (
            <div className="space-y-4">
              {pairings.map((pairing) => (
                <div key={pairing.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">{getWorkstationName(pairing.workstationId)}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePairing(pairing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除配对
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {pairing.deviceInstances.map(device => (
                        <div key={device.id} className="bg-muted/50 rounded p-2 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{device.name || `${getDeviceTypeName(device.deviceTypeId)} ${device.ip}`}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {getDeviceTypeName(device.deviceTypeId)} | {device.ip}:{device.port}
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDevice(pairing.id, device)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDevice(pairing.id, device.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-3">
                      创建时间: {pairing.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkstationDevicePairing;