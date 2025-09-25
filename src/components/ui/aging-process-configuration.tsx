"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2,
  Play,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgingProcess {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  temperatureTarget: number;
  voltageTarget: number;
  status: 'active' | 'inactive';
}

interface WorkstationAgingMapping {
  workstationId: string;
  processId: string;
  deviceRequirements: string[]; // required device types
  priority: 'high' | 'medium' | 'low';
}

const AgingProcessConfiguration = () => {
  const [processes] = useState<AgingProcess[]>([
    { 
      id: 'proc1', 
      name: '高温老化流程 A', 
      description: '适用于高温环境下的设备老化测试',
      duration: 240,
      temperatureTarget: 70,
      voltageTarget: 220,
      status: 'active'
    },
    { 
      id: 'proc2', 
      name: '标准老化流程 B', 
      description: '通用老化测试流程',
      duration: 180,
      temperatureTarget: 65,
      voltageTarget: 220,
      status: 'active'
    },
    { 
      id: 'proc3', 
      name: '快速老化流程 C', 
      description: '快速验证流程',
      duration: 60,
      temperatureTarget: 60,
      voltageTarget: 220,
      status: 'inactive'
    },
  ]);

  const [workstations] = useState([
    { id: 'ws1', name: '工位 A1', location: '车间1' },
    { id: 'ws2', name: '工位 B2', location: '车间1' },
    { id: 'ws3', name: '工位 C3', location: '车间2' },
  ]);

  const [mappings, setMappings] = useState<WorkstationAgingMapping[]>([
    { workstationId: 'ws1', processId: 'proc1', deviceRequirements: ['temperature', 'voltage'], priority: 'high' },
    { workstationId: 'ws1', processId: 'proc2', deviceRequirements: ['temperature', 'voltage'], priority: 'medium' },
    { workstationId: 'ws2', processId: 'proc2', deviceRequirements: ['temperature', 'humidity'], priority: 'high' },
  ]);

  const [newMapping, setNewMapping] = useState<Omit<WorkstationAgingMapping, 'workstationId'>>({
    processId: '',
    deviceRequirements: ['temperature'],
    priority: 'medium'
  });

  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('ws1');

  const addMapping = () => {
    if (newMapping.processId) {
      setMappings([
        ...mappings,
        { ...newMapping, workstationId: selectedWorkstation }
      ]);
      setNewMapping({
        processId: '',
        deviceRequirements: ['temperature'],
        priority: 'medium'
      });
    }
  };

  const removeMapping = (processId: string) => {
    setMappings(mappings.filter(mapping => 
      !(mapping.workstationId === selectedWorkstation && mapping.processId === processId)
    ));
  };

  const getProcessName = (id: string) => {
    return processes.find(proc => proc.id === id)?.name || id;
  };

  const getProcessStatus = (id: string) => {
    return processes.find(proc => proc.id === id)?.status || 'inactive';
  };

  const filteredMappings = mappings.filter(mapping => mapping.workstationId === selectedWorkstation);
  const availableProcesses = processes.filter(proc => 
    !filteredMappings.some(mapping => mapping.processId === proc.id) && proc.status === 'active'
  );

  const getDeviceRequirementsText = (requirements: string[]) => {
    return requirements.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>老化流程配置</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Label htmlFor="workstationSelect">选择工位:</Label>
            <Select value={selectedWorkstation} onValueChange={setSelectedWorkstation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workstations.map(ws => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name} ({ws.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="processSelect">老化流程</Label>
              <Select 
                value={newMapping.processId} 
                onValueChange={(value) => setNewMapping({...newMapping, processId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择流程" />
                </SelectTrigger>
                <SelectContent>
                  {availableProcesses.map(process => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select 
                value={newMapping.priority} 
                onValueChange={(value) => setNewMapping({...newMapping, priority: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addMapping} className="w-full" disabled={!newMapping.processId}>
                <Plus className="h-4 w-4 mr-2" />
                添加流程
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">可用老化流程 ({filteredMappings.length} 个)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>流程名称</TableHead>
                <TableHead>设备要求</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMappings.map((mapping) => (
                <TableRow key={mapping.processId}>
                  <TableCell>{getProcessName(mapping.processId)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getDeviceRequirementsText(mapping.deviceRequirements)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mapping.priority === 'high' ? 'default' : mapping.priority === 'medium' ? 'secondary' : 'outline'}>
                      {mapping.priority === 'high' ? '高' : mapping.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getProcessStatus(mapping.processId) === 'active' ? 'default' : 'destructive'}>
                      {getProcessStatus(mapping.processId) === 'active' ? '可用' : '不可用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeMapping(mapping.processId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">配置说明</h4>
          <ul className="text-sm space-y-1">
            <li>• 老化流程只能在满足设备要求的工位上启动</li>
            <li>• 设备要求基于工位-设备映射中的设备类型</li>
            <li>• 只有状态为"可用"的流程才能被启动</li>
            <li>• 优先级用于自动流程选择和冲突解决</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgingProcessConfiguration;