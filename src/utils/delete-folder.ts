import { rm } from 'fs/promises';
import type { DeleteResult } from '../types.js';

export async function deleteFolder(
  path: string,
  size: number,
  dryRun: boolean = false
): Promise<DeleteResult> {
  try {
    if (dryRun) {
      return { success: true, path, freedSpace: size };
    }
    
    // Use rm with recursive and force - much faster than manual recursion
    await rm(path, { recursive: true, force: true, maxRetries: 3 });
    
    return { success: true, path, freedSpace: size };
  } catch (error) {
    return {
      success: false,
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
      freedSpace: 0
    };
  }
}
