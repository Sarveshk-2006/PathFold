import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckSquare, CheckCircle2, Circle } from 'lucide-react';
import { demoStudent } from '@/data';
import { formatCurrency } from '@/utils';

const decisions = [
  {
    id: 'd-stream',
    question: 'Which stream will you take in Class 11?',
    chosen: 'PCM (Physics, Chemistry, Mathematics)',
    rationale: 'Aligns with Technology interest and opens engineering pathways.',
    status: 'decided',
  },
  {
    id: 'd-exam',
    question: 'Which entrance exam will you target?',
    chosen: 'JEE Main + MHT-CET (Fallback)',
    rationale: 'JEE Main opens NIT/Private options. MHT-CET secures state college entry.',
    status: 'decided',
  },
  {
    id: 'd-college',
    question: 'What type of college are you aiming for?',
    chosen: 'NIT / Good Private College (Pune preferred)',
    rationale: 'Balances quality and budget. COEP and VIT Pune are within budget.',
    status: 'decided',
  },
  {
    id: 'd-pgplan',
    question: 'Are you planning for postgraduate study?',
    chosen: 'Undecided — will revisit after B.Tech Year 2',
    rationale: 'Decision can wait. M.Tech or direct employment both remain viable.',
    status: 'pending',
  },
];

export function DecisionPage() {
  return (
    <div className="p-5 md:p-7 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Decision Centre</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Track and justify your key education decisions. Each choice should be made with clear reasoning.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-5 py-4">
        <p className="text-sm font-semibold text-neutral-700 mb-2">Decision Summary — {demoStudent.name}</p>
        <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
          <span>✓ 3 decisions made</span>
          <span>⏳ 1 pending</span>
          <span>Budget: {formatCurrency(demoStudent.budgetINR, true)}</span>
        </div>
      </div>

      {/* Decision list */}
      <div className="space-y-4">
        {decisions.map((dec) => (
          <Card key={dec.id} id={`decision-${dec.id}`}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                {dec.status === 'decided' ? (
                  <CheckCircle2 className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-neutral-300 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-neutral-800">{dec.question}</p>
                    <Badge
                      variant={dec.status === 'decided' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {dec.status === 'decided' ? 'Decided' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-700 font-medium mb-1">{dec.chosen}</p>
                  <p className="text-xs text-neutral-500">{dec.rationale}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center">
        <CheckSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-500">Full decision audit trail coming in Phase 1</p>
        <p className="text-xs text-neutral-400 mt-1">Record reasoning, reversibility, and deadline for every major choice.</p>
      </div>
    </div>
  );
}
