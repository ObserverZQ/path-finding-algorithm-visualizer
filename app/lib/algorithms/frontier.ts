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

export abstract class BidirectionalFrontier {
  frontierStart: Cell[];
  frontierGoal: Cell[];

  constructor(cellsStart: Cell, cellsGoal: Cell) {
    this.frontierStart = [cellsStart];
    this.frontierGoal = [cellsGoal];
  }

  abstract addToStart(cell: Cell): void;
  abstract addToGoal(cell: Cell): void;
  abstract removeFromStart(): Cell;
  abstract removeFromGoal(): Cell;

  emptyStart(): boolean {
    return this.frontierStart.length === 0;
  }

  emptyGoal(): boolean {
    return this.frontierGoal.length === 0;
  }

  containsStateInStart(state: Position): boolean {
    return this.frontierStart.some(
      (c) => c.state[0] === state[0] && c.state[1] === state[1]
    );
  }

  containsStateInGoal(state: Position): boolean {
    return this.frontierGoal.some(
      (c) => c.state[0] === state[0] && c.state[1] === state[1]
    );
  }
}

export class BidirectionalQueueFrontier extends BidirectionalFrontier {
  addToStart(cell: Cell): void {
    this.frontierStart.push(cell);
  }

  addToGoal(cell: Cell): void {
    this.frontierGoal.push(cell);
  }

  removeFromStart(): Cell {
    return this.frontierStart.shift()!;
  }

  removeFromGoal(): Cell {
    return this.frontierGoal.shift()!;
  }
}

export class BidirectionalStackFrontier extends BidirectionalFrontier {
  addToStart(cell: Cell): void {
    this.frontierStart.push(cell);
  }

  addToGoal(cell: Cell): void {
    this.frontierGoal.push(cell);
  }

  removeFromStart(): Cell {
    return this.frontierStart.pop()!;
  }

  removeFromGoal(): Cell {
    return this.frontierGoal.pop()!;
  }
}