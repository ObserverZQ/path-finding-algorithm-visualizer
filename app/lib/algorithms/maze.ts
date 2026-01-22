import { AnimationStep, StepType } from '../animation/types';
import type { Row, Position } from './types';
import { Frontier } from './frontier';

export class Cell {
  state: Position;
  parent: Cell | undefined;
  action: string;

  constructor(state: Position, parent: Cell | undefined, action: string) {
    this.state = state;
    this.parent = parent;
    this.action = action;
  }
}

export class Maze {
  width: number;
  height: number;
  walls: Array<Row>;
  solution: object;
  start: Position;
  goal: Position;
  numExplored: number;
  steps: AnimationStep[];
  runtime: number;

  constructor(
    width: number,
    height: number,
    start: Position,
    goal: Position,
    walls: boolean[][]
  ) {
    this.width = width;
    this.height = height;
    this.start = start;
    this.goal = goal;
    this.walls = walls;
    this.solution = {};
    this.numExplored = 0;
    this.steps = [];
    this.runtime = 0;
  }

  neighbors(state: Position): Record<string, Position> {
    const [row, col] = state;
    const candidates: Record<string, Position> = {
      up: [row - 1, col],
      down: [row + 1, col],
      left: [row, col - 1],
      right: [row, col + 1],
    };

    const result: Record<string, Position> = {};
    for (const [key, value] of Object.entries(candidates) as [
      string,
      Position
    ][]) {
      const [r, c] = value;
      if (
        0 <= r &&
        r < this.height &&
        0 <= c &&
        c < this.width &&
        !this.walls[r][c]
      ) {
        result[key] = value;
      }
    }
    return result;
  }

  solve(FrontierClass: new (cells: Cell[]) => Frontier): void {
    // Keep track of number of states explored
    const startTime = performance.now();
    this.numExplored = 0;
    const start = new Cell(this.start, undefined, '');
    // console.log('start', start);
    // Initialize frontier to just the starting position
    const frontier = new FrontierClass([start]);
    // Initialize an empty explored set
    // console.log('frontier', frontier);
    const explored = new Set<string>();

    while (true) {
      if (frontier.empty()) {
        throw Error('no solution');
      }

      // Choose a node from the frontier
      let cell = frontier.remove() as Cell;
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      // Mark node as explored
      explored.add(stateKey);
      this.numExplored += 1;
      this.steps.push({
        type: StepType.NodeExplored,
        position: cell.state,
      });

      // If we find the goal in the frontier, record the path and return
      if (cell.state[0] === this.goal[0] && cell.state[1] === this.goal[1]) {
        const actions = [];
        const cells = [];
        while (cell.parent) {
          actions.push(cell.action);
          cells.push(cell.state);
          cell = cell.parent;
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
        const endTime = performance.now();
        this.runtime = endTime - startTime;
        return;
      }

      // Add neighbors to frontier
      const neighbors = this.neighbors(cell.state);
      for (const [action, state] of Object.entries(neighbors)) {
        const neighborKey = `${state[0]},${state[1]}`;
        // If the state is not in the frontier and not explored, add it
        if (!frontier.contains_state(state) && !explored.has(neighborKey)) {
          const child = new Cell(state, cell, action);
          frontier.add(child);

          this.steps.push({
            type: StepType.NodeAdded,
            position: state,
          });
        }
      }
    }
  }
}
