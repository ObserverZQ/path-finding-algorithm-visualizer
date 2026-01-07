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

  informedSearch(
    heuristicType: string,
    useAStar: boolean = true,
    options: any
  ): void {
    this.numExplored = 0;
    this.steps = [];

    const startTime = performance.now();
    if (options.biDirectional) {
      this.biDirectionalSearch(heuristicType, useAStar);
    } else {
      this.uniDirectionalInformedSearch(heuristicType, useAStar);
    }
    const endTime = performance.now();
    this.runtime = endTime - startTime;
    console.log('Runtime:', this.runtime);
  }

  private uniDirectionalInformedSearch(
    heuristicType: string,
    useAStar: boolean
  ): void {
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
        this.reconstructPath(cell);
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
  private reconstructPath(cell: Cell): void {
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
  }
  private biDirectionalSearch(heuristicType: string, useAStar: boolean): void {
    const startCell = new AStarCell(
      this.start,
      undefined,
      '',
      0,
      this.getHeuristic(this.start, heuristicType)
    );

    const goalCell = new AStarCell(
      this.goal,
      undefined,
      '',
      0,
      this.getHeuristic(this.goal, heuristicType)
    );

    const frontierStart: AStarCell[] = [startCell];
    const frontierGoal: AStarCell[] = [goalCell];
    const exploredStart = new Set<string>();
    const exploredGoal = new Set<string>();
    const cellMapStart = new Map<string, AStarCell>();
    const cellMapGoal = new Map<string, AStarCell>();

    cellMapStart.set(`${this.start[0]},${this.start[1]}`, startCell);
    cellMapGoal.set(`${this.goal[0]},${this.goal[1]}`, goalCell);

    while (frontierStart.length > 0 && frontierGoal.length > 0) {
      // Expand from start
      const meetPoint = this.expandBiDirectional(
        frontierStart,
        exploredStart,
        cellMapStart,
        exploredGoal,
        cellMapGoal,
        heuristicType,
        useAStar,
        true
      );

      if (meetPoint) {
        this.reconstructBiDirectionalPath(
          meetPoint.startCell,
          meetPoint.goalCell
        );
        return;
      }

      // Expand from goal
      const meetPoint2 = this.expandBiDirectional(
        frontierGoal,
        exploredGoal,
        cellMapGoal,
        exploredStart,
        cellMapStart,
        heuristicType,
        useAStar,
        false
      );
      if (meetPoint2) {
        this.reconstructBiDirectionalPath(
          meetPoint2.startCell,
          meetPoint2.goalCell
        );
        return;
      }
    }

    throw new Error('no solution');
  }

  private expandBiDirectional(
    frontier: AStarCell[],
    explored: Set<string>,
    cellMap: Map<string, AStarCell>,
    oppositeExplored: Set<string>,
    oppositeCellMap: Map<string, AStarCell>,
    heuristicType: string,
    useAStar: boolean,
    fromStart: boolean
  ): { startCell: AStarCell; goalCell: AStarCell } | null {
    if (frontier.length === 0) return null;

    frontier.sort((a, b) => {
      const scoreA = useAStar ? a.f : a.h;
      const scoreB = useAStar ? b.f : b.h;
      return scoreA - scoreB;
    });

    const cell = frontier.shift()!;
    const stateKey = `${cell.state[0]},${cell.state[1]}`;

    if (explored.has(stateKey)) return null;

    explored.add(stateKey);
    this.numExplored += 1;

    this.steps.push({
      type: StepType.NodeExplored,
      position: cell.state,
    });
    const neighbors = this.neighbors(cell.state);
    for (const [action, state] of Object.entries(neighbors)) {
      const neighborKey = `${state[0]},${state[1]}`;

      // Check if we've met the opposite search
      if (oppositeExplored.has(neighborKey)) {
        const oppositeCell = oppositeCellMap.get(neighborKey)!;
        return fromStart
          ? { startCell: cell, goalCell: oppositeCell }
          : { startCell: oppositeCell, goalCell: cell };
      }

      if (!explored.has(neighborKey)) {
        const moveCost = 1;
        const g = cell.g + moveCost;
        const targetPos = fromStart ? this.goal : this.start;
        const h = this.getHeuristic(state, heuristicType);
        const child = new AStarCell(state, cell, action, g, h);

        const existingIdx = frontier.findIndex(
          (c) => c.state[0] === state[0] && c.state[1] === state[1]
        );
        const childScore = useAStar ? child.f : child.h;

        if (existingIdx === -1) {
          frontier.push(child);
          cellMap.set(neighborKey, child);
          this.steps.push({
            type: StepType.NodeAdded,
            position: state,
          });
        } else if (
          childScore <
          (useAStar ? frontier[existingIdx].f : frontier[existingIdx].h)
        ) {
          frontier[existingIdx] = child;
          cellMap.set(neighborKey, child);
        }
      }
    }

    return null;
  }

  private reconstructBiDirectionalPath(
    startCell: AStarCell,
    goalCell: AStarCell
  ): void {
    const cells: Position[] = [];

    // Trace from start to meeting point
    let current: Cell | undefined = startCell;
    while (current) {
      cells.unshift(current.state);
      current = current.parent;
    }

    // Trace from meeting point to goal
    current = goalCell.parent;
    while (current) {
      cells.push(current.state);
      current = current.parent;
    }

    this.solution = { actions: [], cells };

    cells.forEach((pos) => {
      this.steps.push({
        type: StepType.PathFound,
        position: pos,
      });
    });
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
  maze.informedSearch(options.heuristic, true, options);
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
    runtime: maze.runtime,
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
  maze.informedSearch(options.heuristic, false, options);
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
    runtime: maze.runtime,
  };
};
