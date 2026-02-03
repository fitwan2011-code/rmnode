import React from 'react';
import { Box, Text } from 'ink';

interface ConfirmDialogProps {
  selectedCount: number;
  selectedSize: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  selectedCount,
  selectedSize,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="yellow"
      paddingX={2}
      paddingY={1}
    >
      <Text bold color="yellow">
        ⚠️  Confirm Deletion
      </Text>
      <Box marginY={1}>
        <Text>
          Delete {selectedCount} node_modules folder
          {selectedCount !== 1 ? 's' : ''} ({selectedSize})?
        </Text>
      </Box>
      <Box flexDirection="row" gap={2}>
        <Text color="green">[Y] Yes - Delete</Text>
        <Text color="red">[N] No - Cancel</Text>
      </Box>
    </Box>
  );
}
