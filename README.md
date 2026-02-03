# rmnode

<p align="center">
  <img src="https://img.shields.io/npm/v/rmnode?color=blue&label=npm" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/rmnode?color=green" alt="downloads" />
  <img src="https://img.shields.io/npm/l/rmnode" alt="license" />
  <img src="https://img.shields.io/node/v/rmnode" alt="node version" />
</p>

<p align="center">
  <b>Fast and beautiful CLI tool to find and remove node_modules folders</b>
</p>

```
 $$$$$$\  $$$$$$\$$$$\  $$\   $$\  $$$$$$\   $$$$$$\   $$$$$$\  
 $$  __$$\ $$  _$$  _$$\ $$$\  $$ |$$  __$$\ $$  __$$\ $$  __$$\ 
 $$ |  \__|$$ / $$ / $$ |$$$$\ $$ |$$ /  $$ |$$ /  $$ |$$$$$$$$ |
 $$ |      $$ | $$ | $$ |$$ $$\$$ |$$ |  $$ |$$ |  $$ |$$   ____|
 $$ |      $$ | $$ | $$ |$$ \$$$$ |$$ |  $$ |$$ |  $$ |$$ |      
 $$ |      $$ | $$ | $$ |$$ |\$$$ |$$ |  $$ |$$ |  $$ |$$ |      
 $$ |      $$ | $$ | $$ |$$ | \$$ |\$$$$$$  |\$$$$$$$ |\$$$$$$$\ 
 \__|      \__| \__| \__|\__|  \__| \______/  \_______| \_______|
```

## Features

- **Instant startup** - Results appear in milliseconds, not seconds
- **Beautiful TUI** - Interactive terminal interface with colors
- **Fast scanning** - Parallel directory scanning
- **Smart filtering** - Skips nested node_modules and system directories
- **Search** - Filter projects by name or path
- **Multi-select** - Select multiple folders to delete at once
- **Safe** - Confirmation before deletion, dry-run mode available
- **Non-blocking** - Continue browsing while deletion happens in background

## Installation

```bash
# Run directly with npx (no install needed)
npx rmnode

# Or install globally
npm install -g rmnode
```

## Usage

```bash
# Scan current directory
rmnode

# Scan specific path
rmnode --path ~/projects

# Dry run (show what would be deleted without deleting)
rmnode --dry-run
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Space` | Select/deselect item |
| `Enter` | Select and move to next |
| `a` | Select all |
| `c` | Clear selection |
| `s` / `/` | Search |
| `d` | Delete selected |
| `q` | Quit |
| `Esc` | Close search / Clear filter |

## Screenshots

### Main Interface
```
 Found: 15    Total: 2.5 GB    Selected: 3    Size: 850 MB

    ... 2 more above
 > [x] my-project              450.5 MB  ~/projects/my-project/node_modules
   [ ] another-app             125.3 MB  ~/projects/another-app/node_modules
   [x] old-website             275.8 MB  ~/projects/old-website/node_modules
   [ ] test-repo                45.2 MB  ~/projects/test-repo/node_modules
    ... 8 more below

j/k: navigate | space: select | a: all | s: search | d: delete | q: quit
```

### Search Mode
```
Search: react_  (Esc to close, Enter to keep filter)
```

## How It Works

1. **Scans** your filesystem for `node_modules` directories
2. **Calculates** the size of each folder
3. **Displays** results sorted by size (largest first)
4. **Deletes** selected folders in parallel using native `rm -rf`

## What Gets Skipped

rmnode automatically skips:
- Nested `node_modules` (inside other node_modules)
- Package manager caches (`.npm`, `.yarn`, `.pnpm`)
- System directories (`Library`, `Applications`, etc.)
- Hidden directories

## Project Structure

```
src/
├── components/          # React components (Ink TUI)
│   ├── App.tsx         # Main application
│   ├── MainView.tsx    # Main interface
│   ├── Item.tsx        # List item component
│   ├── NodeModulesList.tsx
│   ├── StatsBar.tsx
│   └── ConfirmDialog.tsx
├── hooks/              # React hooks
│   ├── useScanner.ts   # File scanning
│   ├── useSelection.ts # Selection state
│   └── useKeyboard.ts  # Keyboard input
├── scanner/            # Core scanning logic
│   └── index.ts
├── utils/
│   ├── format-size.ts
│   └── delete-folder.ts
├── types.ts
├── cli.ts
└── index.tsx
```

## Requirements

- Node.js 18.0.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Clone the repo
git clone https://github.com/firaslatrech/rmnode.git
cd rmnode

# Install dependencies
npm install

# Run in development
npm run dev

# Build
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Firas Latrach**

- Website: [firaslatrach.vercel.app](https://firaslatrach.vercel.app)
- GitHub: [@firaslatrach](https://github.com/firaslatrech)

---

<p align="center">
  Made with love by <a href="https://firaslatrach.vercel.app">Firas Latrach</a>
</p>
