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
  protocol: 'modbus-tcp' | 'custom';
  description: string;
}

interface GlobalDevice {
  id: string;
  deviceTypeId: string;
  ip: string;
  port: number;
  otherParams: string;
  alias: string; // 全局设备别名，用于老化流程中访问
  name?: string;
}

const GlobalDevicesTab = () => {
  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: '温度传感器', protocol: 'modbus-tcp', description: '用于监测温度' },
    { id: 'type2', name: '电压监测器', protocol: 'modbus-tcp', description: '用于监测电压' },
    { id: 'type3', name: '湿度传感器', protocol: 'modbus-tcp', description: '用于监测湿度' },
    { id: 'type4', name: 'Agave TH', protocol: 'custom', description: '预定义的温度湿度传感器' }
  ]);

  const [globalDevices, setGlobalDevices] = useState<GlobalDevice[]>([
    { 
      id: 'global1', 
      deviceTypeId: 'type1', 
      ip: '192.168.1.201', 
      port: 502, 
      otherParams: '', 
      alias: 'GLOBAL_TEMP', 
      name: '全局温度传感器' 
    },
    { 
      id: 'global2', 
      deviceTypeId: 'type4', 
      ip: '', 
      port: 0, 
      otherParams: 'device_id=AGV001,model=TH2023', 
      alias: 'GLOBAL_AGAVE', 
      name: '全局Agave设备' 
    }
  ]);

  const [newDevice, setNewDevice] = useState({ 
    deviceTypeId: '', 
    ip: '', 
    port: 502, 
    otherParams: '', 
    alias: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState('');

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(dt => dt.id === id)?.name || '未知设备类型';
  };

  const handleAddGlobalDevice = () => {
    if (!newDevice.deviceTypeId || !newDevice.alias.trim()) {
      showError('请填写设备类型和全局设备别名');
      return;
    }

    // For custom device types, IP and port are not required
    const selectedDeviceType = deviceTypes.find(dt => dt.id === newDevice.deviceTypeId);
    if (selectedDeviceType?.protocol === 'modbus-tcp') {
      if (!newDevice.ip) {
        showError('Modbus TCP设备需要填写IP地址');
        return;
      }
    }

    // Check if alias already exists
    if (globalDevices.some(d => d.alias === newDevice.alias)) {
      showError('全局设备别名已存在，请使用不同的别名');
      return;
    }

    if (isEditing && editingDeviceId) {
      // Edit existing global device
      setGlobalDevices(globalDevices.map(device => 
        device.id === editingDeviceId 
          ? { 
              ...device, 
              deviceTypeId: newDevice.deviceTypeId, 
              ip: newDevice.ip, 
              port: selectedDeviceType?.protocol === 'custom' ? 0 : newDevice.port,
              otherParams: newDevice.otherParams,
              alias: newDevice.alias,
              name: `${getDeviceTypeName(newDevice.deviceTypeId)} ${newDevice.ip ? newDevice.ip.split('.').pop() : 'Custom'}`
            }
          : device
      ));
      showSuccess('全局设备更新成功');
    } else {
      // Add new global device
      const globalDevice: GlobalDevice = {
        id: `global-${Date.now()}`,
        deviceTypeId: newDevice.deviceTypeId,
        ip: newDevice.ip,
        port: selectedDeviceType?.protocol === 'custom' ? 0 : newDevice.port,
        otherParams: newDevice.otherParams,
        alias: newDevice.alias,
        name: `${getDeviceTypeName(newDevice.deviceTypeId)} ${newDevice.ip ? newDevice.ip.split('.').pop() : 'Custom'}`
      };

      setGlobalDevices([...globalDevices, globalDevice]);
      showSuccess('全局设备添加成功');
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setNewDevice({ deviceTypeId: '', ip: '', port: 502, otherParams: '', alias: '' });
    setIsEditing(false);
    setEditingDeviceId('');
  };

  const handleEditGlobalDevice = (device: GlobalDevice) => {
    setNewDevice({ 
      deviceTypeId: device.deviceTypeId, 
      ip: device.ip, 
      port: device.port,
      otherParams: device.otherParams,
      alias: device.alias
    });
    setIsEditing(true);
    setEditingDeviceId(device.id);
  };

  const handleDeleteGlobalDevice = (deviceId: string) => {
    if (window.confirm('确定要删除这个全局设备吗？')) {
      setGlobalDevices(globalDevices.filter(d => d.id !== deviceId));
      showSuccess('全局设备删除成功');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? '编辑全局设备' : '添加全局设备'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="deviceTypeSelect" className="text-sm font-medium">选择设备类型 *</label>
              <select
                id="deviceTypeSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newDevice.deviceTypeId}
                onChange={(e) => {
                  const deviceTypeId = e.target.value;
                  setNewDevice({ ...newDevice, deviceTypeId });
                  // Clear IP/port when switching to custom device type
                  const selectedDeviceType = deviceTypes.find(dt => dt.id === deviceTypeId);
                  if (selectedDeviceType?.protocol === 'custom') {
                    setNewDevice(prev => ({ ...prev, ip: '', port: 0 }));
                  }
                }}
              >
                <option value="">选择设备类型</option>
                {deviceTypes.map(deviceType => (
                  <option key={deviceType.id} value={deviceType.id}>
                    {deviceType.name} ({deviceType.protocol === 'modbus-tcp' ? 'Modbus TCP' : '自定义设备类型'})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="alias" className="text-sm font-medium">全局设备别名 *</label>
              <input
                id="alias"
                type="text"
                className="px-3 py-2 border rounded-md bg-background w-full"
                placeholder="例如: GLOBAL_TEMP, GLOBAL_VOLTAGE"
                value={newDevice.alias}
                onChange={(e) => setNewDevice({ ...newDevice, alias: e.target.value.toUpperCase() })}
              />
              <p className="text-xs text-muted-foreground">
                全局设备别名用于在老化流程脚本中访问设备，例如: GLOBAL_TEMP.get("temperature")
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ipAddress" className="text-sm font-medium">
                IP 地址 {deviceTypes.find(dt => dt.id === newDevice.deviceTypeId)?.protocol === 'modbus-tcp' ? '*' : '(可选)'}
              </label>
              <input
                id="ipAddress"
                type="text"
                className="px-3 py-2 border rounded-md bg-background w-full"
                placeholder={deviceTypes.find(dt => dt.id === newDevice.deviceTypeId)?.protocol === 'custom' ? '自定义设备无需IP' : '192.168.1.xxx'}
                value={newDevice.ip}
                onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                disabled={deviceTypes.find(dt => dt.id === newDevice.deviceTypeId)?.protocol === 'custom'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="port" className="text-sm font-medium">
                端口 {deviceTypes.find(dt => dt.id === newDevice.deviceTypeId)?.protocol === 'modbus-tcp' ? '*' : '(可选)'}
              </label>
              <input
                id="port"
                type="number"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newDevice.port}
                onChange={(e) => setNewDevice({ ...newDevice, port: parseInt(e.target.value) || 502 })}
                disabled={deviceTypes.find(dt => dt.id === newDevice.deviceTypeId)?.protocol === 'custom'}
              />
            </div>
          </div>

          {/* otherParams field */}
          <div className="space-y-2">
            <label htmlFor="otherParams" className="text-sm font-medium">其他参数 (可选)</label>
            <input
              id="otherParams"
              type="text"
              className="px-3 py-2 border rounded-md bg-background w-full"
              placeholder="例如: baud=9600,parity=none 或 device_id=AGV001,model=TH2023"
              value={newDevice.otherParams}
              onChange={(e) => setNewDevice({ ...newDevice, otherParams: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              用于传递设备特定的其他参数，格式为键值对，如: key1=value1,key2=value2
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleAddGlobalDevice} className="flex-1" disabled={!newDevice.deviceTypeId || !newDevice.alias.trim()}>
              {isEditing ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? '更新全局设备' : '添加全局设备'}
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
          <CardTitle>全局设备列表</CardTitle>
        </CardHeader>
        <CardContent>
          {globalDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无全局设备，请先添加全局设备
            </div>
          ) : (
            <div className="space-y-4">
              {globalDevices.map((device) => (
                <div key={device.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-lg">{device.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {device.alias}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>设备类型: {getDeviceTypeName(device.deviceTypeId)}</div>
                        {deviceTypes.find(dt => dt.id === device.deviceTypeId)?.protocol === 'custom' ? (
                          <div>设备类型: 自定义设备类型</div>
                        ) : (
                          <div>连接信息: {device.ip}:{device.port}</div>
                        )}
                        {device.otherParams && <div>其他参数: {device.otherParams}</div>}
                      </div>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditGlobalDevice(device)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGlobalDevice(device.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 p-4 rounded-lg space-y-2">
            <p className="text-sm">
              <strong>全局设备别名使用方式：</strong>在老化流程的Python脚本中，可以通过全局设备别名直接访问设备。
            </p>
            <p className="text-sm">
              <strong>示例：</strong>
            </p>
            <pre className="text-xs bg-background p-2 rounded font-mono">
{`# 通过全局设备别名访问设备
temperature = GLOBAL_TEMP.get("temperature")
voltage = GLOBAL_VOLTAGE.get("voltage")

# 设置全局设备的值
GLOBAL_RELAY.set("output", True)

# 获取全局设备所有变量
variables = GLOBAL_AGAVE.get_variables()`}
            </pre>
            <p className="text-xs text-muted-foreground">
              全局设备别名在所有老化流程中都是可用的，无需在每个流程中单独配置设备实例。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalDevicesTab;