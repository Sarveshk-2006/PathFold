import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/utils';
import { CheckCircle2, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import type { OnboardingData } from '@/types';

const TOTAL_STEPS = 5;

const BOARDS = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'State Board', label: 'State Board' },
  { value: 'IB', label: 'IB (International)' },
  { value: 'IGCSE', label: 'IGCSE' },
];

const CLASSES = [
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' },
];

const ALL_INTERESTS = [
  'Technology', 'Mathematics', 'Problem Solving', 'Biology', 'Chemistry',
  'Physics', 'Economics', 'Design', 'Music', 'Sports', 'Writing',
  'Business', 'Medicine', 'Law', 'Social Work',
];

const ALL_PREFERENCES = [
  'Technology-related careers', 'Medical / Healthcare', 'Finance & Banking',
  'Research & Academia', 'Entrepreneurship', 'Government / Civil Services',
  'Arts & Media', 'Law & Policy', 'Social Impact',
];

const PRIORITIES = [
  'Affordability', 'Career flexibility', 'Future options',
  'Proximity to home', 'Prestige of institution',
  'Entrepreneurship path', 'Research & PhD track', 'Early employment',
];

const defaultData: OnboardingData = {
  name: 'Aarav Sharma',
  class: 10,
  location: 'Pune',
  state: 'Maharashtra',
  board: 'CBSE',
  academics: [
    { name: 'Mathematics', score: 91, outOf: 100 },
    { name: 'Science', score: 87, outOf: 100 },
    { name: 'English', score: 84, outOf: 100 },
    { name: 'Social Studies', score: 82, outOf: 100 },
    { name: 'Hindi', score: 79, outOf: 100 },
  ],
  interests: ['Technology', 'Mathematics', 'Problem Solving'],
  careerPreferences: ['Technology-related careers'],
  abroadOpen: true,
  budgetINR: 600000,
  priorities: ['Affordability', 'Career flexibility', 'Future options', 'Proximity to home'],
};

const stepLabels = ['About You', 'Academics', 'Interests', 'Preferences', 'Budget'];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else {
      navigate('/dashboard');
    }
  };
  const handleBack = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-navy-800 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-navy-900">CareerPath Simulator</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Step progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Step {step} of {TOTAL_STEPS}</span>
              <span className="text-xs font-semibold text-navy-700">{stepLabels[step - 1]}</span>
            </div>
            <Progress value={step} max={TOTAL_STEPS} size="md" variant="navy" />
            <div className="flex mt-2.5 gap-1.5">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex-1 flex items-center gap-1">
                  <div
                    className={cn(
                      'flex-1 h-0.5 rounded-full transition-colors duration-300',
                      i + 1 <= step ? 'bg-navy-600' : 'bg-neutral-200'
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Step cards */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 md:p-8">
            {step === 1 && <StepAboutYou data={data} onChange={updateData} />}
            {step === 2 && <StepAcademics data={data} onChange={updateData} />}
            {step === 3 && (
              <StepInterests
                interests={data.interests}
                onChange={(interests) => updateData({ interests })}
              />
            )}
            {step === 4 && (
              <StepPreferences
                data={data}
                onChange={updateData}
              />
            )}
            {step === 5 && (
              <StepBudget data={data} onChange={updateData} />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-neutral-100">
              <Button
                id={`onboarding-back-step-${step}`}
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                id={`onboarding-next-step-${step}`}
                onClick={handleNext}
                className="gap-1 min-w-32"
              >
                {step < TOTAL_STEPS ? (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Build My Future Map
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {stepLabels.map((label, i) => (
              <button
                key={label}
                id={`onboarding-step-dot-${i + 1}`}
                onClick={() => i + 1 < step && setStep(i + 1)}
                disabled={i + 1 > step}
                title={label}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i + 1 === step ? 'w-6 bg-navy-700' : i + 1 < step ? 'w-2 bg-navy-300' : 'w-2 bg-neutral-200'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: About You ───────────────────────────────────────────
function StepAboutYou({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">About You</h2>
        <p className="text-sm text-neutral-500 mt-1">Tell us a bit about yourself to personalise your map.</p>
      </div>
      <Input
        label="Full Name"
        id="onboarding-name"
        value={data.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="e.g. Aarav Sharma"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Current Class"
          id="onboarding-class"
          value={String(data.class)}
          onChange={(e) => onChange({ class: Number(e.target.value) })}
          options={CLASSES}
        />
        <Select
          label="Board"
          id="onboarding-board"
          value={data.board}
          onChange={(e) => onChange({ board: e.target.value as OnboardingData['board'] })}
          options={BOARDS}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          id="onboarding-location"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. Pune"
        />
        <Input
          label="State"
          id="onboarding-state"
          value={data.state}
          onChange={(e) => onChange({ state: e.target.value })}
          placeholder="e.g. Maharashtra"
        />
      </div>
    </div>
  );
}

// ─── Step 2: Academics ───────────────────────────────────────────
function StepAcademics({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
}) {
  const updateSubject = (idx: number, score: number) => {
    const updated = data.academics.map((s, i) => (i === idx ? { ...s, score } : s));
    const overall = Math.round(updated.reduce((a, s) => a + s.score, 0) / updated.length);
    onChange({ academics: updated, overallPercentage: overall } as Partial<OnboardingData>);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Academic Performance</h2>
        <p className="text-sm text-neutral-500 mt-1">Enter your current or recent marks (out of 100).</p>
      </div>
      <div className="space-y-3">
        {data.academics.map((subject, i) => (
          <div key={subject.name} className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700 w-32 flex-shrink-0">{subject.name}</span>
            <div className="flex-1">
              <Progress
                value={subject.score}
                max={100}
                size="md"
                variant={subject.score >= 85 ? 'success' : subject.score >= 70 ? 'navy' : 'warning'}
              />
            </div>
            <input
              id={`onboarding-score-${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
              type="number"
              min={0}
              max={100}
              value={subject.score}
              onChange={(e) => updateSubject(i, Number(e.target.value))}
              className="w-16 h-9 text-center text-sm font-semibold border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
        <span className="text-sm font-medium text-neutral-600">Overall Average</span>
        <span className="text-lg font-bold text-navy-800">
          {Math.round(data.academics.reduce((a, s) => a + s.score, 0) / data.academics.length)}%
        </span>
      </div>
    </div>
  );
}

// ─── Step 3: Interests ───────────────────────────────────────────
function StepInterests({
  interests,
  onChange,
}: {
  interests: string[];
  onChange: (interests: string[]) => void;
}) {
  const toggle = (item: string) =>
    onChange(interests.includes(item) ? interests.filter((i) => i !== item) : [...interests, item]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Your Interests</h2>
        <p className="text-sm text-neutral-500 mt-1">Select all that genuinely interest you. Choose 2–5 for best results.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_INTERESTS.map((item) => {
          const selected = interests.includes(item);
          return (
            <button
              key={item}
              id={`onboarding-interest-${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => toggle(item)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-150',
                selected
                  ? 'bg-navy-800 text-white border-navy-800'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              )}
            >
              {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
              {item}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-neutral-400">{interests.length} selected</p>
    </div>
  );
}

// ─── Step 4: Preferences ─────────────────────────────────────────
function StepPreferences({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
}) {
  const togglePref = (item: string) =>
    onChange({
      careerPreferences: data.careerPreferences.includes(item)
        ? data.careerPreferences.filter((i) => i !== item)
        : [...data.careerPreferences, item],
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Career Preferences</h2>
        <p className="text-sm text-neutral-500 mt-1">What kinds of careers interest you? Select all that apply.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_PREFERENCES.map((item) => {
          const selected = data.careerPreferences.includes(item);
          return (
            <button
              key={item}
              id={`onboarding-pref-${item.toLowerCase().replace(/[\s/&]+/g, '-')}`}
              onClick={() => togglePref(item)}
              className={cn(
                'px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-150',
                selected
                  ? 'bg-navy-800 text-white border-navy-800'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-neutral-100">
        <p className="text-sm font-medium text-neutral-700 mb-3">Location preference</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Study in India', value: false },
            { label: 'Open to studying abroad', value: true },
          ].map((opt) => (
            <button
              key={opt.label}
              id={`onboarding-abroad-${opt.value}`}
              onClick={() => onChange({ abroadOpen: opt.value })}
              className={cn(
                'p-3.5 rounded-xl border text-sm font-medium text-left transition-all duration-150',
                data.abroadOpen === opt.value
                  ? 'border-navy-600 bg-navy-50 text-navy-800'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Budget ──────────────────────────────────────────────
function StepBudget({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (d: Partial<OnboardingData>) => void;
}) {
  const budgetOptions = [
    { label: 'Up to ₹3L', value: 300000 },
    { label: '₹3L – ₹6L', value: 600000 },
    { label: '₹6L – ₹12L', value: 1200000 },
    { label: '₹12L – ₹25L', value: 2500000 },
    { label: 'Above ₹25L', value: 5000000 },
  ];

  const togglePriority = (item: string) =>
    onChange({
      priorities: data.priorities.includes(item)
        ? data.priorities.filter((i) => i !== item)
        : [...data.priorities, item],
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Budget & Priorities</h2>
        <p className="text-sm text-neutral-500 mt-1">This helps us show relevant options and flag financial gaps.</p>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-3">Total education budget (family)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {budgetOptions.map((opt) => (
            <button
              key={opt.value}
              id={`onboarding-budget-${opt.value}`}
              onClick={() => onChange({ budgetINR: opt.value })}
              className={cn(
                'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-150',
                data.budgetINR === opt.value
                  ? 'border-navy-600 bg-navy-50 text-navy-800'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-100">
        <p className="text-sm font-medium text-neutral-700 mb-3">What matters most to you?</p>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((item) => {
            const selected = data.priorities.includes(item);
            return (
              <button
                key={item}
                id={`onboarding-priority-${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => togglePriority(item)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                  selected
                    ? 'bg-navy-800 text-white border-navy-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
