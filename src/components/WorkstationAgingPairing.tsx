"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Edit,
  Trash2,
  X
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Workstation {
  id: string;
  name: string;
  description: string;
}

interface AgingProcess {
  id: string;
  name: string;
  description: string;
}

interface AgingPairing {
  id: string;
  workstationId: string;
  processIds: string[];
  createdAt: string;
}

const WorkstationAgingPairing = () => {
  const [workstations] = useState<Workstation[]>([
    { id: 'ws1', name: '工位 A1', description: '主老化工位' },
    { id: 'ws2', name: '工位 B2', description: '备用老化工位' },
    { id: 'ws3', name: '工位 C3', description: '测试工位' },
    { id: 'ws4', name: '工位 D4', description: '验证工位' }
  ]);

  const [agingProcesses] = useState<AgingProcess[]>([
    { id: 'proc1', name: '高温老化流程 A', description: '适用于高温环境下的设备老化测试' },
    { id: 'proc2', name: '标准老化流程 B', description: '标准条件下的设备老化测试' },
    { id: 'proc3', name: '快速老化流程 C', description: '加速老化测试流程' },
    { id: 'proc4', name: '低温老化流程 D', description: '低温环境下的设备老化测试' }
  ]);

  const [pairings, setPairings] = useState<AgingPairing[]>([
    { id: 'pair1', workstationId: 'ws1', processIds: ['proc1', 'proc2'], createdAt: '2025-08-10' },
    { id: 'pair2', workstationId: 'ws2', processIds: ['proc2', 'proc3'], createdAt: '2025-08-11' },
    { id: 'pair3', workstationId: 'ws3', processIds: ['proc1'], createdAt: '2025-08-12' }
  ]);

  const [newPairing, setNewPairing] = useState({ workstationId: '', processIds: [] as string[] });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPairingId, setEditingPairingId] = useState('');

  const getWorkstationName = (id: string) => {
    return workstations.find(ws => ws.id === id)?.name || '未知工位';
  };

  const getProcessName = (id: string) => {
    return agingProcesses.find(proc => proc.id === id)?.name || '未知老化流程';
  };

  const handleAddPairing = () => {
    if (!newPairing.workstationId || newPairing.processIds.length === 0) {
      showError('请选择工位和至少一个老化流程');
      return;
    }

    const existingPairing = pairings.find(p => p.workstationId === newPairing.workstationId);
    if (existingPairing && !isEditing) {
      showError('该工位已存在老化流程配对，请编辑现有配对');
      return;
    }

    if (isEditing) {
      // 更新现有配对
      setPairings(pairings.map(pairing => 
        pairing.id === editingPairingId 
          ? { ...pairing, processIds: newPairing.processIds }
          : pairing
      ));
      showSuccess('工位老化流程配对更新成功');
    } else {
      // 添加新配对
      const pairing: AgingPairing = {
        id: `pairing-${Date.now()}`,
        workstationId: newPairing.workstationId,
        processIds: newPairing.processIds,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPairings([...pairings, pairing]);
      showSuccess('工位老化流程配对添加成功');
    }

    // 重置表单
    setNewPairing({ workstationId: '', processIds: [] });
    setIsEditing(false);
    setEditingPairingId('');
  };

  const toggleProcessSelection = (processId: string) => {
    setNewPairing(prev => ({
      ...prev,
      processIds: prev.processIds.includes(processId) 
        ? prev.processIds.filter(id => id !== processId)
        : [...prev.processIds, processId]
    }));
  };

  const handleEditPairing = (pairing: AgingPairing) => {
    setNewPairing({ workstationId: pairing.workstationId, processIds: pairing.processIds });
    setIsEditing(true);
    setEditingPairingId(pairing.id);
  };

  const handleDeletePairing = (pairingId: string) => {
    if (window.confirm('确定要删除这个工位老化流程配对吗？')) {
      setPairings(pairings.filter(p => p.id !== pairingId));
      showSuccess('工位老化流程配对删除成功');
    }
  };

  const handleCancelEdit = () => {
    setNewPairing({ workstationId: '', processIds: [] });
    setIsEditing(false);
    setEditingPairingId('');
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? '编辑工位-老化流程配对' : '创建工位-老化流程配对'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workstationSelect" className="text-sm font-medium">选择工位 *</label>
              <select
                id="workstationSelect"
                className="px-3 py-2 border rounded-md bg-background w-full"
                value={newPairing.workstationId}
                onChange={(e) => {
                  setNewPairing({ ...newPairing, workstationId: e.target.value });
                  const existing = pairings.find(p => p.workstationId === e.target.value);
                  if (existing) {
                    setNewPairing({ ...newPairing, processIds: existing.processIds });
                  } else {
                    setNewPairing({ ...newPairing, processIds: [] });
                  }
                }}
                disabled={isEditing}
              >
                <option value="">选择工位</option>
                {workstations.map(workstation => (
                  <option key={workstation.id} value={workstation.id}>
                    {workstation.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label>选择老化流程 *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agingProcesses.map(process => (
                <div key={process.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={`process-${process.id}`}
                      checked={newPairing.processIds.includes(process.id)}
                      onChange={() => toggleProcessSelection(process.id)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`process-${process.id}`} className="text-sm font-medium">
                      {process.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleAddPairing} className="flex-1" disabled={!newPairing.workstationId || newPairing.processIds.length === 0}>
              {isEditing ? (
                <Edit className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isEditing ? '更新配对' : '添加配对'}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>工位-老化流程配对列表</CardTitle>
        </CardHeader>
        <CardContent>
          {pairings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无工位-老化流程配对，请先创建配对
            </div>
          ) : (
            <div className="space-y-4">
              {pairings.map((pairing) => (
                <div key={pairing.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{getWorkstationName(pairing.workstationId)}</h3>
                      <div className="flex flex-wrap gap-2">
                        {pairing.processIds.map(processId => (
                          <div key={processId} className="bg-muted/50 rounded px-3 py-1">
                            <span className="text-sm">{getProcessName(processId)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        创建时间: {pairing.createdAt}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPairing(pairing)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePairing(pairing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        删除
                      </Button>
                    </div>
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

export default WorkstationAgingPairing;