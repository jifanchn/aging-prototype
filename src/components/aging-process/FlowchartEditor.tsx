"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Play, 
  Save,
  Download,
  Upload
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlowchartStep {
  id: string;
  type: 'condition' | 'action' | 'python' | 'delay';
  name: string;
  config: any;
}

const FlowchartEditor = () => {
  const [steps, setSteps] = useState<FlowchartStep[]>([
    {
      id: '1',
      type: 'condition',
      name: '温度检查',
      config: {
        point: 'temperature',
        operator: '>=',
        value: 60,
        unit: '°C'
      }
    },
    {
      id: '2',
      type: 'action',
      name: '启动加热',
      config: {
        point: 'heater_control',
        value: true
      }
    },
    {
      id: '3',
      type: 'delay',
      name: '等待30秒',
      config: {
        duration: 30
      }
    },
    {
      id: '4',
      type: 'python',
      name: '复杂逻辑处理',
      config: {
        script: '# Python script for complex logic'
      }
    }
  ]);

  const addStep = (type: FlowchartStep['type']) => {
    const newStep: FlowchartStep = {
      id: Date.now().toString(),
      type,
      name: `${type === 'condition' ? '条件' : type === 'action' ? '动作' : type === 'python' ? 'Python脚本' : '延迟'} ${steps.length + 1}`,
      config: {}
    };
    setSteps([...steps, newStep]);
  };

  const renderStep = (step: FlowchartStep) => {
    switch (step.type) {
      case 'condition':
        return (
          <div className="p-3 bg-blue-100 rounded border-l-4 border-blue-500">
            <div className="font-medium">{step.name}</div>
            <div className="text-sm text-blue-700">
              {step.config.point} {step.config.operator} {step.config.value}{step.config.unit}
            </div>
          </div>
        );
      case 'action':
        return (
          <div className="p-3 bg-green-100 rounded border-l-4 border-green-500">
            <div className="font-medium">{step.name}</div>
            <div className="text-sm text-green-700">
              设置 {step.config.point} = {step.config.value ? '开启' : '关闭'}
            </div>
          </div>
        );
      case 'delay':
        return (
          <div className="p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
            <div className="font-medium">{step.name}</div>
            <div className="text-sm text-yellow-700">
              等待 {step.config.duration} 秒
            </div>
          </div>
        );
      case 'python':
        return (
          <div className="p-3 bg-purple-100 rounded border-l-4 border-purple-500">
            <div className="font-medium">{step.name}</div>
            <div className="text-sm text-purple-700">
              执行 Python 脚本
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>流程图编辑器</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              导入
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual">
          <TabsList>
            <TabsTrigger value="visual">可视化编辑</TabsTrigger>
            <TabsTrigger value="config">配置编辑</TabsTrigger>
            <TabsTrigger value="preview">预览</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="mt-4">
            <div className="mb-4 flex space-x-2">
              <Button size="sm" onClick={() => addStep('condition')}>
                <Plus className="h-4 w-4 mr-2" />
                添加条件
              </Button>
              <Button size="sm" onClick={() => addStep('action')}>
                <Plus className="h-4 w-4 mr-2" />
                添加动作
              </Button>
              <Button size="sm" onClick={() => addStep('delay')}>
                <Plus className="h-4 w-4 mr-2" />
                添加延迟
              </Button>
              <Button size="sm" onClick={() => addStep('python')}>
                <Plus className="h-4 w-4 mr-2" />
                添加Python脚本
              </Button>
            </div>
            
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground w-8">{index + 1}</div>
                  {renderStep(step)}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                预览流程
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="config" className="mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm font-mono">
{`{
  "steps": [
    {
      "type": "condition",
      "name": "温度检查",
      "config": {
        "point": "temperature",
        "operator": ">=",
        "value": 60,
        "unit": "°C"
      }
    },
    {
      "type": "action", 
      "name": "启动加热",
      "config": {
        "point": "heater_control",
        "value": true
      }
    }
  ]
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <div className="bg-muted p-4 rounded-lg min-h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">流程预览</div>
                <div className="text-sm text-muted-foreground">
                  这里将显示流程图的可视化预览
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FlowchartEditor;