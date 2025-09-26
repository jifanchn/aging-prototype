"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2,
  CheckCircle,
  Circle
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DeviceType {
  id: string;
  name: string;
  protocol: string;
  description: string;
}

interface RegisterPoint {
  id: string;
  name: string;
  address: string;
  dataType: string;
  unit: string;
  description: string;
}

interface ProcessDevice {
  id: string;
  deviceTypeId: string;
  alias: string;
}

interface RecordingConfig {
  id: string;
  deviceId: string;
  registerId: string;
  interval: number;
}

const ProcessRecordingTab = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [processes] = useState([
    { id: 'proc1', name: '高温老化流程 A' },
    { id: 'proc2', name: '标准老化流程 B' }
  ]);

  // 模拟从协议管理获取的设备类型和点表
  const [deviceTypes] = useState<DeviceType[]>([
    { id: 'type1', name: 'Agave TH', protocol: 'modbus-tcp', description: '温度湿度传感器' },
    { id: 'type2', name: '电压监测器', protocol: 'modbus-tcp', description: '用于监测电压' }
  ]);

  const [registerPoints] = useState<RegisterPoint[]>([
    { id: 'reg1', name: 'temperature', address: '40001', dataType: 'float32', unit: '°C', description: '温度值' },
    { id: 'reg2', name: 'humidity', address: '40002', dataType: 'float32', unit: '%', description: '湿度值' },
    { id: 'reg3', name: 'voltage', address: '40003', dataType: 'float32', unit: 'V', description: '电压值' },
    { id: 'reg4', name: 'current', address: '40004', dataType: 'float32', unit: 'A', description: '电流值' }
  ]);

  // 模拟流程中的设备（从流程管理中获取）
  const [processDevices] = useState<ProcessDevice[]>([
    { id: 'dev1', deviceTypeId: 'type1', alias: 'DEV1' },
    { id: 'dev2', deviceTypeId: 'type2', alias: 'DEV2' }
  ]);

  const [recordingInterval, setRecordingInterval] = useState(5);
  const [recordAllData, setRecordAllData] = useState(false);
  const [recordingConfigs, setRecordingConfigs] = useState<RecordingConfig[]>([
    { id: 'rec1', deviceId: 'dev1', registerId: 'reg1', interval: 5 },
    { id: 'rec2', deviceId: 'dev1', registerId: 'reg2', interval: 5 }
  ]);

  const [newRecording, setNewRecording] = useState({ deviceId: '', registerId: '' });

  const getDeviceTypeName = (id: string) => {
    return deviceTypes.find(dt => dt.id === id)?.name || '未知设备类型';
  };

  const getRegisterName = (id: string) => {
    return registerPoints.find(reg => reg.id === id)?.name || '未知变量';
  };

  const getDeviceAlias = (id: string) => {
    return processDevices.find(dev => dev.id === id)?.alias || '未知设备';
  };

  const handleAddRecording = () => {
    if (!newRecording.deviceId || !newRecording.registerId) {
      showError('请选择设备和变量');
      return;
    }

    // 检查是否已存在相同的配置
    const existing = recordingConfigs.find(rec => 
      rec.deviceId === newRecording.deviceId && rec.registerId === newRecording.registerId
    );
    
    if (existing) {
      showError('该设备变量组合已存在');
      return;
    }

    const config: RecordingConfig = {
      id: `rec-${Date.now()}`,
      deviceId: newRecording.deviceId,
      registerId: newRecording.registerId,
      interval: recordingInterval
    };

    setRecordingConfigs([...recordingConfigs, config]);
    setNewRecording({ deviceId: '', registerId: '' });
    showSuccess('记录配置添加成功');
  };

  const handleRemoveRecording = (configId: string) => {
    setRecordingConfigs(recordingConfigs.filter(rec => rec.id !== configId));
    showSuccess('记录配置移除成功');
  };

  const toggleRecordAll = () => {
    setRecordAllData(!recordAllData);
    if (!recordAllData) {
      setRecordingConfigs([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 流程选择 */}
      <Card>
        <CardHeader>
          <CardTitle>选择老化流程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {processes.map(process => (
              <Button
                key={process.id}
                variant={selectedProcess === process.id ? "default" : "outline"}
                onClick={() => setSelectedProcess(process.id)}
              >
                {process.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {!selectedProcess && (
        <div className="text-center py-12 text-muted-foreground">
          请选择一个老化流程进行记录配置
        </div>
      )}

      {selectedProcess && (
        <>
          {/* 记录间隔配置 */}
          <Card>
            <CardHeader>
              <CardTitle>记录间隔配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>记录间隔</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 5, 10, 30, 60].map(interval => (
                    <Button
                      key={interval}
                      variant={recordingInterval === interval ? "default" : "outline"}
                      onClick={() => setRecordingInterval(interval)}
                    >
                      {interval}s
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecordAll}
                  className="p-0"
                >
                  {recordAllData ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <Label>记录所有数据（选中后下面的配置将不生效）</Label>
              </div>
            </CardContent>
          </Card>

          {/* 记录配置（当不记录所有数据时显示） */}
          {!recordAllData && (
            <Card>
              <CardHeader>
                <CardTitle>选择要记录的设备变量</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 添加记录配置 */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <Label>添加记录配置</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>选择设备（别名）</Label>
                      <select
                        className="px-3 py-2 border rounded-md bg-background w-full"
                        value={newRecording.deviceId}
                        onChange={(e) => setNewRecording({ ...newRecording, deviceId: e.target.value })}
                      >
                        <option value="">选择设备</option>
                        {processDevices.map(device => (
                          <option key={device.id} value={device.id}>
                            {device.alias} ({getDeviceTypeName(device.deviceTypeId)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>选择变量</Label>
                      <select
                        className="px-3 py-2 border rounded-md bg-background w-full"
                        value={newRecording.registerId}
                        onChange={(e) => setNewRecording({ ...newRecording, registerId: e.target.value })}
                      >
                        <option value="">选择变量</option>
                        {registerPoints.map(register => (
                          <option key={register.id} value={register.id}>
                            {register.name} ({register.unit}) - {register.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddRecording} 
                    className="w-full"
                    disabled={!newRecording.deviceId || !newRecording.registerId}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    添加记录配置
                  </Button>
                </div>

                {/* 已配置的记录列表 */}
                {recordingConfigs.length > 0 && (
                  <div className="space-y-2">
                    <Label>已配置的记录</Label>
                    {recordingConfigs.map(config => (
                      <div key={config.id} className="p-3 border rounded-lg bg-muted/10">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{getDeviceAlias(config.deviceId)}</span>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span>{getRegisterName(config.registerId)}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              (间隔: {config.interval}s)
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveRecording(config.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recordingConfigs.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    暂无记录配置，请添加要记录的设备变量
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {recordAllData && (
            <Card>
              <CardHeader>
                <CardTitle>记录配置状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium">所有数据将被记录</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    记录间隔: {recordingInterval}秒
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ProcessRecordingTab;