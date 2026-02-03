export interface NodeModule {
  id: string;
  path: string;
  name: string;
  size: number;
  formattedSize: string;
  lastModified: Date;
}

export interface ScanError {
  path: string;
  message: string;
}

export interface ScanResult {
  items: NodeModule[];
  totalSize: number;
  count: number;
  errors: ScanError[];
}

export interface SelectionState {
  selectedIds: Set<string>;
  selectedSize: number;
  selectedCount: number;
}

export interface DeleteResult {
  success: boolean;
  path: string;
  error?: string;
  freedSpace: number;
}

export interface AppState {
  isScanning: boolean;
  items: NodeModule[];
  cursorIndex: number;
  selectedIds: Set<string>;
  showConfirmDialog: boolean;
  deleting: boolean;
  deleteResults: DeleteResult[];
  scanError?: string;
}

export interface AppProps {
  rootPath: string;
  dryRun: boolean;
}
