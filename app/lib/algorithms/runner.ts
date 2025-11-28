import { Algorithm } from '@/app/lib/sidebar';
import { AnimationStep } from "@/app/lib/animation/types";
import { solveDFS } from './dfs';

export interface AlgorithmResult {
    steps?: AnimationStep[];
    path: Array<[number, number]>;
    nodesExplored: number;
}

export const runAlgorithm = (
    algorithm: Algorithm,
    walls: boolean[][],
    start: [number, number],
    goal: [number, number],
    options: any
): AlgorithmResult => {
    switch (algorithm) {
        case Algorithm.DFS:
            return solveDFS(walls, start, goal, options);
        // throw new Error('DFS not implemented yet');
        case Algorithm.BFS:
            throw new Error('BFS not implemented yet');
        case Algorithm.Dijkstra:
            throw new Error('Dijkstra not implemented yet');
        case Algorithm.AStar:
            throw new Error('A* not implemented yet');
        default:
            throw new Error(`Unknown algorithm: ${algorithm}`);
    }
};