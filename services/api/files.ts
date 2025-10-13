import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, FileUploadResponse } from '@/types/api';

export class FileService {
  async uploadFile(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileUploadResponse>(
      API_ENDPOINTS.FILE.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    return response.data!;
  }

  async uploadMultipleFiles(
    files: File[], 
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, onProgress));
    return Promise.all(uploadPromises);
  }

  // Utility methods for file handling
  validateFile(file: File, maxSize = 5 * 1024 * 1024, allowedTypes?: string[]): boolean {
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    return true;
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const fileService = new FileService();