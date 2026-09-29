import { demoStudent, allPathways } from '@/data';
import { formatCurrency, evaluatePathwayEligibility } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { FutureMapGraph } from '@/components/pathway/FutureMapGraph';
import {
  GitBranch,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  BookOpen,
  Map,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Stat card for summary metrics
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: 'navy' | 'success' | 'warning' | 'neutral';
  id: string;
}

function StatCard({ icon: Icon, label, value, sub, color = 'navy', id }: StatCardProps) {
  const colorStyles: Record<string, { bg: string; fg: string }> = {
    navy: { bg: '#EBF1F9', fg: '#2A4E7F' },
    success: { bg: '#ECFDF5', fg: '#059669' },
    warning: { bg: '#FFFBEB', fg: '#D97706' },
    neutral: { bg: '#F3F4F6', fg: '#4B5563' },
  };
  const { bg, fg } = colorStyles[color];
  return (
    <Card id={id} className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg, color: fg }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        <p className="text-sm font-medium text-neutral-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const student = demoStudent;
  const primaryPathway = allPathways[0];

  // Dynamic calculations from evaluation engine
  const evaluatedPathways = allPathways.map((p) => evaluatePathwayEligibility(student, p));
  const openPathwaysCount = evaluatedPathways.filter((e) => e.status === 'eligible').length;
  const conditionalPathwaysCount = evaluatedPathways.filter((e) => e.status === 'conditional').length;
  const withinBudgetCount = evaluatedPathways.filter((e) => e.budgetAnalysis.feasible).length;
  const requiringFundingCount = evaluatedPathways.filter((e) => e.budgetAnalysis.deficitOrSurplus < 0).length;

  const budgetCoverage = Math.min(
    (student.budgetINR / primaryPathway.totalCostRangeINR[1]) * 100,
    100
  );

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{student.name}'s Future Map</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <Badge variant="navy">Class {student.class}</Badge>
            <span className="text-neutral-300">·</span>
            <span className="text-sm text-neutral-500">{student.location}, {student.state}</span>
            <span className="text-neutral-300">·</span>
            <span className="text-sm text-neutral-500">{student.board}</span>
            <span className="text-neutral-300">·</span>
            <span className="text-sm font-semibold text-neutral-700">{student.overallPercentage}%</span>
            <span className="text-neutral-300">·</span>
            <span className="text-sm text-neutral-500">{formatCurrency(student.budgetINR, true)} budget</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            id="dashboard-explore-paths"
            variant="secondary"
            size="sm"
            onClick={() => navigate('/pathways')}
          >
            <GitBranch className="h-4 w-4 mr-1" />
            Explore Paths
          </Button>
          <Button
            id="dashboard-view-map"
            size="sm"
            onClick={() => navigate('/future-map')}
          >
            <Map className="h-4 w-4 mr-1" />
            Full Map
          </Button>
        </div>
      </div>

      {/* Summary Stats (Calculated dynamically via evaluation Engine) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-paths"
          icon={GitBranch}
          label="Mapped Pathways"
          value={allPathways.length}
          sub={`${openPathwaysCount} eligible, ${conditionalPathwaysCount} conditional`}
          color="navy"
        />
        <StatCard
          id="stat-open"
          icon={CheckCircle2}
          label="Eligible Options"
          value={openPathwaysCount}
          sub="Prerequisites satisfied"
          color="success"
        />
        <StatCard
          id="stat-backup"
          icon={Layers}
          label="Within Family Budget"
          value={withinBudgetCount}
          sub={`Fits ₹${(student.budgetINR / 100000).toFixed(1)}L budget`}
          color="warning"
        />
        <StatCard
          id="stat-funding"
          icon={DollarSign}
          label="Require Funding / Loan"
          value={requiringFundingCount}
          sub="Upper cost exceeds budget"
          color="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Future Map Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-800">Future Map Preview</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Your education-to-career pathway graph</p>
            </div>
            <Button
              id="dashboard-full-map"
              variant="ghost"
              size="sm"
              onClick={() => navigate('/future-map')}
              className="gap-1 text-navy-700"
            >
              Open full map
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <FutureMapGraph miniMode className="h-[380px]" />
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Start', color: 'bg-neutral-800' },
              { label: 'Stream', color: 'bg-navy-700' },
              { label: 'Entrance Exam', color: 'bg-warning-600' },
              { label: 'Degree', color: 'bg-navy-100 border border-navy-300' },
              { label: 'Career', color: 'bg-success-100 border border-success-300' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Academic Profile */}
          <Card id="dashboard-academics-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-navy-600" />
                <CardTitle>Academic Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.academics.map((subject) => (
                <div key={subject.name} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-600 w-28 shrink-0">{subject.name}</span>
                  <div className="flex-1">
                    <Progress
                      value={subject.score}
                      max={100}
                      size="sm"
                      variant={subject.score >= 85 ? 'success' : subject.score >= 70 ? 'navy' : 'warning'}
                    />
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 w-8 text-right">
                    {subject.score}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-600">Overall Aggregate</span>
                <span className="text-sm font-bold text-navy-800">{student.overallPercentage}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card id="dashboard-budget-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-navy-600" />
                <CardTitle>Budget Overview</CardTitle>
              </div>
              <CardDescription>vs. primary pathway cost</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                  <span>Budget: {formatCurrency(student.budgetINR, true)}</span>
                  <span>Needed: {formatCurrency(primaryPathway.totalCostRangeINR[1], true)}</span>
                </div>
                <Progress
                  value={budgetCoverage}
                  max={100}
                  size="lg"
                  variant={budgetCoverage >= 75 ? 'success' : budgetCoverage >= 50 ? 'default' : 'warning'}
                  showLabel
                />
              </div>
              <p className="text-xs text-neutral-500">
                {budgetCoverage >= 100
                  ? 'Budget fully covers this pathway.'
                  : `${Math.round(100 - budgetCoverage)}% gap — scholarships or loan can bridge it.`}
              </p>
              <Button
                id="dashboard-finance-cta"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/finance')}
              >
                View Finance Planner
              </Button>
            </CardContent>
          </Card>
          {/* What-If Simulator & Plan B/C Summary Cards */}
          <Card id="dashboard-what-if-card" className="border-warning-200 bg-warning-50/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-warning-700" />
                <CardTitle>What-If Simulator</CardTitle>
              </div>
              <CardDescription>Test how your plan shifts when circumstances change</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-neutral-600">
                Simulate budget shocks, missed exam cutoffs, no-loan rules, or location constraints in real time.
              </p>
              <Button
                id="dashboard-what-if-cta"
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold bg-white border-neutral-200"
                onClick={() => navigate('/what-if')}
              >
                Explore Scenarios →
              </Button>
            </CardContent>
          </Card>

          <Card id="dashboard-planbc-card" className="border-navy-200 bg-navy-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-navy-700" />
                <CardTitle>Plan B / C Backup Tree</CardTitle>
              </div>
              <CardDescription>Current Plan: B.Tech CSE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <span>Backup Routes Available:</span>
                <Badge variant="navy" size="sm">2 Resilient Alternatives</Badge>
              </div>
              <p className="text-xs text-neutral-600">
                Plan B (B.Sc CS) and Plan C (BCA → MCA) preserve 85%+ career outcomes.
              </p>
              <Button
                id="dashboard-planbc-cta"
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold bg-white"
                onClick={() => navigate('/plan-bc')}
              >
                View Plan B / C Tree →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
