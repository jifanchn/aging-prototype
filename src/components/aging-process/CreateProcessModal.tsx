"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CreateProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessCreated: (process: { name: string; description: string }) => void;
}

const CreateProcessModal = ({ isOpen, onClose, onProcessCreated }: CreateProcessModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      showError('请输入流程名称');
      return;
    }

    onProcessCreated({ name, description });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新建老化流程</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="processName">流程名称 *</Label>
            <Input
              id="processName"
              placeholder="输入流程名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="processDescription">流程描述</Label>
            <Textarea
              id="processDescription"
              placeholder="输入流程描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" />
            创建流程
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProcessModal;