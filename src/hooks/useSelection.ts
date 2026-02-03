import { useState, useCallback } from 'react';
import type { NodeModule } from '../types.js';

interface UseSelectionReturn {
  selectedIds: Set<string>;
  selectedSize: number;
  selectedCount: number;
  toggleSelection: (item: NodeModule) => void;
  selectAll: (items: NodeModule[]) => void;
  deselectAll: () => void;
}

export function useSelection(items: NodeModule[]): UseSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const toggleSelection = useCallback((item: NodeModule) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  }, []);
  
  const selectAll = useCallback((allItems: NodeModule[]) => {
    setSelectedIds(new Set(allItems.map(item => item.id)));
  }, []);
  
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  
  const selectedSize = items
    .filter(item => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.size, 0);
  
  return {
    selectedIds,
    selectedSize,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
    deselectAll
  };
}
