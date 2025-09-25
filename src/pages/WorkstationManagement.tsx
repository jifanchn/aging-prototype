"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter,
  Settings,
  Play,
  StopCircle
} from "lucide-react";
import WorkstationCard from "@/components/ui/workstation-card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const WorkstationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockWorkstations = [
    { id: 1, name: "工位 A1", status: "running", deviceCount: 12 },
    { id: 2, name: "工位 B2", status: "passed", deviceCount: 8 },
    { id: 3, name: "工位 C3", status: "failed", deviceCount: 5 },
    { id: 4, name: "工位 D4", status: "stopped", deviceCount: 15 },
    { id: 5, name: "工位 E5", status: "running", deviceCount: 10 },
    { id: 6, name: "工位 F6", status: "stopped", deviceCount: 7 },
  ];

  const filteredWorkstations = mockWorkstations.filter(ws => {
    const matchesSearch = ws.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ws.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">工位管理</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建工位
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索工位名称..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border rounded-md bg-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">所有状态</option>
                  <option value="running">运行中</option>
                  <option value="passed">老化通过</option>
                  <option value="failed">老化失败</option>
                  <option value="stopped">已停止</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkstations.map((workstation) => (
            <WorkstationCard
              key={workstation.id}
              id={workstation.id}
              name={workstation.name}
              status={workstation.status as any}
              deviceCount={workstation.deviceCount}
              onDetailsClick={() => console.log('View details for', workstation.name)}
              onActionClick={() => console.log('Action for', workstation.name)}
            />
          ))}
        </div>

        {filteredWorkstations.length === 0 && (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium text-foreground">没有找到工位</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              尝试调整搜索条件或创建新的工位
            </p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建工位
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default WorkstationManagement;