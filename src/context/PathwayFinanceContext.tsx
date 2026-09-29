import React, { createContext, useContext, useState } from 'react';
import { allPathways, colleges, scholarships, loanOptions, demoStudent } from '@/data';
import type { Pathway, Institution, Scholarship, LoanOption, FinanceProfile } from '@/types';
import { calculateFundingStack } from '@/features/finance/financeEngine';
import { calculateInstitutionTotalCost } from '@/features/compare/comparisonEngine';

interface PathwayFinanceContextType {
  selectedPathwayId: string;
  setSelectedPathwayId: (id: string) => void;
  selectedPathway: Pathway;

  selectedInstitutionIds: string[];
  setSelectedInstitutionIds: (ids: string[]) => void;
  toggleInstitutionSelection: (id: string) => void;

  activeInstitutionId: string;
  setActiveInstitutionId: (id: string) => void;
  activeInstitution: Institution;

  familyContribution: number;
  setFamilyContribution: (amount: number) => void;

  selectedScholarshipIds: string[];
  toggleScholarship: (id: string) => void;
  selectedScholarships: Scholarship[];

  selectedLoanId: string;
  setSelectedLoanId: (id: string) => void;
  selectedLoan: LoanOption;

  loanAmount: number;
  setLoanAmount: (amount: number) => void;

  financeProfile: FinanceProfile;
}

const PathwayFinanceContext = createContext<PathwayFinanceContextType | undefined>(undefined);

export const PathwayFinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('pathway-btech-cse');
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState<string[]>([
    'inst-iit-bombay',
    'inst-coep-pune',
    'inst-pict-pune',
    'inst-bits-pilani',
  ]);
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>('inst-coep-pune');

  const [familyContribution, setFamilyContribution] = useState<number>(demoStudent.budgetINR || 600000);
  const [selectedScholarshipIds, setSelectedScholarshipIds] = useState<string[]>(['sch-post-matric-merit']);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('loan-sbi-scholar');
  const [loanAmount, setLoanAmount] = useState<number>(100000);

  const selectedPathway = allPathways.find((p) => p.id === selectedPathwayId) || allPathways[0];
  const activeInstitution = colleges.find((c) => c.id === activeInstitutionId) || colleges[1];
  const selectedScholarships = scholarships.filter((s) => selectedScholarshipIds.includes(s.id));
  const selectedLoan = loanOptions.find((l) => l.id === selectedLoanId) || loanOptions[0];

  const totalCost = calculateInstitutionTotalCost(activeInstitution);

  const financeProfile = calculateFundingStack(
    totalCost,
    familyContribution,
    selectedScholarships,
    loanAmount,
    0,
    0
  );

  const toggleInstitutionSelection = (id: string) => {
    if (selectedInstitutionIds.includes(id)) {
      if (selectedInstitutionIds.length > 1) {
        setSelectedInstitutionIds(selectedInstitutionIds.filter((instId) => instId !== id));
      }
    } else {
      if (selectedInstitutionIds.length < 4) {
        setSelectedInstitutionIds([...selectedInstitutionIds, id]);
      }
    }
  };

  const toggleScholarship = (id: string) => {
    if (selectedScholarshipIds.includes(id)) {
      setSelectedScholarshipIds(selectedScholarshipIds.filter((sId) => sId !== id));
    } else {
      setSelectedScholarshipIds([...selectedScholarshipIds, id]);
    }
  };

  return (
    <PathwayFinanceContext.Provider
      value={{
        selectedPathwayId,
        setSelectedPathwayId,
        selectedPathway,
        selectedInstitutionIds,
        setSelectedInstitutionIds,
        toggleInstitutionSelection,
        activeInstitutionId,
        setActiveInstitutionId,
        activeInstitution,
        familyContribution,
        setFamilyContribution,
        selectedScholarshipIds,
        toggleScholarship,
        selectedScholarships,
        selectedLoanId,
        setSelectedLoanId,
        selectedLoan,
        loanAmount,
        setLoanAmount,
        financeProfile,
      }}
    >
      {children}
    </PathwayFinanceContext.Provider>
  );
};

export function usePathwayFinance() {
  const context = useContext(PathwayFinanceContext);
  if (!context) {
    throw new Error('usePathwayFinance must be used within PathwayFinanceProvider');
  }
  return context;
}
