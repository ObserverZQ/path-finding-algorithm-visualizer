import { AlgorithmType, AlgorithmTypeKey } from '@/app/lib/sidebar';
import { AnimationResult, AnimationStep } from '@/app/lib/animation/types';
import { solveDFS, solveBFS } from './dfs';

export const runAlgorithm = (
  algorithm: AlgorithmTypeKey,
  walls: boolean[][],
  start: [number, number],
  goal: [number, number],
  options: any
): AnimationResult => {
  switch (algorithm) {
    case AlgorithmType.DFS:
      return solveDFS(walls, start, goal, options);
    // throw new Error('DFS not implemented yet');
    case AlgorithmType.BFS:
      return solveBFS(walls, start, goal, options);
    case AlgorithmType.GreedyBestFirst:
      throw new Error('Greedy Best-First Search not implemented yet');
    case AlgorithmType.AStar:
      throw new Error('A* Search not implemented yet');
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
};
