import fs from 'fs';
import path from 'path';
import { log } from '../vite';

// Data Processing Service
export class DataProcessingService {
  private dataDir: string;
  
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }
  
  /**
   * Get available datasets
   */
  getAvailableDatasets(): string[] {
    try {
      if (!fs.existsSync(this.dataDir)) {
        return [];
      }
      
      return fs.readdirSync(this.dataDir)
        .filter(item => fs.statSync(path.join(this.dataDir, item)).isDirectory());
    } catch (error) {
      log('Error getting available datasets:', error);
      return [];
    }
  }
  
  /**
   * Get dataset info
   */
  getDatasetInfo(datasetName: string): any {
    try {
      const datasetDir = path.join(this.dataDir, datasetName);
      
      if (!fs.existsSync(datasetDir)) {
        return null;
      }
      
      // Get all files in the dataset directory
      const files = this.getAllFiles(datasetDir);
      
      // Count files by extension
      const fileTypes: Record<string, number> = {};
      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      });
      
      // Get total size
      const totalSize = files.reduce((size, file) => {
        return size + fs.statSync(file).size;
      }, 0);
      
      return {
        name: datasetName,
        path: datasetDir,
        fileCount: files.length,
        fileTypes,
        totalSize,
        sizeInMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      log('Error getting dataset info:', error);
      return null;
    }
  }
  
  /**
   * Get all files in a directory recursively
   */
  private getAllFiles(dir: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(itemPath));
      } else {
        files.push(itemPath);
      }
    }
    
    return files;
  }
  
  /**
   * Process image dataset for tumor detection
   */
  processTumorDetectionDataset(datasetName: string): any {
    try {
      const datasetDir = path.join(this.dataDir, datasetName);
      
      if (!fs.existsSync(datasetDir)) {
        return { error: 'Dataset not found' };
      }
      
      // Get all image files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff'];
      const imageFiles = this.getAllFiles(datasetDir)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });
      
      // For a real application, we would process these images
      // For now, we'll just return some statistics
      
      return {
        datasetName,
        imageCount: imageFiles.length,
        sampleImages: imageFiles.slice(0, 5).map(file => {
          return {
            path: file,
            filename: path.basename(file),
            size: fs.statSync(file).size
          };
        }),
        processingStatus: 'simulated'
      };
    } catch (error) {
      log('Error processing tumor detection dataset:', error);
      return { error: 'Failed to process dataset' };
    }
  }
  
  /**
   * Process dataset for cancer classification
   */
  processCancerClassificationDataset(datasetName: string): any {
    try {
      const datasetDir = path.join(this.dataDir, datasetName);
      
      if (!fs.existsSync(datasetDir)) {
        return { error: 'Dataset not found' };
      }
      
      // Get all subdirectories (assuming they represent classes)
      const classes = fs.readdirSync(datasetDir)
        .filter(item => fs.statSync(path.join(datasetDir, item)).isDirectory());
      
      // Count images per class
      const classStats: Record<string, number> = {};
      
      for (const className of classes) {
        const classDir = path.join(datasetDir, className);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff'];
        
        const imageCount = this.getAllFiles(classDir)
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
          }).length;
        
        classStats[className] = imageCount;
      }
      
      return {
        datasetName,
        classes,
        classStats,
        totalImages: Object.values(classStats).reduce((sum, count) => sum + count, 0),
        processingStatus: 'simulated'
      };
    } catch (error) {
      log('Error processing cancer classification dataset:', error);
      return { error: 'Failed to process dataset' };
    }
  }
}

// Export a singleton instance
export const dataProcessingService = new DataProcessingService();
