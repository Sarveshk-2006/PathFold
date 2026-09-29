import type { StudentProfile, Pathway } from '@/types';

export interface PrerequisiteCheck {
  subject: string;
  met: boolean;
  detail: string;
}

export interface BudgetAnalysis {
  feasible: boolean;
  maxCost: number;
  studentBudget: number;
  deficitOrSurplus: number;
  statusText: string;
}

export interface EligibilityResult {
  status: 'eligible' | 'conditional' | 'ineligible';
  score: number; // 0 to 100
  reason: string;
  missingRequirements: string[];
  prerequisiteChecks: PrerequisiteCheck[];
  budgetAnalysis: BudgetAnalysis;
}

export interface BackupRoute {
  targetGate: string;
  triggerScenario: string;
  primaryPath: string;
  backupPath1: string;
  backupPath2: string;
  fallbackCareer: string;
  transitionDifficulty: 'Easy' | 'Moderate' | 'Hard';
}

export interface OptionScoreResult {
  score: number; // 0 - 100
  flexibilityLevel: 'High' | 'Medium' | 'Low';
  explanation: string;
  optionsAtClass12: number;
  optionsAfterUG: number;
  openDomains: string[];
  lockedOutDomains: string[];
  backupRoutes: BackupRoute[];
}

export interface RiskAnalysisResult {
  riskLevel: 'High' | 'Medium' | 'Low';
  hardPrerequisites: string[];
  singlePointFailures: string[];
  builtInBranchPoints: string[];
  warnings: string[];
}

// ─── 1. Evaluate Pathway Eligibility ─────────────────────────────
export function evaluatePathwayEligibility(
  profile: StudentProfile,
  pathway: Pathway
): EligibilityResult {
  const missingRequirements: string[] = [];
  const prerequisiteChecks: PrerequisiteCheck[] = [];

  // Get student academic scores
  const mathSubject = profile.academics.find(a => a.name.toLowerCase().includes('math'));
  const scienceSubject = profile.academics.find(a => a.name.toLowerCase().includes('sci'));

  const mathScore = mathSubject ? mathSubject.score : 70;
  const scienceScore = scienceSubject ? scienceSubject.score : 70;

  // Stream requirement check
  const requiredStream = pathway.stream.toUpperCase();
  if (requiredStream.includes('PCM')) {
    const pcmMet = mathScore >= 60 && scienceScore >= 60;
    prerequisiteChecks.push({
      subject: 'Class 10 Science & Mathematics (60%+ required for PCM)',
      met: pcmMet,
      detail: pcmMet
        ? `Math: ${mathScore}%, Science: ${scienceScore}% (Prerequisites satisfied)`
        : `Math: ${mathScore}%, Science: ${scienceScore}% (Needs at least 60% in Science & Math)`,
    });
    if (!pcmMet) {
      missingRequirements.push('Class 10 Science & Math aggregate must be >= 60% for PCM stream.');
    }
  } else if (requiredStream.includes('PCB')) {
    const pcbMet = scienceScore >= 65;
    prerequisiteChecks.push({
      subject: 'Class 10 Science (65%+ required for PCB)',
      met: pcbMet,
      detail: pcbMet
        ? `Science: ${scienceScore}% (Prerequisite satisfied)`
        : `Science: ${scienceScore}% (Needs at least 65% in Science)`,
    });
    if (!pcbMet) {
      missingRequirements.push('Class 10 Science score must be >= 65% for PCB stream.');
    }
  } else {
    prerequisiteChecks.push({
      subject: 'Stream Prerequisites (Commerce / Humanities / Any)',
      met: true,
      detail: 'Open to all Class 10 graduates regardless of stream choice.',
    });
  }

  // Academic score threshold check
  const requiredMinScore = pathway.requiredMinScore ?? 60;
  const scoreMet = profile.overallPercentage >= requiredMinScore;
  prerequisiteChecks.push({
    subject: `Overall Academic Score (${requiredMinScore}% benchmark)`,
    met: scoreMet,
    detail: scoreMet
      ? `Your percentage (${profile.overallPercentage}%) meets the required benchmark (${requiredMinScore}%).`
      : `Your percentage (${profile.overallPercentage}%) is below the typical benchmark (${requiredMinScore}%).`,
  });

  if (!scoreMet) {
    missingRequirements.push(
      `Pathway typically requires an overall academic performance of at least ${requiredMinScore}%.`
    );
  }

  // Financial feasibility check
  const maxCost = pathway.totalCostRangeINR[1];
  const minCost = pathway.totalCostRangeINR[0];
  const feasible = profile.budgetINR >= minCost;
  const deficitOrSurplus = profile.budgetINR - maxCost;

  let statusText = '';
  if (profile.budgetINR >= maxCost) {
    statusText = `Fully feasible within your ₹${(profile.budgetINR / 100000).toFixed(1)} Lakh budget (Max estimated cost: ₹${(maxCost / 100000).toFixed(1)} Lakh).`;
  } else if (feasible) {
    statusText = `Partially within budget. Minimum cost (₹${(minCost / 100000).toFixed(1)} L) fits budget, but upper limit (₹${(maxCost / 100000).toFixed(1)} L) may require scholarships or education loans (Deficit: ₹${(Math.abs(deficitOrSurplus) / 100000).toFixed(1)} L).`;
  } else {
    statusText = `Budget deficit: Estimated minimum cost ₹${(minCost / 100000).toFixed(1)} L exceeds current budget of ₹${(profile.budgetINR / 100000).toFixed(1)} L. Scholarship / loan required.`;
    missingRequirements.push(`Requires financial support or loan of approx ₹${(Math.abs(profile.budgetINR - minCost) / 100000).toFixed(1)} Lakh.`);
  }

  const budgetAnalysis: BudgetAnalysis = {
    feasible,
    maxCost,
    studentBudget: profile.budgetINR,
    deficitOrSurplus,
    statusText,
  };

  // Determine overall status
  let status: 'eligible' | 'conditional' | 'ineligible' = 'eligible';
  if (missingRequirements.length === 0) {
    status = 'eligible';
  } else if (missingRequirements.length === 1 && scoreMet) {
    status = 'conditional';
  } else {
    status = 'ineligible';
  }

  // Calculate match score (0 - 100)
  let score = 70;
  if (status === 'eligible') score += 20;
  if (status === 'conditional') score += 10;
  if (profile.budgetINR >= maxCost) score += 10;

  // Bonus for interest match
  const matchesInterest = profile.interests.some(i =>
    pathway.tags.some(t => t.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(t.toLowerCase()))
  );
  if (matchesInterest) score += 10;

  score = Math.min(100, Math.max(30, score));

  let reason = '';
  if (status === 'eligible') {
    reason = `You meet all academic prerequisites and score benchmarks for ${pathway.shortName}.`;
  } else if (status === 'conditional') {
    reason = `Eligible with condition: ${missingRequirements[0]}`;
  } else {
    reason = `Does not satisfy core prerequisites: ${missingRequirements.join(' ')}`;
  }

  return {
    status,
    score,
    reason,
    missingRequirements,
    prerequisiteChecks,
    budgetAnalysis,
  };
}

// ─── 2. Calculate Option Score & Backup Flexibility ───────────────
export function calculateOptionScore(
  pathway: Pathway,
  _profile?: StudentProfile
): OptionScoreResult {
  const s = pathway.stream.toUpperCase();

  if (s.includes('PCM')) {
    return {
      score: 92,
      flexibilityLevel: 'High',
      explanation:
        'Taking PCM with Mathematics keeps 5 primary degree streams and over 14 career domains fully open post Class 12, including Engineering, CS, Data Science, Pure Math, Design, Finance, and Management.',
      optionsAtClass12: 5,
      optionsAfterUG: 4,
      openDomains: [
        'Software Engineering & AI',
        'Data Science & Analytics',
        'Fintech & Quantitative Finance',
        'Industrial & Product Design',
        'Management & Business (IPMAT/BBA)',
        'Pure Sciences & Research',
      ],
      lockedOutDomains: ['Medical Doctor (MBBS)', 'Clinical Health Sciences'],
      backupRoutes: [
        {
          targetGate: 'JEE Advanced / IIT Admission',
          triggerScenario: 'If JEE Advanced rank is not achieved',
          primaryPath: 'B.Tech CSE at IIT',
          backupPath1: 'B.Tech CSE at NIT / State Govt College (via JEE Main / CET)',
          backupPath2: 'B.Sc Computer Science / Data Science (CUET Merit)',
          fallbackCareer: 'Software Developer / Data Analyst',
          transitionDifficulty: 'Easy',
        },
        {
          targetGate: 'B.Tech Entrance Exams (General)',
          triggerScenario: 'If all engineering entrance exams fail or student loses interest in engineering',
          primaryPath: 'B.Tech Computer Science',
          backupPath1: 'BCA (Bachelor of Computer Applications)',
          backupPath2: 'B.Sc Statistics / Economics Honors',
          fallbackCareer: 'Tech Consultant / Business Analyst / Web Developer',
          transitionDifficulty: 'Easy',
        },
      ],
    };
  }

  if (s.includes('PCB')) {
    if (pathway.id.includes('mbbs')) {
      return {
        score: 48,
        flexibilityLevel: 'Low',
        explanation:
          'Targeting MBBS is hyper-specialized with a single high-competition gate (NEET-UG, ~5% success rate). Dropping Mathematics closes engineering, economics, and quantitative finance, but healthcare backups remain accessible.',
        optionsAtClass12: 3,
        optionsAfterUG: 2,
        openDomains: [
          'Clinical Medicine & Surgery',
          'Dental Surgery (BDS)',
          'Biotechnology & Genetics',
          'Pharmacy & Clinical Trials',
          'Healthcare Administration',
        ],
        lockedOutDomains: [
          'Engineering (B.Tech)',
          'Quantitative Finance & Actuarial',
          'Data Science & CS Honors (DU/Top Univs requiring Math)',
        ],
        backupRoutes: [
          {
            targetGate: 'NEET-UG Exam Gate',
            triggerScenario: 'If NEET-UG score is below MBBS cutoff rank',
            primaryPath: 'MBBS Medical Degree',
            backupPath1: 'B.Sc Biotechnology / Genetics (CUET / Merit)',
            backupPath2: 'B.Pharm (Pharmacy & Clinical Research)',
            fallbackCareer: 'Biotech R&D Analyst / Clinical Trial Manager / Pharmacist',
            transitionDifficulty: 'Moderate',
          },
          {
            targetGate: 'Clinical PG Entrance (NEET-PG)',
            triggerScenario: 'If clinical PG seat is delayed',
            primaryPath: 'MD / MS Clinical Specialization',
            backupPath1: 'Hospital Administration (MHA)',
            backupPath2: 'Medical Writing & Pharma Consulting',
            fallbackCareer: 'Healthcare Operations Manager / Medical Advisor',
            transitionDifficulty: 'Easy',
          },
        ],
      };
    }

    return {
      score: 75,
      flexibilityLevel: 'Medium',
      explanation:
        'B.Sc Biotechnology & Life Sciences offers balanced flexibility across lab research, biopharma, diagnostics, and regulatory science.',
      optionsAtClass12: 4,
      optionsAfterUG: 3,
      openDomains: ['Biotech R&D', 'Pharma Operations', 'Bioinformatics', 'Environmental Science', 'Healthcare Management'],
      lockedOutDomains: ['Engineering (B.Tech)', 'Clinical Surgery (MBBS without NEET)'],
      backupRoutes: [
        {
          targetGate: 'CUET Biotech Admission',
          triggerScenario: 'If top university B.Sc Biotech cutoff is missed',
          primaryPath: 'B.Sc Biotechnology',
          backupPath1: 'B.Sc Microbiology / Chemistry',
          backupPath2: 'B.Pharm (Bachelor of Pharmacy)',
          fallbackCareer: 'Quality Assurance Analyst / Lab Researcher',
          transitionDifficulty: 'Easy',
        },
      ],
    };
  }

  // Commerce / Any Stream
  return {
    score: 84,
    flexibilityLevel: 'High',
    explanation:
      'Commerce and Management pathways offer versatile career pivots across corporate finance, consulting, law, product design, and digital marketing without strict single-exam locks.',
    optionsAtClass12: 5,
    optionsAfterUG: 4,
    openDomains: [
      'Chartered Accountancy & Audit',
      'Corporate Law (CLAT / BA LLB)',
      'Management Consulting (IPMAT / IIM)',
      'Product & UX/UI Design',
      'Digital Business & E-Commerce',
    ],
    lockedOutDomains: ['Engineering (B.Tech)', 'Medical Doctor (MBBS)'],
    backupRoutes: [
      {
        targetGate: 'IPMAT / CLAT Entrance Gate',
        triggerScenario: 'If IPMAT or CLAT rank is not achieved',
        primaryPath: '5-Year Integrated IIM BBA+MBA or NLU BA LLB',
        backupPath1: 'B.Com Honors at Central / State University + CFA',
        backupPath2: 'BBA in Fintech / Digital Business at Top College',
        fallbackCareer: 'Financial Analyst / Corporate Legal Analyst / Product Associate',
        transitionDifficulty: 'Easy',
      },
    ],
  };
}

// ─── 3. Evaluate Risk and Dependencies ────────────────────────────
export function evaluateRiskAndDependencies(pathway: Pathway): RiskAnalysisResult {
  const hardPrerequisites: string[] = [];
  const singlePointFailures: string[] = [];
  const builtInBranchPoints: string[] = [];
  const warnings: string[] = [];

  const stream = pathway.stream.toUpperCase();

  if (stream.includes('PCM')) {
    hardPrerequisites.push('Class 11-12 Mathematics & Physics mandatory');
    hardPrerequisites.push('Minimum 60% aggregate in Class 10 Science & Math');

    if (pathway.id.includes('btech')) {
      singlePointFailures.push('JEE Main & Advanced entrance exam ranking gate');
      builtInBranchPoints.push('State CET engineering colleges (MHT-CET, KCET, WBJEE)');
      builtInBranchPoints.push('Direct admission B.Sc Computer Science / Data Science');
      builtInBranchPoints.push('BCA (Bachelor of Computer Applications)');
    }
  } else if (stream.includes('PCB')) {
    hardPrerequisites.push('Class 11-12 Biology & Chemistry mandatory');

    if (pathway.id.includes('mbbs')) {
      singlePointFailures.push('NEET-UG national entrance exam (Single-attempt gate with ~5% admission rate)');
      warnings.push('CRITICAL DEPENDENCY: Dropping Mathematics limits future pivots to engineering or quantitative finance.');
      warnings.push('HIGH RISK: High score requirement in NEET-UG. Ensure backup routes in BDS, B.Pharm, or Biotech are active.');
      builtInBranchPoints.push('BDS (Dental Surgery)');
      builtInBranchPoints.push('B.Pharm / Pharm.D (Pharmacy)');
      builtInBranchPoints.push('B.Sc Biotechnology / Bio-analytics');
    } else {
      builtInBranchPoints.push('B.Sc Microbiology / Biochemistry');
      builtInBranchPoints.push('Clinical Research & Regulatory Affairs');
    }
  } else {
    hardPrerequisites.push('Class 12 Completion in any recognized board');

    if (pathway.id.includes('ca')) {
      singlePointFailures.push('ICAI CA Intermediate & Final passing rate (~15-20%)');
      builtInBranchPoints.push('B.Com Honors + CFA Certification');
      builtInBranchPoints.push('Corporate Accounting & Financial Analysis');
    } else {
      builtInBranchPoints.push('CUET Merit admissions to DU, BHU, Jamia');
      builtInBranchPoints.push('Private university BBA / Law programs');
    }
  }

  let riskLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  if (pathway.id.includes('mbbs') || pathway.id.includes('iit')) {
    riskLevel = 'High';
  } else if (pathway.id.includes('bsc') || pathway.id.includes('bca')) {
    riskLevel = 'Low';
  }

  return {
    riskLevel,
    hardPrerequisites,
    singlePointFailures,
    builtInBranchPoints,
    warnings,
  };
}
