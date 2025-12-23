import { AnimationResult, AnimationStep, StepType } from '../animation/types';
import type { Row, Position } from './types';
import { Cell, Maze } from './maze';

class StackFrontier {
  frontier: Array<Cell>;

  constructor(cells: Array<Cell>) {
    this.frontier = cells;
  }

  add(cell: Cell) {
    this.frontier.push(cell);
  }

  contains_state(state: Position): boolean {
    return this.frontier.some(
      (cell) => cell.state[0] === state[0] && cell.state[1] === state[1]
    );
  }

  empty(): boolean {
    return this.frontier.length === 0;
  }

  remove() {
    if (this.empty()) {
      throw new Error('Frontier is empty');
    } else {
      const cell = this.frontier.pop();
      return cell;
    }
  }
}
class QueueFrontier extends StackFrontier {
  remove() {
    if (this.empty()) {
      throw new Error('Frontier is empty');
    } else {
      const cell = this.frontier.shift();
      return cell;
    }
  }
}

export const solveDFS = (
  walls: boolean[][],
  start: [number, number],
  goal: [number, number],
  options: any
): AnimationResult => {
  const height = walls.length;
  const width = walls[0].length;
  const maze = new Maze(width, height, start, goal, walls);
  maze.start = start;
  maze.goal = goal;

  maze.solve();

  // todo: Generate animation steps from the explored nodes and solution path
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
  };
};

export const solveBFS = (
  walls: boolean[][],
  start: [number, number],
  goal: [number, number],
  options: any
): AnimationResult => {
  const height = walls.length;
  const width = walls[0].length;
  const maze = new Maze(width, height, start, goal, walls);
  maze.start = start;
  maze.goal = goal;

  maze.solve(QueueFrontier);

  // todo: Generate animation steps from the explored nodes and solution path
  return {
    path: (maze.solution as any).cells,
    nodesExplored: maze.numExplored,
    steps: maze.steps,
  };
};
