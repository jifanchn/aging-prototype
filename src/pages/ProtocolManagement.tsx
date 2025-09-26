"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  Plus,
  Database,
  Package,
  Scan,
  Eye
} from "lucide-react";
import DeviceTypeManagement from "@/components/ui/device-type-management";
import RegisterScanConfig from "@/components/ui/register-scan-config";
import DeviceRegisterTable from "@/components/ui/device-register-table";
import DeviceProbeConfig from "@/components/ui/device-probe-config";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProtocolManagement = () => {
  const [activeTab, setActiveTab] = useState('device-types');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">协议通信管理</h1>
            <div className="flex items-center space-x-2">
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="device-types" className="py-2">
              <Package className="h-4 w-4 mr-2" />
              设备类型
            </TabsTrigger>
            <TabsTrigger value="scan-config" className="py-2">
              <Scan className="h-4 w-4 mr-2" />
              寄存器扫描
            </TabsTrigger>
            <TabsTrigger value="register-table" className="py-2">
              <Database className="h-4 w-4 mr-2" />
              寄存器表
            </TabsTrigger>
            <TabsTrigger value="probe-config" className="py-2">
              <Eye className="h-4 w-4 mr-2" />
              Probe条件
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="w-full">
          <CardContent className="p-0">
            <TabsContent value="device-types" className="p-0">
              <DeviceTypeManagement />
            </TabsContent>
            
            <TabsContent value="scan-config" className="p-0">
              <RegisterScanConfig />
            </TabsContent>
            
            <TabsContent value="register-table" className="p-0">
              <DeviceRegisterTable />
            </TabsContent>
            
            <TabsContent value="probe-config" className="p-0">
              <DeviceProbeConfig />
            </TabsContent>
          </CardContent>
        </Card>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default ProtocolManagement;