"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus
} from "lucide-react";
import WorkstationOverview from "@/components/workstation/WorkstationOverview";
import WorkstationDevicePairing from "@/components/workstation/WorkstationDevicePairing";
import WorkstationAgingPairing from "@/components/workstation/WorkstationAgingPairing";
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
            {/* Removed the "新建工位" button from here */}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">工位概览</TabsTrigger>
            <TabsTrigger value="device-pairing">工位-设备配对</TabsTrigger>
            <TabsTrigger value="aging-pairing">工位-老化配对</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <WorkstationOverview />
          </TabsContent>
          
          <TabsContent value="device-pairing">
            <WorkstationDevicePairing />
          </TabsContent>
          
          <TabsContent value="aging-pairing">
            <WorkstationAgingPairing />
          </TabsContent>
        </Tabs>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default WorkstationManagement;