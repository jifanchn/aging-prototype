"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  Plus,
  Database,
  FileText,
  Cpu,
  Settings
} from "lucide-react";
import DeviceConnectionConfig from "@/components/ui/device-connection-config";
import RegisterMappingEditor from "@/components/ui/register-mapping-editor";
import WorkstationDeviceMapping from "@/components/ui/workstation-device-mapping";
import AgingProcessConfiguration from "@/components/ui/aging-process-configuration";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProtocolManagement = () => {
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">协议通信管理</h1>
            <div className="flex items-center space-x-2">
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="devices">
              <Wifi className="h-4 w-4 mr-2" />
              设备连接
            </TabsTrigger>
            <TabsTrigger value="mapping">
              <Database className="h-4 w-4 mr-2" />
              寄存器映射
            </TabsTrigger>
            <TabsTrigger value="workstation">
              <Cpu className="h-4 w-4 mr-2" />
              工位映射
            </TabsTrigger>
            <TabsTrigger value="aging">
              <Settings className="h-4 w-4 mr-2" />
              老化配置
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices">
            <DeviceConnectionConfig />
          </TabsContent>
          
          <TabsContent value="mapping">
            <RegisterMappingEditor />
          </TabsContent>
          
          <TabsContent value="workstation">
            <WorkstationDeviceMapping />
          </TabsContent>
          
          <TabsContent value="aging">
            <AgingProcessConfiguration />
          </TabsContent>
        </Tabs>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default ProtocolManagement;