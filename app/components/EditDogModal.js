'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const COLOR_OPTIONS = ['green', 'yellow', 'red', 'purple', 'blue'];

const COLOR_SWATCH = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
};

const formatDobForInput = (dob) => {
  if (!dob) return '';
  return typeof dob === 'string' ? dob.split('T')[0] : '';
};

const EditDogModal = ({ isOpen, onClose, dog, onSave, isSaving }) => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    level1: '',
    level2: '',
    targetOutIntervalMinutes: 240,
  });

  useEffect(() => {
    if (dog) {
      setForm({
        name: dog.name || '',
        dob: formatDobForInput(dog.dob),
        level1: dog.level1 || '',
        level2: dog.level2 || '',
        targetOutIntervalMinutes: dog.targetOutIntervalMinutes ?? 240,
      });
    }
  }, [dog]);

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));
  const setInput = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit {dog?.name}</DialogTitle>
        <DialogDescription className="sr-only">Edit dog profile details</DialogDescription>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={setInput('name')}
              placeholder="Dog's name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-dob">Date of birth</Label>
            <Input
              id="edit-dob"
              type="date"
              value={form.dob}
              onChange={setInput('dob')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Level 1</Label>
              <Select value={form.level1} onValueChange={set('level1')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${COLOR_SWATCH[color]}`}
                        />
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Level 2</Label>
              <Select value={form.level2} onValueChange={set('level2')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${COLOR_SWATCH[color]}`}
                        />
                        <span className="capitalize">{color}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="edit-interval">Target out interval (minutes)</Label>
            <Input
              id="edit-interval"
              type="number"
              min={30}
              step={30}
              value={form.targetOutIntervalMinutes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  targetOutIntervalMinutes: parseInt(e.target.value) || 240,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={isSaving || !form.name.trim()}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDogModal;
