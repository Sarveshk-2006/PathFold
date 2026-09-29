import type { Pathway } from '@/types';

export const pathways: Pathway[] = [
  {
    id: 'pathway-btech-cse',
    name: 'B.Tech Computer Science & Engineering',
    shortName: 'B.Tech CSE',
    description:
      'The most direct route into software engineering, AI, and related technology fields. Involves clearing JEE after Class 12 PCM.',
    stream: 'PCM',
    totalCostRangeINR: [200000, 800000],
    durationYears: 6,
    careerOutcomes: ['Software Engineer', 'AI/ML Engineer', 'Data Scientist', 'Startup Founder'],
    requiredMinScore: 75,
    tags: ['Engineering', 'Technology', 'High Demand', 'JEE'],
    nodes: [
      {
        id: 'n-class10',
        label: 'Class 10',
        stage: 'class10',
        description: 'Foundation stage. Board exams.',
        duration: '1 year',
      },
      {
        id: 'n-pcm',
        label: 'Class 11–12 PCM',
        stage: 'class12stream',
        description:
          'Physics, Chemistry, Mathematics stream. Required for engineering entrance exams.',
        duration: '2 years',
        averageCostINR: 60000,
        requirements: ['Min 60% in Class 10 Science & Math'],
      },
      {
        id: 'n-jee',
        label: 'JEE Main / Advanced',
        stage: 'entranceexam',
        description: 'Joint Entrance Examination for engineering admissions to NITs, IITs, and private colleges.',
        duration: '1 attempt (up to 3 years)',
        requirements: ['PCM in Class 12'],
        successRate: 25,
        alternativeIds: ['n-state-cet', 'n-bitsat'],
      },
      {
        id: 'n-btech-cse',
        label: 'B.Tech CSE',
        stage: 'undergrad',
        description: '4-year engineering degree in Computer Science. Core: DSA, OS, Networks, Databases.',
        duration: '4 years',
        averageCostINR: 150000,
        requirements: ['JEE Score', 'Merit-based admission'],
      },
      {
        id: 'n-career-se',
        label: 'Software / AI Career',
        stage: 'career',
        description: 'Entry-level roles in software engineering, data science, or AI/ML.',
        duration: 'Ongoing',
      },
    ],
    edges: [
      { from: 'n-class10', to: 'n-pcm' },
      { from: 'n-pcm', to: 'n-jee' },
      { from: 'n-jee', to: 'n-btech-cse', probability: 25 },
      { from: 'n-btech-cse', to: 'n-career-se' },
    ],
  },
  {
    id: 'pathway-bsc-cs',
    name: 'B.Sc. Computer Science',
    shortName: 'B.Sc. CS',
    description:
      'A more affordable and accessible path to a CS career. Less engineering-focused, more theory and research-oriented.',
    stream: 'PCM / PCB',
    totalCostRangeINR: [80000, 400000],
    durationYears: 5,
    careerOutcomes: ['Software Developer', 'Data Analyst', 'IT Consultant', 'Researcher'],
    requiredMinScore: 60,
    tags: ['Science', 'Technology', 'Affordable', 'Flexible'],
    nodes: [
      {
        id: 'n-class10-bsc',
        label: 'Class 10',
        stage: 'class10',
        description: 'Foundation stage.',
      },
      {
        id: 'n-pcm-bsc',
        label: 'Class 11–12 PCM',
        stage: 'class12stream',
        description: 'Science stream with Maths.',
        duration: '2 years',
        averageCostINR: 50000,
      },
      {
        id: 'n-bsc-cs',
        label: 'B.Sc. Computer Science',
        stage: 'undergrad',
        description: '3-year degree in CS. Focus on programming, maths, and theory.',
        duration: '3 years',
        averageCostINR: 60000,
      },
      {
        id: 'n-msc-cs',
        label: 'M.Sc. CS (Optional)',
        stage: 'postgrad',
        description: 'Specialization in AI, Data Science, or Networking.',
        duration: '2 years',
        averageCostINR: 80000,
        alternativeIds: ['n-career-bsc'],
      },
      {
        id: 'n-career-bsc',
        label: 'Tech Career',
        stage: 'career',
        description: 'Developer or analyst roles after B.Sc. or M.Sc.',
      },
    ],
    edges: [
      { from: 'n-class10-bsc', to: 'n-pcm-bsc' },
      { from: 'n-pcm-bsc', to: 'n-bsc-cs' },
      { from: 'n-bsc-cs', to: 'n-msc-cs', condition: 'Optional specialization' },
      { from: 'n-bsc-cs', to: 'n-career-bsc', condition: 'Direct entry' },
      { from: 'n-msc-cs', to: 'n-career-bsc' },
    ],
  },
  {
    id: 'pathway-bca',
    name: 'BCA + MCA / MBA Tech',
    shortName: 'BCA',
    description:
      "Bachelor of Computer Applications — a commerce/arts-friendly path to a tech career. Good for students who don't take PCM.",
    stream: 'Any stream',
    totalCostRangeINR: [100000, 500000],
    durationYears: 5,
    careerOutcomes: ['Software Developer', 'System Analyst', 'Tech Consultant'],
    requiredMinScore: 55,
    tags: ['Technology', 'Any Stream', 'Application-focused'],
    nodes: [
      {
        id: 'n-class10-bca',
        label: 'Class 10',
        stage: 'class10',
        description: 'Foundation stage.',
      },
      {
        id: 'n-any-stream',
        label: 'Class 11–12 (Any Stream)',
        stage: 'class12stream',
        description: 'BCA accepts students from Science, Commerce, or Arts.',
        duration: '2 years',
        averageCostINR: 40000,
      },
      {
        id: 'n-bca',
        label: 'BCA',
        stage: 'undergrad',
        description: 'Application-focused CS degree. Covers programming, databases, and networking.',
        duration: '3 years',
        averageCostINR: 120000,
      },
      {
        id: 'n-mca',
        label: 'MCA (Optional)',
        stage: 'postgrad',
        description: 'Masters of Computer Applications — recognized equivalent of B.Tech for many roles.',
        duration: '2 years',
        averageCostINR: 150000,
      },
      {
        id: 'n-career-bca',
        label: 'Tech Career',
        stage: 'career',
        description: 'Software roles, often in services companies or startups.',
      },
    ],
    edges: [
      { from: 'n-class10-bca', to: 'n-any-stream' },
      { from: 'n-any-stream', to: 'n-bca' },
      { from: 'n-bca', to: 'n-mca', condition: 'For senior roles' },
      { from: 'n-bca', to: 'n-career-bca', condition: 'Direct entry' },
      { from: 'n-mca', to: 'n-career-bca' },
    ],
  },
];

export const pcmPathways = pathways;

// Alternate entrance exam nodes for graph reference
export const alternateExamNodes = [
  { id: 'n-state-cet', label: 'State CET', description: 'State-level engineering entrance' },
  { id: 'n-bitsat', label: 'BITSAT', description: 'BITS Pilani entrance examination' },
];
