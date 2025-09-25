"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  Plus,
  Database,
  FileText
} from "lucide-react";
import ProtocolConfigForm from "@/components/ui/protocol-config-form";
import { MadeWithDyad } from "@/components/made-with-dyad";

const ProtocolManagement = () => {
  const handleSaveConfig = (config: any) => {
    console.log('Saving protocol config:', config);
    // This would save the configuration in the real implementation
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">协议通信管理</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                寄存器映射
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                CSV 导入/导出
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建配置
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProtocolConfigForm 
            protocolType="modbus" 
            onSubmit={handleSaveConfig} 
          />
          <ProtocolConfigForm 
            protocolType="can" 
            onSubmit={handleSaveConfig} 
          />
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>设备连接状态</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Modbus Device 1</span>
                  <span className="text-sm text-muted-foreground">192.168.1.100:502</span>
                </div>
                <Button variant="outline" size="sm">详情</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">CAN Device 1</span>
                  <span className="text-sm text-muted-foreground">can0 @ 500kbps</span>
                </div>
                <Button variant="outline" size="sm">详情</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="font-medium">Modbus Device 2</span>
                  <span className="text-sm text-muted-foreground">Disconnected</span>
                </div>
                <Button variant="outline" size="sm">重连</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default ProtocolManagement;