"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download,
  Search,
  Calendar
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Input } from "@/components/ui/input";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";

// Mock data for aging logs
const mockAgingLogs = [
  { id: '1', sn: 'SN123456789', startTime: '2025-08-10T08:00:00', endTime: '2025-08-10T12:00:00', status: 'completed', workstation: '工位 A1' },
  { id: '2', sn: 'SN123456790', startTime: '2025-08-10T09:00:00', endTime: '2025-08-10T13:30:00', status: 'failed', workstation: '工位 B2' },
  { id: '3', sn: 'SN123456791', startTime: '2025-08-11T10:00:00', endTime: null, status: 'running', workstation: '工位 C3' },
  { id: '4', sn: 'SN987654321', startTime: '2025-08-11T11:00:00', endTime: '2025-08-11T15:00:00', status: 'completed', workstation: '工位 D4' },
  { id: '5', sn: 'SN987654322', startTime: '2025-08-12T08:30:00', endTime: null, status: 'running', workstation: '工位 A1' },
];

const Analytics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Mock data for the circular chart
  const chartData = [
    { name: '成功', value: 92, color: '#10b981' },
    { name: '失败', value: 12, color: '#ef4444' },
    { name: '运行中', value: 8, color: '#3b82f6' },
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showError('请输入SN编号');
      return;
    }
    
    const results = mockAgingLogs.filter(log => 
      log.sn.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (results.length === 0) {
      showError('未找到匹配的SN编号');
      setSearchResults([]);
    } else {
      setSearchResults(results);
      showSuccess(`找到 ${results.length} 条匹配记录`);
    }
  };

  const handleDownload = (log: any) => {
    // Set default time range based on log data
    const defaultStartTime = log.startTime ? format(new Date(log.startTime), 'yyyy-MM-dd HH:mm') : '';
    const defaultEndTime = log.endTime ? format(new Date(log.endTime), 'yyyy-MM-dd HH:mm') : format(new Date(), 'yyyy-MM-dd HH:mm');
    
    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);
    setSelectedLog(log);
    
    // In a real implementation, this would download the actual log file
    // For now, we'll create a mock CSV file
    const csvContent = `SN,${log.sn}\n工位,${log.workstation}\n状态,${log.status}\n开始时间,${defaultStartTime}\n结束时间,${defaultEndTime}\n\n时间,温度(°C),电压(V),电流(A),状态\n2025-08-10 08:00:00,25.0,220.0,0.0,启动\n2025-08-10 08:05:00,35.2,220.1,1.2,升温\n2025-08-10 08:10:00,45.8,219.9,1.8,升温\n2025-08-10 08:15:00,55.3,220.0,2.1,升温\n2025-08-10 08:20:00,65.0,220.1,2.3,恒温`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aging_log_${log.sn}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess('日志文件下载成功');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">数据分析</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6">
        {/* Circular Chart Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>老化状态统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} 次`, '次数']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SN Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>老化日志查询</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="输入SN编号搜索..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">搜索结果 ({searchResults.length} 条)</h3>
                  <div className="border rounded-md">
                    {searchResults.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                      >
                        <div>
                          <div className="font-medium">{log.sn}</div>
                          <div className="text-sm text-muted-foreground">
                            工位: {log.workstation} | 状态: {log.status === 'completed' ? '成功' : log.status === 'failed' ? '失败' : '运行中'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            开始时间: {format(new Date(log.startTime), 'yyyy-MM-dd HH:mm:ss')}
                            {log.endTime && ` | 结束时间: ${format(new Date(log.endTime), 'yyyy-MM-dd HH:mm:ss')}`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {log.status === 'completed' && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">成功</span>
                          )}
                          {log.status === 'failed' && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">失败</span>
                          )}
                          {log.status === 'running' && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">运行中</span>
                          )}
                          <Button 
                            size="sm" 
                            onClick={() => handleDownload(log)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            下载
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Analytics;