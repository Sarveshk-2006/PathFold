import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type NodeProps,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '@/utils';
import { useMemo } from 'react';

// ─── Stage visual configurations ───────────────────────────────────
const stageConfig = {
  class10: { bg: 'bg-neutral-800', text: 'text-white', border: 'border-neutral-700', badge: 'Start' },
  class12stream: { bg: 'bg-navy-700', text: 'text-white', border: 'border-navy-600', badge: 'Stream' },
  entranceexam: { bg: 'bg-warning-600', text: 'text-white', border: 'border-warning-500', badge: 'Gate / Exam' },
  undergrad: { bg: 'bg-navy-100', text: 'text-navy-900', border: 'border-navy-300', badge: 'Degree' },
  postgrad: { bg: 'bg-accent-100', text: 'text-accent-700', border: 'border-accent-300', badge: 'PG' },
  career: { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-300', badge: 'Career' },
  branch: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300', badge: 'Branch' },
};

export interface PathwayNodeData {
  id: string;
  label: string;
  stage: keyof typeof stageConfig;
  description?: string;
  duration?: string;
  cost?: string;
  requirements?: string[];
  flexibilityScore?: number;
  backupOptions?: string[];
  isHighlighted?: boolean;
  isAlternate?: boolean;
  isFailed?: boolean;
  isFallbackRoute?: boolean;
  isCriticalGate?: boolean;
}

function PathwayFlowNode({ data }: NodeProps<PathwayNodeData>) {
  const config = stageConfig[data.stage] ?? stageConfig.branch;

  return (
    <div
      className={cn(
        'rounded-xl border-2 shadow-sm transition-all duration-200 cursor-pointer min-w-[150px] relative',
        config.border,
        data.isFailed ? 'border-danger-500 ring-2 ring-danger-300 shadow-lg scale-105 bg-danger-50' : '',
        data.isFallbackRoute ? 'border-amber-500 ring-2 ring-amber-300 shadow-md scale-105 bg-amber-50' : '',
        data.isHighlighted && !data.isFailed && !data.isFallbackRoute ? 'ring-2 ring-navy-500 shadow-md scale-105' : '',
        data.isAlternate && !data.isFallbackRoute ? 'opacity-75' : ''
      )}
    >
      <Handle type="target" position={Position.Top} className="!border-0 !w-2.5 !h-2.5 !bg-neutral-400" />
      <div className={cn('px-3 py-2.5 rounded-[10px]', data.isFailed ? 'bg-danger-600' : data.isFallbackRoute ? 'bg-amber-600' : config.bg)}>
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={cn('text-[9px] font-bold uppercase tracking-wider block', data.isFailed || data.isFallbackRoute ? 'text-white' : config.text)}>
            {data.isFailed ? '⚠️ Gate Failed' : data.isFallbackRoute ? '🔄 Active Fallback' : config.badge}
          </span>
          {data.isCriticalGate && !data.isFailed && (
            <span className="text-[9px] bg-danger-500 text-white px-1 py-0.2 rounded font-semibold">High Risk Gate</span>
          )}
        </div>
        <p className={cn('text-sm font-semibold leading-tight', data.isFailed || data.isFallbackRoute ? 'text-white' : config.text)}>
          {data.label}
        </p>
        {data.duration && (
          <p className={cn('text-[10px] mt-0.5 opacity-80', data.isFailed || data.isFallbackRoute ? 'text-white' : config.text)}>
            ⏱️ {data.duration}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !w-2.5 !h-2.5 !bg-neutral-400" />
    </div>
  );
}

const nodeTypes = { pathway: PathwayFlowNode };

// ─── Graph Nodes Dataset ───────────────────────────────────────────
const allGraphNodes: Node<PathwayNodeData>[] = [
  // Column 0 - Start
  {
    id: 'class10',
    type: 'pathway',
    position: { x: 420, y: 0 },
    data: {
      id: 'class10',
      label: 'Class 10 Completion',
      stage: 'class10',
      duration: 'Foundation',
      description: 'Core secondary education board exams.',
      requirements: ['Board Examination Score'],
      flexibilityScore: 100,
      backupOptions: ['PCM Science', 'PCB Science', 'Commerce & Finance', 'Humanities / Design'],
      isHighlighted: true,
    },
  },

  // Column 1 - Stream Choices
  {
    id: 'pcm',
    type: 'pathway',
    position: { x: 120, y: 110 },
    data: {
      id: 'pcm',
      label: 'Class 11–12 PCM',
      stage: 'class12stream',
      duration: '2 years',
      description: 'Physics, Chemistry, Mathematics stream.',
      cost: '₹60,000 / yr',
      requirements: ['Min 60% in Class 10 Science & Math'],
      flexibilityScore: 92,
      backupOptions: ['B.Tech Engineering', 'B.Sc Computer Science', 'BCA', 'B.Des Product', 'IPMAT Management'],
      isHighlighted: true,
    },
  },
  {
    id: 'pcb',
    type: 'pathway',
    position: { x: 420, y: 110 },
    data: {
      id: 'pcb',
      label: 'Class 11–12 PCB',
      stage: 'class12stream',
      duration: '2 years',
      description: 'Physics, Chemistry, Biology stream.',
      cost: '₹75,000 / yr',
      requirements: ['Min 65% in Class 10 Science'],
      flexibilityScore: 55,
      backupOptions: ['MBBS Medical', 'B.Sc Biotechnology', 'B.Pharm Pharmacy', 'BDS Dental', 'B.Sc Nursing'],
      isAlternate: true,
    },
  },
  {
    id: 'commerce',
    type: 'pathway',
    position: { x: 720, y: 110 },
    data: {
      id: 'commerce',
      label: 'Commerce & Finance',
      stage: 'class12stream',
      duration: '2 years',
      description: 'Accounts, Economics, Business Studies, Informatics.',
      cost: '₹50,000 / yr',
      requirements: ['Min 55% in Class 10'],
      flexibilityScore: 84,
      backupOptions: ['CA Foundation', 'IPMAT IIM BBA+MBA', 'CLAT BA LLB', 'B.Des UX/UI', 'B.Com Honors'],
      isAlternate: true,
    },
  },

  // Column 2 - Gate / Entrance Exams
  {
    id: 'jee-adv',
    type: 'pathway',
    position: { x: 20, y: 240 },
    data: {
      id: 'jee-adv',
      label: 'JEE Advanced Gate',
      stage: 'entranceexam',
      duration: '1 attempt',
      description: 'IIT Entrance Exam (Top 2.5 Lakh JEE Main candidates).',
      requirements: ['Top 2.5L rank in JEE Main', 'Class 12 PCM >= 75%'],
      isCriticalGate: true,
      flexibilityScore: 40,
      backupOptions: ['NITs via JEE Main', 'MHT-CET State Govt Colleges', 'B.Sc Data Science', 'BCA'],
    },
  },
  {
    id: 'jee-main',
    type: 'pathway',
    position: { x: 190, y: 240 },
    data: {
      id: 'jee-main',
      label: 'JEE Main / State CET',
      stage: 'entranceexam',
      duration: 'National/State',
      description: 'Entrance for NITs, IIITs, and State Engineering Colleges.',
      requirements: ['PCM in Class 12'],
      flexibilityScore: 85,
      backupOptions: ['B.Tech Private', 'B.Sc Computer Science', 'BCA'],
      isHighlighted: true,
    },
  },
  {
    id: 'neet',
    type: 'pathway',
    position: { x: 420, y: 240 },
    data: {
      id: 'neet',
      label: 'NEET-UG Exam Gate',
      stage: 'entranceexam',
      duration: 'Single Attempt',
      description: 'Single national entrance for medical & dental colleges (~5% success rate).',
      requirements: ['PCB in Class 12 with >= 50%'],
      isCriticalGate: true,
      flexibilityScore: 30,
      backupOptions: ['B.Sc Biotechnology (CUET)', 'B.Pharm Pharmacy', 'BDS Dental', 'Allied Health'],
    },
  },
  {
    id: 'ipmat-clat',
    type: 'pathway',
    position: { x: 720, y: 240 },
    data: {
      id: 'ipmat-clat',
      label: 'IPMAT / CLAT / CA Gate',
      stage: 'entranceexam',
      duration: 'National Entrance',
      description: 'Entrance tests for IIM 5-yr BBA+MBA, NLU BA LLB, or ICAI CA Foundation.',
      requirements: ['Class 12 Completion'],
      flexibilityScore: 80,
      backupOptions: ['B.Com Honors (DU/CUET)', 'BBA Fintech', 'Corporate Law Diploma'],
    },
  },

  // Column 3 - Undergraduate Degrees
  {
    id: 'btech-iit',
    type: 'pathway',
    position: { x: 0, y: 370 },
    data: {
      id: 'btech-iit',
      label: 'B.Tech CSE (IIT)',
      stage: 'undergrad',
      duration: '4 years',
      cost: '₹2.5 Lakh / yr',
      description: 'Flagship engineering program at Indian Institutes of Technology.',
      requirements: ['JEE Advanced Rank'],
    },
  },
  {
    id: 'btech-nit',
    type: 'pathway',
    position: { x: 170, y: 370 },
    data: {
      id: 'btech-nit',
      label: 'B.Tech CSE (NIT/COEP)',
      stage: 'undergrad',
      duration: '4 years',
      cost: '₹1.8 Lakh / yr',
      description: 'Premier engineering degree at NITs or top state autonomous colleges.',
      requirements: ['JEE Main / State CET Rank'],
      isHighlighted: true,
    },
  },
  {
    id: 'bsc-cs',
    type: 'pathway',
    position: { x: 330, y: 370 },
    data: {
      id: 'bsc-cs',
      label: 'B.Sc CS / Data Science',
      stage: 'undergrad',
      duration: '3 years',
      cost: '₹60,000 / yr',
      description: 'Degree focusing on computing theory, analytics, and software logic.',
      requirements: ['Class 12 Merit / CUET'],
    },
  },
  {
    id: 'mbbs-degree',
    type: 'pathway',
    position: { x: 490, y: 370 },
    data: {
      id: 'mbbs-degree',
      label: 'MBBS Medical Degree',
      stage: 'undergrad',
      duration: '5.5 years',
      cost: '₹1.5 L - ₹15 L / yr',
      description: 'Clinical medical education + 1 year hospital internship.',
      requirements: ['NEET-UG Qualifying Rank'],
    },
  },
  {
    id: 'bsc-biotech-deg',
    type: 'pathway',
    position: { x: 650, y: 370 },
    data: {
      id: 'bsc-biotech-deg',
      label: 'B.Sc Biotech / B.Pharm',
      stage: 'undergrad',
      duration: '3-4 years',
      cost: '₹90,000 / yr',
      description: 'Degree in molecular biology, genetics, and pharmaceutical formulations.',
      requirements: ['Class 12 PCB Merit'],
    },
  },
  {
    id: 'iim-bba-nlu',
    type: 'pathway',
    position: { x: 810, y: 370 },
    data: {
      id: 'iim-bba-nlu',
      label: 'IIM BBA+MBA / NLU BA LLB',
      stage: 'undergrad',
      duration: '5 years',
      cost: '₹4.5 Lakh / yr',
      description: 'Integrated business management or corporate law degree.',
      requirements: ['IPMAT / CLAT Merit Rank'],
    },
  },

  // Column 4 - Career Outcomes
  {
    id: 'career-se',
    type: 'pathway',
    position: { x: 50, y: 510 },
    data: {
      id: 'career-se',
      label: 'Software Engineer',
      stage: 'career',
      description: 'Building software systems, backend services, and web apps.',
      isHighlighted: true,
    },
  },
  {
    id: 'career-ai',
    type: 'pathway',
    position: { x: 220, y: 510 },
    data: {
      id: 'career-ai',
      label: 'AI / ML Specialist',
      stage: 'career',
      description: 'Designing neural networks, LLMs, and predictive models.',
      isHighlighted: true,
    },
  },
  {
    id: 'career-doctor',
    type: 'pathway',
    position: { x: 490, y: 510 },
    data: {
      id: 'career-doctor',
      label: 'Medical Physician',
      stage: 'career',
      description: 'Clinical diagnostic practice in hospitals or health networks.',
    },
  },
  {
    id: 'career-biotech',
    type: 'pathway',
    position: { x: 650, y: 510 },
    data: {
      id: 'career-biotech',
      label: 'Biotech & Pharma R&D',
      stage: 'career',
      description: 'Genomic analytics, clinical trial operations, bio-manufacturing.',
    },
  },
  {
    id: 'career-mgmt',
    type: 'pathway',
    position: { x: 810, y: 510 },
    data: {
      id: 'career-mgmt',
      label: 'Management / Legal Lead',
      stage: 'career',
      description: 'Corporate strategy consulting, investment banking, or legal counsel.',
    },
  },
];

const defaultEdgeStyle = { stroke: '#9CA3AF', strokeWidth: 1.5 };

const graphEdges: Edge[] = [
  { id: 'e-c10-pcm', source: 'class10', target: 'pcm', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-c10-pcb', source: 'class10', target: 'pcb', type: 'smoothstep', style: { ...defaultEdgeStyle, strokeDasharray: '4,4' } },
  { id: 'e-c10-comm', source: 'class10', target: 'commerce', type: 'smoothstep', style: { ...defaultEdgeStyle, strokeDasharray: '4,4' } },

  { id: 'e-pcm-jeeadv', source: 'pcm', target: 'jee-adv', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-pcm-jeemain', source: 'pcm', target: 'jee-main', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-pcb-neet', source: 'pcb', target: 'neet', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-comm-ipm', source: 'commerce', target: 'ipmat-clat', type: 'smoothstep', style: defaultEdgeStyle },

  { id: 'e-adv-iit', source: 'jee-adv', target: 'btech-iit', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-main-nit', source: 'jee-main', target: 'btech-nit', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-main-bsc', source: 'jee-main', target: 'bsc-cs', type: 'smoothstep', style: { ...defaultEdgeStyle, strokeDasharray: '4,4' } },
  { id: 'e-neet-mbbs', source: 'neet', target: 'mbbs-degree', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-neet-biotech', source: 'neet', target: 'bsc-biotech-deg', type: 'smoothstep', style: { ...defaultEdgeStyle, strokeDasharray: '4,4' } },
  { id: 'e-ipm-iim', source: 'ipmat-clat', target: 'iim-bba-nlu', type: 'smoothstep', style: defaultEdgeStyle },

  { id: 'e-iit-se', source: 'btech-iit', target: 'career-se', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-nit-se', source: 'btech-nit', target: 'career-se', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-nit-ai', source: 'btech-nit', target: 'career-ai', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-bsc-se', source: 'bsc-cs', target: 'career-se', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-mbbs-doc', source: 'mbbs-degree', target: 'career-doctor', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-bio-r&d', source: 'bsc-biotech-deg', target: 'career-biotech', type: 'smoothstep', style: defaultEdgeStyle },
  { id: 'e-iim-mgmt', source: 'iim-bba-nlu', target: 'career-mgmt', type: 'smoothstep', style: defaultEdgeStyle },
];

// ─── Component Props ───────────────────────────────────────────────
interface FutureMapGraphProps {
  selectedStream?: 'PCM' | 'PCB' | 'Commerce' | 'All';
  failedNodeId?: string | null;
  onSelectNode?: (nodeData: PathwayNodeData) => void;
  miniMode?: boolean;
  className?: string;
}

export function FutureMapGraph({
  selectedStream = 'All',
  failedNodeId = null,
  onSelectNode,
  miniMode = false,
  className,
}: FutureMapGraphProps) {
  const nodes = useMemo(() => {
    return allGraphNodes.map((node) => {
      const isFailed = failedNodeId === node.id;

      // Check if node is part of fallback route when a gate fails
      let isFallbackRoute = false;
      if (failedNodeId === 'jee-adv' && (node.id === 'btech-nit' || node.id === 'bsc-cs' || node.id === 'career-se')) {
        isFallbackRoute = true;
      }
      if (failedNodeId === 'neet' && (node.id === 'bsc-biotech-deg' || node.id === 'career-biotech')) {
        isFallbackRoute = true;
      }

      // Stream filter opacity adjustment
      let isAlternate = false;
      if (selectedStream === 'PCM' && node.id !== 'class10' && !['pcm', 'jee-adv', 'jee-main', 'btech-iit', 'btech-nit', 'bsc-cs', 'career-se', 'career-ai'].includes(node.id)) {
        isAlternate = true;
      }
      if (selectedStream === 'PCB' && node.id !== 'class10' && !['pcb', 'neet', 'mbbs-degree', 'bsc-biotech-deg', 'career-doctor', 'career-biotech'].includes(node.id)) {
        isAlternate = true;
      }
      if (selectedStream === 'Commerce' && node.id !== 'class10' && !['commerce', 'ipmat-clat', 'iim-bba-nlu', 'career-mgmt'].includes(node.id)) {
        isAlternate = true;
      }

      return {
        ...node,
        data: {
          ...node.data,
          isFailed,
          isFallbackRoute,
          isAlternate,
        },
      };
    });
  }, [selectedStream, failedNodeId]);

  const edges = useMemo(() => {
    if (!failedNodeId) return graphEdges;
    return graphEdges.map((edge) => {
      if (failedNodeId === 'jee-adv' && edge.source === 'jee-adv') {
        return { ...edge, style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '4,4' } };
      }
      if (failedNodeId === 'jee-adv' && (edge.id === 'e-main-nit' || edge.id === 'e-main-bsc')) {
        return {
          ...edge,
          style: { stroke: '#F59E0B', strokeWidth: 3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
        };
      }
      if (failedNodeId === 'neet' && edge.source === 'neet' && edge.target === 'mbbs-degree') {
        return { ...edge, style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '4,4' } };
      }
      if (failedNodeId === 'neet' && edge.id === 'e-neet-biotech') {
        return {
          ...edge,
          style: { stroke: '#F59E0B', strokeWidth: 3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
        };
      }
      return edge;
    });
  }, [failedNodeId]);

  return (
    <div className={cn('w-full rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50/50', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_evt, node) => onSelectNode && onSelectNode(node.data)}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={!miniMode}
        nodesConnectable={false}
        elementsSelectable={!miniMode}
        panOnScroll={true}
        zoomOnScroll={!miniMode}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={20} size={1} />
        {!miniMode && <Controls className="!shadow-sm !border !border-neutral-200 !rounded-lg" />}
        {!miniMode && (
          <MiniMap
            nodeColor={(n) => {
              const d = n.data as PathwayNodeData;
              if (d.isFailed) return '#EF4444';
              if (d.isFallbackRoute) return '#F59E0B';
              const cfg = stageConfig[d.stage];
              if (!cfg) return '#E5E7EB';
              if (cfg.bg.includes('navy')) return '#1E3A5F';
              if (cfg.bg.includes('success')) return '#059669';
              if (cfg.bg.includes('warning')) return '#D97706';
              return '#6B7280';
            }}
            maskColor="rgba(249,250,251,0.8)"
            className="!border !border-neutral-200 !rounded-lg !shadow-sm"
          />
        )}
      </ReactFlow>
    </div>
  );
}
