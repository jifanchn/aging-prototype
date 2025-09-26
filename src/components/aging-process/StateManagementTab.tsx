"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2,
  Circle
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProcessState {
  id: string;
  name: string;
  description: string;
  pythonScript: string;
  checkInterval: '500ms' | '1s' | '5s' | '10s';
  conditions: ProcessCondition[];
  jumpTarget: string;
  mode: 'script' | 'condition';
}

interface ProcessCondition {
  id: string;
  condition: string;
  action: string;
}

const StateManagementTab = () => {
  const [processStates, setProcessStates] = useState<ProcessState[]>([
    { 
      id: 'state1', 
      name: '初始化', 
      description: '初始化设备和参数',
      pythonScript: 'system.log("开始初始化")\ndev1.set("power", 1)',
      checkInterval: '1s',
      conditions: [],
      jumpTarget: 'running',
      mode: 'script'
    },
    { 
      id: 'state2', 
      name: '运行中', 
      description: '执行老化测试',
      pythonScript: '',
      checkInterval: '5s',
      conditions: [
        { id: 'cond1', condition: 'dev1.get("temperature") > 80', action: 'fail' }
      ],
      jumpTarget: 'end',
      mode: 'condition'
    }
  ]);

  const [newState, setNewState] = useState({ name: '', description: '' });
  const [selectedStateId, setSelectedStateId] = useState<string | null>(processStates[0]?.id || null);
  const [editingState, setEditingState] = useState<ProcessState | null>(processStates[0] || null);
  const [newCondition, setNewCondition] = useState({ condition: '', action: 'pause' });

  const selectedState = processStates.find(state => state.id === selectedStateId) || null;

  const handleAddState = () => {
    if (!newState.name.trim()) {
      showError('请输入状态名称');
      return;
    }

    const state: ProcessState = {
      id: `state-${Date.now()}`,
      name: newState.name,
      description: newState.description,
      pythonScript: '',
      checkInterval: '1s',
      conditions: [],
      jumpTarget: processStates.length > 0 ? processStates[0].name : 'end',
      mode: 'script' // Default to script mode
    };

    setProcessStates([...processStates, state]);
    setNewState({ name: '', description: '' });
    setSelectedStateId(state.id);
    setEditingState(state);
    showSuccess('状态添加成功');
  };

  const handleSaveState = () => {
    if (!editingState) return;

    setProcessStates(processStates.map(state => 
      state.id === editingState.id ? editingState : state
    ));
    showSuccess('状态保存成功');
  };

  const handleRemoveState = (stateId: string) => {
    if (processStates.length <= 1) {
      showError('至少需要保留一个状态');
      return;
    }
    setProcessStates(processStates.filter(s => s.id !== stateId));
    if (selectedStateId === stateId) {
      const remainingState = processStates.find(s => s.id !== stateId);
      setSelectedStateId(remainingState?.id || null);
      setEditingState(remainingState || null);
    }
    showSuccess('状态移除成功');
  };

  const handleAddCondition = () => {
    if (!editingState || !newCondition.condition.trim()) {
      showError('请输入条件');
      return;
    }

    const updatedState = {
      ...editingState,
      conditions: [...editingState.conditions, { 
        id: `cond-${Date.now()}`, 
        condition: newCondition.condition, 
        action: newCondition.action 
      }]
    };

    setEditingState(updatedState);
    setNewCondition({ condition: '', action: 'pause' });
    showSuccess('条件添加成功');
  };

  const handleRemoveCondition = (conditionId: string) => {
    if (!editingState) return;

    const updatedState = {
      ...editingState,
      conditions: editingState.conditions.filter(c => c.id !== conditionId)
    };

    setEditingState(updatedState);
  };

  const handleModeChange = (mode: 'script' | 'condition') => {
    if (!editingState) return;

    const updatedState = {
      ...editingState,
      mode,
      pythonScript: mode === 'condition' ? '' : editingState.pythonScript,
      conditions: mode === 'script' ? [] : editingState.conditions
    };

    setEditingState(updatedState);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>状态列表</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-4 p-3 border rounded-lg">
              <Label>添加新状态</Label>
              <div className="space-y-2">
                <Input
                  placeholder="状态名称"
                  value={newState.name}
                  onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                />
                <Input
                  placeholder="状态描述"
                  value={newState.description}
                  onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                />
              </div>
              <Button onClick={handleAddState} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                添加状态
              </Button>
            </div>

            <div className="space-y-2">
              {processStates.map(state => (
                <div 
                  key={state.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStateId === state.id 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedStateId(state.id);
                    setEditingState(state);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{state.name}</h4>
                      {state.description && (
                        <p className="text-xs text-muted-foreground mt-1">{state.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveState(state.id);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    模式: {state.mode === 'script' ? '脚本' : '条件'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* State Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedState ? `编辑状态: ${selectedState.name}` : '选择一个状态进行编辑'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedState && editingState ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>状态名称</Label>
                    <Input
                      value={editingState.name}
                      onChange={(e) => setEditingState({ ...editingState, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>状态描述</Label>
                    <Input
                      value={editingState.description}
                      onChange={(e) => setEditingState({ ...editingState, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Check interval selection */}
                <div className="space-y-2">
                  <Label>检查时间间隔</Label>
                  <select
                    className="px-3 py-2 border rounded-md bg-background w-full"
                    value={editingState.checkInterval}
                    onChange={(e) => setEditingState({ ...editingState, checkInterval: e.target.value as any })}
                  >
                    <option value="500ms">500ms</option>
                    <option value="1s">1s</option>
                    <option value="5s">5s</option>
                    <option value="10s">10s</option>
                  </select>
                </div>

                {/* Mode selection */}
                <div className="space-y-2">
                  <Label>执行模式</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={editingState.mode === 'script' ? "default" : "outline"}
                      onClick={() => handleModeChange('script')}
                      className="flex-1"
                    >
                      <Circle className={`mr-2 h-4 w-4 ${editingState.mode === 'script' ? 'text-white' : 'text-muted-foreground'}`} />
                      Python脚本模式
                    </Button>
                    <Button
                      variant={editingState.mode === 'condition' ? "default" : "outline"}
                      onClick={() => handleModeChange('condition')}
                      className="flex-1"
                    >
                      <Circle className={`mr-2 h-4 w-4 ${editingState.mode === 'condition' ? 'text-white' : 'text-muted-foreground'}`} />
                      条件模式
                    </Button>
                  </div>
                </div>

                {editingState.mode === 'script' ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Python脚本</Label>
                      <Textarea
                        placeholder="输入状态Python脚本..."
                        value={editingState.pythonScript}
                        onChange={(e) => setEditingState({ ...editingState, pythonScript: e.target.value })}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 条件配置 */}
                    <div className="space-y-2">
                      <Label>条件配置</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          placeholder='dev1.get("temperature") > 20'
                          value={newCondition.condition}
                          onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
                        />
                        <div className="flex space-x-2">
                          <select
                            className="px-3 py-2 border rounded-md bg-background flex-1"
                            value={newCondition.action}
                            onChange={(e) => setNewCondition({ ...newCondition, action: e.target.value })}
                          >
                            {processStates.map(state => (
                              <option key={state.id} value={state.name}>{state.name}</option>
                            ))}
                            <option value="start">开始</option>
                            <option value="pause">暂停</option>
                            <option value="fail">失败</option>
                            <option value="success">成功</option>
                            <option value="end">结束</option>
                          </select>
                          <Button 
                            onClick={handleAddCondition}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {editingState.conditions.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {editingState.conditions.map(condition => (
                            <div key={condition.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                              <div>
                                <span className="text-sm">条件: {condition.condition}</span>
                                <span className="text-sm text-muted-foreground ml-2">→ {condition.action}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveCondition(condition.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button onClick={handleSaveState} className="w-full">
                  保存状态配置
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                请选择左侧的状态进行编辑
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StateManagementTab;