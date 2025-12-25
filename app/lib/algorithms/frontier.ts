import type { Position } from './types';
import type { Cell } from './maze';

export abstract class Frontier {
  frontier: Cell[];

  constructor(cells: Cell[]) {
    this.frontier = cells;
  }

  abstract add(cell: Cell): void;
  abstract remove(): Cell;

  contains_state(state: Position): boolean {
    return this.frontier.some(
      (c) => c.state[0] === state[0] && c.state[1] === state[1]
    );
  }

  empty(): boolean {
    return this.frontier.length === 0;
  }
}

export class StackFrontier extends Frontier {
  add(cell: Cell): void {
    this.frontier.push(cell);
  }

  remove(): Cell {
    return this.frontier.pop()!;
  }
}

export class QueueFrontier extends Frontier {
  add(cell: Cell): void {
    this.frontier.push(cell);
  }

  remove(): Cell {
    return this.frontier.shift()!;
  }
}
