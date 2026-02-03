import React from 'react';
import { Box, Text } from 'ink';
import { formatSize } from '../utils/format-size.js';
import { StatsBar } from './StatsBar.js';
import { NodeModulesList } from './NodeModulesList.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import type { NodeModule } from '../types.js';

const BANNER = `
 $$$$$$\\  $$$$$$\\$$$$\\  $$\\   $$\\  $$$$$$\\   $$$$$$\\   $$$$$$\\  
 $$  __$$\\ $$  _$$  _$$\\ $$$\\  $$ |$$  __$$\\ $$  __$$\\ $$  __$$\\ 
 $$ |  \\__|$$ / $$ / $$ |$$$$\\ $$ |$$ /  $$ |$$ /  $$ |$$$$$$$$ |
 $$ |      $$ | $$ | $$ |$$ $$\\$$ |$$ |  $$ |$$ |  $$ |$$   ____|
 $$ |      $$ | $$ | $$ |$$ \\$$$$ |$$ |  $$ |$$ |  $$ |$$ |      
 $$ |      $$ | $$ | $$ |$$ |\\$$$ |$$ |  $$ |$$ |  $$ |$$ |      
 $$ |      $$ | $$ | $$ |$$ | \\$$ |\\$$$$$$  |\\$$$$$$$ |\\$$$$$$$\\ 
 \\__|      \\__| \\__| \\__|\\__|  \\__| \\______/  \\_______| \\_______|
`;

interface MainViewProps {
  items: NodeModule[];
  cursorIndex: number;
  selectedIds: Set<string>;
  selectedCount: number;
  selectedSize: number;
  foundCount: number;
  totalSize: number;
  showConfirm: boolean;
  deleting: boolean;
  freedSpace: number;
  dryRun: boolean;
  isScanning: boolean;
  searchQuery: string;
  isSearching: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onItemClick?: (index: number) => void;
}

export function MainView({
  items,
  cursorIndex,
  selectedIds,
  selectedCount,
  selectedSize,
  foundCount,
  totalSize,
  showConfirm,
  deleting,
  freedSpace,
  dryRun,
  isScanning,
  searchQuery,
  isSearching,
  onConfirm,
  onCancel,
  onItemClick
}: MainViewProps) {
  return (
    <Box flexDirection="column" padding={1}>
      {/* Banner */}
      <Box flexDirection="column">
        <Text color="cyan">{BANNER}</Text>
        <Box>
          {dryRun && <Text color="yellow">[DRY RUN] </Text>}
          {isScanning && <Text color="blue">scanning...</Text>}
          {deleting && <Text color="yellow">deleting...</Text>}
        </Box>
      </Box>
      
      {/* Stats */}
      <StatsBar
        foundCount={foundCount}
        totalSize={formatSize(totalSize)}
        selectedCount={selectedCount}
        selectedSize={formatSize(selectedSize)}
      />
      
      {/* Search bar */}
      {(isSearching || searchQuery) && (
        <Box marginY={1}>
          <Text color="yellow" bold>Search: </Text>
          <Text color="white" bold>{searchQuery}</Text>
          {isSearching && <Text color="cyan" bold>_</Text>}
          {isSearching ? (
            <Text dimColor>  (Esc to close, Enter to keep filter)</Text>
          ) : (
            <Text dimColor>  ({items.length} found) (Esc to clear)</Text>
          )}
        </Box>
      )}
      
      {/* Freed space message */}
      {freedSpace > 0 && (
        <Box>
          <Text bold color="green">Freed {formatSize(freedSpace)}</Text>
        </Box>
      )}
      
      {/* Main content */}
      {items.length === 0 && isScanning ? (
        <Box marginY={1}>
          <Text dimColor>Searching for node_modules...</Text>
        </Box>
      ) : items.length === 0 && searchQuery ? (
        <Box marginY={1}>
          <Text color="yellow">No results for "{searchQuery}"</Text>
        </Box>
      ) : items.length === 0 ? (
        <Box marginY={1}>
          <Text color="green">No node_modules found! Your disk is clean.</Text>
        </Box>
      ) : (
        <Box marginY={1}>
          <NodeModulesList
            items={items}
            cursorIndex={cursorIndex}
            selectedIds={selectedIds}
            onItemClick={onItemClick}
          />
        </Box>
      )}
      
      {/* Confirm dialog */}
      {showConfirm && (
        <ConfirmDialog
          selectedCount={selectedCount}
          selectedSize={formatSize(selectedSize)}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
      
      {/* Controls */}
      <Box marginTop={1}>
        <Text dimColor>j/k: navigate | space: select | a: all | s: search | d: delete | q: quit | built by </Text>
        <Text color="cyan" bold>Firas Latrach</Text>
      </Box>
    </Box>
  );
}
