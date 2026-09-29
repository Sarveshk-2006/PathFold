import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GitBranch, DollarSign, FlaskConical, Shield } from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Map Education Pathways',
    description: 'See every route from Class 10 to a career — and the dependencies between them.',
  },
  {
    icon: DollarSign,
    title: 'Understand the Finances',
    description: 'Compare real costs, scholarships, and loans for each path, within your budget.',
  },
  {
    icon: FlaskConical,
    title: 'Test What-If Scenarios',
    description: 'Change assumptions — like your JEE score or budget — and see how paths shift.',
  },
  {
    icon: Shield,
    title: 'Preserve Backup Routes',
    description: 'Always know your Plan B and Plan C before committing to a direction.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-navy-800 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-navy-900">CareerPath</span>
            <span className="text-xs text-neutral-400 ml-1">Simulator</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium text-neutral-400 px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-full">
            Round 1 Demo
          </span>
          <Button
            id="landing-start-cta-nav"
            variant="secondary"
            size="sm"
            onClick={() => navigate('/onboarding')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy-50 border border-navy-200 rounded-full text-xs font-medium text-navy-700 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-navy-600 animate-pulse" />
          For students starting from Class 10
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-tight tracking-tight max-w-3xl">
          Explore your{' '}
          <span className="text-navy-700">possible</span>{' '}
          <br className="hidden md:block" />
          futures.
        </h1>

        <p className="mt-5 text-lg md:text-xl text-neutral-500 max-w-lg leading-relaxed">
          A decision simulator for students choosing what comes next.
        </p>

        <p className="mt-2 text-sm text-neutral-400 max-w-md">
          Start with where you are. See where different choices can take you.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
          <Button
            id="landing-start-cta"
            size="xl"
            onClick={() => navigate('/onboarding')}
            className="gap-2 min-w-44"
          >
            Start Exploring
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            id="landing-demo-cta"
            variant="ghost"
            size="xl"
            onClick={() => navigate('/dashboard')}
          >
            View Demo Dashboard
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400">
          <span>✓ No AI scores or predictions</span>
          <span>✓ Real education data</span>
          <span>✓ Every result is explainable</span>
          <span>✓ Built for Indian students</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-neutral-100" />

      {/* Features */}
      <div className="px-6 md:px-12 lg:px-20 py-16">
        <p className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-10">
          What this simulator helps you do
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-5 rounded-xl border border-neutral-100 bg-neutral-50 hover:border-neutral-200 hover:bg-white transition-all duration-150"
            >
              <div className="h-9 w-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                <f.icon className="h-4.5 w-4.5 text-navy-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{f.title}</p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-neutral-100 px-6 py-8 text-center">
        <p className="text-sm text-neutral-500 mb-4">
          Ready to start mapping your path?
        </p>
        <Button
          id="landing-footer-cta"
          onClick={() => navigate('/onboarding')}
          size="md"
        >
          Begin with your profile →
        </Button>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 px-6 py-4 text-center">
        <p className="text-xs text-neutral-400">
          CareerPath Simulator · Hackathon Prototype · 2024
        </p>
      </div>
    </div>
  );
}
