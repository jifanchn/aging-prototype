"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play,
  Pause,
  X,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import GlobalChecksTab from "@/components/aging-process/GlobalChecksTab";
import StateManagementTab from "@/components/aging-process/StateManagementTab";
import MesReportingTab from "@/components/aging-process/MesReportingTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProcessConfigurationTab = () => {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [processes] = useState([
    { id: 'proc1', name: '高温老化流程 A' },
    { id: 'proc2', name: '标准老化流程 B' }
  ]);
  const [showScriptExamples, setShowScriptExamples] = useState(false);

  const scriptExamples = `# 脚本示例：全局检查和状态脚本中可用的函数和变量

# ===== 系统变量和函数 =====
system.aging_time        # 老化总运行时间 (秒)
system.state_time        # 当前状态已运行时间 (秒)
system.session_id        # 当前老化会话的唯一标识符 (UUID)
system.label             # 当前工位显示的状态标签 (可读写)
system.logs              # 运行日志列表: [[时间戳, "日志内容"], ...]
system.debug_logs        # 调试日志列表: [[时间戳, "调试信息"], ...]
system.record            # 记录数据: {"csv": "time,temp,voltage\\n1,25.5,220\\n2,26.0,221", "json": [{"time": 1, "temp": 25.5, "voltage": 220}, {"time": 2, "temp": 26.0, "voltage": 221}]}

system.log("message")    # 记录普通日志信息
system.debug("message")  # 记录调试信息 (仅在调试模式下显示)
system.get_state()       # 获取当前状态名称

# ===== 全局变量存储 =====
vars.set("key", value)   # 存储变量，整个老化流程中可用
vars.get("key")          # 获取存储的变量值

# ===== 设备访问 (通过设备别名) =====
dev1.get("point_name")   # 获取设备指定点的值
dev1.set("point_name", value)  # 设置设备指定点的值
dev1.get_variables()     # 获取设备所有变量名列表: ["temperature", "voltage", "current", ...]

# ===== 流程控制函数 =====
jumpstate("state_name")  # 立即跳转到指定状态
next()                   # 跳转到流程中的下一个状态

# ===== 预定义系统状态 =====
# "start", "pause", "fail", "success", "end"

# ===== 实际使用示例 =====

# 示例1: 使用调试功能和会话ID
system.debug(f"开始处理会话 {system.session_id}")
system.label = "温度监控中"

# 示例2: 使用全局变量存储
vars.set("max_temperature", dev1.get("temperature"))
current_max = vars.get("max_temperature")
system.debug(f"记录最高温度: {current_max}")

# 示例3: 获取设备所有变量并记录
variables = dev1.get_variables()
system.log(f"设备变量列表: {variables}")

# 示例4: 检查多个条件并跳转
if dev1.get("temperature") > 80:
    system.label = "温度超限"
    system.debug("触发高温保护")
    jumpstate("fail")
elif dev1.get("voltage") < 200:
    system.label = "电压异常"
    jumpstate("pause")

# 示例5: 访问记录数据
csv_data = system.record["csv"]
json_data = system.record["json"]
system.debug(f"记录数据点数: {len(json_data)}")

# 示例6: 完整的状态处理逻辑
current_temp = dev1.get("temperature")
current_voltage = dev1.get("voltage")

# 记录调试信息
system.debug(f"温度: {current_temp}°C, 电压: {current_voltage}V")

# 更新工位显示标签
system.label = f"运行中 - {current_temp}°C"

# 条件判断
if current_temp >= 75:
    jumpstate("success")
elif current_temp <= 20:
    jumpstate("fail")`;

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
          {/* 状态流程图示意 - Updated with larger rectangles and "下一次循环" label */}
          <Card>
            <CardHeader>
              <CardTitle>状态流程图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-6 p-4 bg-muted/30 rounded">
                <div className="text-center">
                  <div className="w-24 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold">循环</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-green-500 rounded flex items-center justify-center text-white font-bold">全局检查</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-purple-500 rounded flex items-center justify-center text-white font-bold">状态管理</div>
                </div>
                <div className="text-2xl">→</div>
                <div className="text-center">
                  <div className="w-24 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold">下一次循环</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 脚本示例 with toggle */}
          <Card>
            <Button
              variant="ghost"
              className="w-full justify-between p-4"
              onClick={() => setShowScriptExamples(!showScriptExamples)}
            >
              <span className="font-medium">脚本示例</span>
              {showScriptExamples ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showScriptExamples && (
              <div className="p-4 bg-muted/20">
                <pre className="text-xs bg-background p-3 rounded font-mono overflow-x-auto">
                  {scriptExamples}
                </pre>
              </div>
            )}
          </Card>

          {/* Tabs for Global Checks, State Management, and MES Reporting */}
          <Tabs defaultValue="global-checks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="global-checks">全局检查</TabsTrigger>
              <TabsTrigger value="state-management">状态管理</TabsTrigger>
              <TabsTrigger value="mes-reporting">上报MES</TabsTrigger>
            </TabsList>

            <TabsContent value="global-checks">
              <GlobalChecksTab />
            </TabsContent>

            <TabsContent value="state-management">
              <StateManagementTab />
            </TabsContent>

            <TabsContent value="mes-reporting">
              <MesReportingTab />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ProcessConfigurationTab;