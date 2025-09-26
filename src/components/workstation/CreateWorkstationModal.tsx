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
import { Plus } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface CreateWorkstationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkstation: (name: string) => void;
}

const CreateWorkstationModal = ({ isOpen, onClose, onCreateWorkstation }: CreateWorkstationModalProps) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      showError('请输入工位名称');
      return;
    }

    onCreateWorkstation(name);
    setName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新建工位</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workstationName">工位名称 *</Label>
            <Input
              id="workstationName"
              placeholder="输入工位名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" />
            创建工位
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkstationModal;