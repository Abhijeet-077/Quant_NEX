import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  title: true,
  profileImage: true,
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  cancerType: text("cancer_type").notNull(),
  stage: text("stage").notNull(),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  treatmentHistory: jsonb("treatment_history"),
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  patientId: true,
  name: true,
  age: true,
  gender: true,
  cancerType: true,
  stage: true,
  status: true,
  treatmentHistory: true,
});

// Scans/medical images table
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  scanType: text("scan_type").notNull(), // CT, MRI, PET, etc.
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  tumorDetected: boolean("tumor_detected").default(false),
  tumorLocation: jsonb("tumor_location"),
  tumorSize: real("tumor_size"),
  malignancyScore: real("malignancy_score"),
  growthRate: real("growth_rate"),
  notes: text("notes"),
});

export const insertScanSchema = createInsertSchema(scans).pick({
  patientId: true,
  scanType: true,
  fileUrl: true,
  tumorDetected: true,
  tumorLocation: true,
  tumorSize: true,
  malignancyScore: true,
  growthRate: true,
  notes: true,
});

// Diagnosis table
export const diagnoses = pgTable("diagnoses", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  primaryDiagnosis: text("primary_diagnosis").notNull(),
  confidence: real("confidence").notNull(),
  details: text("details"),
  alternativeDiagnoses: jsonb("alternative_diagnoses"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDiagnosisSchema = createInsertSchema(diagnoses).pick({
  patientId: true,
  primaryDiagnosis: true,
  confidence: true,
  details: true,
  alternativeDiagnoses: true,
});

// Prognosis table
export const prognoses = pgTable("prognoses", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  survival1yr: real("survival_1yr").notNull(),
  survival3yr: real("survival_3yr").notNull(),
  survival5yr: real("survival_5yr").notNull(),
  treatmentScenarios: jsonb("treatment_scenarios"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPrognosisSchema = createInsertSchema(prognoses).pick({
  patientId: true,
  survival1yr: true,
  survival3yr: true,
  survival5yr: true,
  treatmentScenarios: true,
});

// Radiation treatment plans
export const radiationPlans = pgTable("radiation_plans", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  beamAngles: integer("beam_angles").notNull(),
  totalDose: real("total_dose").notNull(),
  fractions: integer("fractions").notNull(),
  tumorCoverage: real("tumor_coverage").notNull(),
  healthyTissueSpared: real("healthy_tissue_spared").notNull(),
  organsAtRisk: jsonb("organs_at_risk"),
  optimizationMethod: text("optimization_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRadiationPlanSchema = createInsertSchema(radiationPlans).pick({
  patientId: true,
  beamAngles: true,
  totalDose: true,
  fractions: true,
  tumorCoverage: true,
  healthyTissueSpared: true,
  organsAtRisk: true,
  optimizationMethod: true,
});

// Patient biomarkers for monitoring
export const biomarkers = pgTable("biomarkers", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  type: text("type").notNull(), // CEA, WBC, CRP, etc.
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  normalRangeLow: real("normal_range_low"),
  normalRangeHigh: real("normal_range_high"),
  trend: text("trend"), // up, down, stable
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertBiomarkerSchema = createInsertSchema(biomarkers).pick({
  patientId: true,
  type: true,
  value: true,
  unit: true,
  normalRangeLow: true,
  normalRangeHigh: true,
  trend: true,
});

// Alerts for patient monitoring
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  type: text("type").notNull(), // warning, critical, info
  message: text("message").notNull(),
  details: text("details"),
  acknowledged: boolean("acknowledged").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  patientId: true,
  type: true,
  message: true,
  details: true,
  acknowledged: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = z.infer<typeof insertDiagnosisSchema>;

export type Prognosis = typeof prognoses.$inferSelect;
export type InsertPrognosis = z.infer<typeof insertPrognosisSchema>;

export type RadiationPlan = typeof radiationPlans.$inferSelect;
export type InsertRadiationPlan = z.infer<typeof insertRadiationPlanSchema>;

export type Biomarker = typeof biomarkers.$inferSelect;
export type InsertBiomarker = z.infer<typeof insertBiomarkerSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
