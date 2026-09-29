import type { Pathway } from '@/types';
import { pathways as pcmPathways, alternateExamNodes } from './pcm';
import { pcbPathways } from './pcb';
import { commercePathways } from './commerce';

export const allPathways: Pathway[] = [...pcmPathways, ...pcbPathways, ...commercePathways];

export { pcmPathways, pcbPathways, commercePathways, alternateExamNodes };

export function getPathwaysByStream(stream: string): Pathway[] {
  if (!stream || stream === 'All') return allPathways;
  const s = stream.toLowerCase();
  return allPathways.filter((p) => {
    const ps = p.stream.toLowerCase();
    return ps.includes(s) || ps.includes('any');
  });
}

export function getPathwayById(id: string): Pathway | undefined {
  return allPathways.find((p) => p.id === id);
}
