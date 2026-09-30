import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { demoStudent } from '@/data';
import { formatCurrency } from '@/utils';
import { generatePlanTree, type PlanStatus } from '@/features/plans/planEngine';
import { scenarioPresets } from '@/features/scenario/scenarioPresets';
import { evaluateScenario } from '@/features/scenario/scenarioEngine';
import {
  Shield,
  ArrowRight,
  GitBranch,
  Network,
  RotateCcw,
} from 'lucide-react';

const statusBadgeVariants: Record<PlanStatus, 'navy' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'> = {
  ACTIVE: 'navy',
  CURRENTLY_SELECTED: 'navy',
  ALTERNATIVE: 'outline',
  TRIGGERED: 'warning',
  AFFECTED: 'danger',
  UNAVAILABLE: 'ghost',
};

export function PlanBCPage() {
  const [activeScenarioPreset, setActiveScenarioPreset] = useState<string>('none');

  const selectedPresetConfig = scenarioPresets.find((p) => p.id === activeScenarioPreset);
  const activeScenarioResult = selectedPresetConfig
    ? evaluateScenario(demoStudent, selectedPresetConfig)
    : undefined;

  const planTree = generatePlanTree(demoStudent, 'pathway-btech-cse', activeScenarioResult);

  return (
    <div className="page-container space-y-6">
      {/* Page Header & Scenario Simulator Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">Plan B / Plan C Decision Tree</h1>
            <Badge variant="navy" size="sm">Phase 3 Dynamic Tree</Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Always preserve backup routes before committing. Plan B & C activate automatically when dependencies fail.
          </p>
        </div>

        {/* Quick Scenario Dependency Selector */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200 shadow-xs shrink-0 max-w-full">
          <GitBranch className="h-4 w-4 text-navy-700 shrink-0 ml-1" />
          <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">Test Trigger Condition:</span>
          <select
            value={activeScenarioPreset}
            onChange={(e) => setActiveScenarioPreset(e.target.value)}
            className="text-xs font-bold text-navy-900 bg-neutral-100 px-2.5 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-navy-500 cursor-pointer max-w-[210px] truncate"
          >
            <option value="none">Baseline Plan (No Trigger)</option>
            <option value="preset-entrance-fail">Simulate JEE Gate Missed (Trigger Plan B)</option>
            <option value="preset-budget-drop">Simulate Budget Drop to ₹4L (Trigger Plan C)</option>
          </select>
          {activeScenarioPreset !== 'none' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveScenarioPreset('none')}
              title="Reset to Baseline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>


      {/* Primary Goal & Dependency Summary */}
      <div className="rounded-xl bg-navy-900 text-white p-5 space-y-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-success-400" />
          <h2 className="text-base font-bold text-white">
            Primary Target: {planTree.primaryGoal} ({planTree.baselineStudentName})
          </h2>
        </div>
        <p className="text-xs text-navy-200 leading-relaxed">{planTree.dependencySummary}</p>
      </div>

      {/* Plan A -> Plan B -> Plan C Decision Tree Stack */}
      <div className="space-y-4 relative">
        {planTree.plans.map((plan, idx) => (
          <div key={plan.pathwayId} className="relative">
            {/* Connecting Dependency Arrow */}
            {idx > 0 && (
              <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-white border border-neutral-200 text-neutral-600 px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-navy-700 rotate-90" />
                  <span>{plan.triggerCondition}</span>
                </div>
              </div>
            )}

            <Card
              className={`transition-all ${
                plan.status === 'TRIGGERED'
                  ? 'border-warning-400 bg-warning-50/30 ring-2 ring-warning-300 shadow-md'
                  : plan.status === 'AFFECTED'
                  ? 'border-danger-300 bg-danger-50/20'
                  : plan.status === 'ACTIVE'
                  ? 'border-navy-400 bg-navy-50/30 shadow-sm'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              <CardContent className="pt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusBadgeVariants[plan.status]} size="sm">
                        {plan.planLabel}
                      </Badge>
                      <h3 className="text-base font-bold text-neutral-900">{plan.name}</h3>
                      <Badge variant="outline" size="sm">
                        Status: {plan.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Estimated Cost Range
                    </span>
                    <span className="text-sm font-extrabold text-navy-900">
                      {formatCurrency(plan.totalCostRangeINR[0], true)} – {formatCurrency(plan.totalCostRangeINR[1], true)}
                    </span>
                  </div>
                </div>

                {/* Plan Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200/80">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Duration & Stream</span>
                    <span className="font-bold text-neutral-800">
                      ⏱ {plan.durationYears} Years • {plan.stream}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200/80">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Prerequisite Evaluation</span>
                    <span className="font-medium text-neutral-700">{plan.eligibilityReason}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200/80">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Preserved Career Roles</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {plan.preservedCareers.map((c) => (
                        <span key={c} className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nodes Preview Sequence */}
                <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-400 shrink-0">Gates:</span>
                  {plan.nodesPreview.map((nodeLabel, nIdx) => (
                    <span key={nIdx} className="flex items-center gap-1 shrink-0">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-medium">
                        {nodeLabel}
                      </span>
                      {nIdx < plan.nodesPreview.length - 1 && <ArrowRight className="h-3 w-3 text-neutral-300" />}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Section: Decision Dependency Map */}
      <Card id="plan-dependency-map">
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Network className="h-4 w-4 text-navy-700" />
              Decision Dependency Propagation Map
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              How a single condition change propagates through institutions, funding gaps, and backup plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Chain 1: Budget Dependency */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <span className="font-bold text-navy-900 uppercase tracking-wider block border-b pb-1">
                Chain 1: Budget → Affordability Propagation
              </span>
              <div className="space-y-1.5 text-neutral-700">
                <p>1. <strong>Budget Change:</strong> Family budget drops from ₹6.0L → ₹4.0L</p>
                <p>2. <strong>Institution Impact:</strong> IIT Bombay (₹12L) & PICT (₹10.68L) exceed budget limit</p>
                <p>3. <strong>Funding Gap:</strong> Net gap increases by ₹2.0L</p>
                <p>4. <strong>Backup Trigger:</strong> Triggers Plan C (BCA / B.Sc CS) to restore zero-gap feasibility</p>
              </div>
            </div>

            {/* Chain 2: Entrance Dependency */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <span className="font-bold text-navy-900 uppercase tracking-wider block border-b pb-1">
                Chain 2: Exam Gate → Pathway Trigger
              </span>
              <div className="space-y-1.5 text-neutral-700">
                <p>1. <strong>Entrance Result:</strong> JEE Advanced gate cutoff not achieved</p>
                <p>2. <strong>Pathway Status:</strong> Plan A (IIT B.Tech CSE) status becomes AFFECTED</p>
                <p>3. <strong>Branch Pivot:</strong> Triggers Plan B (B.Sc CS / Data Science via CUET)</p>
                <p>4. <strong>Career Preservation:</strong> Preserves 90% software engineering career outcomes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
