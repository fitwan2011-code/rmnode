import React from 'react';
import { Box, Text } from 'ink';
import type { NodeModule } from '../types.js';

interface ItemProps {
  item: NodeModule;
  isSelected: boolean;
  isCursor: boolean;
  index: number;
  onClick?: () => void;
}

export function Item({ item, isSelected, isCursor, index, onClick }: ItemProps) {
  // Clean checkbox design
  const checkbox = isSelected ? '[x]' : '[ ]';
  
  // Size color coding
  const sizeColor = item.size > 500 * 1024 * 1024 
    ? 'red' 
    : item.size > 100 * 1024 * 1024 
      ? 'yellow' 
      : 'green';
  
  // Cursor style
  const bgColor = isCursor ? 'blue' : undefined;
  const textColor = isCursor ? 'white' : undefined;
  
  // Truncate name
  const displayName = item.name.length > 25 ? item.name.slice(0, 22) + '...' : item.name;
  
  return (
    <Box>
      <Text backgroundColor={bgColor} color={textColor}>
        {isCursor ? ' > ' : '   '}
      </Text>
      <Text color={isSelected ? 'green' : 'gray'} bold={isSelected}>
        {checkbox}
      </Text>
      <Text> </Text>
      <Text backgroundColor={bgColor} color={textColor} bold={isCursor}>
        {displayName.padEnd(26)}
      </Text>
      <Text color={sizeColor} bold>
        {item.formattedSize.padStart(12)}
      </Text>
      <Text dimColor>  {item.path.length > 50 ? '...' + item.path.slice(-47) : item.path}</Text>
    </Box>
  );
}
