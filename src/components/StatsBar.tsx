import React from 'react';
import { Box, Text } from 'ink';

interface StatsBarProps {
  foundCount: number;
  totalSize: string;
  selectedCount: number;
  selectedSize: string;
}

export function StatsBar({
  foundCount,
  totalSize,
  selectedCount,
  selectedSize
}: StatsBarProps) {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderStyle="single"
      borderColor="blue"
      paddingX={1}
    >
      <Box flexDirection="column">
        <Text bold color="white">
          Found: {foundCount} folders
        </Text>
        <Text color="blue">
          Total: {totalSize}
        </Text>
      </Box>
      
      <Box flexDirection="column" alignItems="flex-end">
        <Text bold color="white">
          Selected: {selectedCount} folders
        </Text>
        <Text color="green">
          To free: {selectedSize}
        </Text>
      </Box>
    </Box>
  );
}
