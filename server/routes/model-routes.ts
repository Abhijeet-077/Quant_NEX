import express, { Request, Response } from "express";
import { fetchAllKagglePredictions, classifyImageWithKaggleModel, KAGGLE_MODEL_ENDPOINTS } from "../services/kaggle-model-service";
import { generateDiagnosticReport, modelBenchmarks } from "../services/ai-service";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory for scan images if it doesn't exist
const modelUploadsDir = path.join(process.cwd(), "uploads", "model_inputs");
if (!fs.existsSync(modelUploadsDir)) {
  fs.mkdirSync(modelUploadsDir, { recursive: true });
}

// Configure multer for model input file uploads
const modelUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, modelUploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

// Helper function to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Create router for model-related routes
const modelRouter = express.Router();

// Get model benchmarks for the landing page
modelRouter.get("/benchmarks", (req, res) => {
  try {
    res.json({
      benchmarks: modelBenchmarks,
      modelCount: Object.keys(KAGGLE_MODEL_ENDPOINTS).length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching model benchmarks:", error);
    res.status(500).json({ message: "Failed to fetch model benchmarks" });
  }
});

// Get available models
modelRouter.get("/available", (req, res) => {
  try {
    const models = Object.keys(KAGGLE_MODEL_ENDPOINTS).map(key => ({
      id: key,
      name: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase()),
      endpoint: KAGGLE_MODEL_ENDPOINTS[key as keyof typeof KAGGLE_MODEL_ENDPOINTS]
    }));
    
    res.json({
      models,
      count: models.length,
    });
  } catch (error) {
    console.error("Error fetching available models:", error);
    res.status(500).json({ message: "Failed to fetch available models" });
  }
});

// Get predictions from all models for a patient
modelRouter.post("/predict", isAuthenticated, async (req, res) => {
  try {
    const { patientId, patientData } = req.body;
    
    if (!patientId || !patientData) {
      return res.status(400).json({ message: "Patient ID and data are required" });
    }
    
    // Fetch predictions from all Kaggle models
    const predictions = await fetchAllKagglePredictions(patientData);
    
    // Generate comprehensive diagnostic report
    const report = generateDiagnosticReport(patientData, predictions);
    
    res.json({
      patientId,
      predictions,
      diagnosticReport: report,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting model predictions:", error);
    res.status(500).json({ message: `Failed to get predictions: ${error.message}` });
  }
});

// Analyze a scan image using the appropriate model
modelRouter.post("/analyze-scan", 
  isAuthenticated, 
  modelUpload.single("scanImage"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No scan image uploaded" });
      }
      
      const { cancerType, patientId } = req.body;
      
      if (!cancerType || !patientId) {
        return res.status(400).json({ message: "Cancer type and patient ID are required" });
      }
      
      // Get the appropriate model endpoint
      const modelEndpoint = KAGGLE_MODEL_ENDPOINTS[cancerType as keyof typeof KAGGLE_MODEL_ENDPOINTS];
      
      if (!modelEndpoint) {
        return res.status(400).json({ message: `No model available for cancer type: ${cancerType}` });
      }
      
      // Analyze the scan image
      const analysis = await classifyImageWithKaggleModel(
        req.file.path,
        modelEndpoint
      );
      
      res.json({
        patientId,
        scanId: path.basename(req.file.path),
        cancerType,
        analysis,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error analyzing scan:", error);
      res.status(500).json({ message: `Failed to analyze scan: ${error.message}` });
    }
  }
);

// Compare multiple models
modelRouter.post("/compare-models", isAuthenticated, async (req, res) => {
  try {
    const { patientId, patientData, modelTypes } = req.body;
    
    if (!patientId || !patientData) {
      return res.status(400).json({ message: "Patient ID and data are required" });
    }
    
    // Filter model endpoints by requested types (or use all if not specified)
    const selectedModels: Record<string, string> = {};
    if (modelTypes && Array.isArray(modelTypes)) {
      modelTypes.forEach(type => {
        if (KAGGLE_MODEL_ENDPOINTS[type as keyof typeof KAGGLE_MODEL_ENDPOINTS]) {
          selectedModels[type] = KAGGLE_MODEL_ENDPOINTS[type as keyof typeof KAGGLE_MODEL_ENDPOINTS];
        }
      });
    } else {
      Object.assign(selectedModels, KAGGLE_MODEL_ENDPOINTS);
    }
    
    // Fetch predictions from selected models
    const predictions = await fetchAllKagglePredictions(patientData);
    
    // Filter predictions to only include selected models
    const filteredPredictions: Record<string, any> = {};
    Object.keys(selectedModels).forEach(key => {
      if (predictions[key]) {
        filteredPredictions[key] = predictions[key];
      }
    });
    
    res.json({
      patientId,
      modelComparison: filteredPredictions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error comparing models:", error);
    res.status(500).json({ message: `Failed to compare models: ${error.message}` });
  }
});

export default modelRouter;