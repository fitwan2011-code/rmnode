import React from 'react';
import { Box, Text } from 'ink';
import type { NodeModule } from '../types.js';
import { Item } from './Item.js';

interface NodeModulesListProps {
  items: NodeModule[];
  cursorIndex: number;
  selectedIds: Set<string>;
  visibleCount?: number;
  onItemClick?: (index: number) => void;
}

export function NodeModulesList({
  items,
  cursorIndex,
  selectedIds,
  visibleCount = 12,
  onItemClick
}: NodeModulesListProps) {
  // Calculate visible window
  const halfVisible = Math.floor(visibleCount / 2);
  let startIndex = Math.max(0, cursorIndex - halfVisible);
  
  // Adjust if near the end
  if (startIndex + visibleCount > items.length) {
    startIndex = Math.max(0, items.length - visibleCount);
  }
  
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  const visibleItems = items.slice(startIndex, endIndex);
  
  // Scroll indicator
  const canScrollUp = startIndex > 0;
  const canScrollDown = endIndex < items.length;
  
  return (
    <Box flexDirection="column">
      {/* Scroll up indicator */}
      {canScrollUp && (
        <Text dimColor>  {'  '}  ... {startIndex} more above</Text>
      )}
      
      {/* Items */}
      {visibleItems.map((item, idx) => {
        const actualIndex = startIndex + idx;
        return (
          <Item
            key={item.id}
            item={item}
            isSelected={selectedIds.has(item.id)}
            isCursor={actualIndex === cursorIndex}
            index={actualIndex}
            onClick={() => onItemClick?.(actualIndex)}
          />
        );
      })}
      
      {/* Scroll down indicator */}
      {canScrollDown && (
        <Text dimColor>  {'  '}  ... {items.length - endIndex} more below</Text>
      )}
      
      {/* Empty state */}
      {items.length === 0 && (
        <Text dimColor>No items to display</Text>
      )}
    </Box>
  );
}
