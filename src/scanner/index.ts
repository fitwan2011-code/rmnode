import { stat, readdir } from 'fs/promises';
import { join, basename } from 'path';
import { formatSize } from '../utils/format-size.js';
import type { NodeModule, ScanResult, ScanError } from '../types.js';

// Directories to skip during scanning
const IGNORED_DIRS = new Set([
  '.git', '.svn', '.hg',
  '.next', '.nuxt', 'dist', 'build', 'coverage', '.cache',
  // macOS system directories
  'Library', 'System', 'Private', 'Applications',
  'Pictures', 'Movies', 'Music', 'Photos Library.photoslibrary',
  '.Trash', '.Spotlight-V100', '.fseventsd',
  '.DocumentRevisions-V100', '.TemporaryItems',
  // Package manager caches
  '.npm', '.yarn', '.pnpm', '.pnpm-store', 'pnpm-store', '.local',
  // System directories
  'Volumes', 'dev', 'etc', 'proc', 'sys', 'tmp', 'var'
]);

// Paths that indicate nested node_modules we should skip
const NESTED_INDICATORS = [
  '/node_modules/', '/.npm/', '/.yarn/', '/.pnpm/',
  '/pnpm-store/', '/_cacache/'
];

// Check if path is nested inside cache/node_modules
function isNestedPath(fullPath: string): boolean {
  const parentPath = fullPath.replace(/[\/\\]node_modules$/, '');
  return NESTED_INDICATORS.some(ind => parentPath.includes(ind));
}

// Concurrent directory scanning limit
const CONCURRENCY = 20;

export async function findNodeModules(
  rootPath: string,
  onItemFound?: (item: NodeModule) => void,
  onError?: (error: ScanError) => void
): Promise<ScanResult> {
  const items: NodeModule[] = [];
  const errors: ScanError[] = [];
  const seen = new Set<string>();
  
  // Use a work queue for parallel scanning
  const queue: string[] = [rootPath];
  let activeWorkers = 0;
  let resolveComplete: () => void;
  const complete = new Promise<void>(r => resolveComplete = r);

  async function processDirectory(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const subdirs: string[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const name = entry.name;
        
        // Skip ignored and hidden directories
        if (IGNORED_DIRS.has(name) || name.startsWith('.')) continue;
        
        const fullPath = join(dir, name);
        
        if (name === 'node_modules') {
          // Skip if nested
          if (isNestedPath(fullPath) || seen.has(fullPath)) continue;
          seen.add(fullPath);
          
          // Process immediately - don't wait for size
          processNodeModules(fullPath, items, errors, onItemFound, onError);
        } else {
          // Queue subdirectory for scanning
          subdirs.push(fullPath);
        }
      }
      
      // Add subdirs to queue
      queue.push(...subdirs);
      
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'ENOENT') {
        const scanError = { path: dir, message: err.message || 'Permission denied' };
        errors.push(scanError);
        onError?.(scanError);
      }
    }
  }

  async function worker(): Promise<void> {
    while (queue.length > 0 || activeWorkers > 1) {
      const dir = queue.shift();
      if (dir) {
        await processDirectory(dir);
      } else {
        // Wait a bit for more work
        await new Promise(r => setTimeout(r, 5));
      }
    }
    activeWorkers--;
    if (activeWorkers === 0) resolveComplete();
  }

  // Start workers
  for (let i = 0; i < CONCURRENCY; i++) {
    activeWorkers++;
    worker();
  }

  await complete;
  
  // Wait a bit for any pending size calculations
  await new Promise(r => setTimeout(r, 100));

  // Sort by size descending
  items.sort((a, b) => b.size - a.size);
  const totalSize = items.reduce((sum, item) => sum + item.size, 0);
  
  return { items, totalSize, count: items.length, errors };
}

// Process a found node_modules folder
async function processNodeModules(
  fullPath: string,
  items: NodeModule[],
  errors: ScanError[],
  onItemFound?: (item: NodeModule) => void,
  onError?: (error: ScanError) => void
): Promise<void> {
  try {
    const stats = await stat(fullPath);
    const parentPath = fullPath.replace(/[\/\\]node_modules$/, '');
    const parentDir = basename(parentPath) || 'root';
    
    // Create item immediately with size = 0, update later
    const item: NodeModule = {
      id: fullPath,
      path: fullPath,
      name: parentDir,
      size: 0,
      formattedSize: 'calculating...',
      lastModified: stats.mtime
    };
    
    items.push(item);
    onItemFound?.(item);
    
    // Calculate size in background
    calculateSizeFast(fullPath).then(size => {
      item.size = size;
      item.formattedSize = formatSize(size);
      // Trigger UI update
      onItemFound?.(item);
    }).catch(() => {
      item.formattedSize = 'unknown';
    });
    
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'ENOENT') {
      const scanError = { path: fullPath, message: err.message || 'Permission denied' };
      errors.push(scanError);
      onError?.(scanError);
    }
  }
}

// Fast size calculation
async function calculateSizeFast(dir: string): Promise<number> {
  let total = 0;
  const pending: string[] = [dir];
  
  while (pending.length > 0) {
    const batch = pending.splice(0, 50);
    
    await Promise.all(batch.map(async (currentDir) => {
      try {
        const entries = await readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(currentDir, entry.name);
          
          if (entry.isDirectory()) {
            pending.push(fullPath);
          } else if (entry.isFile()) {
            try {
              const stats = await stat(fullPath);
              total += stats.size;
            } catch {
              // Skip files we can't stat
            }
          }
        }
      } catch {
        // Skip directories we can't read
      }
    }));
  }
  
  return total;
}
