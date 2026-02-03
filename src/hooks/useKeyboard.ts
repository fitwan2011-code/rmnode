import { useState, useEffect } from 'react';
import { useInput, useApp } from 'ink';
import type { NodeModule } from '../types.js';

interface UseKeyboardReturn {
  cursorIndex: number;
  setCursorIndex: (index: number) => void;
  showConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
  searchQuery: string;
  isSearching: boolean;
}

export function useKeyboard(
  items: NodeModule[],
  deleting: boolean,
  selectedCount: number,
  toggleSelection: (item: NodeModule) => void,
  selectAll: (items: NodeModule[]) => void,
  deselectAll: () => void,
  onDeleteRequest: () => void,
  onDeleteConfirm: () => void
): UseKeyboardReturn {
  const { exit } = useApp();
  const [cursorIndex, setCursorIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Keep cursor in bounds
  useEffect(() => {
    if (items.length > 0 && cursorIndex >= items.length) {
      setCursorIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, cursorIndex]);
  
  const validCursor = items.length > 0 ? Math.min(cursorIndex, items.length - 1) : 0;
  
  useInput((input, key) => {
    // Search mode - ONLY handle search input
    if (isSearching) {
      // Escape ALWAYS exits search
      if (key.escape) {
        setIsSearching(false);
        return;
      }
      // Enter exits search and keeps query
      if (key.return) {
        setIsSearching(false);
        return;
      }
      // Backspace
      if (key.backspace || key.delete) {
        setSearchQuery(prev => prev.slice(0, -1));
        return;
      }
      // Clear all with Ctrl+U
      if (key.ctrl && input === 'u') {
        setSearchQuery('');
        return;
      }
      // Add character to search (printable chars only)
      if (input && input.length === 1 && !key.ctrl && !key.meta) {
        setSearchQuery(prev => prev + input);
        setCursorIndex(0); // Reset cursor on new search
      }
      return;
    }
    
    // === Normal mode below ===
    
    // Quit
    if (input === 'q' || input === 'Q') {
      exit();
      return;
    }
    
    // Confirmation dialog
    if (showConfirm) {
      if (input === 'y' || input === 'Y' || key.return) {
        setShowConfirm(false);
        onDeleteConfirm();
      } else if (input === 'n' || input === 'N' || key.escape) {
        setShowConfirm(false);
      }
      return;
    }
    
    // Clear search with Escape (when not searching but have query)
    if (key.escape) {
      if (searchQuery) {
        setSearchQuery('');
        setCursorIndex(0);
      }
      return;
    }
    
    // Start search
    if (input === 's' || input === 'S' || input === '/') {
      setIsSearching(true);
      return;
    }
    
    // No items, nothing to do
    if (items.length === 0) return;
    
    // Navigation
    if (key.upArrow || input === 'k') {
      setCursorIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow || input === 'j') {
      setCursorIndex(prev => Math.min(items.length - 1, prev + 1));
    } 
    // Page navigation
    else if (key.pageUp) {
      setCursorIndex(prev => Math.max(0, prev - 10));
    } else if (key.pageDown) {
      setCursorIndex(prev => Math.min(items.length - 1, prev + 10));
    }
    // Selection with space
    else if (input === ' ') {
      if (items[validCursor]) {
        toggleSelection(items[validCursor]);
      }
    }
    // Selection with enter
    else if (key.return) {
      if (items[validCursor]) {
        toggleSelection(items[validCursor]);
        setCursorIndex(prev => Math.min(items.length - 1, prev + 1));
      }
    }
    // Select all
    else if (input === 'a' || input === 'A') {
      selectAll(items);
    } 
    // Clear selection
    else if (input === 'c' || input === 'C') {
      deselectAll();
    } 
    // Delete
    else if (input === 'd' || input === 'D') {
      if (selectedCount > 0) {
        setShowConfirm(true);
      }
    }
  });
  
  return { 
    cursorIndex: validCursor, 
    setCursorIndex, 
    showConfirm, 
    setShowConfirm,
    searchQuery,
    isSearching
  };
}
