"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";

interface DeviceType {
  id: string;
  name: string;
  protocol: 'modbus-tcp'; // 只保留Modbus TCP
  description: string;
  createdAt: string;
}

const DeviceTypeManagement = () => {
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
    }
  ]);

  const [newDeviceType, setNewDeviceType] = useState<Omit<DeviceType, 'id' | 'createdAt'>>({
    name: '',
    protocol: 'modbus-tcp', // 默认且唯一选项
    description: ''
  });

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>添加设备类型</CardTitle>
        </CardHeader>
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
              <Input
                id="protocol"
                value="Modbus TCP"
                readOnly
                className="bg-muted cursor-not-allowed"
              />
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
                  <TableCell>{type.protocol.toUpperCase()}</TableCell>
                  <TableCell className="max-w-xs truncate" title={type.description}>
                    {type.description}
                  </TableCell>
                  <TableCell>{type.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDeviceType(type.id)}
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
    </div>
  );
};

export default DeviceTypeManagement;