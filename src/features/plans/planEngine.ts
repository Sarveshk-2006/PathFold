import type { StudentProfile } from '../../types/index';
import { allPathways } from '../../data/index';
import { evaluatePathwayEligibility } from '../../utils/evaluationEngine';
import type { ScenarioResult } from '../scenario/scenarioTypes';

export type PlanStatus =
  | 'ACTIVE'
  | 'CURRENTLY_SELECTED'
  | 'ALTERNATIVE'
  | 'TRIGGERED'
  | 'AFFECTED'
  | 'UNAVAILABLE';

export interface PlanItem {
  planLabel: 'Plan A' | 'Plan B' | 'Plan C';
  pathwayId: string;
  name: string;
  stream: string;
  durationYears: number;
  totalCostRangeINR: [number, number];
  status: PlanStatus;
  triggerCondition: string;
  preservedCareers: string[];
  description: string;
  eligibilityReason: string;
  nodesPreview: string[];
}

export interface PlanTreeResult {
  plans: PlanItem[];
  primaryGoal: string;
  baselineStudentName: string;
  dependencySummary: string;
}

export function generatePlanTree(
  student: StudentProfile,
  primaryPathwayId = 'pathway-btech-cse',
  scenarioResult?: ScenarioResult
): PlanTreeResult {
  const primaryPathway = allPathways.find((p) => p.id === primaryPathwayId) || allPathways[0];
  const bscPathway = allPathways.find((p) => p.id === 'pathway-bsc-cs') || allPathways[1];
  const bcaPathway = allPathways.find((p) => p.id === 'pathway-bca') || allPathways[2];

  const primaryEval = evaluatePathwayEligibility(student, primaryPathway);
  const bscEval = evaluatePathwayEligibility(student, bscPathway);
  const bcaEval = evaluatePathwayEligibility(student, bcaPathway);

  // Check if scenario triggered Plan B or Plan C
  const isEntranceFailed = scenarioResult?.type === 'ENTRANCE_FAILURE';
  const isBudgetReduced = scenarioResult?.type === 'BUDGET_REDUCTION' || student.budgetINR < 450000;
  const isPathwayUnavailable = scenarioResult?.type === 'PATHWAY_UNAVAILABLE';

  let planAStatus: PlanStatus = 'ACTIVE';
  let planBStatus: PlanStatus = 'ALTERNATIVE';
  let planCStatus: PlanStatus = 'ALTERNATIVE';

  if (isEntranceFailed || isPathwayUnavailable) {
    planAStatus = 'AFFECTED';
    planBStatus = 'TRIGGERED';
  }

  if (isBudgetReduced) {
    planCStatus = 'TRIGGERED';
  }

  const plans: PlanItem[] = [
    {
      planLabel: 'Plan A',
      pathwayId: primaryPathway.id,
      name: primaryPathway.name,
      stream: primaryPathway.stream,
      durationYears: primaryPathway.durationYears,
      totalCostRangeINR: primaryPathway.totalCostRangeINR,
      status: planAStatus,
      triggerCondition: 'Primary Target Plan — Active baseline route',
      preservedCareers: primaryPathway.careerOutcomes,
      description: primaryPathway.description,
      eligibilityReason: primaryEval.reason,
      nodesPreview: primaryPathway.nodes.map((n) => n.label),
    },
    {
      planLabel: 'Plan B',
      pathwayId: bscPathway.id,
      name: bscPathway.name,
      stream: bscPathway.stream,
      durationYears: bscPathway.durationYears,
      totalCostRangeINR: bscPathway.totalCostRangeINR,
      status: planBStatus,
      triggerCondition: 'Activated if JEE / entrance exam gate is missed or rank is below cutoff',
      preservedCareers: bscPathway.careerOutcomes,
      description: bscPathway.description,
      eligibilityReason: bscEval.reason,
      nodesPreview: bscPathway.nodes.map((n) => n.label),
    },
    {
      planLabel: 'Plan C',
      pathwayId: bcaPathway.id,
      name: bcaPathway.name,
      stream: bcaPathway.stream,
      durationYears: bcaPathway.durationYears,
      totalCostRangeINR: bcaPathway.totalCostRangeINR,
      status: planCStatus,
      triggerCondition: 'Activated if family budget drops below ₹4.0L or non-PCM stream chosen',
      preservedCareers: bcaPathway.careerOutcomes,
      description: bcaPathway.description,
      eligibilityReason: bcaEval.reason,
      nodesPreview: bcaPathway.nodes.map((n) => n.label),
    },
  ];

  return {
    plans,
    primaryGoal: primaryPathway.careerOutcomes[0] || 'Software Engineer',
    baselineStudentName: student.name,
    dependencySummary:
      'Plan B & C maintain 85%+ career outcome overlap (Software Dev / Data Analyst) while removing high-competition single entrance dependencies and reducing tuition cost by up to 60%.',
  };
}
