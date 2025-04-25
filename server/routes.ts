import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import {
  insertPatientSchema,
  insertScanSchema,
  insertDiagnosisSchema,
  insertPrognosisSchema,
  insertRadiationPlanSchema,
  insertBiomarkerSchema,
  insertAlertSchema
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import modelRouter from "./routes/model-routes";
import apiRoutes from "./routes/api";

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Register machine learning model routes
  app.use('/api/models', modelRouter);

  // Register new API routes
  app.use('/api/v1', apiRoutes);

  // PATIENT ROUTES
  // Get all patients
  app.get("/api/patients", isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  // Get patient by ID
  app.get("/api/patients/:patientId", isAuthenticated, async (req, res) => {
    try {
      const patient = await storage.getPatientByPatientId(req.params.patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  // Create new patient
  app.post("/api/patients", isAuthenticated, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create patient" });
    }
  });

  // SCAN ROUTES
  // Get scans for a patient
  app.get("/api/patients/:patientId/scans", isAuthenticated, async (req, res) => {
    try {
      const scans = await storage.getScans(req.params.patientId);
      res.json(scans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scans" });
    }
  });

  // Upload scan with associated data
  app.post("/api/patients/:patientId/scans", isAuthenticated, upload.single("scan"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      // Parse the rest of the scan data from the request body
      const scanData = insertScanSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
        fileUrl,
        // Parse JSON strings if they came as form data
        tumorLocation: req.body.tumorLocation ? JSON.parse(req.body.tumorLocation) : undefined,
        tumorSize: req.body.tumorSize ? parseFloat(req.body.tumorSize) : undefined,
        malignancyScore: req.body.malignancyScore ? parseFloat(req.body.malignancyScore) : undefined,
        growthRate: req.body.growthRate ? parseFloat(req.body.growthRate) : undefined,
      });

      const scan = await storage.createScan(scanData);
      res.status(201).json(scan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload scan" });
    }
  });

  // DIAGNOSIS ROUTES
  // Get diagnoses for a patient
  app.get("/api/patients/:patientId/diagnoses", isAuthenticated, async (req, res) => {
    try {
      const diagnoses = await storage.getDiagnoses(req.params.patientId);
      res.json(diagnoses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch diagnoses" });
    }
  });

  // Create diagnosis
  app.post("/api/patients/:patientId/diagnoses", isAuthenticated, async (req, res) => {
    try {
      // If the request has alternativeDiagnoses as a string, parse it to JSON
      let requestBody = { ...req.body };
      if (typeof requestBody.alternativeDiagnoses === 'string') {
        requestBody.alternativeDiagnoses = JSON.parse(requestBody.alternativeDiagnoses);
      }

      const diagnosisData = insertDiagnosisSchema.parse({
        ...requestBody,
        patientId: req.params.patientId
      });

      const diagnosis = await storage.createDiagnosis(diagnosisData);
      res.status(201).json(diagnosis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid diagnosis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create diagnosis" });
    }
  });

  // PROGNOSIS ROUTES
  // Get prognoses for a patient
  app.get("/api/patients/:patientId/prognoses", isAuthenticated, async (req, res) => {
    try {
      const prognoses = await storage.getPrognoses(req.params.patientId);
      res.json(prognoses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prognoses" });
    }
  });

  // Create prognosis
  app.post("/api/patients/:patientId/prognoses", isAuthenticated, async (req, res) => {
    try {
      // If the request has treatmentScenarios as a string, parse it to JSON
      let requestBody = { ...req.body };
      if (typeof requestBody.treatmentScenarios === 'string') {
        requestBody.treatmentScenarios = JSON.parse(requestBody.treatmentScenarios);
      }

      const prognosisData = insertPrognosisSchema.parse({
        ...requestBody,
        patientId: req.params.patientId
      });

      const prognosis = await storage.createPrognosis(prognosisData);
      res.status(201).json(prognosis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prognosis data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prognosis" });
    }
  });

  // RADIATION PLAN ROUTES
  // Get radiation plans for a patient
  app.get("/api/patients/:patientId/radiation-plans", isAuthenticated, async (req, res) => {
    try {
      const plans = await storage.getRadiationPlans(req.params.patientId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch radiation plans" });
    }
  });

  // Create radiation plan
  app.post("/api/patients/:patientId/radiation-plans", isAuthenticated, async (req, res) => {
    try {
      // If the request has organsAtRisk as a string, parse it to JSON
      let requestBody = { ...req.body };
      if (typeof requestBody.organsAtRisk === 'string') {
        requestBody.organsAtRisk = JSON.parse(requestBody.organsAtRisk);
      }

      const planData = insertRadiationPlanSchema.parse({
        ...requestBody,
        patientId: req.params.patientId
      });

      const plan = await storage.createRadiationPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid radiation plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create radiation plan" });
    }
  });

  // BIOMARKER ROUTES
  // Get biomarkers for a patient
  app.get("/api/patients/:patientId/biomarkers", isAuthenticated, async (req, res) => {
    try {
      const biomarkers = await storage.getBiomarkers(req.params.patientId);
      res.json(biomarkers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch biomarkers" });
    }
  });

  // Create biomarker
  app.post("/api/patients/:patientId/biomarkers", isAuthenticated, async (req, res) => {
    try {
      const biomarkerData = insertBiomarkerSchema.parse({
        ...req.body,
        patientId: req.params.patientId
      });

      const biomarker = await storage.createBiomarker(biomarkerData);
      res.status(201).json(biomarker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid biomarker data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create biomarker" });
    }
  });

  // ALERT ROUTES
  // Get alerts for a patient
  app.get("/api/patients/:patientId/alerts", isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAlerts(req.params.patientId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Create alert
  app.post("/api/patients/:patientId/alerts", isAuthenticated, async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse({
        ...req.body,
        patientId: req.params.patientId
      });

      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Acknowledge alert
  app.patch("/api/alerts/:id/acknowledge", isAuthenticated, async (req, res) => {
    try {
      const alertId = parseInt(req.params.id, 10);
      const updatedAlert = await storage.acknowledgeAlert(alertId);

      if (!updatedAlert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // AI INTEGRATION ROUTES

  // Gemini API for diagnosis assistance
  app.post("/api/ai/diagnosis-assistance", isAuthenticated, async (req, res) => {
    try {
      const { patientData, scanResults } = req.body;

      if (!patientData || !scanResults) {
        return res.status(400).json({ message: "Both patient data and scan results are required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBn-kcJcmzPzxqmu4U-nAQXpUiWa9XRWCQ";
      const prompt = `
        Based on the following patient information and scan data, please provide:
        1. A potential primary diagnosis with confidence score
        2. Details explaining the diagnosis
        3. 2-3 alternative diagnoses with confidence scores

        Patient information:
        ${JSON.stringify(patientData, null, 2)}

        Scan results:
        ${JSON.stringify(scanResults, null, 2)}

        Please format your response as a JSON object with the following structure:
        {
          "primaryDiagnosis": "string",
          "confidence": float (0-1),
          "details": "string",
          "alternativeDiagnoses": [
            { "diagnosis": "string", "confidence": float (0-1) }
          ]
        }
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the AI response text
      const aiResponse = response.data.candidates[0].content.parts[0].text;

      // Extract the JSON from the response (remove any markdown or extra text)
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/{[\s\S]*?}/);

      let diagnosisData;
      if (jsonMatch) {
        try {
          diagnosisData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
        } catch (e) {
          diagnosisData = JSON.parse(aiResponse);
        }
      } else {
        diagnosisData = JSON.parse(aiResponse);
      }

      res.json(diagnosisData);
    } catch (error) {
      console.error("AI Diagnosis Error:", error);
      res.status(500).json({ message: "Failed to generate AI diagnosis assistance" });
    }
  });

  // Gemini API for prognosis prediction
  app.post("/api/ai/prognosis-prediction", isAuthenticated, async (req, res) => {
    try {
      const { patientData, diagnosisData, treatmentOptions } = req.body;

      if (!patientData || !diagnosisData) {
        return res.status(400).json({ message: "Both patient data and diagnosis data are required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBn-kcJcmzPzxqmu4U-nAQXpUiWa9XRWCQ";
      const prompt = `
        Based on the following patient information, diagnosis, and treatment options, please predict:
        1. 1-year survival probability
        2. 3-year survival probability
        3. 5-year survival probability
        4. Treatment scenarios with expected outcomes for each option

        Patient information:
        ${JSON.stringify(patientData, null, 2)}

        Diagnosis:
        ${JSON.stringify(diagnosisData, null, 2)}

        Treatment options:
        ${JSON.stringify(treatmentOptions || [], null, 2)}

        Please format your response as a JSON object with the following structure:
        {
          "survival1yr": float (0-1),
          "survival3yr": float (0-1),
          "survival5yr": float (0-1),
          "treatmentScenarios": [
            {
              "name": "string",
              "description": "string",
              "survivalRate": float (0-1),
              "timeframe": "string" (e.g., "3-year")
            }
          ]
        }
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the AI response text
      const aiResponse = response.data.candidates[0].content.parts[0].text;

      // Extract the JSON from the response (remove any markdown or extra text)
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/{[\s\S]*?}/);

      let prognosisData;
      if (jsonMatch) {
        try {
          prognosisData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
        } catch (e) {
          prognosisData = JSON.parse(aiResponse);
        }
      } else {
        prognosisData = JSON.parse(aiResponse);
      }

      res.json(prognosisData);
    } catch (error) {
      console.error("AI Prognosis Error:", error);
      res.status(500).json({ message: "Failed to generate AI prognosis prediction" });
    }
  });

  // Gemini API for radiation plan optimization
  app.post("/api/ai/radiation-optimization", isAuthenticated, async (req, res) => {
    try {
      const { patientData, tumorData, organConstraints } = req.body;

      if (!patientData || !tumorData) {
        return res.status(400).json({ message: "Both patient data and tumor data are required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBn-kcJcmzPzxqmu4U-nAQXpUiWa9XRWCQ";
      const prompt = `
        Based on the following patient information, tumor data, and organ constraints, please provide an optimized radiation therapy plan:

        Patient information:
        ${JSON.stringify(patientData, null, 2)}

        Tumor data:
        ${JSON.stringify(tumorData, null, 2)}

        Organ constraints:
        ${JSON.stringify(organConstraints || [], null, 2)}

        Please simulate a quantum-optimized radiation plan and format your response as a JSON object with the following structure:
        {
          "beamAngles": integer,
          "totalDose": float,
          "fractions": integer,
          "tumorCoverage": float (0-1),
          "healthyTissueSpared": float (0-1),
          "organsAtRisk": [
            {
              "name": "string",
              "dose": float,
              "limit": float
            }
          ],
          "optimizationMethod": "string"
        }
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the AI response text
      const aiResponse = response.data.candidates[0].content.parts[0].text;

      // Extract the JSON from the response (remove any markdown or extra text)
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                         aiResponse.match(/{[\s\S]*?}/);

      let radiationPlanData;
      if (jsonMatch) {
        try {
          radiationPlanData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
        } catch (e) {
          radiationPlanData = JSON.parse(aiResponse);
        }
      } else {
        radiationPlanData = JSON.parse(aiResponse);
      }

      res.json(radiationPlanData);
    } catch (error) {
      console.error("AI Radiation Plan Error:", error);
      res.status(500).json({ message: "Failed to generate AI radiation optimization" });
    }
  });

  // Cohere API for chat assistant
  app.post("/api/chat/message", isAuthenticated, async (req, res) => {
    try {
      const { message, chatHistory } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const apiKey = process.env.COHERE_API_KEY || "lH59QipA0dtO0vrcRyYEXiwsgSRbQ8IzDlREYSgc";

      // Format chat history for Cohere API
      const formattedHistory = (chatHistory || []).map((msg: any) => ({
        role: msg.isUser ? 'USER' : 'CHATBOT',
        message: msg.text
      }));

      const response = await axios.post(
        "https://api.cohere.ai/v1/chat",
        {
          message,
          chat_history: formattedHistory,
          model: "command-r",
          preamble: `You are an advanced Quantum-AI Oncology Assistant helping doctors with cancer cases. You have access to state-of-the-art quantum computing methods for tumor detection, diagnosis, prognosis, and radiation therapy optimization. Provide concise, clinically relevant responses about cancer cases, treatment options, and quantum-enhanced approaches. Always stay professional, ethical, and reference scientific evidence when available.`,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      res.json({
        text: response.data.text,
        isUser: false
      });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ message: "Failed to get chat response" });
    }
  });

  // Serve static files from the uploads directory
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);

  return httpServer;
}
