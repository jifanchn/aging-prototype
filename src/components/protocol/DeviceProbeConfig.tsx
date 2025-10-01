"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Textarea } from "@/components/ui/textarea";

interface DeviceProbeConfig {
  id: string;
  deviceTypeId: string;
  probeScript: string;
  description: string;
  createdAt: string;
}

interface DeviceType {
  id: string;
  name: string;
  protocol: 'modbus-tcp' | 'custom';
}

const DeviceProbeConfig = () => {
  const [probeConfigs, setProbeConfigs] = useState<DeviceProbeConfig[]>([
    {
      id: 'probe1',
      deviceTypeId: 'type1',
      probeScript: 'temperature >= 0 and temperature <= 100',
      description: '温度传感器在线条件',
      createdAt: '2025-08-10'
    },
    {
      id: 'probe2',
      deviceTypeId: 'type2',
      probeScript: 'voltage >= 210 and voltage <= 230 and current >= 0',
      description: '电力监测器在线条件',
      createdAt: '2025-08-11'
    }
  ]);

  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: '温度传感器', protocol: 'modbus-tcp' },
    { id: 'type2', name: '电力监测器', protocol: 'modbus-tcp' },
    { id: 'type3', name: 'Agave TH', protocol: 'custom' }
  ]);

  const [newProbeConfig, setNewProbeConfig] = useState<Omit<DeviceProbeConfig, 'id' | 'createdAt'>>({
    deviceTypeId: '',
    probeScript: '',
    description: ''
  });

  // Filter out custom device types for probe configuration
  const modbusDeviceTypes = deviceTypes.filter(type => type.protocol === 'modbus-tcp');

  // Ensure each Modbus device type has Probe condition
  useEffect(() => {
    const missingTypes = modbusDeviceTypes.filter(type => 
      !probeConfigs.some(config => config.deviceTypeId === type.id)
    );
    
    if (missingTypes.length > 0) {
      const newConfigs = missingTypes.map(type => ({
        id: `probe-${type.id}-${Date.now()}`,
        deviceTypeId: type.id,
        probeScript: '',
        description: `${type.name}在线条件`,
        createdAt: new Date().toISOString().split('T')[0]
      }));
      
      setProbeConfigs(prev => [...prev, ...newConfigs]);
    }
  }, [modbusDeviceTypes, probeConfigs]);

  const handleAddOrUpdateProbeConfig = () => {
    if (!newProbeConfig.deviceTypeId || !newProbeConfig.probeScript) {
      showError('请选择设备类型并输入Probe条件');
      return;
    }

    const existingIndex = probeConfigs.findIndex(config => config.deviceTypeId === newProbeConfig.deviceTypeId);
    
    if (existingIndex >= 0) {
      // Update existing configuration
      const updatedConfigs = [...probeConfigs];
      updatedConfigs[existingIndex] = {
        ...updatedConfigs[existingIndex],
        probeScript: newProbeConfig.probeScript,
        description: newProbeConfig.description
      };
      setProbeConfigs(updatedConfigs);
      showSuccess('设备Probe条件更新成功');
    } else {
      // Add new configuration
      const probeConfig: DeviceProbeConfig = {
        id: `probe-${Date.now()}`,
        ...newProbeConfig,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProbeConfigs([...probeConfigs, probeConfig]);
      showSuccess('设备Probe条件添加成功');
    }

    setNewProbeConfig({
      deviceTypeId: '',
      probeScript: '',
      description: ''
    });
  };

  const handleDeleteProbeConfig = (id: string) => {
    // Don't allow deletion of device type Probe conditions, only update
    showError('设备Probe条件不能删除，只能更新');
  };

  const validateProbeScript = (script: string) => {
    const validOperators = ['>=', '<=', '>', '<', '==', '!=', 'and', 'or', '='];
    return validOperators.some(op => script.includes(op));
  };

  const getDeviceTypeById = (id: string) => {
    return deviceTypes.find(type => type.id === id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>设备Probe条件配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceType">设备类型 *</Label>
              <Select
                value={newProbeConfig.deviceTypeId}
                onValueChange={(value) => {
                  setNewProbeConfig({ ...newProbeConfig, deviceTypeId: value });
                  // Auto-fill description
                  const deviceType = getDeviceTypeById(value);
                  if (deviceType && !newProbeConfig.description) {
                    setNewProbeConfig(prev => ({ ...prev, description: `${deviceType.name}在线条件` }));
                  }
                }}
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                placeholder="设备在线条件描述"
                value={newProbeConfig.description}
                onChange={(e) => setNewProbeConfig({ ...newProbeConfig, description: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="probeScript">Probe脚本条件 *</Label>
              <div className="relative">
                <Textarea
                  id="probeScript"
                  placeholder="temperature >= 0 and temperature <= 100"
                  value={newProbeConfig.probeScript}
                  onChange={(e) => setNewProbeConfig({ ...newProbeConfig, probeScript: e.target.value })}
                  className="min-h-[100px] font-mono"
                />
                {!validateProbeScript(newProbeConfig.probeScript) && newProbeConfig.probeScript && (
                  <AlertTriangle className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                支持的操作符: =, {'>='}, {'<='}, {'>'}, {'<'}, ==, !=, and, or
              </p>
              <p className="text-xs text-muted-foreground">
                注意：Probe条件用于判断设备是否在线，基于设备寄存器表中的变量名
              </p>
            </div>
          </div>
          <Button onClick={handleAddOrUpdateProbeConfig} className="w-full">
            {newProbeConfig.deviceTypeId && probeConfigs.some(c => c.deviceTypeId === newProbeConfig.deviceTypeId) ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                更新Probe条件
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                添加Probe条件
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>设备Probe条件列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备类型</TableHead>
                <TableHead>Probe条件</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {probeConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">
                    {getDeviceTypeById(config.deviceTypeId)?.name || '未知'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono" title={config.probeScript}>
                    {config.probeScript || (
                      <span className="text-red-500">未配置</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={config.description}>
                    {config.description}
                  </TableCell>
                  <TableCell>{config.createdAt}</TableCell>
                  <TableCell>
                    {config.probeScript ? (
                      <span className="text-green-500">已配置</span>
                    ) : (
                      <span className="text-red-500">未配置</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewProbeConfig({
                          deviceTypeId: config.deviceTypeId,
                          probeScript: config.probeScript,
                          description: config.description
                        });
                      }}
                    >
                      编辑
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
                自定义设备类型（如Agave TH）由后端直接实现，具有固定的数据字段结构，不需要配置Probe条件。
                这些设备的在线状态由后端自动管理，无需手动配置Probe脚本。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeviceProbeConfig;