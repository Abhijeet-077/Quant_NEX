import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { log } from '../vite';

// Load environment variables
dotenv.config();

// Define the datasets to download
const DATASETS = [
  {
    id: 'kmader/skin-cancer-mnist-ham10000',
    description: 'Skin Cancer MNIST: HAM10000 - A large collection of multi-source dermatoscopic images of pigmented lesions'
  },
  {
    id: 'paultimothymooney/breast-histopathology-images',
    description: 'Breast Histopathology Images - Invasive Ductal Carcinoma (IDC) classification'
  },
  {
    id: 'andrewmvd/lung-and-colon-cancer-histopathological-images',
    description: 'Lung and Colon Cancer Histopathological Images'
  },
  {
    id: 'adityamahimkar/hecktor-2022-dataset',
    description: 'HECKTOR 2022 - Head and Neck Tumor Segmentation and Outcome Prediction'
  }
];

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Download datasets from Kaggle
 */
async function downloadDatasets() {
  // Check if Kaggle credentials are set
  const username = process.env.KAGGLE_USERNAME;
  const key = process.env.KAGGLE_KEY;
  
  if (!username || !key) {
    log('Error: Kaggle credentials not found in .env file');
    log('Please set KAGGLE_USERNAME and KAGGLE_KEY in your .env file');
    return;
  }
  
  // Create Kaggle API credentials file if it doesn't exist
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const kaggleDir = path.join(homeDir as string, '.kaggle');
  const kaggleJson = path.join(kaggleDir, 'kaggle.json');
  
  if (!fs.existsSync(kaggleDir)) {
    fs.mkdirSync(kaggleDir, { recursive: true });
  }
  
  // Write credentials to kaggle.json
  fs.writeFileSync(
    kaggleJson,
    JSON.stringify({ username, key }),
    { mode: 0o600 } // Set permissions to owner read/write only
  );
  
  log('Kaggle credentials configured successfully');
  
  // Download each dataset
  for (const dataset of DATASETS) {
    const datasetDir = path.join(dataDir, dataset.id.split('/')[1]);
    
    if (!fs.existsSync(datasetDir)) {
      fs.mkdirSync(datasetDir, { recursive: true });
    }
    
    log(`Downloading dataset: ${dataset.id} - ${dataset.description}`);
    
    try {
      // Download the dataset using Kaggle API
      execSync(`kaggle datasets download -d ${dataset.id} -p ${datasetDir} --unzip`, {
        stdio: 'inherit'
      });
      
      log(`Successfully downloaded dataset: ${dataset.id}`);
    } catch (error) {
      log(`Error downloading dataset ${dataset.id}:`, error);
    }
  }
  
  log('Dataset download process completed');
}

// Run the download function
downloadDatasets()
  .then(() => {
    log('All datasets downloaded successfully');
  })
  .catch((error) => {
    log('Error downloading datasets:', error);
  });
