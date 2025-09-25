"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Play,
  StopCircle,
  Settings
} from "lucide-react";
import AgingProcessCard from "@/components/ui/aging-process-card";
import PythonScriptEditor from "@/components/ui/python-script-editor";
import FlowchartEditor from "@/components/ui/flowchart-editor";
import ModbusPointTable from "@/components/ui/modbus-point-table";
import { MadeWithDyad } from "@/components/made-with-dyad";

const AgingProcessManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('processes');
  const [pythonScript, setPythonScript] = useState('');

  const mockProcesses = [
    { id: 1, name: "老化流程 A", status: "running" as const, progress: 65, duration: "2h 15m", temperature: "65°C", voltage: "220V" },
    { id: 2, name: "老化流程 B", status: "completed" as const, progress: 100, duration: "4h 30m", temperature: "70°C", voltage: "220V" },
    { id: 3, name: "老化流程 C", status: "failed" as const, progress: 45, duration: "1h 20m", temperature: "60°C", voltage: "210V" },
    { id: 4, name: "老化流程 D", status: "stopped" as const, progress: 30, duration: "1h 00m", temperature: "55°C", voltage: "220V" },
    { id: 5, name: "老化流程 E", status: "paused" as const, progress: 75, duration: "3h 10m", temperature: "68°C", voltage: "220V" },
  ];

  const filteredProcesses = mockProcesses.filter(process => 
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleControlClick = (processId: number, action: 'start' | 'pause' | 'stop' | 'resume') => {
    console.log(`Action ${action} for process ${processId}`);
    // This would trigger the actual control action in the real implementation
  };

  const handleRunScript = () => {
    console.log('Running Python script:', pythonScript);
  };

  const handleSaveScript = () => {
    console.log('Saving Python script:', pythonScript);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">老化流程管理</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建流程
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <div className="flex space-x-2 mb-6">
          <Button 
            variant={activeTab === 'processes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('processes')}
          >
            老化流程
          </Button>
          <Button 
            variant={activeTab === 'modbus' ? 'default' : 'outline'}
            onClick={() => setActiveTab('modbus')}
          >
            Modbus 点表
          </Button>
          <Button 
            variant={activeTab === 'flowchart' ? 'default' : 'outline'}
            onClick={() => setActiveTab('flowchart')}
          >
            流程图配置
          </Button>
          <Button 
            variant={activeTab === 'python' ? 'default' : 'outline'}
            onClick={() => setActiveTab('python')}
          >
            Python 脚本
          </Button>
        </div>

        {activeTab === 'processes' && (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索老化流程..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                      批量配置
                    </Button>
                    <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                      <Play className="h-4 w-4" />
                      批量启动
                    </Button>
                    <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
                      <StopCircle className="h-4 w-4" />
                      批量停止
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProcesses.map((process) => (
                <AgingProcessCard
                  key={process.id}
                  id={process.id}
                  name={process.name}
                  status={process.status}
                  progress={process.progress}
                  duration={process.duration}
                  temperature={process.temperature}
                  voltage={process.voltage}
                  onControlClick={(action) => handleControlClick(process.id, action)}
                />
              ))}
            </div>

            {filteredProcesses.length === 0 && (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium text-foreground">没有找到老化流程</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  尝试调整搜索条件或创建新的老化流程
                </p>
                <div className="mt-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建流程
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'modbus' && <ModbusPointTable />}
        {activeTab === 'flowchart' && <FlowchartEditor />}
        {activeTab === 'python' && (
          <PythonScriptEditor
            script={pythonScript}
            onScriptChange={setPythonScript}
            onRunScript={handleRunScript}
            onSaveScript={handleSaveScript}
          />
        )}
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default AgingProcessManagement;