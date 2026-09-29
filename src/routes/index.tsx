import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/Landing/LandingPage';
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { FutureMapPage } from '@/pages/FutureMap/FutureMapPage';
import { PathwaysPage } from '@/pages/Pathways/PathwaysPage';
import { ComparePage } from '@/pages/Compare/ComparePage';
import { FinancePage } from '@/pages/Finance/FinancePage';
import { ScenariosPage } from '@/pages/Scenarios/ScenariosPage';
import { PlanBCPage } from '@/pages/Plans/PlanBCPage';
import { DecisionPage } from '@/pages/Decision/DecisionPage';

export const router = createBrowserRouter([
  // Public routes (no layout)
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  // App routes (with layout)
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/future-map', element: <FutureMapPage /> },
      { path: '/pathways', element: <PathwaysPage /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '/finance', element: <FinancePage /> },
      { path: '/what-if', element: <ScenariosPage /> },
      { path: '/plan-bc', element: <PlanBCPage /> },
      { path: '/decision', element: <DecisionPage /> },
      // Redirect /profile to dashboard for now
      { path: '/profile', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  // Catch-all redirect
  { path: '*', element: <Navigate to="/" replace /> },
]);
