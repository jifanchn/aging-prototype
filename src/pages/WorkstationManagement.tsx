"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter,
  Settings,
  Play,
  StopCircle,
  Edit,
  Trash2,
  X
} from "lucide-react";
import WorkstationCard from "@/components/ui/workstation-card";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";

// 工位-设备配对组件
const WorkstationDevicePairing = () => {
  const [workstations] = useState([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [devices] = useState([
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus-tcp', ip: '192.168.1.101', port: 502, status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus-tcp', ip: '192.168.1.102', port: 502, status: 'disconnected', deviceTypeId: 'type2' },
    { id: 'dev3', name: '湿度传感器 C3', protocol: 'modbus-tcp', ip: '192.168.1.103', port: 502, status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev4', name: '功率计 D4', protocol: 'modbus-tcp', ip: '192.168.1.104', port: 502, status: 'connected', deviceTypeId: 'type2' },
    { id: 'dev5', name: '压力传感器 E5', protocol: 'modbus-tcp', ip: '192.168.1.105', port: 502, status: 'connected', deviceTypeId: 'type3' },
    { id: 'dev6', name: '电流传感器 F6', protocol: 'modbus-rtu', ip: '192.168.1.106', port: 503, status: 'connected', deviceTypeId: 'type1' }
  ]);

  const [pairings, setPairings] = useState([
    { id: 'pair1', workstationId: 'ws1', devices: ['dev1', 'dev2'], createdAt: '2025-08-10' },
    { id: 'pair2', workstationId: 'ws2', devices: ['dev3', 'dev4', 'dev5'], createdAt: '2025-08-11' },
    { id: 'pair3', workstationId: 'ws3', devices: ['dev1', 'dev3'], createdAt: '2025-08-12' }
  ]);

  const [newPairing, setNewPairing] = useState({ workstationId: '', devices: [] });
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPairingId, setEditingPairingId] = useState('');

  const handleAddPairing = () => {
    if (!newPairing.workstationId || selectedDevices.length === 0) {
      showError('请选择工位和至少一个设备');
      return;
    }

    const existingPairing = pairings.find(p => p.workstationId === newPairing.workstationId);
    if (existingPairing && !isEditing) {
      showError('该工位已存在设备配对，请编辑现有配对');
      return;
    }

    if (isEditing) {
      // 更新现有配对
      setPairings(pairings.map(pairing => 
        pairing.id === editingPairingId 
          ? { ...pairing, devices: selectedDevices }
          : pairing
      ));
      showSuccess('工位设备配对更新成功');
    } else {
      // 添加新配对
      const pairing = {
        id: `pairing-${Date.now()}`,
        workstationId: newPairing.workstationId,
        devices: selectedDevices,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPairings([...pairings, pairing]);
      showSuccess('工位设备配对添加成功');
    }

    // 重置表单
    setNewPairing({ workstationId: '', devices: [] });
    setSelectedDevices([]);
    setIsEditing(false);
    setEditingPairingId('');
  };

  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const getWorkstationName = (id) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getDeviceDetails = (deviceId) => {
    return devices.find(dev => dev.id === deviceId);
  };

  const handleEditPairing = (pairing) => {
    setNewPairing({ workstationId: pairing.workstationId, devices: pairing.devices });
    setSelectedDevices([...pairing.devices]);
    setIsEditing(true);
    setEditingPairingId(pairing.id);
  };

  const handleDeletePairing = (pairingId) => {
    if (window.confirm('确定要删除这个工位设备配对吗？')) {
      setPairings(pairings.filter(p => p.id !== pairingId));
      showSuccess('工位设备配对删除成功');
    }
  };

  const handleCancelEdit = () => {
    setNewPairing({ workstationId: '', devices: [] });
    setSelectedDevices([]);
    setIsEditing(false);
    setEditingPairingId('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? '编辑工位-设备配对' : '创建工位-设备配对'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.workstationId}
                onChange={(e) => {
                  setNewPairing({ ...newPairing, workstationId: e.target.value });
                  const existing = pairings.find(p => p.workstationId === e.target.value);
                  if (existing) {
                    setSelectedDevices([...existing.devices]);
                  } else {
                    setSelectedDevices([]);
                  }
                }}
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
          </div>

          <div className="space-y-2">
            <Label>选择设备 *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {devices.map(device => (
                <div key={device.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`device-${device.id}`}
                      checked={selectedDevices.includes(device.id)}
                      onChange={() => toggleDeviceSelection(device.id)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`device-${device.id}`} className="text-sm font-medium">
                      {device.name}
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>协议: {device.protocol}</div>
                    <div>IP: {device.ip}</div>
                    <div>端口: {device.port}</div>
                    <div>状态: <span className={device.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                      {device.status === 'connected' ? '在线' : '离线'}
                    </span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleAddPairing} className="flex-1" disabled={!newPairing.workstationId || selectedDevices.length === 0}>
              {isEditing ? (
                <Settings className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? '更新配对' : '添加配对'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{getWorkstationName(pairing.workstationId)}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pairing.devices.map(deviceId => {
                          const device = getDeviceDetails(deviceId);
                          return device ? (
                            <div key={deviceId} className="bg-muted/50 rounded p-2">
                              <div className="font-medium text-sm">{device.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {device.protocol} | {device.ip}:{device.port}
                              </div>
                              <div className="text-xs">
                                状态: <span className={device.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                                  {device.status === 'connected' ? '在线' : '离线'}
                                </span>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        创建时间: {pairing.createdAt}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPairing(pairing)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePairing(pairing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
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

// 工位-老化流程配对组件
const WorkstationAgingProcessPairing = () => {
  const [workstations] = useState([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [agingProcesses] = useState([
    { id: 'proc1', name: '高温老化流程 A', description: '适用于高温环境下的设备老化测试', temperature: '65°C', duration: '4h' },
    { id: 'proc2', name: '标准老化流程 B', description: '标准条件下的设备老化测试', temperature: '60°C', duration: '6h' },
    { id: 'proc3', name: '快速老化流程 C', description: '加速老化测试流程', temperature: '70°C', duration: '2h' },
    { id: 'proc4', name: '低温老化流程 D', description: '低温环境下的设备老化测试', temperature: '40°C', duration: '8h' }
  ]);

  const [pairings, setPairings] = useState([
    { id: 'pair1', workstationId: 'ws1', processIds: ['proc1', 'proc2'], createdAt: '2025-08-10' },
    { id: 'pair2', workstationId: 'ws2', processIds: ['proc2', 'proc3'], createdAt: '2025-08-11' },
    { id: 'pair3', workstationId: 'ws3', processIds: ['proc1'], createdAt: '2025-08-12' }
  ]);

  const [newPairing, setNewPairing] = useState({ workstationId: '', processIds: [] });
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPairingId, setEditingPairingId] = useState('');

  const handleAddPairing = () => {
    if (!newPairing.workstationId || selectedProcesses.length === 0) {
      showError('请选择工位和至少一个老化流程');
      return;
    }

    const existingPairing = pairings.find(p => p.workstationId === newPairing.workstationId);
    if (existingPairing && !isEditing) {
      showError('该工位已存在老化流程配对，请编辑现有配对');
      return;
    }

    if (isEditing) {
      // 更新现有配对
      setPairings(pairings.map(pairing => 
        pairing.id === editingPairingId 
          ? { ...pairing, processIds: selectedProcesses }
          : pairing
      ));
      showSuccess('工位老化流程配对更新成功');
    } else {
      // 添加新配对
      const pairing = {
        id: `pairing-${Date.now()}`,
        workstationId: newPairing.workstationId,
        processIds: selectedProcesses,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPairings([...pairings, pairing]);
      showSuccess('工位老化流程配对添加成功');
    }

    // 重置表单
    setNewPairing({ workstationId: '', processIds: [] });
    setSelectedProcesses([]);
    setIsEditing(false);
    setEditingPairingId('');
  };

  const toggleProcessSelection = (processId) => {
    setSelectedProcesses(prev => 
      prev.includes(processId) 
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const getWorkstationName = (id) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getProcessDetails = (processId) => {
    return agingProcesses.find(proc => proc.id === processId);
  };

  const handleEditPairing = (pairing) => {
    setNewPairing({ workstationId: pairing.workstationId, processIds: pairing.processIds });
    setSelectedProcesses([...pairing.processIds]);
    setIsEditing(true);
    setEditingPairingId(pairing.id);
  };

  const handleDeletePairing = (pairingId) => {
    if (window.confirm('确定要删除这个工位老化流程配对吗？')) {
      setPairings(pairings.filter(p => p.id !== pairingId));
      showSuccess('工位老化流程配对删除成功');
    }
  };

  const handleCancelEdit = () => {
    setNewPairing({ workstationId: '', processIds: [] });
    setSelectedProcesses([]);
    setIsEditing(false);
    setEditingPairingId('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? '编辑工位-老化流程配对' : '创建工位-老化流程配对'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.workstationId}
                onChange={(e) => {
                  setNewPairing({ ...newPairing, workstationId: e.target.value });
                  const existing = pairings.find(p => p.workstationId === e.target.value);
                  if (existing) {
                    setSelectedProcesses([...existing.processIds]);
                  } else {
                    setSelectedProcesses([]);
                  }
                }}
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
          </div>

          <div className="space-y-2">
            <Label>选择老化流程 *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agingProcesses.map(process => (
                <div key={process.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`process-${process.id}`}
                      checked={selectedProcesses.includes(process.id)}
                      onChange={() => toggleProcessSelection(process.id)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`process-${process.id}`} className="text-sm font-medium">
                      {process.name}
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{process.description}</div>
                    <div>温度: {process.temperature}</div>
                    <div>时长: {process.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleAddPairing} className="flex-1" disabled={!newPairing.workstationId || selectedProcesses.length === 0}>
              {isEditing ? (
                <Settings className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? '更新配对' : '添加配对'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>工位-老化流程配对列表</CardTitle>
        </CardHeader>
        <CardContent>
          {pairings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无工位-老化流程配对，请先创建配对
            </div>
          ) : (
            <div className="space-y-4">
              {pairings.map((pairing) => (
                <div key={pairing.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{getWorkstationName(pairing.workstationId)}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pairing.processIds.map(processId => {
                          const process = getProcessDetails(processId);
                          return process ? (
                            <div key={processId} className="bg-muted/50 rounded p-2">
                              <div className="font-medium text-sm">{process.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {process.temperature} | {process.duration}
                              </div>
                              <div className="text-xs mt-1">{process.description}</div>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        创建时间: {pairing.createdAt}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPairing(pairing)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePairing(pairing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
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

const WorkstationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorkstation, setSelectedWorkstation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const mockWorkstations = [
    { 
      id: 1, 
      name: "工位 A1", 
      status: "running" as const, 
      deviceCount: 12,
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
      status: "passed" as const, 
      deviceCount: 8,
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
      status: "failed" as const, 
      deviceCount: 5,
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
      status: "stopped" as const, 
      deviceCount: 15,
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
      status: "running" as const, 
      deviceCount: 10,
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
      status: "stopped" as const, 
      deviceCount: 7,
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

  const handleViewDetails = (workstation) => {
    setSelectedWorkstation(workstation);
  };

  const handleCloseDetails = () => {
    setSelectedWorkstation(null);
  };

  const handleStartWorkstation = (workstationId) => {
    showSuccess(`工位 ${workstationId} 启动成功`);
    // 实际应用中这里会调用API启动工位
  };

  const handleStopWorkstation = (workstationId) => {
    if (window.confirm(`确定要停止工位 ${workstationId} 吗？`)) {
      showSuccess(`工位 ${workstationId} 停止成功`);
      // 实际应用中这里会调用API停止工位
    }
  };

  const handleEditWorkstation = (workstationId) => {
    showSuccess(`编辑工位 ${workstationId}`);
    // 实际应用中这里会打开编辑表单
  };

  const handleDeleteWorkstation = (workstationId) => {
    if (window.confirm(`确定要删除工位 ${workstationId} 吗？删除后无法恢复！`)) {
      showSuccess(`工位 ${workstationId} 删除成功`);
      // 实际应用中这里会调用API删除工位
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">工位管理</h1>
            <Button onClick={() => showSuccess('新建工位功能')}>
              <Plus className="mr-2 h-4 w-4" />
              新建工位
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">工位概览</TabsTrigger>
            <TabsTrigger value="device-pairing">工位-设备配对</TabsTrigger>
            <TabsTrigger value="aging-pairing">工位-老化配对</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
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
                  deviceCount={workstation.deviceCount}
                  onDetailsClick={() => handleViewDetails(workstation)}
                  onControlClick={(action) => {
                    switch(action) {
                      case 'start':
                        handleStartWorkstation(workstation.name);
                        break;
                      case 'stop':
                        handleStopWorkstation(workstation.name);
                        break;
                      case 'edit':
                        handleEditWorkstation(workstation.name);
                        break;
                      case 'delete':
                        handleDeleteWorkstation(workstation.name);
                        break;
                      default:
                        break;
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
          </TabsContent>
          
          <TabsContent value="device-pairing">
            <WorkstationDevicePairing />
          </TabsContent>
          
          <TabsContent value="aging-pairing">
            <WorkstationAgingProcessPairing />
          </TabsContent>
        </Tabs>

        {selectedWorkstation && (
          <WorkstationDetailView 
            workstation={selectedWorkstation} 
            onClose={handleCloseDetails} 
          />
        )}
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default WorkstationManagement;