"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wifi, 
  Settings,
  Upload,
  Download,
  TestTube
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProtocolConfigFormProps {
  protocolType: 'modbus' | 'can';
  onSubmit: (config: any) => void;
}

const ProtocolConfigForm = ({ 
  protocolType = 'modbus',
  onSubmit 
}: ProtocolConfigFormProps) => {
  const [modbusConfig, setModbusConfig] = useState({
    ipAddress: '192.168.1.100',
    port: '502',
    slaveId: '1',
    timeout: '1000',
    baudRate: '9600'
  });

  const [canConfig, setCanConfig] = useState({
    baudRate: '500000',
    canId: '0x123',
    interface: 'can0'
  });

  const handleModbusChange = (field: string, value: string) => {
    setModbusConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCanChange = (field: string, value: string) => {
    setCanConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (protocolType === 'modbus') {
      onSubmit(modbusConfig);
    } else {
      onSubmit(canConfig);
    }
  };

  const handleTestConnection = () => {
    console.log('Testing connection with config:', protocolType === 'modbus' ? modbusConfig : canConfig);
    // This would trigger a connection test in the real implementation
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wifi className="h-5 w-5" />
          <span>{protocolType === 'modbus' ? 'Modbus TCP' : 'CAN'} 协议配置</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={protocolType}>
          <TabsList>
            <TabsTrigger value="modbus">Modbus TCP</TabsTrigger>
            <TabsTrigger value="can">CAN</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modbus">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP 地址</Label>
                  <Input
                    id="ipAddress"
                    value={modbusConfig.ipAddress}
                    onChange={(e) => handleModbusChange('ipAddress', e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">端口</Label>
                  <Input
                    id="port"
                    type="number"
                    value={modbusConfig.port}
                    onChange={(e) => handleModbusChange('port', e.target.value)}
                    placeholder="502"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slaveId">从站ID</Label>
                  <Input
                    id="slaveId"
                    type="number"
                    value={modbusConfig.slaveId}
                    onChange={(e) => handleModbusChange('slaveId', e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">超时 (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={modbusConfig.timeout}
                    onChange={(e) => handleModbusChange('timeout', e.target.value)}
                    placeholder="1000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baudRate">波特率</Label>
                <Select
                  value={modbusConfig.baudRate}
                  onValueChange={(value) => handleModbusChange('baudRate', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择波特率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9600">9600</SelectItem>
                    <SelectItem value="19200">19200</SelectItem>
                    <SelectItem value="38400">38400</SelectItem>
                    <SelectItem value="57600">57600</SelectItem>
                    <SelectItem value="115200">115200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="can">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canBaudRate">波特率 (bps)</Label>
                <Select
                  value={canConfig.baudRate}
                  onValueChange={(value) => handleCanChange('baudRate', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择波特率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="125000">125 kbps</SelectItem>
                    <SelectItem value="250000">250 kbps</SelectItem>
                    <SelectItem value="500000">500 kbps</SelectItem>
                    <SelectItem value="1000000">1 Mbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canId">CAN ID</Label>
                <Input
                  id="canId"
                  value={canConfig.canId}
                  onChange={(e) => handleCanChange('canId', e.target.value)}
                  placeholder="0x123"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interface">接口</Label>
                <Input
                  id="interface"
                  value={canConfig.interface}
                  onChange={(e) => handleCanChange('interface', e.target.value)}
                  placeholder="can0"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex space-x-2 mt-6">
          <Button onClick={handleSubmit}>
            <Settings className="mr-2 h-4 w-4" />
            保存配置
          </Button>
          <Button variant="outline" onClick={handleTestConnection}>
            <TestTube className="mr-2 h-4 w-4" />
            测试连接
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            导入
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolConfigForm;