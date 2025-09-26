"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play,
  Pause,
  X,
  Check
} from "lucide-react";
import GlobalChecksTab from "@/components/aging-process/GlobalChecksTab";
import StateManagementTab from "@/components/aging-process/StateManagementTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProcessConfigurationTab = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [processes] = useState([
    { id: 'proc1', name: '高温老化流程 A' },
    { id: 'proc2', name: '标准老化流程 B' }
  ]);

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
          请选择一个老化流程进行配置
        </div>
      )}

      {selectedProcess && (
        <>
          {/* 状态流程图示意 - Updated with larger rectangles and "下一次循环" label */}
          <Card>
            <CardHeader>
              <CardTitle>状态流程图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-6 p-4 bg-muted/30 rounded">
                <div className="text-center">
                  <div className="w-24 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold">循环</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-green-500 rounded flex items-center justify-center text-white font-bold">全局检查</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-purple-500 rounded flex items-center justify-center text-white font-bold">状态管理</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold">下一次循环</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Global Checks and State Management */}
          <Tabs defaultValue="global-checks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="global-checks">全局检查</TabsTrigger>
              <TabsTrigger value="state-management">状态管理</TabsTrigger>
            </TabsList>

            <TabsContent value="global-checks">
              <GlobalChecksTab />
            </TabsContent>

            <TabsContent value="state-management">
              <StateManagementTab />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ProcessConfigurationTab;