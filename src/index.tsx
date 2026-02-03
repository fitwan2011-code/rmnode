#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './components/App.js';
import { parseArgs } from './cli.js';

const { path, dryRun } = parseArgs();

render(<App rootPath={path} dryRun={dryRun} />);
