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

interface GlobalCheck {
  id: string;
  pythonScript: string;
  condition: string;
  jumpTarget: string;
  mode: 'script' | 'condition';
}

const GlobalChecksTab = () => {
  const [globalChecks, setGlobalChecks] = useState<GlobalCheck[]>([
    { 
      id: 'gc1', 
      pythonScript: 'if dev1.get("temperature") > 50:\n    jumpstate("end")', 
      condition: '',
      jumpTarget: 'end',
      mode: 'script'
    }
  ]);

  const [newGlobalCheck, setNewGlobalCheck] = useState({ pythonScript: '', condition: '', jumpTarget: 'pause', mode: 'script' as 'script' | 'condition' });

  const handleAddGlobalCheck = () => {
    if (newGlobalCheck.mode === 'script' && !newGlobalCheck.pythonScript.trim()) {
      showError('请输入Python脚本');
      return;
    }
    if (newGlobalCheck.mode === 'condition' && !newGlobalCheck.condition.trim()) {
      showError('请输入条件');
      return;
    }

    const check: GlobalCheck = {
      id: `gc-${Date.now()}`,
      pythonScript: newGlobalCheck.mode === 'script' ? newGlobalCheck.pythonScript : '',
      condition: newGlobalCheck.mode === 'condition' ? newGlobalCheck.condition : '',
      jumpTarget: newGlobalCheck.jumpTarget,
      mode: newGlobalCheck.mode
    };

    setGlobalChecks([...globalChecks, check]);
    setNewGlobalCheck({ pythonScript: '', condition: '', jumpTarget: 'pause', mode: 'script' });
    showSuccess('全局检查添加成功');
  };

  const handleRemoveGlobalCheck = (checkId: string) => {
    setGlobalChecks(globalChecks.filter(gc => gc.id !== checkId));
    showSuccess('全局检查移除成功');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>全局检查配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 添加全局检查 */}
          <div className="space-y-4 p-4 border rounded-lg">
            <Label>添加全局检查</Label>
            <div className="space-y-4">
              {/* Mode selection */}
              <div className="flex space-x-4 mb-4">
                <Button
                  variant={newGlobalCheck.mode === 'script' ? "default" : "outline"}
                  onClick={() => setNewGlobalCheck({...newGlobalCheck, mode: 'script', condition: ''})}
                  className="flex-1"
                >
                  <Circle className={`mr-2 h-4 w-4 ${newGlobalCheck.mode === 'script' ? 'text-white' : 'text-muted-foreground'}`} />
                  Python脚本模式
                </Button>
                <Button
                  variant={newGlobalCheck.mode === 'condition' ? "default" : "outline"}
                  onClick={() => setNewGlobalCheck({...newGlobalCheck, mode: 'condition', pythonScript: ''})}
                  className="flex-1"
                >
                  <Circle className={`mr-2 h-4 w-4 ${newGlobalCheck.mode === 'condition' ? 'text-white' : 'text-muted-foreground'}`} />
                  条件模式
                </Button>
              </div>

              {newGlobalCheck.mode === 'script' ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>条件配置</Label>
                    <Input
                      placeholder="添加条件，如: dev1.get('temperature') > 50"
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
              )}
              
              <Button onClick={handleAddGlobalCheck} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                添加全局检查
              </Button>
            </div>
          </div>

          {/* 已配置的全局检查 */}
          {globalChecks.length > 0 && (
            <div className="space-y-2">
              <Label>已配置的全局检查</Label>
              {globalChecks.map(check => (
                <div key={check.id} className="p-3 border rounded-lg bg-muted/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {check.mode === 'script' && check.pythonScript && (
                        <div className="mb-2">
                          <div className="text-sm font-medium mb-1">Python脚本:</div>
                          <pre className="text-xs bg-background p-2 rounded font-mono whitespace-pre-wrap">
                            {check.pythonScript}
                          </pre>
                        </div>
                      )}
                      {check.mode === 'condition' && check.condition && (
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
    </div>
  );
};

export default GlobalChecksTab;