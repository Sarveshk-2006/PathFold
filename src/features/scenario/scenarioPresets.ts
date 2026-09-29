import type { ScenarioConfig } from './scenarioTypes';

export const scenarioPresets: ScenarioConfig[] = [
  {
    id: 'preset-budget-drop',
    name: 'What if my budget drops to ₹4L?',
    description: 'Test what happens if family budget drops from ₹6.0L to ₹4.0L due to sudden financial constraints.',
    type: 'BUDGET_REDUCTION',
    budgetOverride: 400000,
  },
  {
    id: 'preset-entrance-fail',
    name: "What if I don't clear the entrance exam?",
    description: 'Test what happens if JEE Main / Advanced or NEET rank cutoff is missed at the entrance exam gate.',
    type: 'ENTRANCE_FAILURE',
    entranceCleared: false,
  },
  {
    id: 'preset-academic-drop',
    name: 'What if my Board marks are lower (75%)?',
    description: 'Test what happens if Class 12 board percentage is 75% instead of expected 88%.',
    type: 'ACADEMIC_CHANGE',
    academicScoreOverride: 75,
  },
  {
    id: 'preset-no-loan',
    name: 'What if I cannot take an education loan?',
    description: 'Test what happens if education loan is disabled and all degree expenses must fit family budget + scholarships.',
    type: 'NO_LOAN',
    loanAllowed: false,
  },
  {
    id: 'preset-location-pune',
    name: 'What if I need to stay in my home city (Pune)?',
    description: 'Test what happens if location is restricted strictly to Pune, filtering out outstation institutes.',
    type: 'LOCATION_CONSTRAINT',
    locationConstraint: 'Pune',
  },
  {
    id: 'preset-pathway-unavailable',
    name: 'What if B.Tech CSE is unavailable?',
    description: 'Test what happens if primary target degree is unavailable or cutoffs are missed.',
    type: 'PATHWAY_UNAVAILABLE',
    pathwayUnavailableId: 'pathway-btech-cse',
  },
];
