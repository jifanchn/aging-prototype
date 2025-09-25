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
  StopCircle
} from "lucide-react";
import WorkstationCard from "@/components/ui/workstation-card";
import WorkstationDetailView from "@/components/ui/workstation-detail-view";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 工位-设备映射组件
const WorkstationDeviceMapping = () => {
  const [workstations] = useState([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [devices] = useState([
    { id: 'dev1', name: '温度传感器 A1', protocol: 'modbus-tcp', ip: '192.168.1.101', status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev2', name: '电压监测器 B2', protocol: 'modbus-tcp', ip: '192.168.1.102', status: 'disconnected', deviceTypeId: 'type2' },
    { id: 'dev3', name: '湿度传感器 C3', protocol: 'modbus-tcp', ip: '192.168.1.103', status: 'connected', deviceTypeId: 'type1' },
    { id: 'dev4', name: '功率计 D4', protocol: 'modbus-tcp', ip: '192.168.1.104', status: 'connected', deviceTypeId: 'type2' },
    { id: 'dev5', name: '压力传感器 E5', protocol: 'modbus-tcp', ip: '192.168.1.105', status: 'connected', deviceTypeId: 'type3' }
  ]);

  const [mappings, setMappings] = useState([
    { id: 'map1', workstationId: 'ws1', deviceIds: ['dev1', 'dev2'], createdAt: '2025-08-10' },
    { id: 'map2', workstationId: 'ws2', deviceIds: ['dev3', 'dev4', 'dev5'], createdAt: '2025-08-11' },
    { id: 'map3', workstationId: 'ws3', deviceIds: ['dev1', 'dev3'], createdAt: '2025-08-12' }
  ]);

  const [newMapping, setNewMapping] = useState({ workstationId: '', deviceIds: [] });
  const [selectedDevices, setSelectedDevices] = useState([]);

  const handleAddMapping = () => {
    if (!newMapping.workstationId || selectedDevices.length === 0) {
      alert('请选择工位和至少一个设备');
      return;
    }

    const existingMapping = mappings.find(m => m.workstationId === newMapping.workstationId);
    if (existingMapping) {
      alert('该工位已存在设备映射，请编辑现有映射');
      return;
    }

    const mapping = {
      id: `mapping-${Date.now()}`,
      workstationId: newMapping.workstationId,
      deviceIds: selectedDevices,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMappings([...mappings, mapping]);
    setNewMapping({ workstationId: '', deviceIds: [] });
    setSelectedDevices([]);
    alert('工位设备映射添加成功');
  };

  const handleUpdateMapping = (workstationId) => {
    if (selectedDevices.length === 0) {
      alert('请至少选择一个设备');
      return;
    }

    setMappings(mappings.map(mapping => 
      mapping.workstationId === workstationId 
        ? { ...mapping, deviceIds: selectedDevices }
        : mapping
    ));
    
    setSelectedDevices([]);
    alert('工位设备映射更新成功');
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

  const getDeviceNames = (deviceIds) => {
    return deviceIds
      .map(id => devices.find(dev => dev.id === id)?.name || '未知设备')
      .join(', ');
  };

  const handleEditMapping = (mapping) => {
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
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newMapping.workstationId}
                onChange={(e) => {
                  setNewMapping({ ...newMapping, workstationId: e.target.value });
                  const existing = mappings.find(m => m.workstationId === e.target.value);
                  if (existing) {
                    setSelectedDevices([...existing.deviceIds]);
                  } else {
                    setSelectedDevices([]);
                  }
                }}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
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
                <Settings className="mr-2 h-4 w-4" />
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
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">工位</th>
                <th className="text-left py-2">关联设备</th>
                <th className="text-left py-2">设备数量</th>
                <th className="text-left py-2">创建日期</th>
                <th className="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id} className="border-b">
                  <td className="py-2 font-medium">{getWorkstationName(mapping.workstationId)}</td>
                  <td className="py-2 max-w-xs">
                    <div className="text-xs truncate" title={getDeviceNames(mapping.deviceIds)}>
                      {getDeviceNames(mapping.deviceIds)}
                    </div>
                  </td>
                  <td className="py-2">{mapping.deviceIds.length}</td>
                  <td className="py-2">{mapping.createdAt}</td>
                  <td className="py-2 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMapping(mapping)}
                    >
                      编辑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

// 工位-老化流程配置组件
const WorkstationAgingProcessMapping = () => {
  const [workstations] = useState([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [agingProcesses] = useState([
    { id: 'proc1', name: '高温老化流程 A', description: '适用于高温环境下的设备老化测试' },
    { id: 'proc2', name: '标准老化流程 B', description: '标准条件下的设备老化测试' },
    { id: 'proc3', name: '快速老化流程 C', description: '加速老化测试流程' }
  ]);

  const [mappings, setMappings] = useState([
    { id: 'map1', workstationId: 'ws1', processIds: ['proc1', 'proc2'], createdAt: '2025-08-10' },
    { id: 'map2', workstationId: 'ws2', processIds: ['proc2', 'proc3'], createdAt: '2025-08-11' },
    { id: 'map3', workstationId: 'ws3', processIds: ['proc1'], createdAt: '2025-08-12' }
  ]);

  const [newMapping, setNewMapping] = useState({ workstationId: '', processIds: [] });
  const [selectedProcesses, setSelectedProcesses] = useState([]);

  const handleAddMapping = () => {
    if (!newMapping.workstationId || selectedProcesses.length === 0) {
      alert('请选择工位和至少一个老化流程');
      return;
    }

    const existingMapping = mappings.find(m => m.workstationId === newMapping.workstationId);
    if (existingMapping) {
      alert('该工位已存在老化流程映射，请编辑现有映射');
      return;
    }

    const mapping = {
      id: `mapping-${Date.now()}`,
      workstationId: newMapping.workstationId,
      processIds: selectedProcesses,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMappings([...mappings, mapping]);
    setNewMapping({ workstationId: '', processIds: [] });
    setSelectedProcesses([]);
    alert('工位老化流程映射添加成功');
  };

  const handleUpdateMapping = (workstationId) => {
    if (selectedProcesses.length === 0) {
      alert('请至少选择一个老化流程');
      return;
    }

    setMappings(mappings.map(mapping => 
      mapping.workstationId === workstationId 
        ? { ...mapping, processIds: selectedProcesses }
        : mapping
    ));
    
    setSelectedProcesses([]);
    alert('工位老化流程映射更新成功');
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

  const getProcessNames = (processIds) => {
    return processIds
      .map(id => agingProcesses.find(proc => proc.id === id)?.name || '未知流程')
      .join(', ');
  };

  const handleEditMapping = (mapping) => {
    setNewMapping({ workstationId: mapping.workstationId, processIds: mapping.processIds });
    setSelectedProcesses([...mapping.processIds]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>工位-老化流程映射</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newMapping.workstationId}
                onChange={(e) => {
                  setNewMapping({ ...newMapping, workstationId: e.target.value });
                  const existing = mappings.find(m => m.workstationId === e.target.value);
                  if (existing) {
                    setSelectedProcesses([...existing.processIds]);
                  } else {
                    setSelectedProcesses([]);
                  }
                }}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {agingProcesses.map(process => (
                <div key={process.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`process-${process.id}`}
                    checked={selectedProcesses.includes(process.id)}
                    onChange={() => toggleProcessSelection(process.id)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`process-${process.id}`} className="text-sm">
                    {process.name}
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
                <Settings className="mr-2 h-4 w-4" />
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
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">工位</th>
                <th className="text-left py-2">关联老化流程</th>
                <th className="text-left py-2">流程数量</th>
                <th className="text-left py-2">创建日期</th>
                <th className="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id} className="border-b">
                  <td className="py-2 font-medium">{getWorkstationName(mapping.workstationId)}</td>
                  <td className="py-2 max-w-xs">
                    <div className="text-xs truncate" title={getProcessNames(mapping.processIds)}>
                      {getProcessNames(mapping.processIds)}
                    </div>
                  </td>
                  <td className="py-2">{mapping.processIds.length}</td>
                  <td className="py-2">{mapping.createdAt}</td>
                  <td className="py-2 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMapping(mapping)}
                    >
                      编辑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">工位管理</h1>
            <Button>
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
            <TabsTrigger value="device-mapping">工位-设备映射</TabsTrigger>
            <TabsTrigger value="aging-mapping">工位-老化映射</TabsTrigger>
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
                  onActionClick={() => console.log('Action for', workstation.name)}
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
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建工位
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="device-mapping">
            <WorkstationDeviceMapping />
          </TabsContent>
          
          <TabsContent value="aging-mapping">
            <WorkstationAgingProcessMapping />
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