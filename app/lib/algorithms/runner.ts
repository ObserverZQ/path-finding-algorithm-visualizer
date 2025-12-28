import { AlgorithmType, AlgorithmTypeKey } from '@/app/lib/sidebar';
import { AnimationResult, AnimationStep } from '@/app/lib/animation/types';
import { solveDFS, solveBFS } from './dfs';
import { solveAStar, solveGreedyBestFirst } from './astar';

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
    case AlgorithmType.BFS:
      return solveBFS(walls, start, goal, options);
    case AlgorithmType.GreedyBestFirst:
      return solveGreedyBestFirst(walls, start, goal, options);
    case AlgorithmType.AStar:
      return solveAStar(walls, start, goal, options);
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
};
