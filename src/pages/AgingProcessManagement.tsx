"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import ProcessManagementTab from "@/components/aging-process/ProcessManagementTab";
import ProcessConfigurationTab from "@/components/aging-process/ProcessConfigurationTab";
import ProcessRecordingTab from "@/components/aging-process/ProcessRecordingTab";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgingProcessManagement = () => {
  const [activeTab, setActiveTab] = useState('process-management');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">老化流程管理</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="process-management">流程管理</TabsTrigger>
            <TabsTrigger value="process-configuration">流程配置</TabsTrigger>
            <TabsTrigger value="process-recording">流程记录配置</TabsTrigger>
          </TabsList>
          
          <TabsContent value="process-management">
            <ProcessManagementTab />
          </TabsContent>
          
          <TabsContent value="process-configuration">
            <ProcessConfigurationTab />
          </TabsContent>
          
          <TabsContent value="process-recording">
            <ProcessRecordingTab />
          </TabsContent>
        </Tabs>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default AgingProcessManagement;