import { X, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Layers, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { PathwayNodeData } from './FutureMapGraph';

interface NodeDetailDrawerProps {
  node: PathwayNodeData | null;
  onClose: () => void;
  onTestFailureScenario: (nodeId: string) => void;
  onResetFailureScenario: () => void;
  isTestingFailure?: boolean;
}

export function NodeDetailDrawer({
  node,
  onClose,
  onTestFailureScenario,
  onResetFailureScenario,
  isTestingFailure = false,
}: NodeDetailDrawerProps) {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="navy" size="sm">
            {node.stage.toUpperCase()}
          </Badge>
          {node.isCriticalGate && <Badge variant="warning" size="sm">Critical Gate</Badge>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} id="close-node-drawer">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-900">{node.label}</h3>
          <p className="text-sm text-neutral-600 mt-1">{node.description || 'Step in education-to-career pathway.'}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
          {node.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-navy-600 shrink-0" />
              <div>
                <span className="text-neutral-400 block font-medium">Duration</span>
                <span className="font-semibold text-neutral-800">{node.duration}</span>
              </div>
            </div>
          )}
          {node.cost && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-success-600 shrink-0" />
              <div>
                <span className="text-neutral-400 block font-medium">Est. Cost</span>
                <span className="font-semibold text-neutral-800">{node.cost}</span>
              </div>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {node.requirements && node.requirements.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-navy-700" />
              Prerequisites & Requirements
            </h4>
            <ul className="space-y-2 text-xs">
              {node.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 text-neutral-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy-600 mt-1 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Preserved Options */}
        {node.backupOptions && node.backupOptions.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-navy-700" />
              Options Preserved From This Gate
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {node.backupOptions.map((opt, i) => (
                <Badge key={i} variant="outline" size="sm">
                  {opt}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Test Failure Scenario Block */}
        {(node.stage === 'entranceexam' || node.isCriticalGate) && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800">What-If Gate Failure Test</h5>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Test what happens if rank or score is not achieved at this decision gate.
                </p>
              </div>
            </div>

            {isTestingFailure ? (
              <div className="space-y-2">
                <div className="p-2.5 bg-amber-100 rounded-lg text-xs font-semibold text-amber-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
                  Scenario active: Active fallback path highlighted in graph!
                </div>
                <Button variant="secondary" size="sm" className="w-full text-xs" onClick={onResetFailureScenario}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Reset Scenario View
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-medium border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                onClick={() => onTestFailureScenario(node.id)}
                id="test-failure-scenario-btn"
              >
                <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                Test Scenario: "What if I miss this cutoff?"
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Panel
        </Button>
      </div>
    </div>
  );
}
