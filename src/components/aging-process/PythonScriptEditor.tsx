"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Save, 
  Download,
  Upload,
  Terminal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PythonScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onRunScript: () => void;
  onSaveScript: () => void;
}

const PythonScriptEditor = ({ 
  script, 
  onScriptChange, 
  onRunScript, 
  onSaveScript 
}: PythonScriptEditorProps) => {
  const [output, setOutput] = useState<string[]>([
    '>>> Script execution started...',
    '>>> Reading Modbus registers...',
    '>>> Temperature: 65.5°C',
    '>>> Voltage: 220.0V',
    '>>> Process completed successfully!'
  ]);

  const sampleScript = `# 老化流程控制脚本
import modbus
import time

def main():
    # 读取重要点位
    temperature = modbus.read_register(40001, 'float32')
    voltage = modbus.read_register(40003, 'float32')
    
    # 检查条件
    if temperature < 60:
        modbus.write_register(40006, True, 'bool')  # 启动加热
        time.sleep(30)
    
    # 持续监控
    for i in range(3600):  # 1小时
        temp = modbus.read_register(40001, 'float32')
        if temp > 75:
            modbus.write_register(40006, False, 'bool')  # 停止加热
            break
        time.sleep(1)
    
    print(f"老化完成 - 最终温度: {temp}°C")

if __name__ == "__main__":
    main()
`;

  const handleRunScript = () => {
    onRunScript();
    setOutput([
      '>>> Executing Python script...',
      '>>> Importing modbus module...',
      '>>> Reading register 40001 (float32)...',
      '>>> Temperature: 65.5°C',
      '>>> Reading register 40003 (float32)...',
      '>>> Voltage: 220.0V',
      '>>> Writing register 40006 (bool): True',
      '>>> Script execution completed successfully!'
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Python 脚本编辑器</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSaveScript}>
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
        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">脚本编辑器</TabsTrigger>
            <TabsTrigger value="output">执行输出</TabsTrigger>
            <TabsTrigger value="api">API 文档</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-4">
            <Textarea
              value={script || sampleScript}
              onChange={(e) => onScriptChange(e.target.value)}
              className="font-mono h-64"
              placeholder="编写您的 Python 脚本..."
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleRunScript}>
                <Play className="h-4 w-4 mr-2" />
                执行脚本
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="mt-4">
            <div className="bg-muted p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Terminal className="h-4 w-4" />
                <span className="font-medium">执行输出</span>
              </div>
              {output.map((line, index) => (
                <div key={index} className="text-green-400">
                  {line}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Modbus API</h4>
                <pre className="bg-muted p-3 rounded text-sm font-mono">
{`# 读取寄存器
value = modbus.read_register(address, data_type)

# 写入寄存器  
modbus.write_register(address, value, data_type)

# 支持的数据类型: 'uint16', 'int16', 'uint32', 'int32', 'float32', 'bool'`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">时间控制 API</h4>
                <pre className="bg-muted p-3 rounded text-sm font-mono">
{`# 延迟
time.sleep(seconds)

# 获取当前时间
current_time = time.time()`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">数据记录 API</h4>
                <pre className="bg-muted p-3 rounded text-sm font-mono">
{`# 记录数据点
data_logger.log(point_name, value, timestamp)

# 查询历史数据
history = data_logger.query(point_name, start_time, end_time)`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PythonScriptEditor;