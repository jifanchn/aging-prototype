"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2,
  Settings,
  Download,
  Upload,
  Copy
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import CreateProcessModal from "@/components/aging-process/CreateProcessModal";
import { usePermissions } from "@/hooks/usePermissions";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

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
  const { hasPermission } = usePermissions();
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [processDevices, setProcessDevices] = useState<ProcessDevice[]>([]);
  const [newDevice, setNewDevice] = useState({ deviceTypeId: '', alias: '' });
  
  // Import functionality
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importProcessId, setImportProcessId] = useState<string | null>(null);
  
  // Copy functionality
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyProcessId, setCopyProcessId] = useState<string | null>(null);
  const [copyProcessName, setCopyProcessName] = useState('');

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(dt => dt.id === id)?.name || '未知设备类型';
  };

  const handleAddProcess = (newProcess: { name: string; description: string }) => {
    const process: AgingProcess = {
      id: `proc-${Date.now()}`,
      name: newProcess.name,
      description: newProcess.description,
      devices: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProcesses([...processes, process]);
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
    
    // Update the process's device list
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

  const handleExportProcess = (process: AgingProcess) => {
    const exportData = {
      name: process.name,
      description: process.description,
      devices: process.devices,
      createdAt: process.createdAt
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${process.name.replace(/\s+/g, '_')}_config.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('配置导出成功');
  };

  const handleImportProcess = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedProcess = JSON.parse(content);
          
          // Validate imported process
          if (!importedProcess.name || !importedProcess.devices) {
            throw new Error('Invalid process configuration');
          }
          
          const process: AgingProcess = {
            id: `proc-${Date.now()}`,
            name: importedProcess.name,
            description: importedProcess.description || '',
            devices: importedProcess.devices,
            createdAt: new Date().toISOString().split('T')[0]
          };
          
          setProcesses([...processes, process]);
          showSuccess('配置导入成功');
        } catch (error) {
          showError('导入文件格式错误');
        }
      };
      reader.readAsText(file);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerImport = (processId: string) => {
    setImportProcessId(processId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCopyProcess = () => {
    if (!copyProcessName.trim()) {
      showError('请输入新流程名称');
      return;
    }
    
    const originalProcess = processes.find(p => p.id === copyProcessId);
    if (!originalProcess) {
      showError('原流程不存在');
      return;
    }
    
    const newProcess: AgingProcess = {
      id: `proc-${Date.now()}`,
      name: copyProcessName,
      description: originalProcess.description,
      devices: originalProcess.devices, // DEV和别名保持不变
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProcesses([...processes, newProcess]);
    setCopyProcessName('');
    setIsCopyModalOpen(false);
    setCopyProcessId(null);
    showSuccess('配置复制成功');
  };

  const openCopyModal = (processId: string) => {
    setCopyProcessId(processId);
    setCopyProcessName('');
    setIsCopyModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImportProcess}
        className="hidden"
      />
      
      {/* Process list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>老化流程列表</CardTitle>
          {hasPermission('edit_aging_processes') && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建流程
            </Button>
          )}
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
                  <div className="flex flex-col space-y-2 ml-4">
                    <div className="flex space-x-2">
                      {hasPermission('edit_aging_processes') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectProcess(process)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          配置
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportProcess(process)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {hasPermission('edit_aging_processes') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerImport(process.id)}
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {hasPermission('edit_aging_processes') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCopyModal(process.id)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    )}
                    {hasPermission('edit_aging_processes') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProcess(process.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device configuration (for selected process) */}
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

            {/* Added devices list */}
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

      {/* Create Process Modal */}
      <CreateProcessModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProcessCreated={handleAddProcess}
      />
      
      {/* Copy Process Modal */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>复制老化流程</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="copyProcessName">新流程名称 *</Label>
              <Input
                id="copyProcessName"
                placeholder="输入新流程名称"
                value={copyProcessName}
                onChange={(e) => setCopyProcessName(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-sm text-muted-foreground">
              复制后的流程将保持原有的设备配置（DEV和别名不变）
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleCopyProcess}>
              <Copy className="mr-2 h-4 w-4" />
              复制流程
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessManagementTab;