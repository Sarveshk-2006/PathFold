import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { colleges } from '@/data';
import { compareInstitutions, calculateInstitutionTotalCost } from '@/features/compare/comparisonEngine';
import { usePathwayFinance } from '@/context/PathwayFinanceContext';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function ComparePage() {
  const navigate = useNavigate();
  const {
    selectedInstitutionIds,
    toggleInstitutionSelection,
    activeInstitutionId,
    setActiveInstitutionId,
    familyContribution,
  } = usePathwayFinance();

  const comparisonData = compareInstitutions(colleges, selectedInstitutionIds, familyContribution);

  // Prepare chart dataset
  const costChartData = comparisonData.selectedInstitutions.map((inst) => ({
    name: inst.shortName,
    Tuition: Math.round((inst.tuitionFeeAnnual * inst.durationYears) / 100000),
    HostelAndLiving: Math.round(((inst.hostelCostAnnual + inst.livingCostAnnual) * inst.durationYears) / 100000),
    Other: Math.round((inst.otherMandatoryCostsAnnual * inst.durationYears) / 100000),
    TotalCost: Math.round(calculateInstitutionTotalCost(inst) / 100000),
  }));

  return (
    <div className="page-container space-y-6">
      {/* Header & Institution Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">Compare Institutions & Programmes</h1>
            <Badge variant="navy" size="sm">Phase 2 Factual Compare</Badge>
          </div>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Factual side-by-side cost breakdown, admission prerequisites, and funding gap analysis against Aarav's ₹6.0L budget.
          </p>
        </div>

        {/* Action button */}
        <Button
          variant="primary"
          size="md"
          className="gap-1.5 shrink-0"
          onClick={() => navigate('/finance')}
        >
          Open Finance Planner
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Selector pills for 2-4 institutions */}
      <Card className="bg-neutral-50/70 border-neutral-200">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-navy-700 shrink-0" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Select Institutions to Compare (2–4):
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {colleges.map((inst) => {
                const isSelected = selectedInstitutionIds.includes(inst.id);
                return (
                  <button
                    key={inst.id}
                    onClick={() => toggleInstitutionSelection(inst.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-navy-900 text-white border-navy-900 shadow-2xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-success-400" />}
                    {inst.shortName}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Comparison Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Total Cost Breakdown Chart */}
        <Card id="compare-cost-chart">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Degree Cost Breakdown (4 Years)</h3>
                <p className="text-xs text-neutral-500">Tuition vs Hostel & Living in ₹ Lakhs</p>
              </div>
              <Badge variant="outline" size="sm">Factual Data</Badge>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={costChartData} margin={{ left: -15, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} unit="L" />
                <Tooltip
                  formatter={(v, name) => [`₹${v} Lakhs`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Tuition" name="Tuition Fee" stackId="a" fill="#1E3A5F" radius={[0, 0, 0, 0]} />
                <Bar dataKey="HostelAndLiving" name="Hostel & Living" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Other" name="Mandatory Fees" stackId="a" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funding Gap Comparison Chart */}
        <Card id="compare-gap-chart">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Funding Gap vs ₹6.0L Family Budget</h3>
                <p className="text-xs text-neutral-500">Net funding deficit requiring loans or scholarships</p>
              </div>
              <Badge variant="outline" size="sm">Dynamic Engine</Badge>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={comparisonData.costComparison.map((c) => ({
                  name: c.name,
                  TotalCost: Math.round(c.total4YearCost / 100000),
                  FundingGap: Math.round(c.fundingGapVsBudget / 100000),
                }))}
                margin={{ left: -15, top: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} unit="L" />
                <Tooltip
                  formatter={(v, name) => [`₹${v} Lakhs`, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="TotalCost" name="Total Estimated Cost" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="FundingGap" name="Funding Gap" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Side-by-Side Comparison Table */}
      <Card id="compare-institutions-table" className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Side-by-Side Institution Comparison</h3>
              <p className="text-xs text-neutral-500">Detailed admission, fee, and requirement matrix</p>
            </div>
            <span className="text-xs text-neutral-400">Comparing {comparisonData.selectedInstitutions.length} institutions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200">
                  <th className="py-3 px-4 font-bold text-neutral-700 w-1/4">Comparison Criteria</th>
                  {comparisonData.selectedInstitutions.map((inst) => {
                    const isActive = inst.id === activeInstitutionId;
                    return (
                      <th key={inst.id} className={`py-3 px-4 font-bold ${isActive ? 'bg-navy-50 text-navy-900 border-x border-navy-200' : 'text-neutral-800'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span>{inst.shortName}</span>
                          {isActive ? (
                            <Badge variant="navy" size="sm">Active for Finance</Badge>
                          ) : (
                            <button
                              onClick={() => setActiveInstitutionId(inst.id)}
                              className="text-[10px] text-navy-700 underline hover:text-navy-900 font-semibold"
                            >
                              Select for Finance
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {comparisonData.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      row.category === 'financial'
                        ? 'bg-neutral-50/80 font-medium'
                        : row.category === 'trust'
                        ? 'bg-amber-50/30 text-amber-900'
                        : 'hover:bg-neutral-50'
                    }
                  >
                    <td className="py-3 px-4 font-semibold text-neutral-700 bg-neutral-50/50">
                      {row.fieldLabel}
                    </td>
                    {comparisonData.selectedInstitutions.map((inst) => {
                      const isActive = inst.id === activeInstitutionId;
                      const val = row.values[inst.id];
                      return (
                        <td
                          key={inst.id}
                          className={`py-3 px-4 leading-relaxed ${
                            isActive ? 'bg-navy-50/40 border-x border-navy-100 font-semibold text-navy-950' : 'text-neutral-700'
                          }`}
                        >
                          {typeof val === 'string' && val.includes('⚠️') ? (
                            <span className="text-danger-700 font-bold">{val}</span>
                          ) : typeof val === 'string' && val.includes('✅') ? (
                            <span className="text-success-700 font-bold">{val}</span>
                          ) : (
                            val
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
