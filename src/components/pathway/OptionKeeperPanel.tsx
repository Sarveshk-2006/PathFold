import { useState } from 'react';
import { ShieldAlert, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { calculateOptionScore, evaluateRiskAndDependencies } from '@/utils';
import { demoStudent } from '@/data/students/aarav';
import { pcmPathways } from '@/data/pathways/pcm';
import { pcbPathways } from '@/data/pathways/pcb';
import { commercePathways } from '@/data/pathways/commerce';

export function OptionKeeperPanel() {
  const [activeStream, setActiveStream] = useState<'PCM' | 'PCB' | 'Commerce'>('PCM');

  const selectedPathway =
    activeStream === 'PCM'
      ? pcmPathways[0]
      : activeStream === 'PCB'
      ? pcbPathways[0]
      : commercePathways[0];

  const optionData = calculateOptionScore(selectedPathway, demoStudent);
  const riskData = evaluateRiskAndDependencies(selectedPathway);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-6">
      {/* Header & Stream Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900">Option Keeper & Flexibility Engine</h3>
            <Badge variant="navy" size="sm">Phase 1 Logic</Badge>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Preserve high-value backup routes and prevent premature non-reversible career lock-in.
          </p>
        </div>

        {/* Stream selector buttons */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
          {(['PCM', 'PCB', 'Commerce'] as const).map((stream) => (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeStream === stream
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {stream === 'PCM' ? 'PCM (Science Tech)' : stream === 'PCB' ? 'PCB (Medical Bio)' : 'Commerce & Finance'}
            </button>
          ))}
        </div>
      </div>

      {/* Dependency Warning Banner (if PCB or hyper-specialized) */}
      {riskData.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Critical Subject Dependency Warning
            </h4>
            {riskData.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-800 leading-relaxed">
                {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Option Score Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Option Score */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Option Score</span>
            <Badge
              variant={
                optionData.flexibilityLevel === 'High'
                  ? 'success'
                  : optionData.flexibilityLevel === 'Medium'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {optionData.flexibilityLevel} Flexibility
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900">{optionData.score}</span>
            <span className="text-xs text-neutral-400 font-medium">/ 100</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed pt-1 border-t border-neutral-200/60">
            {optionData.explanation}
          </p>
        </div>

        {/* Metric 2: Options Preserved at Decision Gates */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Options Preserved
          </span>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
              <span className="text-xl font-bold text-navy-900">{optionData.optionsAtClass12}</span>
              <span className="text-[10px] text-neutral-500 block">After Class 12</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
              <span className="text-xl font-bold text-navy-900">{optionData.optionsAfterUG}</span>
              <span className="text-[10px] text-neutral-500 block">After UG Degree</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <Layers className="h-3.5 w-3.5 text-navy-600" />
            <span>High options = safer backup routes</span>
          </div>
        </div>

        {/* Metric 3: Open vs Locked Domains */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Domain Access Impact
          </span>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-success-700 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success-600" /> Open Domains
              </span>
              <span className="font-bold">{optionData.openDomains.length}</span>
            </div>
            <div className="flex items-center justify-between text-danger-700 font-medium">
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-danger-500" /> Locked Out
              </span>
              <span className="font-bold">{optionData.lockedOutDomains.length}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-200/60">
            <span className="text-[10px] text-neutral-400 block mb-1">Locked out domains:</span>
            <div className="flex flex-wrap gap-1">
              {optionData.lockedOutDomains.map((d, i) => (
                <span key={i} className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backup Routes Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-navy-700" />
            Backup Routes Matrix ({activeStream} Stream)
          </h4>
          <span className="text-xs text-neutral-500">Deterministic decision gates</span>
        </div>

        <div className="space-y-3">
          {optionData.backupRoutes.map((route, idx) => (
            <div key={idx} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2">
                <span className="text-xs font-bold text-navy-900">
                  Target Gate: <span className="text-neutral-700 font-semibold">{route.targetGate}</span>
                </span>
                <Badge variant="warning" size="sm">
                  {route.triggerScenario}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {/* Primary */}
                <div className="bg-white p-3 rounded-lg border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Primary Target Path
                  </span>
                  <p className="font-bold text-navy-900">{route.primaryPath}</p>
                </div>

                {/* Backup 1 */}
                <div className="bg-white p-3 rounded-lg border border-amber-200 bg-amber-50/40 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                    Backup Route 1
                  </span>
                  <p className="font-semibold text-neutral-800">{route.backupPath1}</p>
                </div>

                {/* Backup 2 */}
                <div className="bg-white p-3 rounded-lg border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Backup Route 2
                  </span>
                  <p className="font-semibold text-neutral-800">{route.backupPath2}</p>
                </div>

                {/* Fallback Career */}
                <div className="bg-success-50/60 p-3 rounded-lg border border-success-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-success-800 block">
                    Preserved Career
                  </span>
                  <p className="font-bold text-success-900 flex items-center justify-between">
                    {route.fallbackCareer}
                    <ArrowRight className="h-3.5 w-3.5 text-success-700" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
