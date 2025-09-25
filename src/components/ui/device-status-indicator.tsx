"use client";

import React from 'react';
import { 
  Circle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Wifi,
  WifiOff
} from "lucide-react";

interface DeviceStatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'normal' | 'warning' | 'error' | 'offline';
  size?: 'sm' | 'md' | 'lg';
}

const DeviceStatusIndicator = ({ 
  status, 
  size = 'md' 
}: DeviceStatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getIcon = () => {
    switch (status) {
      case 'connected':
      case 'normal':
        return <CheckCircle2 className={`${sizeClasses[size]} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${sizeClasses[size]} text-orange-500`} />;
      case 'error':
        return <XCircle className={`${sizeClasses[size]} text-red-500`} />;
      case 'disconnected':
      case 'offline':
        return <WifiOff className={`${sizeClasses[size]} text-gray-500`} />;
      default:
        return <Circle className={`${sizeClasses[size]} text-gray-300`} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '已连接';
      case 'disconnected': return '已断开';
      case 'normal': return '正常';
      case 'warning': return '警告';
      case 'error': return '错误';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {getIcon()}
      <span className="text-xs text-muted-foreground">{getStatusText()}</span>
    </div>
  );
};

export default DeviceStatusIndicator;