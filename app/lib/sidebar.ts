import { create } from 'zustand';

export enum SearchStatus {
  Idle = 'Idle',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed',
}

// Algorithm grouping by option type
const algorithmsByOptions = {
  base: ['BFS', 'DFS'] as const,
  weighted: ['Greedy Best-First', 'AStar'] as const,
} as const;

export const AlgorithmType = {
  BFS: 'Breadth-First Search',
  DFS: 'Depth-First Search',
  GreedyBestFirst: 'Greedy Best-First Search',
  AStar: 'A* Search',
} as const;

export type AlgorithmTypeKey =
  (typeof AlgorithmType)[keyof typeof AlgorithmType];

export enum Heuristic {
  Manhattan = 'Manhattan',
  Euclidean = 'Euclidean',
  Octile = 'Octile',
  Chebyshev = 'Chebyshev',
}

// Option type definitions
export interface BaseOptions {
  allowDiagonal: boolean;
  biDirectional: boolean;
  // doNotCrossCorners: boolean;
}

export interface WeightedOptions extends BaseOptions {
  weight: number;
}

export type OptionsMap = {
  [AlgorithmType.BFS]: BaseOptions;
  [AlgorithmType.DFS]: BaseOptions;
  [AlgorithmType.GreedyBestFirst]: WeightedOptions;
  [AlgorithmType.AStar]: WeightedOptions;
};

export type OptionsUnion = BaseOptions | WeightedOptions;

export type Algorithm = {
  name: AlgorithmTypeKey;
  options: OptionsUnion;
  heuristic?: Heuristic; // Only for A* currently
};

type Metrics = {
  runtime: number;
  operations: number;
  visitedNodes: number;
  pathLength: number;
};

// Default options
export const defaultBaseOptions: BaseOptions = {
  allowDiagonal: false,
  biDirectional: false,
  // doNotCrossCorners: false,
};

export const defaultWeightedOptions: WeightedOptions = {
  ...defaultBaseOptions,
  weight: 1,
};

export const defaultHeuristic: Heuristic = Heuristic.Manhattan;

// Create defaults dynamically
export const defaults: OptionsMap = {
  [AlgorithmType.BFS]: defaultBaseOptions,
  [AlgorithmType.DFS]: defaultBaseOptions,
  [AlgorithmType.GreedyBestFirst]: defaultWeightedOptions,
  [AlgorithmType.AStar]: defaultWeightedOptions,
};

// Helper to check if algorithm uses weights
const usesWeight = (name: AlgorithmTypeKey): boolean => {
  return algorithmsByOptions.weighted.includes(name as any);
};

// Helper to check if algorithm supports heuristics
const supportsHeuristic = (name: AlgorithmTypeKey): boolean => {
  const informedSearchAlgorithms: AlgorithmTypeKey[] = [
    AlgorithmType.AStar,
    AlgorithmType.GreedyBestFirst,
  ];
  return informedSearchAlgorithms.includes(name);
};

interface SideBarState {
  algorithm: Algorithm;
  status: SearchStatus;
  metrics: Metrics;
  setStatus: (status: SearchStatus) => void;
  setAlgorithm: (alg: AlgorithmTypeKey) => void;
  setAlgorithmOptions: (
    alg: AlgorithmTypeKey,
    opts: Partial<OptionsUnion>
  ) => void;
  setAlgorithmHeuristic: (heuristic: Heuristic) => void;
  setMetrics: (metrics: Metrics) => void;
}

export const useSideBarStore = create<SideBarState>()((set) => ({
  algorithm: {
    name: AlgorithmType.BFS,
    options: defaults[AlgorithmType.BFS],
    heuristic: undefined,
  },
  status: SearchStatus.Idle,
  metrics: { runtime: 0, operations: 0, visitedNodes: 0, pathLength: 0 },
  setStatus(status: SearchStatus) {
    set({ status });
  },

  setAlgorithm: (alg: AlgorithmTypeKey) => {
    const algorithm: Algorithm = {
      name: alg,
      options: defaults[alg as keyof typeof defaults],
      heuristic: supportsHeuristic(alg) ? defaultHeuristic : undefined,
    };
    console.log('Setting algorithm to:', algorithm);
    set({ algorithm });
  },

  setAlgorithmOptions: (alg: AlgorithmTypeKey, opts: Partial<OptionsUnion>) => {
    set((state) => {
      if (state.algorithm.name !== alg) return state;
      return {
        algorithm: {
          ...state.algorithm,
          options: { ...state.algorithm.options, ...opts },
        },
      };
    });
  },

  setAlgorithmHeuristic: (heuristic: Heuristic) => {
    console.log('Setting heuristic to:', heuristic);
    set((state) => ({
      algorithm: { ...state.algorithm, heuristic },
    }));
  },

  setMetrics: (metrics: Metrics) => {
    set({ metrics });
  },
}));
