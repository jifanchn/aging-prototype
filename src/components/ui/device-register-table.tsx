"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search,
  Eye,
  Database
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Register {
  id: string;
  name: string;
  address: number;
  dataType: string;
  unit: string;
  description: string;
  deviceTypeId: string;
}

interface DeviceType {
  id: string;
  name: string;
  protocol: string;
}

const DeviceRegisterTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState('all');
  
  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'all', name: '所有设备类型', protocol: '' },
    { id: 'type1', name: '温度传感器', protocol: 'modbus-tcp' },
    { id: 'type2', name: '电压监测器', protocol: 'modbus-tcp' },
    { id: 'type3', name: '湿度传感器', protocol: 'modbus-tcp' },
    { id: 'type4', name: '功率计', protocol: 'modbus-rtu' }
  ]);

  const [registers] = useState<Register[]>([
    { id: 'reg1', name: '温度值', address: 40001, dataType: 'float32', unit: '°C', description: '当前温度读数', deviceTypeId: 'type1' },
    { id: 'reg2', name: '电压值', address: 40001, dataType: 'float32', unit: 'V', description: '当前电压读数', deviceTypeId: 'type2' },
    { id: 'reg3', name: '湿度值', address: 40001, dataType: 'float32', unit: '%', description: '当前湿度读数', deviceTypeId: 'type3' },
    { id: 'reg4', name: '功率值', address: 40001, dataType: 'float32', unit: 'W', description: '当前功率读数', deviceTypeId: 'type4' },
    { id: 'reg5', name: '状态标志', address: 40002, dataType: 'uint16', unit: '', description: '设备运行状态', deviceTypeId: 'type1' },
    { id: 'reg6', name: '报警阈值', address: 40003, dataType: 'float32', unit: '°C', description: '温度报警阈值', deviceTypeId: 'type1' }
  ]);

  const filteredRegisters = registers.filter(register => {
    const matchesSearch = register.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         register.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeviceType = selectedDeviceType === 'all' || register.deviceTypeId === selectedDeviceType;
    return matchesSearch && matchesDeviceType;
  });

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(type => type.id === id)?.name || '未知设备类型';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">设备寄存器表配置</h2>
        <Button onClick={() => showSuccess('创建寄存器')}>
          <Plus className="mr-2 h-4 w-4" />
          新建寄存器
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="搜索寄存器名称或描述..."
                  className="pl-10 px-3 py-2 border rounded-md bg-background w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={selectedDeviceType}
                onChange={(e) => setSelectedDeviceType(e.target.value)}
              >
                {deviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Eye className="h-4 w-4" />
                查看映射
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>寄存器列表</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRegisters.length === 0 ? (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium text-foreground">没有找到寄存器</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                尝试调整搜索条件或创建新的寄存器
              </p>
              <div className="mt-6">
                <Button onClick={() => showSuccess('创建寄存器')}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建寄存器
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegisters.map(register => (
                <div key={register.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{register.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">地址:</span> {register.address}</div>
                        <div><span className="text-muted-foreground">数据类型:</span> {register.dataType}</div>
                        <div><span className="text-muted-foreground">单位:</span> {register.unit}</div>
                        <div><span className="text-muted-foreground">设备类型:</span> {getDeviceTypeName(register.deviceTypeId)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{register.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => showSuccess('编辑寄存器')}>
                        编辑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm('确定要删除这个寄存器吗？')) {
                            showSuccess('寄存器删除成功');
                          }
                        }}
                      >
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

export default DeviceRegisterTable;