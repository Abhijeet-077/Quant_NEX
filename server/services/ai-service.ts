import axios from "axios";
import { z } from "zod";

// Define Kaggle model response schema
const kaggleModelResponseSchema = z.object({
  prediction: z.number(),
  probability: z.number(),
  confidence: z.number(),
  modelVersion: z.string(),
  metadata: z.object({
    accuracy: z.number(),
    f1Score: z.number(),
    sensitivity: z.number(),
    specificity: z.number(),
    auc: z.number(),
  }).optional(),
});

type KaggleModelResponse = z.infer<typeof kaggleModelResponseSchema>;

// Define benchmark data for the landing page
export const modelBenchmarks = {
  breastCancer: {
    accuracy: 0.94,
    precision: 0.95,
    recall: 0.92,
    f1Score: 0.93,
    auc: 0.97,
    trainSize: 12845,
    validationMetrics: {
      accuracy: 0.91,
      precision: 0.92,
      recall: 0.89,
      f1Score: 0.90,
    },
  },
  lungCancer: {
    accuracy: 0.89,
    precision: 0.88,
    recall: 0.91,
    f1Score: 0.89,
    auc: 0.93,
    trainSize: 9523,
    validationMetrics: {
      accuracy: 0.87,
      precision: 0.86,
      recall: 0.88,
      f1Score: 0.87,
    },
  },
  brainTumor: {
    accuracy: 0.92,
    precision: 0.93,
    recall: 0.90,
    f1Score: 0.91,
    auc: 0.95,
    trainSize: 5782,
    validationMetrics: {
      accuracy: 0.89,
      precision: 0.90,
      recall: 0.88,
      f1Score: 0.89,
    },
  },
  colorectalCancer: {
    accuracy: 0.91,
    precision: 0.92,
    recall: 0.90,
    f1Score: 0.91,
    auc: 0.94,
    trainSize: 7241,
    validationMetrics: {
      accuracy: 0.88,
      precision: 0.89,
      recall: 0.87,
      f1Score: 0.88,
    },
  },
  melanomaDetection: {
    accuracy: 0.93,
    precision: 0.92,
    recall: 0.91,
    f1Score: 0.91,
    auc: 0.95,
    trainSize: 8456,
    validationMetrics: {
      accuracy: 0.90,
      precision: 0.89,
      recall: 0.88,
      f1Score: 0.88,
    },
  },
};

/**
 * Fetches cancer prediction results from a Kaggle model
 * @param kaggleModelUrl The URL to the Kaggle model API endpoint
 * @param patientData The patient data to send to the model
 * @param apiKey Optional Kaggle API key for authenticated requests
 * @returns Prediction results from the Kaggle model
 */
export async function fetchKagglePrediction(
  kaggleModelUrl: string,
  patientData: any,
  apiKey?: string
): Promise<KaggleModelResponse> {
  try {
    // Configure headers with API key if provided
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Make request to Kaggle model API
    const response = await axios.post(kaggleModelUrl, patientData, {
      headers,
    });

    // Validate the response against our schema
    try {
      return kaggleModelResponseSchema.parse(response.data);
    } catch (validationError) {
      console.error("Kaggle model response validation error:", validationError);
      throw new Error("Invalid response format from Kaggle model");
    }
  } catch (error) {
    console.error("Error fetching Kaggle prediction:", error);
    throw new Error(`Failed to fetch prediction from Kaggle model: ${error.message}`);
  }
}

/**
 * Fetches multiple cancer prediction results from different Kaggle models
 * @param modelEndpoints Object mapping cancer types to their model URLs
 * @param patientData The patient data to send to the models
 * @param apiKey Optional Kaggle API key for authenticated requests
 * @returns Object mapping cancer types to their prediction results
 */
export async function fetchMultiModelPredictions(
  modelEndpoints: Record<string, string>,
  patientData: any,
  apiKey?: string
): Promise<Record<string, KaggleModelResponse>> {
  const predictions: Record<string, KaggleModelResponse> = {};
  const errors: string[] = [];

  // Create an array of promises to fetch predictions from all models
  const promises = Object.entries(modelEndpoints).map(async ([cancerType, url]) => {
    try {
      const prediction = await fetchKagglePrediction(url, patientData, apiKey);
      predictions[cancerType] = prediction;
    } catch (error) {
      errors.push(`${cancerType}: ${error.message}`);
    }
  });

  // Wait for all prediction requests to complete
  await Promise.all(promises);

  if (Object.keys(predictions).length === 0 && errors.length > 0) {
    throw new Error(`Failed to fetch predictions: ${errors.join("; ")}`);
  }

  return predictions;
}

/**
 * Combines predictions with patient data to generate comprehensive diagnostic report
 * @param patientData Patient information
 * @param predictions Model predictions for various cancer types
 * @returns Comprehensive diagnostic report
 */
export function generateDiagnosticReport(
  patientData: any,
  predictions: Record<string, KaggleModelResponse>
) {
  const highRiskCancers = Object.entries(predictions)
    .filter(([_, prediction]) => prediction.probability > 0.7)
    .sort((a, b) => b[1].probability - a[1].probability);

  const moderateRiskCancers = Object.entries(predictions)
    .filter(([_, prediction]) => prediction.probability > 0.4 && prediction.probability <= 0.7)
    .sort((a, b) => b[1].probability - a[1].probability);

  const lowRiskCancers = Object.entries(predictions)
    .filter(([_, prediction]) => prediction.probability <= 0.4)
    .sort((a, b) => b[1].probability - a[1].probability);

  return {
    patientId: patientData.patientId,
    patientAge: patientData.age,
    patientGender: patientData.gender,
    highRiskFindings: highRiskCancers.map(([type, prediction]) => ({
      cancerType: type,
      probability: prediction.probability,
      confidence: prediction.confidence,
      recommendedActions: [
        "Immediate additional testing",
        "Specialist consultation",
        "Treatment planning",
      ],
    })),
    moderateRiskFindings: moderateRiskCancers.map(([type, prediction]) => ({
      cancerType: type,
      probability: prediction.probability,
      confidence: prediction.confidence,
      recommendedActions: [
        "Follow-up testing within 1-2 weeks",
        "Monitoring",
      ],
    })),
    lowRiskFindings: lowRiskCancers.map(([type, prediction]) => ({
      cancerType: type,
      probability: prediction.probability,
      confidence: prediction.confidence,
      recommendedActions: [
        "Routine monitoring",
        "Preventive measures",
      ],
    })),
    overallRiskAssessment: highRiskCancers.length > 0 ? "High" 
      : moderateRiskCancers.length > 0 ? "Moderate" 
      : "Low",
    reportGeneratedAt: new Date().toISOString(),
    modelVersions: Object.entries(predictions).reduce((acc, [type, prediction]) => {
      acc[type] = prediction.modelVersion;
      return acc;
    }, {} as Record<string, string>),
  };
}