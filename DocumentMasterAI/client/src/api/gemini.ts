import axios from "axios";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBn-kcJcmzPzxqmu4U-nAQXpUiWa9XRWCQ";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-pro";

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export interface DiagnosisResult {
  primaryDiagnosis: string;
  confidence: number;
  details: string;
  alternativeDiagnoses: {
    diagnosis: string;
    confidence: number;
  }[];
}

export interface PrognosisResult {
  survival1yr: number;
  survival3yr: number;
  survival5yr: number;
  treatmentScenarios: {
    name: string;
    description: string;
    survivalRate: number;
    timeframe: string;
  }[];
}

export interface RadiationPlanResult {
  beamAngles: number;
  totalDose: number;
  fractions: number;
  tumorCoverage: number;
  healthyTissueSpared: number;
  organsAtRisk: {
    name: string;
    dose: number;
    limit: number;
  }[];
  optimizationMethod: string;
}

export async function generateDiagnosis(
  patientData: any,
  scanResults: any
): Promise<DiagnosisResult> {
  try {
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

    const response = await axios.post<GeminiResponse>(
      `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/{[\s\S]*?}/);
                      
    let diagnosisData: DiagnosisResult;
    if (jsonMatch) {
      try {
        diagnosisData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
      } catch (e) {
        diagnosisData = JSON.parse(aiResponse);
      }
    } else {
      diagnosisData = JSON.parse(aiResponse);
    }

    return diagnosisData;
  } catch (error) {
    console.error("Error generating diagnosis:", error);
    throw new Error("Failed to generate diagnosis");
  }
}

export async function generatePrognosis(
  patientData: any,
  diagnosisData: any,
  treatmentOptions?: any[]
): Promise<PrognosisResult> {
  try {
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

    const response = await axios.post<GeminiResponse>(
      `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/{[\s\S]*?}/);
                      
    let prognosisData: PrognosisResult;
    if (jsonMatch) {
      try {
        prognosisData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
      } catch (e) {
        prognosisData = JSON.parse(aiResponse);
      }
    } else {
      prognosisData = JSON.parse(aiResponse);
    }

    return prognosisData;
  } catch (error) {
    console.error("Error generating prognosis:", error);
    throw new Error("Failed to generate prognosis");
  }
}

export async function generateRadiationPlan(
  patientData: any,
  tumorData: any,
  organConstraints?: any[]
): Promise<RadiationPlanResult> {
  try {
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

    const response = await axios.post<GeminiResponse>(
      `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/{[\s\S]*?}/);
                      
    let radiationPlanData: RadiationPlanResult;
    if (jsonMatch) {
      try {
        radiationPlanData = JSON.parse(jsonMatch[0].replace(/```json\n|```\n|```/g, ''));
      } catch (e) {
        radiationPlanData = JSON.parse(aiResponse);
      }
    } else {
      radiationPlanData = JSON.parse(aiResponse);
    }

    return radiationPlanData;
  } catch (error) {
    console.error("Error generating radiation plan:", error);
    throw new Error("Failed to generate radiation plan");
  }
}
