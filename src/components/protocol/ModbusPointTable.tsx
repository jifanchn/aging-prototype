"use client";

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Play,
  StopCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModbusPoint {
  id: string;
  address: number;
  name: string;
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'bool';
  description: string;
  read: boolean;
  write: boolean;
  value?: number | boolean;
}

const ModbusPointTable = () => {
  const [points, setPoints] = useState<ModbusPoint[]>([
    { id: '1', address: 40001, name: '温度', dataType: 'float32', description: '设备温度', read: true, write: false, value: 65.5 },
    { id: '2', address: 40003, name: '电压', dataType: 'float32', description: '输入电压', read: true, write: false, value: 220.0 },
    { id: '3', address: 40005, name: '运行状态', dataType: 'bool', description: '设备运行状态', read: true, write: true, value: true },
    { id: '4', address: 40006, name: '启动命令', dataType: 'bool', description: '启动设备命令', read: false, write: true },
  ]);

  const [newPoint, setNewPoint] = useState<Omit<ModbusPoint, 'id' | 'value'>>({
    address: 40001,
    name: '',
    dataType: 'uint16',
    description: '',
    read: true,
    write: false
  });

  const addPoint = () => {
    if (newPoint.name.trim()) {
      setPoints([...points, { ...newPoint, id: Date.now().toString() }]);
      setNewPoint({
        address: 40001,
        name: '',
        dataType: 'uint16',
        description: '',
        read: true,
        write: false
      });
    }
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(point => point.id !== id));
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "地址,名称,数据类型,描述,读取,写入\n" +
      points.map(point => 
        `${point.address},${point.name},${point.dataType},${point.description},${point.read},${point.write}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modbus_points.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = () => {
    // This would handle CSV import in real implementation
    console.log('Import CSV functionality');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Modbus 点表配置</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              导出 CSV
            </Button>
            <Button variant="outline" size="sm" onClick={importCSV}>
              <Upload className="h-4 w-4 mr-2" />
              导入 CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">实时数据</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {points.filter(p => p.read && p.value !== undefined).map(point => (
              <div key={point.id} className="text-center">
                <div className="text-sm text-muted-foreground">{point.name}</div>
                <div className="text-lg font-bold">
                  {typeof point.value === 'boolean' ? (point.value ? '运行' : '停止') : point.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>地址</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>数据类型</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>读取</TableHead>
              <TableHead>写入</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {points.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.address}</TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.dataType}</TableCell>
                <TableCell>{point.description}</TableCell>
                <TableCell>{point.read ? '✓' : ''}</TableCell>
                <TableCell>{point.write ? '✓' : ''}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {point.write && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removePoint(point.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Input 
                  type="number" 
                  value={newPoint.address}
                  onChange={(e) => setNewPoint({...newPoint, address: parseInt(e.target.value) || 0})}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={newPoint.name}
                  onChange={(e) => setNewPoint({...newPoint, name: e.target.value})}
                />
              </TableCell>
              <TableCell>
                <select 
                  value={newPoint.dataType}
                  onChange={(e) => setNewPoint({...newPoint, dataType: e.target.value as any})}
                  className="px-2 py-1 border rounded"
                >
                  <option value="uint16">UINT16</option>
                  <option value="int16">INT16</option>
                  <option value="uint32">UINT32</option>
                  <option value="int32">INT32</option>
                  <option value="float32">FLOAT32</option>
                  <option value="bool">BOOL</option>
                </select>
              </TableCell>
              <TableCell>
                <Input 
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                />
              </TableCell>
              <TableCell>
                <input 
                  type="checkbox" 
                  checked={newPoint.read}
                  onChange={(e) => setNewPoint({...newPoint, read: e.target.checked})}
                />
              </TableCell>
              <TableCell>
                <input 
                  type="checkbox" 
                  checked={newPoint.write}
                  onChange={(e) => setNewPoint({...newPoint, write: e.target.checked})}
                />
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={addPoint}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModbusPointTable;