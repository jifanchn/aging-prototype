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
  Play,
  Pause,
  X,
  Check
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface ProcessState {
  id: string;
  name: string;
  description: string;
  pythonScript: string;
  delay: number;
  conditions: ProcessCondition[];
  jumpTarget: string;
}

interface ProcessCondition {
  id: string;
  condition: string;
  action: string;
}

interface GlobalCheck {
  id: string;
  pythonScript: string;
  condition: string;
  jumpTarget: string;
}

const ProcessConfigurationTab = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [processes] = useState([
    { id: 'proc1', name: '高温老化流程 A' },
    { id: 'proc2', name: '标准老化流程 B' }
  ]);

  const [globalChecks, setGlobalChecks] = useState<GlobalCheck[]>([
    { 
      id: 'gc1', 
      pythonScript: 'if dev1.temperature > 50:\n    jumpstate("end")', 
      condition: '',
      jumpTarget: 'end' 
    }
  ]);

  const [processStates, setProcessStates] = useState<ProcessState[]>([
    { 
      id: 'state1', 
      name: '初始化', 
      description: '初始化设备和参数',
      pythonScript: 'system.log("开始初始化")\ndev1.set("power", 1)',
      delay: 0,
      conditions: [],
      jumpTarget: 'running'
    },
    { 
      id: 'state2', 
      name: '运行中', 
      description: '执行老化测试',
      pythonScript: 'system.log("老化测试进行中")\ntemp = dev1.get("temperature")',
      delay: 10,
      conditions: [
        { id: 'cond1', condition: 'dev1.temperature > 80', action: 'fail' }
      ],
      jumpTarget: 'end'
    }
  ]);

  const [newGlobalCheck, setNewGlobalCheck] = useState({ pythonScript: '', condition: '', jumpTarget: 'pause' });
  const [newState, setNewState] = useState({ name: '', description: '', pythonScript: '', delay: 0, jumpTarget: 'end' });
  const [newCondition, setNewCondition] = useState({ condition: '', action: 'pause' });

  const scriptExamples = `# Python脚本示例:
jumpstate("pause")      # 跳转到暂停状态
jumpstate("fail")       # 跳转到失败状态  
jumpstate("success")    # 跳转到成功状态

# 获取设备数据
dev1.get_last_timestamp  # 获取最后时间戳
dev1.get("point1")       # 获取设备点值

# 设置设备数据  
dev1.set("point1", 10)   # 设置设备点值

# 系统变量和函数
system.aging_time        # 老化时间 (float32)
system.log("TEXT")       # 记录日志
system.get_state()       # 获取当前状态`;

  const handleAddGlobalCheck = () => {
    if (!newGlobalCheck.pythonScript.trim() && !newGlobalCheck.condition.trim()) {
      showError('请输入Python脚本或条件');
      return;
    }

    const check: GlobalCheck = {
      id: `gc-${Date.now()}`,
      pythonScript: newGlobalCheck.pythonScript,
      condition: newGlobalCheck.condition,
      jumpTarget: newGlobalCheck.jumpTarget
    };

    setGlobalChecks([...globalChecks, check]);
    setNewGlobalCheck({ pythonScript: '', condition: '', jumpTarget: 'pause' });
    showSuccess('全局检查添加成功');
  };

  const handleRemoveGlobalCheck = (checkId: string) => {
    setGlobalChecks(globalChecks.filter(gc => gc.id !== checkId));
    showSuccess('全局检查移除成功');
  };

  const handleAddState = () => {
    if (!newState.name.trim()) {
      showError('请输入状态名称');
      return;
    }

    const state: ProcessState = {
      id: `state-${Date.now()}`,
      name: newState.name,
      description: newState.description,
      pythonScript: newState.pythonScript,
      delay: newState.delay,
      conditions: [],
      jumpTarget: newState.jumpTarget
    };

    setProcessStates([...processStates, state]);
    setNewState({ name: '', description: '', pythonScript: '', delay: 0, jumpTarget: 'end' });
    showSuccess('状态添加成功');
  };

  const handleRemoveState = (stateId: string) => {
    if (processStates.length <= 1) {
      showError('至少需要保留一个状态');
      return;
    }
    setProcessStates(processStates.filter(s => s.id !== stateId));
    showSuccess('状态移除成功');
  };

  const handleAddCondition = (stateId: string) => {
    if (!newCondition.condition.trim()) {
      showError('请输入条件');
      return;
    }

    setProcessStates(processStates.map(state => 
      state.id === stateId 
        ? { 
            ...state, 
            conditions: [...state.conditions, { 
              id: `cond-${Date.now()}`, 
              condition: newCondition.condition, 
              action: newCondition.action 
            }] 
          }
        : state
    ));
    
    setNewCondition({ condition: '', action: 'pause' });
    showSuccess('条件添加成功');
  };

  const handleRemoveCondition = (stateId: string, conditionId: string) => {
    setProcessStates(processStates.map(state => 
      state.id === stateId 
        ? { ...state, conditions: state.conditions.filter(c => c.id !== conditionId) }
        : state
    ));
    showSuccess('条件移除成功');
  };

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
          {/* 状态流程图示意 */}
          <Card>
            <CardHeader>
              <CardTitle>状态流程图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 p-4 bg-muted/30 rounded">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">LOOP</div>
                  <div className="text-xs mt-1">循环</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">GC</div>
                  <div className="text-xs mt-1">全局检查</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">SM</div>
                  <div className="text-xs mt-1">状态管理</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">LOOP</div>
                  <div className="text-xs mt-1">循环</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 全局检查配置 */}
          <Card>
            <CardHeader>
              <CardTitle>全局检查配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 添加全局检查 */}
              <div className="space-y-4 p-4 border rounded-lg">
                <Label>添加全局检查</Label>
                <div className="space-y-4">
                  <div>
                    <Label>Python脚本</Label>
                    <Textarea
                      placeholder="输入Python脚本..."
                      value={newGlobalCheck.pythonScript}
                      onChange={(e) => setNewGlobalCheck({ ...newGlobalCheck, pythonScript: e.target.value })}
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>条件配置</Label>
                      <Input
                        placeholder="添加条件，如: dev1.temperature > 50"
                        value={newGlobalCheck.condition}
                        onChange={(e) => setNewGlobalCheck({ ...newGlobalCheck, condition: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>跳转目标</Label>
                      <select
                        className="px-3 py-2 border rounded-md bg-background w-full"
                        value={newGlobalCheck.jumpTarget}
                        onChange={(e) => setNewGlobalCheck({ ...newGlobalCheck, jumpTarget: e.target.value })}
                      >
                        <option value="start">开始</option>
                        <option value="pause">暂停</option>
                        <option value="fail">失败</option>
                        <option value="success">成功</option>
                        <option value="end">结束</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button onClick={handleAddGlobalCheck} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    添加全局检查
                  </Button>
                </div>
              </div>

              {/* 脚本示例 */}
              <div className="p-4 bg-muted/20 rounded-lg">
                <Label className="mb-2">脚本示例</Label>
                <pre className="text-xs bg-background p-3 rounded font-mono overflow-x-auto">
                  {scriptExamples}
                </pre>
              </div>

              {/* 已配置的全局检查 */}
              {globalChecks.length > 0 && (
                <div className="space-y-2">
                  <Label>已配置的全局检查</Label>
                  {globalChecks.map(check => (
                    <div key={check.id} className="p-3 border rounded-lg bg-muted/10">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {check.pythonScript && (
                            <div className="mb-2">
                              <div className="text-sm font-medium mb-1">Python脚本:</div>
                              <pre className="text-xs bg-background p-2 rounded font-mono whitespace-pre-wrap">
                                {check.pythonScript}
                              </pre>
                            </div>
                          )}
                          {check.condition && (
                            <div className="text-sm">
                              <span className="font-medium">条件:</span> {check.condition}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            跳转目标: {check.jumpTarget}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveGlobalCheck(check.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 流程图配置 */}
          <Card>
            <CardHeader>
              <CardTitle>流程图配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 添加状态 */}
              <div className="space-y-4 p-4 border rounded-lg">
                <Label>添加状态</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>状态名称 *</Label>
                    <Input
                      placeholder="输入状态名称"
                      value={newState.name}
                      onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>状态文档</Label>
                    <Input
                      placeholder="状态描述"
                      value={newState.description}
                      onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Python脚本</Label>
                  <Textarea
                    placeholder="输入状态Python脚本..."
                    value={newState.pythonScript}
                    onChange={(e) => setNewState({ ...newState, pythonScript: e.target.value })}
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>延迟 (秒)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newState.delay}
                      onChange={(e) => setNewState({ ...newState, delay: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>跳转状态</Label>
                    <select
                      className="px-3 py-2 border rounded-md bg-background w-full"
                      value={newState.jumpTarget}
                      onChange={(e) => setNewState({ ...newState, jumpTarget: e.target.value })}
                    >
                      <option value="start">开始</option>
                      <option value="pause">暂停</option>
                      <option value="fail">失败</option>
                      <option value="success">成功</option>
                      <option value="end">结束</option>
                      {processStates.map(state => (
                        <option key={state.id} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleAddState} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  添加状态
                </Button>
              </div>

              {/* 状态列表 */}
              {processStates.length > 0 && (
                <div className="space-y-4">
                  <Label>状态列表</Label>
                  {processStates.map(state => (
                    <div key={state.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{state.name}</h3>
                          {state.description && (
                            <p className="text-sm text-muted-foreground">{state.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveState(state.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {state.pythonScript && (
                        <div className="mb-3">
                          <Label className="text-sm">Python脚本:</Label>
                          <pre className="text-xs bg-background p-2 rounded font-mono whitespace-pre-wrap mt-1">
                            {state.pythonScript}
                          </pre>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label className="text-sm">延迟:</Label>
                          <span className="ml-2">{state.delay} 秒</span>
                        </div>
                        <div>
                          <Label className="text-sm">跳转目标:</Label>
                          <span className="ml-2">{state.jumpTarget}</span>
                        </div>
                      </div>
                      
                      {/* 条件配置 */}
                      <div className="space-y-2">
                        <Label>条件配置</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input
                            placeholder="添加条件，如: dev1.temperature > 50"
                            value={newCondition.condition}
                            onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
                          />
                          <div className="flex space-x-2">
                            <select
                              className="px-3 py-2 border rounded-md bg-background flex-1"
                              value={newCondition.action}
                              onChange={(e) => setNewCondition({ ...newCondition, action: e.target.value })}
                            >
                              <option value="pause">暂停</option>
                              <option value="fail">失败</option>
                              <option value="success">成功</option>
                              <option value="start">开始</option>
                              <option value="end">结束</option>
                            </select>
                            <Button 
                              onClick={() => handleAddCondition(state.id)}
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {state.conditions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {state.conditions.map(condition => (
                              <div key={condition.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                <div>
                                  <span className="text-sm">条件: {condition.condition}</span>
                                  <span className="text-sm text-muted-foreground ml-2">→ {condition.action}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveCondition(state.id, condition.id)}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProcessConfigurationTab;