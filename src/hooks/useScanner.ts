import { useState, useEffect, useRef } from 'react';
import { findNodeModules } from '../scanner/index.js';
import type { NodeModule, ScanError } from '../types.js';

interface UseScannerReturn {
  isScanning: boolean;
  items: NodeModule[];
  errors: ScanError[];
  currentItem: NodeModule | null;
  currentError: ScanError | null;
  foundCount: number;
  totalSize: number;
  error?: string;
}

export function useScanner(rootPath: string): UseScannerReturn {
  const [state, setState] = useState<UseScannerReturn>({
    isScanning: true,
    items: [],
    errors: [],
    currentItem: null,
    currentError: null,
    foundCount: 0,
    totalSize: 0
  });
  
  const itemsMapRef = useRef<Map<string, NodeModule>>(new Map());
  const errorsRef = useRef<ScanError[]>([]);
  
  useEffect(() => {
    let cancelled = false;
    
    async function scan() {
      try {
        itemsMapRef.current.clear();
        errorsRef.current = [];
        
        await findNodeModules(
          rootPath,
          (item) => {
            if (cancelled) return;
            
            // Update or add item (handles size updates)
            itemsMapRef.current.set(item.id, item);
            const items = Array.from(itemsMapRef.current.values());
            
            setState(prev => ({
              ...prev,
              items: items,
              currentItem: item,
              foundCount: items.length,
              totalSize: items.reduce((sum, i) => sum + i.size, 0)
            }));
          },
          (error) => {
            if (cancelled) return;
            errorsRef.current.push(error);
            setState(prev => ({
              ...prev,
              errors: [...errorsRef.current],
              currentError: error
            }));
          }
        );
        
        // Final update
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (!cancelled) {
          const items = Array.from(itemsMapRef.current.values());
          setState(prev => ({
            ...prev,
            items: items,
            isScanning: false,
            currentItem: null,
            currentError: null,
            totalSize: items.reduce((sum, i) => sum + i.size, 0)
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            isScanning: false,
            error: error instanceof Error ? error.message : 'Scan failed'
          }));
        }
      }
    }
    
    scan();
    
    return () => {
      cancelled = true;
    };
  }, [rootPath]);
  
  return state;
}
