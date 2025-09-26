"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus
} from "lucide-react";
import WorkstationOverview from "@/components/WorkstationOverview";
import WorkstationDevicePairing from "@/components/WorkstationDevicePairing";
import WorkstationAgingPairing from "@/components/WorkstationAgingPairing";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";

const WorkstationManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">工位管理</h1>
            <Button onClick={() => showSuccess('新建工位功能')}>
              <Plus className="mr-2 h-4 w-4" />
              新建工位
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="py-2">工位概览</TabsTrigger>
            <TabsTrigger value="device-pairing" className="py-2">工位-设备配对</TabsTrigger>
            <TabsTrigger value="aging-pairing" className="py-2">工位-老化配对</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="w-full">
            <Card>
              <CardContent className="p-0">
                <WorkstationOverview />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="device-pairing" className="w-full">
            <Card>
              <CardContent className="p-0">
                <WorkstationDevicePairing />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aging-pairing" className="w-full">
            <Card>
              <CardContent className="p-0">
                <WorkstationAgingPairing />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default WorkstationManagement;