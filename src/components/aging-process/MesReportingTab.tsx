"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const MesReportingTab = () => {
  const [mesScript, setMesScript] = useState(`# MES上报脚本
# 在进入 fail, end, success 状态时自动执行

def report_to_mes():
    """
    上报老化结果到MES系统
    使用脚本示例中定义的系统变量和函数
    """
    import requests
    import json
    
    # 获取设备数据
    temperature = dev1.get("temperature")
    voltage = dev1.get("voltage") 
    
    # 获取记录数据
    csv_data = system.record["csv"]
    json_data = system.record["json"]
    
    # 获取会话ID
    session_id = system.session_id
    
    # 获取当前状态
    current_state = system.get_state()
    
    # 构建上报数据
    report_data = {
        "session_id": session_id,
        "result": current_state,
        "measurements": {
            "temperature": temperature,
            "voltage": voltage
        },
        "record_data": {
            "csv": csv_data,
            "json": json_data
        }
    }
    
    # 发送HTTP请求到MES
    try:
        response = requests.post(
            "http://mes-server/api/v1/aging-results",
            json=report_data,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            system.log(f"MES上报成功: {current_state}")
        else:
            system.log(f"MES上报失败: {response.status_code}")
    except Exception as e:
        system.log(f"MES上报异常: {str(e)}")

# 调用上报函数
report_to_mes()`);

  const handleSaveScript = () => {
    // In a real implementation, this would save to backend
    showSuccess('MES上报脚本保存成功');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MES上报配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                在进入 <code className="bg-muted px-1 rounded">fail</code>, <code className="bg-muted px-1 rounded">end</code>, <code className="bg-muted px-1 rounded">success</code> 状态时，会自动执行此Python脚本进行上报操作。
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Python上报脚本</Label>
              <Textarea
                value={mesScript}
                onChange={(e) => setMesScript(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                placeholder="编写MES上报Python脚本..."
              />
            </div>
            
            <Button onClick={handleSaveScript} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              保存上报脚本
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesReportingTab;