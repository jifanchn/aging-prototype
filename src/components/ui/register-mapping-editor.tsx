"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RegisterMapping {
  id: string;
  address: number;
  name: string;
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'bool';
  description: string;
  read: boolean;
  write: boolean;
  scalingFactor?: number;
  offset?: number;
}

const RegisterMappingEditor = () => {
  const [mappings, setMappings] = useState<RegisterMapping[]>([
    { 
      id: '1', 
      address: 40001, 
      name: '温度', 
      dataType: 'float32', 
      description: '设备温度传感器', 
      read: true, 
      write: false,
      scalingFactor: 0.1,
      offset: 0
    },
    { 
      id: '2', 
      address: 40003, 
      name: '电压', 
      dataType: 'float32', 
      description: '输入电压监测', 
      read: true, 
      write: false,
      scalingFactor: 0.1,
      offset: 0
    },
    { 
      id: '3', 
      address: 40005, 
      name: '运行状态', 
      dataType: 'bool', 
      description: '设备运行状态', 
      read: true, 
      write: true
    },
    { 
      id: '4', 
      address: 40006, 
      name: '启动命令', 
      dataType: 'bool', 
      description: '启动设备命令', 
      read: false, 
      write: true
    },
  ]);

  const [newMapping, setNewMapping] = useState<Omit<RegisterMapping, 'id'>>({
    address: 40001,
    name: '',
    dataType: 'uint16',
    description: '',
    read: true,
    write: false
  });

  const addMapping = () => {
    if (newMapping.name.trim()) {
      setMappings([...mappings, { ...newMapping, id: Date.now().toString() }]);
      setNewMapping({
        address: 40001,
        name: '',
        dataType: 'uint16',
        description: '',
        read: true,
        write: false
      });
    }
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
  };

  const updateMapping = (id: string, field: keyof RegisterMapping, value: any) => {
    setMappings(mappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    ));
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "地址,名称,数据类型,描述,读取,写入,缩放因子,偏移量\n" +
      mappings.map(mapping => 
        `${mapping.address},${mapping.name},${mapping.dataType},${mapping.description},${mapping.read},${mapping.write},${mapping.scalingFactor || ''},${mapping.offset || ''}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "register_mapping.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = () => {
    // CSV import functionality would be implemented here
    console.log('Import CSV functionality');
  };

  const saveMappings = () => {
    console.log('Saving register mappings:', mappings);
    // This would save to backend in real implementation
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>寄存器映射配置</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            导出 CSV
          </Button>
          <Button variant="outline" size="sm" onClick={importCSV}>
            <Upload className="h-4 w-4 mr-2" />
            导入 CSV
          </Button>
          <Button size="sm" onClick={saveMappings}>
            <Save className="h-4 w-4 mr-2" />
            保存配置
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">添加新映射</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <div>
              <Input 
                type="number" 
                placeholder="地址"
                value={newMapping.address}
                onChange={(e) => setNewMapping({...newMapping, address: parseInt(e.target.value) || 0})}
                className="w-full"
              />
            </div>
            <div>
              <Input 
                placeholder="名称"
                value={newMapping.name}
                onChange={(e) => setNewMapping({...newMapping, name: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <Select 
                value={newMapping.dataType}
                onValueChange={(value) => setNewMapping({...newMapping, dataType: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="数据类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uint16">UINT16</SelectItem>
                  <SelectItem value="int16">INT16</SelectItem>
                  <SelectItem value="uint32">UINT32</SelectItem>
                  <SelectItem value="int32">INT32</SelectItem>
                  <SelectItem value="float32">FLOAT32</SelectItem>
                  <SelectItem value="bool">BOOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input 
                placeholder="描述"
                value={newMapping.description}
                onChange={(e) => setNewMapping({...newMapping, description: e.target.value})}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm">读取</label>
              <input 
                type="checkbox" 
                checked={newMapping.read}
                onChange={(e) => setNewMapping({...newMapping, read: e.target.checked})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm">写入</label>
              <input 
                type="checkbox" 
                checked={newMapping.write}
                onChange={(e) => setNewMapping({...newMapping, write: e.target.checked})}
              />
              <Button size="sm" onClick={addMapping}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">地址</TableHead>
                <TableHead className="w-32">名称</TableHead>
                <TableHead className="w-24">数据类型</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="w-16">读取</TableHead>
                <TableHead className="w-16">写入</TableHead>
                <TableHead className="w-24">缩放因子</TableHead>
                <TableHead className="w-24">偏移量</TableHead>
                <TableHead className="w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={mapping.address}
                      onChange={(e) => updateMapping(mapping.id, 'address', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={mapping.name}
                      onChange={(e) => updateMapping(mapping.id, 'name', e.target.value)}
                      className="w-28"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={mapping.dataType}
                      onValueChange={(value) => updateMapping(mapping.id, 'dataType', value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uint16">UINT16</SelectItem>
                        <SelectItem value="int16">INT16</SelectItem>
                        <SelectItem value="uint32">UINT32</SelectItem>
                        <SelectItem value="int32">INT32</SelectItem>
                        <SelectItem value="float32">FLOAT32</SelectItem>
                        <SelectItem value="bool">BOOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={mapping.description}
                      onChange={(e) => updateMapping(mapping.id, 'description', e.target.value)}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={mapping.read}
                      onChange={(e) => updateMapping(mapping.id, 'read', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={mapping.write}
                      onChange={(e) => updateMapping(mapping.id, 'write', e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    {mapping.dataType !== 'bool' && (
                      <Input 
                        type="number" 
                        step="0.1"
                        value={mapping.scalingFactor || ''}
                        onChange={(e) => updateMapping(mapping.id, 'scalingFactor', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="1.0"
                        className="w-20"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {mapping.dataType !== 'bool' && (
                      <Input 
                        type="number" 
                        value={mapping.offset || ''}
                        onChange={(e) => updateMapping(mapping.id, 'offset', e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0"
                        className="w-20"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMapping(mapping.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">映射说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Badge variant="secondary" className="mr-2">地址</Badge>
              Modbus寄存器地址 (40001-49999 为保持寄存器)
            </div>
            <div>
              <Badge variant="secondary" className="mr-2">数据类型</Badge>
              支持标准Modbus数据类型
            </div>
            <div>
              <Badge variant="secondary" className="mr-2">缩放因子</Badge>
              用于数值转换 (原始值 × 缩放因子 + 偏移量)
            </div>
            <div>
              <Badge variant="secondary" className="mr-2">读取/写入</Badge>
              控制寄存器的访问权限
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterMappingEditor;