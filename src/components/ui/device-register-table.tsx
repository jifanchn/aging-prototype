"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Copy,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { showSuccess, showError } from "@/utils/toast";

interface Register {
  id: string;
  name: string;
  address: number;
  dataType: string;
  unit: string;
  description: string;
  readWrite: 'read' | 'write' | 'read-write';
  scalingFactor: number;
  offset: number;
}

const DeviceRegisterTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registers, setRegisters] = useState<Register[]>([
    { id: 'reg1', name: '温度值', address: 40001, dataType: 'float32', unit: '°C', description: '设备当前温度', readWrite: 'read', scalingFactor: 1, offset: 0 },
    { id: 'reg2', name: '电压值', address: 40003, dataType: 'float32', unit: 'V', description: '设备当前电压', readWrite: 'read', scalingFactor: 1, offset: 0 },
    { id: 'reg3', name: '电流值', address: 40005, dataType: 'float32', unit: 'A', description: '设备当前电流', readWrite: 'read', scalingFactor: 1, offset: 0 },
    { id: 'reg4', name: '功率值', address: 40007, dataType: 'float32', unit: 'W', description: '设备当前功率', readWrite: 'read', scalingFactor: 1, offset: 0 },
    { id: 'reg5', name: '目标温度', address: 40009, dataType: 'float32', unit: '°C', description: '设定目标温度', readWrite: 'write', scalingFactor: 1, offset: 0 },
    { id: 'reg6', name: '运行状态', address: 40011, dataType: 'bool', unit: '', description: '设备运行状态', readWrite: 'read-write', scalingFactor: 1, offset: 0 },
    { id: 'reg7', name: '湿度值', address: 40012, dataType: 'float32', unit: '%', description: '设备当前湿度', readWrite: 'read', scalingFactor: 1, offset: 0 },
    { id: 'reg8', name: '压力值', address: 40014, dataType: 'float32', unit: 'bar', description: '设备当前压力', readWrite: 'read', scalingFactor: 1, offset: 0 },
  ]);

  const filteredRegisters = registers.filter(register => 
    register.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    register.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    register.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRegister = () => {
    showSuccess('添加寄存器功能');
  };

  const handleEditRegister = (id: string) => {
    showSuccess(`编辑寄存器 ${id}`);
  };

  const handleDeleteRegister = (id: string) => {
    if (window.confirm('确定要删除这个寄存器吗？')) {
      setRegisters(registers.filter(reg => reg.id !== id));
      showSuccess('寄存器删除成功');
    }
  };

  const handleDuplicateRegister = (register: Register) => {
    const newRegister = { ...register, id: `reg-${Date.now()}`, name: `${register.name} (副本)` };
    setRegisters([...registers, newRegister]);
    showSuccess('寄存器复制成功');
  };

  const handleExportRegisters = () => {
    showSuccess('导出寄存器表功能');
  };

  const getReadWriteText = (rw: Register['readWrite']) => {
    switch (rw) {
      case 'read': return '只读';
      case 'write': return '只写';
      case 'read-write': return '读写';
      default: return rw;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">设备寄存器表配置</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportRegisters}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button onClick={handleAddRegister}>
            <Plus className="h-4 w-4 mr-2" />
            新建寄存器
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索寄存器名称、描述或单位..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>寄存器名称</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>单位</TableHead>
                  <TableHead>读写属性</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegisters.map((register) => (
                  <TableRow key={register.id}>
                    <TableCell className="font-medium">{register.name}</TableCell>
                    <TableCell>{register.address}</TableCell>
                    <TableCell>{register.dataType}</TableCell>
                    <TableCell>{register.unit}</TableCell>
                    <TableCell>{getReadWriteText(register.readWrite)}</TableCell>
                    <TableCell>{register.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateRegister(register)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRegister(register.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRegister(register.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRegisters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              没有找到匹配的寄存器
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceRegisterTable;