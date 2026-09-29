import type { StudentProfile } from '@/types';

export const demoStudent: StudentProfile = {
  id: 'student-aarav-001',
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
  overallPercentage: 88,
  interests: ['Technology', 'Mathematics', 'Problem Solving'],
  careerPreferences: ['Technology', 'Research', 'Entrepreneurship'],
  locationPreference: 'India',
  abroadOpen: true,
  budgetINR: 600000,
  priorities: [
    'Affordability',
    'Career flexibility',
    'Future options',
    'Reasonable distance from home',
  ],
};
