import { Cell, Maze } from './maze';
import type { Position } from './types';
import { StepType } from '../animation/types';

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
  heuristic(pos: Position, type: string): number {
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

  // todo: solveAStar method implementation
}
