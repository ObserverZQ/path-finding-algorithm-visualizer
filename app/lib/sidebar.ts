import { create } from 'zustand';

export enum Algorithm {
  BFS = 'BFS',
  DFS = 'DFS',
  Dijkstra = 'Dijkstra',
  AStar = 'A*',
}

export enum Heuristic {
  Manhattan = 'Manhattan',
  Euclidean = 'Euclidean',
  Octile = 'Octile',
  Chebyshev = 'Chebyshev',
}

interface BaseOptions {
  allowDiagonal: boolean;
  biDirectional: boolean;
  doNotCrossCorners: boolean;
}

export interface AStarOptions extends BaseOptions {
  heuristic: Heuristic;
  weight?: number;
}

export type OptionsMap = {
  [Algorithm.BFS]: BaseOptions;
  [Algorithm.DFS]: BaseOptions;
  [Algorithm.Dijkstra]: BaseOptions;
  [Algorithm.AStar]: AStarOptions;
};

export type OptionsUnion = OptionsMap[Algorithm];

// default options
const defaultBaseOptions: BaseOptions = {
  allowDiagonal: false,
  biDirectional: false,
  doNotCrossCorners: false,
};

const defaultAStarOptions: AStarOptions = {
  ...defaultBaseOptions,
  heuristic: Heuristic.Manhattan,
  weight: 1,
};

const defaults: OptionsMap = {
  [Algorithm.BFS]: defaultBaseOptions,
  [Algorithm.DFS]: defaultBaseOptions,
  [Algorithm.Dijkstra]: defaultBaseOptions,
  [Algorithm.AStar]: defaultAStarOptions,
};

/** State Definition */
interface SideBarState {
  algorithm: { name: Algorithm; options: OptionsUnion };
  setAlgorithm: (alg: Algorithm) => void;
  setAlgorithmOptions: <K extends Algorithm>(
    alg: K,
    opts: Partial<OptionsMap[K]>
  ) => void;
}

export const useSideBarStore = create<SideBarState>()((set) => ({
  algorithm: { name: Algorithm.BFS, options: defaults[Algorithm.BFS] },
  setAlgorithm: (alg: Algorithm) => {
    set({ algorithm: { name: alg, options: defaults[alg] } });
  },
  setAlgorithmOptions: <K extends Algorithm>(
    alg: K,
    opts: Partial<OptionsMap[K]>
  ) => {
    set((state: SideBarState) => {
      const currentOptions = state.algorithm.options as OptionsMap[K];
      const mergedOptions = { ...currentOptions, ...opts };
      return { algorithm: { name: alg, options: mergedOptions } };
    });
  },
}));
