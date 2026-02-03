import React from 'react';
import { Box, Text } from 'ink';
import { useScanner } from '../hooks/useScanner.js';
import { useSelection } from '../hooks/useSelection.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { MainView } from './MainView.js';
import { deleteFolder } from '../utils/delete-folder.js';
import type { AppProps } from '../types.js';

export function App({ rootPath, dryRun }: AppProps) {
  const { isScanning, items: rawItems, error } = useScanner(rootPath);
  const [deletedIds, setDeletedIds] = React.useState<Set<string>>(new Set());
  
  // Filter out deleted items
  const allItems = React.useMemo(() => 
    rawItems.filter(item => !deletedIds.has(item.id)),
    [rawItems, deletedIds]
  );
  
  // Selection (on all items, not filtered)
  const { selectedIds, selectedSize, selectedCount, toggleSelection, selectAll, deselectAll } = useSelection(allItems);
  
  // Deletion state
  const [deleting, setDeleting] = React.useState(false);
  const [freedSpace, setFreedSpace] = React.useState(0);
  
  // Delete handler
  const handleDeleteConfirm = React.useCallback(async () => {
    if (selectedCount === 0) return;
    
    const toDelete = allItems.filter(item => selectedIds.has(item.id));
    const idsToDelete = new Set(toDelete.map(item => item.id));
    const totalFreed = toDelete.reduce((sum, item) => sum + item.size, 0);
    
    setDeletedIds(prev => new Set([...prev, ...idsToDelete]));
    setDeleting(true);
    deselectAll();
    
    Promise.all(
      toDelete.map(item => deleteFolder(item.path, item.size, dryRun))
    ).then(() => {
      setFreedSpace(totalFreed);
      setDeleting(false);
      setTimeout(() => setFreedSpace(0), 3000);
    }).catch(() => {
      setDeleting(false);
    });
    
  }, [allItems, selectedIds, selectedCount, dryRun, deselectAll]);
  
  // Keyboard with search
  const { cursorIndex, setCursorIndex, showConfirm, setShowConfirm, searchQuery, isSearching } = useKeyboard(
    allItems,
    deleting,
    selectedCount,
    toggleSelection,
    selectAll,
    deselectAll,
    () => {},
    handleDeleteConfirm
  );
  
  // Filter items by search query
  const items = React.useMemo(() => {
    if (!searchQuery) return allItems;
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.path.toLowerCase().includes(query)
    );
  }, [allItems, searchQuery]);
  
  // Item click handler
  const handleItemClick = React.useCallback((index: number) => {
    setCursorIndex(index);
    if (items[index]) {
      toggleSelection(items[index]);
    }
  }, [items, toggleSelection, setCursorIndex]);
  
  const totalSize = allItems.reduce((sum, item) => sum + item.size, 0);
  
  if (error) {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }
  
  return (
    <MainView
      items={items}
      cursorIndex={cursorIndex}
      selectedIds={selectedIds}
      selectedCount={selectedCount}
      selectedSize={selectedSize}
      foundCount={allItems.length}
      totalSize={totalSize}
      showConfirm={showConfirm}
      deleting={deleting}
      freedSpace={freedSpace}
      dryRun={dryRun}
      isScanning={isScanning}
      searchQuery={searchQuery}
      isSearching={isSearching}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setShowConfirm(false)}
      onItemClick={handleItemClick}
    />
  );
}
