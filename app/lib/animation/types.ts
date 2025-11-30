import type { Position } from '../algorithms/types';

export enum StepType {
  NodeExplored = 'NodeExplored',
  NodeAdded = 'NodeAdded',
  PathFound = 'PathFound',
}

export interface AnimationStep {
  type: StepType;
  gridId?: string;
  position: Position;
  timestamp?: number;
}

export interface AnimationResult {
  steps: AnimationStep[];
  path: Position[];
  nodesExplored: number;
  runtime?: number;
}
