const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  
  return `${size} ${UNITS[i]}`;
}
