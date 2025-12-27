import { Cell, Maze } from './maze';
import type { Position } from './types';
import { StepType } from '../animation/types';
import { use } from 'react';

export class AStarCell extends Cell {
  g: number; // Cost from start to current node
  h: number; // Heuristic cost estimate to goal
  f: number; // Total cost

  constructor(
    state: Position,
    parent: Cell | undefined,
    action: string,
    g: number,
    h: number
  ) {
    super(state, parent, action);
    this.g = g;
    this.h = h;
    this.f = g + h;
  }
}

export class AStarMaze extends Maze {
  getHeuristic(pos: Position, type: string): number {
    const [y, x] = pos;
    const [goalY, goalX] = this.goal;
    const dx = Math.abs(x - goalX);
    const dy = Math.abs(y - goalY);

    switch (type) {
      case 'Manhattan':
        return dx + dy;
      case 'Euclidean':
        return Math.sqrt(dy ** 2 + dx ** 2);
      case 'Octile':
        const F = Math.SQRT2 - 1;
        return dx < dy ? F * dx + dy : F * dy + dx;
      case 'Chebyshev':
        return Math.max(dx, dy);
      default:
        return 0;
    }
  }

  informedSearch(heuristicType: string, useAStar: boolean = true): void {
    this.numExplored = 0;
    this.steps = [];

    const startCell = new AStarCell(
      this.start,
      undefined,
      '',
      0,
      this.getHeuristic(this.start, heuristicType)
    );

    // priority queue (sorted by f for A*, h for Greedy)
    const frontier: AStarCell[] = [startCell];
    const explored = new Set<string>();

    while (frontier.length > 0) {
      // 1. sort by f (A*) or h (Greedy Best-First)
      frontier.sort((a, b) => {
        const scoreA = useAStar ? a.f : a.h;
        const scoreB = useAStar ? b.f : b.h;
        return scoreA - scoreB;
      });

      const cell = frontier.shift()!;
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      // skip explored nodes
      if (explored.has(stateKey)) continue;

      explored.add(stateKey);
      this.numExplored += 1;

      this.steps.push({
        type: StepType.NodeExplored,
        position: cell.state,
      });

      // Check if goal reached, return if so
      if (cell.state[0] === this.goal[0] && cell.state[1] === this.goal[1]) {
        const actions = [];
        const cells = [];
        let current: Cell | undefined = cell;

        while (current?.parent) {
          actions.push(current.action);
          cells.push(current.state);
          current = current.parent;
        }

        actions.reverse();
        cells.reverse();
        this.solution = { actions, cells };

        cells.forEach((pos) => {
          this.steps.push({
            type: StepType.PathFound,
            position: pos,
          });
        });

        return;
      }

      const neighbors = this.neighbors(cell.state);
      for (const [action, state] of Object.entries(neighbors)) {
        const neighborKey = `${state[0]},${state[1]}`;

        if (!explored.has(neighborKey)) {
          const moveCost = 1; // uniform cost
          const g = cell.g + moveCost;
          const h = this.getHeuristic(state, heuristicType);
          const child = new AStarCell(state, cell, action, g, h);

          // check if already in frontier with worse score
          const existingIdx = frontier.findIndex(
            (c) => c.state[0] === state[0] && c.state[1] === state[1]
          );
          const childScore = useAStar ? child.f : child.h;

          // does not exist in frontier, add it
          if (existingIdx === -1) {
            frontier.push(child);
            this.steps.push({
              type: StepType.NodeAdded,
              position: state,
            });
            // does exist but found a bette path, update it
          } else if (
            childScore <
            (useAStar ? frontier[existingIdx].f : frontier[existingIdx].h)
          ) {
            frontier[existingIdx] = child;
          }
        }
      }
    }

    throw new Error('no solution');
  }
}

export const solveAStar = (
  walls: boolean[][],
  start: [number, number],
  goal: [number, number],
  options: any
): any => {
  const height = walls.length;
  const width = walls[0].length;
  const maze = new AStarMaze(width, height, start, goal, walls);
  maze.start = start;
  maze.goal = goal;
  maze.informedSearch(options.heuristic, true);
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
  };
};

export const solveGreedyBestFirst = (
  walls: boolean[][],
  start: [number, number],
  goal: [number, number],
  options: any
): any => {
  const height = walls.length;
  const width = walls[0].length;
  const maze = new AStarMaze(width, height, start, goal, walls);
  maze.start = start;
  maze.goal = goal;
  maze.informedSearch(options.heuristic, false);
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
  };
};
