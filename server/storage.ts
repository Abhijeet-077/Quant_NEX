import {
  users, patients, scans, diagnoses, prognoses, radiationPlans, biomarkers, alerts,
  type User, type InsertUser,
  type Patient, type InsertPatient,
  type Scan, type InsertScan,
  type Diagnosis, type InsertDiagnosis,
  type Prognosis, type InsertPrognosis,
  type RadiationPlan, type InsertRadiationPlan,
  type Biomarker, type InsertBiomarker,
  type Alert, type InsertAlert
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patient management
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<Patient>): Promise<Patient | undefined>;

  // Scan management
  getScans(patientId: string): Promise<Scan[]>;
  getScan(id: number): Promise<Scan | undefined>;
  createScan(scan: InsertScan): Promise<Scan>;

  // Diagnosis management
  getDiagnoses(patientId: string): Promise<Diagnosis[]>;
  getDiagnosis(id: number): Promise<Diagnosis | undefined>;
  createDiagnosis(diagnosis: InsertDiagnosis): Promise<Diagnosis>;

  // Prognosis management
  getPrognoses(patientId: string): Promise<Prognosis[]>;
  getPrognosis(id: number): Promise<Prognosis | undefined>;
  createPrognosis(prognosis: InsertPrognosis): Promise<Prognosis>;

  // Radiation plan management
  getRadiationPlans(patientId: string): Promise<RadiationPlan[]>;
  getRadiationPlan(id: number): Promise<RadiationPlan | undefined>;
  createRadiationPlan(plan: InsertRadiationPlan): Promise<RadiationPlan>;

  // Biomarker management
  getBiomarkers(patientId: string): Promise<Biomarker[]>;
  getBiomarker(id: number): Promise<Biomarker | undefined>;
  createBiomarker(biomarker: InsertBiomarker): Promise<Biomarker>;

  // Alert management
  getAlerts(patientId: string): Promise<Alert[]>;
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: number): Promise<Alert | undefined>;

  // Session store
  sessionStore: any; // Using any as session.SessionStore has typing issues
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private scans: Map<number, Scan>;
  private diagnoses: Map<number, Diagnosis>;
  private prognoses: Map<number, Prognosis>;
  private radiationPlans: Map<number, RadiationPlan>;
  private biomarkers: Map<number, Biomarker>;
  private alerts: Map<number, Alert>;

  // Current IDs for auto-increment
  private userCurrentId: number;
  private patientCurrentId: number;
  private scanCurrentId: number;
  private diagnosisCurrentId: number;
  private prognosisCurrentId: number;
  private radiationPlanCurrentId: number;
  private biomarkerCurrentId: number;
  private alertCurrentId: number;

  // Session store
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.scans = new Map();
    this.diagnoses = new Map();
    this.prognoses = new Map();
    this.radiationPlans = new Map();
    this.biomarkers = new Map();
    this.alerts = new Map();

    this.userCurrentId = 1;
    this.patientCurrentId = 1;
    this.scanCurrentId = 1;
    this.diagnosisCurrentId = 1;
    this.prognosisCurrentId = 1;
    this.radiationPlanCurrentId = 1;
    this.biomarkerCurrentId = 1;
    this.alertCurrentId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Patient management methods
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientId === patientId,
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const patient: Patient = { ...insertPatient, id, createdAt, updatedAt };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, updates: Partial<Patient>): Promise<Patient | undefined> {
    const existing = await this.getPatient(id);
    if (!existing) return undefined;

    const updated: Patient = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.patients.set(id, updated);
    return updated;
  }

  // Scan management methods
  async getScans(patientId: string): Promise<Scan[]> {
    return Array.from(this.scans.values()).filter(
      (scan) => scan.patientId === patientId,
    );
  }

  async getScan(id: number): Promise<Scan | undefined> {
    return this.scans.get(id);
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const id = this.scanCurrentId++;
    const uploadedAt = new Date();
    const scan: Scan = { ...insertScan, id, uploadedAt };
    this.scans.set(id, scan);
    return scan;
  }

  // Diagnosis management methods
  async getDiagnoses(patientId: string): Promise<Diagnosis[]> {
    return Array.from(this.diagnoses.values()).filter(
      (diagnosis) => diagnosis.patientId === patientId,
    );
  }

  async getDiagnosis(id: number): Promise<Diagnosis | undefined> {
    return this.diagnoses.get(id);
  }

  async createDiagnosis(insertDiagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const id = this.diagnosisCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const diagnosis: Diagnosis = { ...insertDiagnosis, id, createdAt, updatedAt };
    this.diagnoses.set(id, diagnosis);
    return diagnosis;
  }

  // Prognosis management methods
  async getPrognoses(patientId: string): Promise<Prognosis[]> {
    return Array.from(this.prognoses.values()).filter(
      (prognosis) => prognosis.patientId === patientId,
    );
  }

  async getPrognosis(id: number): Promise<Prognosis | undefined> {
    return this.prognoses.get(id);
  }

  async createPrognosis(insertPrognosis: InsertPrognosis): Promise<Prognosis> {
    const id = this.prognosisCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const prognosis: Prognosis = { ...insertPrognosis, id, createdAt, updatedAt };
    this.prognoses.set(id, prognosis);
    return prognosis;
  }

  // Radiation plan management methods
  async getRadiationPlans(patientId: string): Promise<RadiationPlan[]> {
    return Array.from(this.radiationPlans.values()).filter(
      (plan) => plan.patientId === patientId,
    );
  }

  async getRadiationPlan(id: number): Promise<RadiationPlan | undefined> {
    return this.radiationPlans.get(id);
  }

  async createRadiationPlan(insertPlan: InsertRadiationPlan): Promise<RadiationPlan> {
    const id = this.radiationPlanCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const plan: RadiationPlan = { ...insertPlan, id, createdAt, updatedAt };
    this.radiationPlans.set(id, plan);
    return plan;
  }

  // Biomarker management methods
  async getBiomarkers(patientId: string): Promise<Biomarker[]> {
    return Array.from(this.biomarkers.values()).filter(
      (biomarker) => biomarker.patientId === patientId,
    );
  }

  async getBiomarker(id: number): Promise<Biomarker | undefined> {
    return this.biomarkers.get(id);
  }

  async createBiomarker(insertBiomarker: InsertBiomarker): Promise<Biomarker> {
    const id = this.biomarkerCurrentId++;
    const recordedAt = new Date();
    const biomarker: Biomarker = { ...insertBiomarker, id, recordedAt };
    this.biomarkers.set(id, biomarker);
    return biomarker;
  }

  // Alert management methods
  async getAlerts(patientId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(
      (alert) => alert.patientId === patientId,
    );
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertCurrentId++;
    const createdAt = new Date();
    const alert: Alert = { ...insertAlert, id, createdAt };
    this.alerts.set(id, alert);
    return alert;
  }

  async acknowledgeAlert(id: number): Promise<Alert | undefined> {
    const alert = await this.getAlert(id);
    if (!alert) return undefined;

    const updated: Alert = {
      ...alert,
      acknowledged: true,
    };
    this.alerts.set(id, updated);
    return updated;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any as a workaround for the SessionStore type issue

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Patient management methods
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.patientId, patientId));
    return patient;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db.insert(patients).values(insertPatient).returning();
    return patient;
  }

  async updatePatient(id: number, updates: Partial<Patient>): Promise<Patient | undefined> {
    const [updated] = await db
      .update(patients)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(patients.id, id))
      .returning();
    return updated;
  }

  // Scan management methods
  async getScans(patientId: string): Promise<Scan[]> {
    return await db.select().from(scans).where(eq(scans.patientId, patientId));
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db.insert(scans).values(insertScan).returning();
    return scan;
  }

  // Diagnosis management methods
  async getDiagnoses(patientId: string): Promise<Diagnosis[]> {
    return await db.select().from(diagnoses).where(eq(diagnoses.patientId, patientId));
  }

  async getDiagnosis(id: number): Promise<Diagnosis | undefined> {
    const [diagnosis] = await db.select().from(diagnoses).where(eq(diagnoses.id, id));
    return diagnosis;
  }

  async createDiagnosis(insertDiagnosis: InsertDiagnosis): Promise<Diagnosis> {
    const [diagnosis] = await db.insert(diagnoses).values(insertDiagnosis).returning();
    return diagnosis;
  }

  // Prognosis management methods
  async getPrognoses(patientId: string): Promise<Prognosis[]> {
    return await db.select().from(prognoses).where(eq(prognoses.patientId, patientId));
  }

  async getPrognosis(id: number): Promise<Prognosis | undefined> {
    const [prognosis] = await db.select().from(prognoses).where(eq(prognoses.id, id));
    return prognosis;
  }

  async createPrognosis(insertPrognosis: InsertPrognosis): Promise<Prognosis> {
    const [prognosis] = await db.insert(prognoses).values(insertPrognosis).returning();
    return prognosis;
  }

  // Radiation plan management methods
  async getRadiationPlans(patientId: string): Promise<RadiationPlan[]> {
    return await db.select().from(radiationPlans).where(eq(radiationPlans.patientId, patientId));
  }

  async getRadiationPlan(id: number): Promise<RadiationPlan | undefined> {
    const [plan] = await db.select().from(radiationPlans).where(eq(radiationPlans.id, id));
    return plan;
  }

  async createRadiationPlan(insertPlan: InsertRadiationPlan): Promise<RadiationPlan> {
    const [plan] = await db.insert(radiationPlans).values(insertPlan).returning();
    return plan;
  }

  // Biomarker management methods
  async getBiomarkers(patientId: string): Promise<Biomarker[]> {
    return await db.select().from(biomarkers).where(eq(biomarkers.patientId, patientId));
  }

  async getBiomarker(id: number): Promise<Biomarker | undefined> {
    const [biomarker] = await db.select().from(biomarkers).where(eq(biomarkers.id, id));
    return biomarker;
  }

  async createBiomarker(insertBiomarker: InsertBiomarker): Promise<Biomarker> {
    const [biomarker] = await db.insert(biomarkers).values(insertBiomarker).returning();
    return biomarker;
  }

  // Alert management methods
  async getAlerts(patientId: string): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.patientId, patientId));
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  async acknowledgeAlert(id: number): Promise<Alert | undefined> {
    const [updated] = await db
      .update(alerts)
      .set({ acknowledged: true })
      .where(eq(alerts.id, id))
      .returning();
    return updated;
  }
}

// Use MemStorage for development/testing
export const storage = new MemStorage();

// Add a demo user for testing
(async () => {
  await storage.createUser({
    username: 'demo',
    password: 'password',
    fullName: 'Demo Doctor',
    title: 'Oncologist',
    profileImage: 'https://ui-avatars.com/api/?name=Demo+Doctor&background=0D47A1&color=fff'
  });
})();
