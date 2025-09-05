export interface CloudFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string; // For blob URL when needed
  data?: string; // Base64 data for persistence
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  usedPercentage: number;
  quotaBytes: number;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️';
  if (type === 'application/pdf') return '📄';
  if (type.startsWith('text/')) return '📝';
  if (type.includes('word') || type.includes('document')) return '📄';
  if (type.includes('sheet') || type.includes('excel')) return '📊';
  if (type.includes('presentation') || type.includes('powerpoint')) return '📊';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  return '📎';
};