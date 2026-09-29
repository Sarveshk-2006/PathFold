import { useState } from 'react';
import { FutureMapGraph, type PathwayNodeData } from '@/components/pathway/FutureMapGraph';
import { NodeDetailDrawer } from '@/components/pathway/NodeDetailDrawer';
import { OptionKeeperPanel } from '@/components/pathway/OptionKeeperPanel';
import { Button } from '@/components/ui/Button';
import { Layers, Network, RefreshCw, AlertTriangle } from 'lucide-react';

export function FutureMapPage() {
  const [selectedStream, setSelectedStream] = useState<'All' | 'PCM' | 'PCB' | 'Commerce'>('All');
  const [activeTab, setActiveTab] = useState<'graph' | 'optionKeeper'>('graph');
  const [selectedNode, setSelectedNode] = useState<PathwayNodeData | null>(null);
  const [failedNodeId, setFailedNodeId] = useState<string | null>(null);

  const handleTestFailureScenario = (nodeId: string) => {
    setFailedNodeId(nodeId);
  };

  const handleResetFailureScenario = () => {
    setFailedNodeId(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-neutral-50 relative">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-neutral-200 bg-white gap-3 shrink-0">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Education-to-Career Pathway Map</h2>
          <p className="text-xs text-neutral-500">Interactive decision graph starting from Class 10</p>
        </div>

        {/* View mode switcher tabs */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'graph' ? 'bg-white text-navy-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Network className="h-3.5 w-3.5 text-navy-600" />
            Interactive Graph View
          </button>
          <button
            onClick={() => setActiveTab('optionKeeper')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'optionKeeper' ? 'bg-white text-navy-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-navy-600" />
            Option Keeper & Matrix
          </button>
        </div>

        {/* Stream Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-neutral-400 mr-1 hidden sm:inline">Stream:</span>
          {(['All', 'PCM', 'PCB', 'Commerce'] as const).map((stream) => (
            <button
              key={stream}
              onClick={() => setSelectedStream(stream)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                selectedStream === stream
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      {/* Active Scenario Indicator Banner */}
      {failedNodeId && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />
            <span>
              <strong>What-If Scenario Active:</strong> Gate failure test active for node{' '}
              <span className="font-bold underline">{failedNodeId.toUpperCase()}</span>. Active fallback path highlighted on map!
            </span>
          </div>
          <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={handleResetFailureScenario}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Map View
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'graph' ? (
        <div className="flex-1 flex flex-col min-h-[550px]">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 px-5 py-2 border-b border-neutral-200 bg-white text-xs text-neutral-500 shrink-0">
            {[
              { label: 'Start / Milestone', color: 'bg-neutral-800' },
              { label: 'Stream Choice', color: 'bg-navy-700' },
              { label: 'Entrance Exam Gate', color: 'bg-warning-600' },
              { label: 'Undergraduate Degree', color: 'bg-navy-100 border border-navy-300' },
              { label: 'Career Outcome', color: 'bg-success-100 border border-success-300' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`h-3 w-3 rounded-sm ${item.color}`} />
                {item.label}
              </div>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 border-t-2 border-neutral-400" />
                <span>Primary Path</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 border-t-2 border-dashed border-neutral-400" />
                <span>Alternative Route</span>
              </div>
            </div>
          </div>

          {/* Interactive ReactFlow Graph */}
          <div className="w-full h-[600px] relative">
            <FutureMapGraph
              selectedStream={selectedStream}
              failedNodeId={failedNodeId}
              onSelectNode={(node) => setSelectedNode(node)}
              className="w-full h-full rounded-none border-0"
            />
          </div>

          {/* Info Footer */}
          <div className="px-5 py-2.5 border-t border-neutral-200 bg-white text-xs text-neutral-500 flex flex-wrap justify-between gap-4 shrink-0">
            <span>💡 <strong>Click any node</strong> to open detail drawer & test what-if scenarios</span>
            <span>📌 Scroll to zoom graph • Drag canvas to pan</span>
          </div>
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto w-full">
          <OptionKeeperPanel />
        </div>
      )}

      {/* Side Drawer for Node Click Details */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onTestFailureScenario={handleTestFailureScenario}
        onResetFailureScenario={handleResetFailureScenario}
        isTestingFailure={failedNodeId === selectedNode?.id}
      />
    </div>
  );
}
