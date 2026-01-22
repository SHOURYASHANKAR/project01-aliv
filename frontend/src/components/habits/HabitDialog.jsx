import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHabits } from '@/context/HabitContext';
import { cn } from '@/lib/utils';

const CATEGORY_STYLES = {
  health: 'bg-success-light text-success',
  productivity: 'bg-[hsl(220_70%_92%)] text-[hsl(220_70%_40%)]',
  personal: 'bg-[hsl(280_55%_92%)] text-[hsl(280_55%_40%)]',
  fitness: 'bg-[hsl(25_85%_92%)] text-[hsl(25_85%_40%)]',
  mindfulness: 'bg-[hsl(180_50%_92%)] text-[hsl(180_50%_35%)]',
  learning: 'bg-[hsl(45_90%_90%)] text-[hsl(45_90%_35%)]',
};

const getInitialFormData = (editHabit) => ({
  name: editHabit?.name || '',
  categoryId: editHabit?.categoryId || 'personal',
  note: editHabit?.note || '',
});

export const HabitDialog = ({ 
  open, 
  onOpenChange, 
  editHabit = null 
}) => {
  const { categories, addHabit, updateHabit } = useHabits();
  
  const [formData, setFormData] = useState(() => getInitialFormData(editHabit));
  const [errors, setErrors] = useState({});

  // Reset form when dialog opens or editHabit changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(editHabit));
      setErrors({});
    }
    // Only re-run when open changes to true or when editHabit changes while open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editHabit?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editHabit) {
      updateHabit(editHabit.id, formData);
    } else {
      addHabit(formData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editHabit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
          <DialogDescription>
            {editHabit 
              ? 'Update your habit details below.' 
              : 'Add a new habit to track. Start small and build consistency.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Habit Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="e.g., Morning meditation, Read 20 pages..."
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={cn(errors.name && "border-destructive")}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            CATEGORY_STYLES[category.color]?.split(' ')[0] || 'bg-muted'
                          )}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">
                Note <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="note"
                placeholder="Add a reminder or motivation..."
                value={formData.note}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, note: e.target.value }))
                }
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editHabit ? 'Save Changes' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDialog;
