"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface RegisterScanConfig {
  id: string;
  deviceTypeId: string;
  registerType: 'input' | 'holding' | 'coil' | 'discrete';
  startAddress: number;
  endAddress: number;
  slaveId: number;
  scanInterval: number; // 毫秒
  description: string;
}

interface DeviceType {
  id: string;
  name: string;
  protocol: 'modbus-tcp' | 'custom';
}

const RegisterScanConfig = () => {
  const [scanConfigs, setScanConfigs] = useState<RegisterScanConfig[]>([
    {
      id: 'scan1',
      deviceTypeId: 'type1',
      registerType: 'input',
      startAddress: 40001,
      endAddress: 40010,
      slaveId: 1,
      scanInterval: 1000,
      description: '温度传感器输入寄存器扫描'
    },
    {
      id: 'scan2',
      deviceTypeId: 'type2',
      registerType: 'holding',
      startAddress: 40001,
      endAddress: 40020,
      slaveId: 2,
      scanInterval: 2000,
      description: '电力监测器保持寄存器扫描'
    }
  ]);

  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: '温度传感器', protocol: 'modbus-tcp' },
    { id: 'type2', name: '电力监测器', protocol: 'modbus-tcp' },
    { id: 'type3', name: 'Agave TH', protocol: 'custom' }
  ]);

  // Filter out custom device types for scan configuration
  const modbusDeviceTypes = deviceTypes.filter(type => type.protocol === 'modbus-tcp');

  const [newScanConfig, setNewScanConfig] = useState<Omit<RegisterScanConfig, 'id'>>({
    deviceTypeId: '',
    registerType: 'input',
    startAddress: 40001,
    endAddress: 40010,
    slaveId: 1,
    scanInterval: 1000,
    description: ''
  });

  const handleAddScanConfig = () => {
    if (!newScanConfig.deviceTypeId || newScanConfig.startAddress > newScanConfig.endAddress) {
      showError('请选择设备类型并确保起始地址小于结束地址');
      return;
    }

    const scanConfig: RegisterScanConfig = {
      id: `scan-${Date.now()}`,
      ...newScanConfig
    };

    setScanConfigs([...scanConfigs, scanConfig]);
    setNewScanConfig({
      deviceTypeId: '',
      registerType: 'input',
      startAddress: 40001,
      endAddress: 40010,
      slaveId: 1,
      scanInterval: 1000,
      description: ''
    });
    showSuccess('寄存器扫描配置添加成功');
  };

  const handleDeleteScanConfig = (id: string) => {
    setScanConfigs(scanConfigs.filter(config => config.id !== id));
    showSuccess('寄存器扫描配置删除成功');
  };

  const getRegisterTypeName = (type: string) => {
    switch (type) {
      case 'input': return '输入寄存器';
      case 'holding': return '保持寄存器';
      case 'coil': return '线圈';
      case 'discrete': return '离散输入';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>添加寄存器扫描配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceType">设备类型 *</Label>
              <Select
                value={newScanConfig.deviceTypeId}
                onValueChange={(value) => setNewScanConfig({ ...newScanConfig, deviceTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择设备类型" />
                </SelectTrigger>
                <SelectContent>
                  {modbusDeviceTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerType">寄存器类型</Label>
              <Select
                value={newScanConfig.registerType}
                onValueChange={(value) => setNewScanConfig({ ...newScanConfig, registerType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择寄存器类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">输入寄存器</SelectItem>
                  <SelectItem value="holding">保持寄存器</SelectItem>
                  <SelectItem value="coil">线圈</SelectItem>
                  <SelectItem value="discrete">离散输入</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startAddress">起始地址</Label>
              <Input
                id="startAddress"
                type="number"
                value={newScanConfig.startAddress}
                onChange={(e) => setNewScanConfig({ ...newScanConfig, startAddress: parseInt(e.target.value) || 40001 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAddress">结束地址</Label>
              <Input
                id="endAddress"
                type="number"
                value={newScanConfig.endAddress}
                onChange={(e) => setNewScanConfig({ ...newScanConfig, endAddress: parseInt(e.target.value) || 40010 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slaveId">从站ID</Label>
              <Input
                id="slaveId"
                type="number"
                value={newScanConfig.slaveId}
                onChange={(e) => setNewScanConfig({ ...newScanConfig, slaveId: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scanInterval">扫描间隔 (ms)</Label>
              <Input
                id="scanInterval"
                type="number"
                value={newScanConfig.scanInterval}
                onChange={(e) => setNewScanConfig({ ...newScanConfig, scanInterval: parseInt(e.target.value) || 1000 })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                placeholder="扫描配置描述"
                value={newScanConfig.description}
                onChange={(e) => setNewScanConfig({ ...newScanConfig, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddScanConfig} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            添加扫描配置
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>寄存器扫描配置列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备类型</TableHead>
                <TableHead>寄存器类型</TableHead>
                <TableHead>地址范围</TableHead>
                <TableHead>从站ID</TableHead>
                <TableHead>扫描间隔</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{modbusDeviceTypes.find(t => t.id === config.deviceTypeId)?.name || '未知'}</TableCell>
                  <TableCell>{getRegisterTypeName(config.registerType)}</TableCell>
                  <TableCell>{config.startAddress} - {config.endAddress}</TableCell>
                  <TableCell>{config.slaveId}</TableCell>
                  <TableCell>{config.scanInterval}ms</TableCell>
                  <TableCell className="max-w-xs truncate" title={config.description}>
                    {config.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteScanConfig(config.id)}
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

      {deviceTypes.some(type => type.protocol === 'custom') && (
        <Card>
          <CardHeader>
            <CardTitle>自定义设备类型说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm">
                自定义设备类型（如Agave TH）由后端直接实现，具有固定的数据字段结构，不需要配置寄存器扫描。
                这些设备的数据采集由后端自动管理，无需手动配置扫描参数。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegisterScanConfig;