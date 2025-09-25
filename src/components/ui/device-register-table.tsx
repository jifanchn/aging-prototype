"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Download, Upload, Info } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RegisterMapping {
  id: string;
  name: string;
  address: number;
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'bool';
  description: string;
  unit: string;
  normalRangeMin: number;
  normalRangeMax: number;
  isImportant: boolean;
  scale: number;
  offset: number;
  // 移除了 deviceName 字段
}

interface DeviceRegisterTable {
  id: string;
  deviceTypeId: string;
  name: string;
  description: string;
  mappings: RegisterMapping[];
}

interface DeviceType {
  id: string;
  name: string;
}

const DeviceRegisterTable = () => {
  const [tables, setTables] = useState<DeviceRegisterTable[]>([
    {
      id: 'table1',
      deviceTypeId: 'type1',
      name: '温度传感器寄存器表',
      description: '包含温度、湿度等寄存器定义',
      mappings: [
        {
          id: '1',
          name: '温度',
          address: 40001,
          dataType: 'float32',
          description: '当前温度值',
          unit: '°C',
          normalRangeMin: 0,
          normalRangeMax: 100,
          isImportant: true,
          scale: 0.1,
          offset: 0
        },
        {
          id: '2',
          name: '湿度',
          address: 40003,
          dataType: 'float32',
          description: '当前湿度值',
          unit: '%',
          normalRangeMin: 0,
          normalRangeMax: 100,
          isImportant: false,
          scale: 0.1,
          offset: 0
        }
      ]
    },
    {
      id: 'table2',
      deviceTypeId: 'type2',
      name: '电力监测寄存器表',
      description: '包含电压、电流、功率等寄存器定义',
      mappings: [
        {
          id: '3',
          name: '电压',
          address: 40001,
          dataType: 'float32',
          description: '当前电压值',
          unit: 'V',
          normalRangeMin: 210,
          normalRangeMax: 230,
          isImportant: true,
          scale: 0.1,
          offset: 0
        },
        {
          id: '4',
          name: '电流',
          address: 40003,
          dataType: 'float32',
          description: '当前电流值',
          unit: 'A',
          normalRangeMin: 0,
          normalRangeMax: 10,
          isImportant: true,
          scale: 0.01,
          offset: 0
        }
      ]
    }
  ]);

  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: '温度传感器' },
    { id: 'type2', name: '电力监测器' }
  ]);

  const [activeDeviceTypeId, setActiveDeviceTypeId] = useState('type1');
  const [newMapping, setNewMapping] = useState<Omit<RegisterMapping, 'id'>>({
    name: '',
    address: 40001,
    dataType: 'float32',
    description: '',
    unit: '',
    normalRangeMin: 0,
    normalRangeMax: 100,
    isImportant: false,
    scale: 1.0,
    offset: 0
  });

  const activeTable = tables.find(table => table.deviceTypeId === activeDeviceTypeId);

  const handleAddMapping = () => {
    if (!newMapping.name) {
      showError('请输入寄存器名称');
      return;
    }

    const mapping: RegisterMapping = {
      id: `mapping-${Date.now()}`,
      ...newMapping
    };

    setTables(tables.map(table => 
      table.deviceTypeId === activeDeviceTypeId 
        ? { ...table, mappings: [...table.mappings, mapping] }
        : table
    ));

    setNewMapping({
      name: '',
      address: 40001,
      dataType: 'float32',
      description: '',
      unit: '',
      normalRangeMin: 0,
      normalRangeMax: 100,
      isImportant: false,
      scale: 1.0,
      offset: 0
    });

    showSuccess('寄存器映射添加成功');
  };

  const handleDeleteMapping = (mappingId: string) => {
    setTables(tables.map(table => 
      table.deviceTypeId === activeDeviceTypeId 
        ? { ...table, mappings: table.mappings.filter(m => m.id !== mappingId) }
        : table
    ));
    showSuccess('寄存器映射删除成功');
  };

  const handleExportTable = () => {
    const table = tables.find(t => t.deviceTypeId === activeDeviceTypeId);
    if (table) {
      const dataStr = JSON.stringify(table, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${table.name}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showSuccess('寄存器表导出成功');
    }
  };

  const handleImportTable = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedTable = JSON.parse(content);
          setTables([...tables, { ...importedTable, id: `table-${Date.now()}` }]);
          showSuccess('寄存器表导入成功');
        } catch (error) {
          showError('导入文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>设备寄存器表配置</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportTable}>
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                导入
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportTable}
                className="hidden"
              />
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="deviceTypeSelect">选择设备类型</Label>
            <Select value={activeDeviceTypeId} onValueChange={setActiveDeviceTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="选择设备类型" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeTable && (
            <>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{activeTable.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="registerName">寄存器名称 *</Label>
                  <Input
                    id="registerName"
                    placeholder="温度"
                    value={newMapping.name}
                    onChange={(e) => setNewMapping({ ...newMapping, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">寄存器地址</Label>
                  <Input
                    id="address"
                    type="number"
                    value={newMapping.address}
                    onChange={(e) => setNewMapping({ ...newMapping, address: parseInt(e.target.value) || 40001 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataType">数据类型</Label>
                  <Select
                    value={newMapping.dataType}
                    onValueChange={(value) => setNewMapping({ ...newMapping, dataType: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择数据类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="int16">INT16</SelectItem>
                      <SelectItem value="uint16">UINT16</SelectItem>
                      <SelectItem value="int32">INT32</SelectItem>
                      <SelectItem value="uint32">UINT32</SelectItem>
                      <SelectItem value="float32">FLOAT32</SelectItem>
                      <SelectItem value="bool">BOOL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">单位</Label>
                  <Input
                    id="unit"
                    placeholder="°C, V, A"
                    value={newMapping.unit}
                    onChange={(e) => setNewMapping({ ...newMapping, unit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Input
                    id="description"
                    placeholder="当前温度值"
                    value={newMapping.description}
                    onChange={(e) => setNewMapping({ ...newMapping, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="normalRangeMin">正常范围最小值</Label>
                  <Input
                    id="normalRangeMin"
                    type="number"
                    step="0.1"
                    value={newMapping.normalRangeMin}
                    onChange={(e) => setNewMapping({ ...newMapping, normalRangeMin: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="normalRangeMax">正常范围最大值</Label>
                  <Input
                    id="normalRangeMax"
                    type="number"
                    step="0.1"
                    value={newMapping.normalRangeMax}
                    onChange={(e) => setNewMapping({ ...newMapping, normalRangeMax: parseFloat(e.target.value) || 100 })}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isImportant"
                      checked={newMapping.isImportant}
                      onChange={(e) => setNewMapping({ ...newMapping, isImportant: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isImportant">重要参数</Label>
                  </div>
                </div>
              </div>

              {/* 新增的变换参数配置 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="scale">比例系数 (A)</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>实际值 = A × 原始值 + B</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="scale"
                    type="number"
                    step="0.001"
                    placeholder="1.0"
                    value={newMapping.scale}
                    onChange={(e) => setNewMapping({ ...newMapping, scale: parseFloat(e.target.value) || 1.0 })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="offset">偏移量 (B)</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>实际值 = A × 原始值 + B</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="offset"
                    type="number"
                    step="0.001"
                    placeholder="0"
                    value={newMapping.offset}
                    onChange={(e) => setNewMapping({ ...newMapping, offset: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Button onClick={handleAddMapping} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                添加寄存器映射
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {activeTable && (
        <Card>
          <CardHeader>
            <CardTitle>寄存器映射列表 - {activeTable.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>单位</TableHead>
                  <TableHead>变换</TableHead>
                  <TableHead>重要参数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTable.mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">{mapping.name}</TableCell>
                    <TableCell>{mapping.address}</TableCell>
                    <TableCell>{mapping.dataType.toUpperCase()}</TableCell>
                    <TableCell>{mapping.unit}</TableCell>
                    <TableCell className="text-xs">
                      y = {mapping.scale}x + {mapping.offset}
                    </TableCell>
                    <TableCell>
                      {mapping.isImportant ? '是' : '否'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMapping(mapping.id)}
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
      )}
    </div>
  );
};

export default DeviceRegisterTable;