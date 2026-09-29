// ─── Student Types ───────────────────────────────────────────────
export type BoardType = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'IGCSE';
export type ViewMode = 'student' | 'parent';

export interface AcademicSubject {
  name: string;
  score: number;
  outOf: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  class: number;
  location: string;
  state: string;
  board: BoardType;
  academics: AcademicSubject[];
  overallPercentage: number;
  interests: string[];
  careerPreferences: string[];
  locationPreference: string;
  abroadOpen: boolean;
  budgetINR: number;
  priorities: string[];
  avatar?: string;
}

// ─── Evidence & Trust Model ──────────────────────────────────────
export type EvidenceStatus = 'verified' | 'prototype' | 'needs_verification';

export interface Evidence {
  sourceName: string;
  sourceType: string;
  sourceUrl?: string;
  verifiedDate?: string;
  confidence: EvidenceStatus;
  notes?: string;
}

// ─── Pathway Types ───────────────────────────────────────────────
export type PathwayStage =
  | 'class10'
  | 'class12stream'
  | 'entranceexam'
  | 'undergrad'
  | 'postgrad'
  | 'career';

export interface PathwayNode {
  id: string;
  label: string;
  stage: PathwayStage;
  description: string;
  duration?: string;
  averageCostINR?: number;
  requirements?: string[];
  successRate?: number;
  alternativeIds?: string[];
}

export interface PathwayEdge {
  from: string;
  to: string;
  condition?: string;
  probability?: number;
}

export interface Pathway {
  id: string;
  name: string;
  shortName: string;
  description: string;
  stream: string;
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  totalCostRangeINR: [number, number];
  durationYears: number;
  careerOutcomes: string[];
  requiredMinScore?: number;
  tags: string[];

  // Phase 2 Extensions
  tuitionEstimate?: number;
  livingEstimate?: number;
  otherCostsEstimate?: number;
  totalCostEstimate?: number;
  entranceRequirements?: string[];
  academicRequirements?: string[];
  careers?: string[];
  alternatives?: string[];
  institutions?: string[];
  fundingOptions?: string[];
  evidence?: Evidence;
  assumptions?: string[];
}

// ─── Career Types ────────────────────────────────────────────────
export interface CareerRole {
  id: string;
  title: string;
  domain: string;
  medianSalaryINR: number;
  salaryRangeINR: [number, number];
  growthOutlook: 'high' | 'medium' | 'low';
  requiredEducation: string[];
  keySkills: string[];
  description: string;
  isAbroad?: boolean;
}

// ─── Institution Types ───────────────────────────────────────────
export type InstitutionType =
  | 'government'
  | 'private'
  | 'deemed'
  | 'autonomous'
  | 'public_technical'
  | 'state';

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  city: string;
  state: string;
  country: string;
  programme: string;
  durationYears: number;
  tuitionFeeAnnual: number;
  hostelCostAnnual: number;
  livingCostAnnual: number;
  otherMandatoryCostsAnnual: number;
  totalCostEstimate: number;
  admissionRequirements: string[];
  entranceExam: string;
  scholarships: string[];
  evidence: Evidence;
  assumptions: string[];
  ranking?: number;
  rating?: number;
  location?: string;
}

// ─── Finance Types ───────────────────────────────────────────────
export interface FinanceProfile {
  totalEducationCost: number;
  familyContribution: number;
  scholarshipAmount: number;
  governmentSupport: number;
  loanAmount: number;
  otherFunding: number;
  fundingGap: number;
}

export interface LoanOption {
  id: string;
  provider: string;
  annualInterestRate: number;
  maxLoanAmount: number;
  tenureYears: number;
  processingFee: number;
  moratoriumMonths: number;
  notes: string;
  evidence: Evidence;
  assumptions: string[];
  requiresCollateral?: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  eligibility: string[];
  deadline: string;
  applicablePathways: string[];
  evidence: Evidence;
  assumptions: string[];
  renewable?: boolean;
  amountINR?: number;
}

// ─── Scenario Types ──────────────────────────────────────────────
export interface Scenario {
  id: string;
  name: string;
  description: string;
  changes: Record<string, unknown>;
  impact: string[];
}

// ─── UI State Types ──────────────────────────────────────────────
export interface OnboardingData {
  name: string;
  class: number;
  location: string;
  state: string;
  board: BoardType;
  academics: AcademicSubject[];
  interests: string[];
  careerPreferences: string[];
  abroadOpen: boolean;
  budgetINR: number;
  priorities: string[];
}
