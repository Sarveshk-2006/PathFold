import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { demoStudent, allPathways, colleges } from '@/data';
import { formatCurrency } from '@/utils';
import { scenarioPresets } from '@/features/scenario/scenarioPresets';
import { evaluateScenario } from '@/features/scenario/scenarioEngine';
import type { ScenarioConfig, ScenarioResult } from '@/features/scenario/scenarioTypes';
import {
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Layers,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ScenariosPage() {
  const navigate = useNavigate();
  const [activePresetId, setActivePresetId] = useState<string>('preset-budget-drop');

  // Interactive control states
  const [customBudget, setCustomBudget] = useState<number>(400000);
  const [customEntranceCleared, setCustomEntranceCleared] = useState<boolean>(false);
  const [customAcademicScore, setCustomAcademicScore] = useState<number>(88);
  const [customLoanAllowed, setCustomLoanAllowed] = useState<boolean>(true);
  const [customLocationConstraint, setCustomLocationConstraint] = useState<string>('');

  const currentPreset = scenarioPresets.find((p) => p.id === activePresetId) || scenarioPresets[0];

  // Build active scenario config
  let activeConfig: ScenarioConfig = { ...currentPreset };
  if (activePresetId === 'preset-budget-drop') {
    activeConfig.budgetOverride = customBudget;
  } else if (activePresetId === 'preset-entrance-fail') {
    activeConfig.entranceCleared = customEntranceCleared;
  } else if (activePresetId === 'preset-academic-drop') {
    activeConfig.academicScoreOverride = customAcademicScore;
  } else if (activePresetId === 'preset-no-loan') {
    activeConfig.loanAllowed = customLoanAllowed;
  } else if (activePresetId === 'preset-location-pune') {
    activeConfig.locationConstraint = customLocationConstraint || 'Pune';
  }

  // Run pure deterministic scenario engine
  const scenarioResult: ScenarioResult = evaluateScenario(demoStudent, activeConfig, allPathways, colleges);

  const handleResetToBaseline = () => {
    setActivePresetId('preset-budget-drop');
    setCustomBudget(600000);
    setCustomEntranceCleared(true);
    setCustomAcademicScore(88);
    setCustomLoanAllowed(true);
    setCustomLocationConstraint('');
  };

  return (
    <div className="page-container space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">What-If Decision Simulator</h1>
            <Badge variant="navy" size="sm">Phase 3 Scenario Engine</Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Test what happens when reality shifts (budget shocks, missed exam ranks, or location constraints) without risking your baseline plan.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetToBaseline}
          className="gap-1.5 text-neutral-600 border-neutral-300 shrink-0 cursor-pointer"
          id="reset-scenario-btn"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Baseline
        </Button>
      </div>


      {/* Section A: Baseline Profile Overview */}
      <Card className="bg-navy-900 text-white border-navy-800 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-success-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-300 block">
                  Current Baseline Profile
                </span>
                <h3 className="text-base font-bold text-white">
                  {demoStudent.name} (Class {demoStudent.class}, {demoStudent.overallPercentage}% CBSE)
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-navy-200">
              <div>
                <span className="text-navy-400 block font-medium">Family Budget</span>
                <span className="font-bold text-white">{formatCurrency(demoStudent.budgetINR)}</span>
              </div>
              <span className="text-navy-700">|</span>
              <div>
                <span className="text-navy-400 block font-medium">Target Stream</span>
                <span className="font-bold text-white">PCM Science</span>
              </div>
              <span className="text-navy-700">|</span>
              <div>
                <span className="text-navy-400 block font-medium">Primary Goal</span>
                <span className="font-bold text-white">Software / AI Engineer</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B: Scenario Preset Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Select What-If Scenario Preset to Test:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarioPresets.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                onClick={() => setActivePresetId(preset.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 relative ${
                  isSelected
                    ? 'bg-white border-navy-900 shadow-md ring-1 ring-navy-800'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={isSelected ? 'navy' : 'outline'} size="sm">
                    {preset.type.replace('_', ' ')}
                  </Badge>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-navy-600 animate-ping" />}
                </div>
                <h4 className="text-sm font-bold text-neutral-900 leading-snug">{preset.name}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{preset.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section B.2: Interactive Scenario Controls */}
      <Card className="bg-neutral-50 border-neutral-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-navy-700" />
              Adjust Scenario Condition Controls ({scenarioResult.name}):
            </span>
          </div>

          {activePresetId === 'preset-budget-drop' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-800">
                <span>Reduced Family Budget:</span>
                <span className="text-navy-900 font-extrabold">{formatCurrency(customBudget)}</span>
              </div>
              <input
                type="range"
                min={200000}
                max={1000000}
                step={50000}
                value={customBudget}
                onChange={(e) => setCustomBudget(Number(e.target.value))}
                className="w-full accent-navy-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-semibold">
                <span>₹2.0 Lakh (Tight)</span>
                <span>Baseline: ₹6.0L</span>
                <span>₹10.0 Lakh (Expanded)</span>
              </div>
            </div>
          )}

          {activePresetId === 'preset-entrance-fail' && (
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>JEE / NEET Entrance Exam Gate Status:</span>
              <button
                onClick={() => setCustomEntranceCleared(!customEntranceCleared)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  !customEntranceCleared
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-success-100 text-success-900 border-success-300'
                }`}
              >
                {!customEntranceCleared ? '⚠️ Gate Missed / Uncleared' : '✅ Gate Cleared'}
              </button>
            </div>
          )}

          {activePresetId === 'preset-academic-drop' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-neutral-800">
                <span>Class 12 Actual Board Percentage:</span>
                <span className="text-navy-900 font-extrabold">{customAcademicScore}%</span>
              </div>
              <input
                type="range"
                min={55}
                max={95}
                step={1}
                value={customAcademicScore}
                onChange={(e) => setCustomAcademicScore(Number(e.target.value))}
                className="w-full accent-navy-800 cursor-pointer"
              />
            </div>
          )}

          {activePresetId === 'preset-no-loan' && (
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Allow Education Loan Funding:</span>
              <button
                onClick={() => setCustomLoanAllowed(!customLoanAllowed)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  !customLoanAllowed
                    ? 'bg-danger-100 text-danger-900 border-danger-300'
                    : 'bg-success-100 text-success-900 border-success-300'
                }`}
              >
                {!customLoanAllowed ? '❌ No Education Loan' : '✅ Loan Allowed'}
              </button>
            </div>
          )}

          {activePresetId === 'preset-location-pune' && (
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Restricted Location Constraint:</span>
              <input
                type="text"
                value={customLocationConstraint || 'Pune'}
                onChange={(e) => setCustomLocationConstraint(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-800 bg-white"
                placeholder="Enter city (e.g. Pune)"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section C: WHAT CHANGED? Panel */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            WHAT CHANGED? ({scenarioResult.name})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarioResult.changes.map((c, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                {c.field} Shift
              </span>
              <p className="font-bold text-neutral-900">
                {c.previousValue} → <span className="text-amber-900 font-extrabold">{c.newValue}</span>
              </p>
              <p className="text-[11px] text-neutral-500">{c.reason}</p>
            </div>
          ))}

          {/* Financial summary card */}
          <div className="bg-white p-3 rounded-lg border border-amber-200 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Funding Gap Consequence
            </span>
            <p className="font-bold text-navy-900">
              Previous Gap: {formatCurrency(scenarioResult.financialImpact.previousGap)} →{' '}
              <span className="text-danger-600 font-extrabold">
                New Gap: {formatCurrency(scenarioResult.financialImpact.newGap)}
              </span>
            </p>
            <p className="text-[11px] text-neutral-500">{scenarioResult.financialImpact.explanation}</p>
          </div>
        </div>
      </div>

      {/* Section C.2: WHY DID THIS CHANGE? Panel */}
      <Card id="scenario-why-changed">
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-navy-700" />
              WHY DID THIS CHANGE? (Deterministic Cause & Effect)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Exact requirement and cost differences evaluated by evaluation & finance engines.
            </p>
          </div>

          {/* Affected & Removed Options Breakdown */}
          <div className="space-y-3">
            {scenarioResult.removedOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-danger-700 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-danger-500" />
                  Constrained / Removed Options ({scenarioResult.removedOptions.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scenarioResult.removedOptions.map((item) => (
                    <div key={item.id} className="bg-danger-50/50 p-3 rounded-xl border border-danger-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-danger-900">{item.name}</span>
                        <Badge variant="danger" size="sm">{item.type}</Badge>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scenarioResult.affectedOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Pathways & Institutions Requiring Additional Funding / Exam Gate ({scenarioResult.affectedOptions.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scenarioResult.affectedOptions.map((item) => (
                    <div key={item.id} className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950">{item.name}</span>
                        <Badge variant="warning" size="sm">{item.statusChange || item.type}</Badge>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scenarioResult.stillOpenOptions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs font-bold text-success-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success-600" />
                  Routes Still Open Under Current Constraints ({scenarioResult.stillOpenOptions.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {scenarioResult.stillOpenOptions.map((item) => (
                    <Badge key={item.id} variant="success" size="sm">
                      ✓ {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section C.3: Surfaced Structured Alternative Routes */}
      <Card id="scenario-alternatives">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-navy-700" />
                Surfaced Resilient Alternative Routes
              </h3>
              <p className="text-xs text-neutral-500">
                Alternative pathways preserved from structured local mock data
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/plan-bc')}
              id="view-plan-bc-cta"
            >
              Open Plan B / C Tree
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioResult.alternativeRoutes.map((alt) => (
              <div key={alt.id} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900">{alt.title}</span>
                  <Badge variant="navy" size="sm">{alt.stream}</Badge>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{alt.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200">
                  <span>⏱ {alt.durationYears} Years</span>
                  <span>From {formatCurrency(alt.totalCostEstimate, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assumptions & Trust Section */}
      <div className="p-3.5 bg-neutral-100 rounded-xl border border-neutral-200 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
        <span>💡 <strong>Evidence Status:</strong> Prototype scenario diff derived from baseline recalculations.</span>
        <span>📌 No AI chatbot or LLM text generation used in decision logic</span>
      </div>
    </div>
  );
}
