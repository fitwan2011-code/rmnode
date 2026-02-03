#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';

interface CliOptions {
  path: string;
  dryRun: boolean;
}

export function parseArgs(): CliOptions {
  const program = new Command();
  
  program
    .name('rmnode')
    .description('Clean node_modules cleaner with beautiful TUI')
    .version('1.0.0')
    .option('-p, --path <path>', 'Starting directory', process.cwd())
    .option('-d, --dry-run', 'Show what would be deleted without deleting', false)
    .parse();
  
  const options = program.opts();
  
  return {
    path: path.resolve(options.path),
    dryRun: options.dryRun
  };
}
