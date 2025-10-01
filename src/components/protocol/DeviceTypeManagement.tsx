"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Download, Upload, Copy } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";
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
  protocol: 'modbus-tcp' | 'custom'; // Added custom protocol type
  description: string;
  createdAt: string;
}

const DeviceTypeManagement = () => {
  const { hasPermission } = usePermissions();
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([
    {
      id: 'type1',
      name: '温度传感器',
      protocol: 'modbus-tcp',
      description: '支持温度、湿度测量的Modbus TCP设备',
      createdAt: '2025-08-10'
    },
    {
      id: 'type2',
      name: '电力监测器',
      protocol: 'modbus-tcp',
      description: '支持电压、电流、功率监测的Modbus TCP设备',
      createdAt: '2025-08-11'
    },
    {
      id: 'type3',
      name: 'Agave TH',
      protocol: 'custom',
      description: '预定义的Agave温度湿度传感器，包含固定数据字段',
      createdAt: '2025-08-12'
    }
  ]);

  const [newDeviceType, setNewDeviceType] = useState<Omit<DeviceType, 'id' | 'createdAt'>>({
    name: '',
    protocol: 'modbus-tcp',
    description: ''
  });

  // Import functionality
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDeviceTypeId, setImportDeviceTypeId] = useState<string | null>(null);
  
  // Copy functionality
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyDeviceTypeId, setCopyDeviceTypeId] = useState<string | null>(null);
  const [copyDeviceTypeName, setCopyDeviceTypeName] = useState('');

  const handleAddDeviceType = () => {
    if (!newDeviceType.name) {
      showError('请输入设备类型名称');
      return;
    }

    const deviceType: DeviceType = {
      id: `type-${Date.now()}`,
      ...newDeviceType,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDeviceTypes([...deviceTypes, deviceType]);
    setNewDeviceType({
      name: '',
      protocol: 'modbus-tcp',
      description: ''
    });
    showSuccess('设备类型添加成功');
  };

  const handleDeleteDeviceType = (id: string) => {
    // 检查是否有设备在使用此类型
    const hasDevices = false; // 这里应该检查实际的设备使用情况
    if (hasDevices) {
      showError('该设备类型正在被使用，无法删除');
      return;
    }

    setDeviceTypes(deviceTypes.filter(type => type.id !== id));
    showSuccess('设备类型删除成功');
  };

  const handleExportDeviceType = (deviceType: DeviceType) => {
    const exportData = {
      name: deviceType.name,
      protocol: deviceType.protocol,
      description: deviceType.description,
      createdAt: deviceType.createdAt
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deviceType.name.replace(/\s+/g, '_')}_config.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('设备类型配置导出成功');
  };

  const handleImportDeviceType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedDeviceType = JSON.parse(content);
          
          // Validate imported device type
          if (!importedDeviceType.name || !importedDeviceType.protocol) {
            throw new Error('Invalid device type configuration');
          }
          
          const deviceType: DeviceType = {
            id: `type-${Date.now()}`,
            name: importedDeviceType.name,
            protocol: importedDeviceType.protocol,
            description: importedDeviceType.description || '',
            createdAt: new Date().toISOString().split('T')[0]
          };
          
          setDeviceTypes([...deviceTypes, deviceType]);
          showSuccess('设备类型配置导入成功');
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

  const triggerImport = (deviceTypeId: string) => {
    setImportDeviceTypeId(deviceTypeId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCopyDeviceType = () => {
    if (!copyDeviceTypeName.trim()) {
      showError('请输入新设备类型名称');
      return;
    }
    
    const originalDeviceType = deviceTypes.find(dt => dt.id === copyDeviceTypeId);
    if (!originalDeviceType) {
      showError('原设备类型不存在');
      return;
    }
    
    const newDeviceType: DeviceType = {
      id: `type-${Date.now()}`,
      name: copyDeviceTypeName,
      protocol: originalDeviceType.protocol,
      description: originalDeviceType.description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDeviceTypes([...deviceTypes, newDeviceType]);
    setCopyDeviceTypeName('');
    setIsCopyModalOpen(false);
    setCopyDeviceTypeId(null);
    showSuccess('设备类型配置复制成功');
  };

  const openCopyModal = (deviceTypeId: string) => {
    setCopyDeviceTypeId(deviceTypeId);
    setCopyDeviceTypeName('');
    setIsCopyModalOpen(true);
  };

  // Get fixed data fields for custom device types
  const getCustomDeviceFields = (protocol: string) => {
    if (protocol === 'custom') {
      return [
        { name: 'temperature', type: 'float32', description: '温度值 (°C)' },
        { name: 'humidity', type: 'float32', description: '湿度值 (%)' },
        { name: 'battery', type: 'uint16', description: '电池电量 (%)' },
        { name: 'rssi', type: 'int16', description: '信号强度 (dBm)' }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImportDeviceType}
        className="hidden"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>添加设备类型</CardTitle>
        </CardHeader>
        {hasPermission('edit_protocols') ? (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeName">设备类型名称 *</Label>
                <Input
                  id="typeName"
                  placeholder="温度传感器"
                  value={newDeviceType.name}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protocol">通信协议</Label>
                <select
                  id="protocol"
                  className="px-3 py-2 border rounded-md bg-background w-full"
                  value={newDeviceType.protocol}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, protocol: e.target.value as any })}
                >
                  <option value="modbus-tcp">Modbus TCP</option>
                  <option value="custom">自定义设备类型</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  placeholder="设备类型描述"
                  value={newDeviceType.description}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <Button onClick={handleAddDeviceType} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              添加设备类型
            </Button>
          </CardContent>
        ) : (
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">您当前的权限只能查看设备类型，无法进行添加操作</p>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>设备类型列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型名称</TableHead>
                <TableHead>协议</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviceTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>
                    {type.protocol === 'modbus-tcp' ? 'Modbus TCP' : '自定义设备类型'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={type.description}>
                    {type.description}
                  </TableCell>
                  <TableCell>{type.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportDeviceType(type)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      {hasPermission('edit_protocols') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerImport(type.id)}
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      )}
                      {hasPermission('edit_protocols') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCopyModal(type.id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                      {hasPermission('edit_protocols') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDeviceType(type.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Display fixed data fields for custom device types */}
      {deviceTypes.some(type => type.protocol === 'custom') && (
        <Card>
          <CardHeader>
            <CardTitle>自定义设备类型数据字段</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              自定义设备类型具有预定义的数据字段，无需配置寄存器映射、扫描或Probe条件。
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>设备类型</TableHead>
                  <TableHead>字段名称</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>描述</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviceTypes
                  .filter(type => type.protocol === 'custom')
                  .map(type => 
                    getCustomDeviceFields(type.protocol).map((field, index) => (
                      <TableRow key={`${type.id}-${index}`}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.type.toUpperCase()}</TableCell>
                        <TableCell>{field.description}</TableCell>
                      </TableRow>
                    ))
                  )
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Copy Device Type Modal */}
      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>复制设备类型</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="copyDeviceTypeName">新设备类型名称 *</Label>
              <Input
                id="copyDeviceTypeName"
                placeholder="输入新设备类型名称"
                value={copyDeviceTypeName}
                onChange={(e) => setCopyDeviceTypeName(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-sm text-muted-foreground">
              复制后的设备类型将保持原有的协议和描述配置
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleCopyDeviceType}>
              <Copy className="mr-2 h-4 w-4" />
              复制设备类型
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceTypeManagement;