import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { allPathways, demoStudent } from '@/data';
import { formatCurrency, evaluatePathwayEligibility, calculateOptionScore, cn } from '@/utils';
import { GitBranch, Clock, IndianRupee, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PathwaysPage() {
  const navigate = useNavigate();
  const [selectedStream, setSelectedStream] = useState<'All' | 'PCM' | 'PCB' | 'Commerce'>('All');

  const filteredPathways = allPathways.filter((p) => {
    if (selectedStream === 'All') return true;
    const ps = p.stream.toUpperCase();
    return ps.includes(selectedStream.toUpperCase()) || ps.includes('ANY');
  });

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">Explore Education Pathways</h1>
            <Badge variant="navy" size="sm">Phase 1 Engine Active</Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Compare structured education-to-career routes evaluated deterministically against Aarav's academic profile & budget.
          </p>
        </div>

        {/* Stream Filters */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
          {(['All', 'PCM', 'PCB', 'Commerce'] as const).map((stream) => (
            <button
              key={stream}
              onClick={() => setSelectedStream(stream)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedStream === stream
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {stream === 'All' ? 'All Streams' : stream === 'PCM' ? 'PCM Science' : stream === 'PCB' ? 'PCB Medical' : 'Commerce & Law'}
            </button>
          ))}
        </div>
      </div>

      {/* Pathway Cards List */}
      <div className="space-y-5">
        {filteredPathways.map((pathway) => {
          const evalResult = evaluatePathwayEligibility(demoStudent, pathway);
          const optionResult = calculateOptionScore(pathway, demoStudent);

          return (
            <Card
              key={pathway.id}
              id={`pathway-card-${pathway.id}`}
              className="hover:border-navy-300 transition-all cursor-pointer shadow-sm overflow-hidden"
              onClick={() => navigate('/compare')}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center shrink-0 mt-0.5">
                      <GitBranch className="h-5 w-5 text-navy-700" />
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-neutral-900">{pathway.name}</h3>

                        {/* Stream badge */}
                        <Badge variant="navy" size="sm">
                          {pathway.stream}
                        </Badge>

                        {/* Eligibility status */}
                        <Badge
                          variant={
                            evalResult.status === 'eligible'
                              ? 'success'
                              : evalResult.status === 'conditional'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {evalResult.status === 'eligible'
                            ? '✅ Eligible'
                            : evalResult.status === 'conditional'
                            ? '⚠️ Conditional'
                            : '❌ Prerequisite Deficit'}
                        </Badge>

                        {/* Option Score Badge */}
                        <Badge
                          variant={
                            optionResult.flexibilityLevel === 'High'
                              ? 'success'
                              : optionResult.flexibilityLevel === 'Medium'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          Option Score: {optionResult.score}/100 ({optionResult.flexibilityLevel} Flexibility)
                        </Badge>
                      </div>

                      <p className="text-sm text-neutral-600 leading-relaxed">{pathway.description}</p>

                      {/* Info grid */}
                      <div className="flex flex-wrap gap-5 text-xs text-neutral-600 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-navy-600" />
                          <span><strong>{pathway.durationYears} Years</strong> total duration</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="h-3.5 w-3.5 text-success-600" />
                          <span>
                            Cost: <strong>{formatCurrency(pathway.totalCostRangeINR[0], true)} – {formatCurrency(pathway.totalCostRangeINR[1], true)}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-navy-700" />
                          <span>Prereq: <strong>{pathway.requiredMinScore ?? 60}% Class 10 aggregate</strong></span>
                        </div>
                      </div>

                      {/* Budget Feasibility Note */}
                      <div className="text-xs bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 text-neutral-700">
                        💡 <strong>Financial Feasibility:</strong> {evalResult.budgetAnalysis.statusText}
                      </div>

                      {/* Career outcomes tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-neutral-400 mr-1">Target Careers:</span>
                        {pathway.careerOutcomes.map((outcome) => (
                          <Badge key={outcome} variant="outline" size="sm">
                            {outcome}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action button & match score */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Match Score</span>
                      <span className="text-xl font-extrabold text-navy-900">{evalResult.score}%</span>
                    </div>
                    <Button
                      id={`pathway-explore-${pathway.id}`}
                      variant="primary"
                      size="sm"
                      className="gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/compare');
                      }}
                    >
                      Compare Pathway
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Pathway Nodes Step Sequence */}
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    Step-by-Step Pathway Gates:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {pathway.nodes.map((node, ni) => (
                      <div key={node.id} className="flex items-center gap-2 shrink-0">
                        <div
                          className={cn(
                            'px-3 py-1.2 rounded-lg text-xs font-semibold shadow-2xs',
                            node.stage === 'class10'
                              ? 'bg-neutral-800 text-white'
                              : node.stage === 'class12stream'
                              ? 'bg-navy-700 text-white'
                              : node.stage === 'entranceexam'
                              ? 'bg-warning-500 text-white'
                              : node.stage === 'undergrad'
                              ? 'bg-navy-100 text-navy-900 border border-navy-200'
                              : node.stage === 'postgrad'
                              ? 'bg-accent-100 text-accent-800 border border-accent-200'
                              : 'bg-success-100 text-success-800 border border-success-200'
                          )}
                        >
                          {node.label}
                        </div>
                        {ni < pathway.nodes.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option Keeper Backup Routes Preview */}
                {optionResult.backupRoutes.length > 0 && (
                  <div className="mt-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Layers className="h-4 w-4 text-navy-600 shrink-0" />
                      <span>
                        <strong>Primary Backup Route:</strong> {optionResult.backupRoutes[0].primaryPath} →{' '}
                        <span className="text-amber-800 font-semibold">{optionResult.backupRoutes[0].backupPath1}</span> →{' '}
                        <span className="text-success-800 font-semibold">{optionResult.backupRoutes[0].fallbackCareer}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Options preserved at Class 12: {optionResult.optionsAtClass12}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
