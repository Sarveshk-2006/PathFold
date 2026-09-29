import type { StudentProfile, Evidence } from '../../types/index';

export type ScenarioType =
  | 'BUDGET_REDUCTION'
  | 'ENTRANCE_FAILURE'
  | 'ACADEMIC_CHANGE'
  | 'NO_LOAN'
  | 'LOCATION_CONSTRAINT'
  | 'PATHWAY_UNAVAILABLE'
  | 'GOAL_CHANGE';

export interface ScenarioChange {
  field: string;
  previousValue: string | number | boolean;
  newValue: string | number | boolean;
  reason: string;
}

export interface ScenarioConfig {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  budgetOverride?: number;
  entranceCleared?: boolean;
  academicScoreOverride?: number;
  loanAllowed?: boolean;
  locationConstraint?: string;
  pathwayUnavailableId?: string;
  goalOverride?: string;
}

export interface ScenarioAffectedItem {
  id: string;
  name: string;
  type: 'pathway' | 'institution';
  reason?: string;
  statusChange?: string;
}

export interface ScenarioResult {
  scenarioId: string;
  name: string;
  type: ScenarioType;
  changes: ScenarioChange[];
  baselineProfile: StudentProfile;
  modifiedProfile: StudentProfile;

  removedOptions: ScenarioAffectedItem[];
  affectedOptions: ScenarioAffectedItem[];
  stillOpenOptions: ScenarioAffectedItem[];
  newlyConditional: ScenarioAffectedItem[];

  financialImpact: {
    previousGap: number;
    newGap: number;
    gapDiff: number;
    previousLoan: number;
    newLoan: number;
    explanation: string;
  };

  alternativeRoutes: {
    id: string;
    title: string;
    stream: string;
    durationYears: number;
    totalCostEstimate: number;
    description: string;
  }[];

  recommendations: string[];
  assumptions: string[];
  evidence: Evidence;
}
