import { AnimationResult, AnimationStep, StepType } from '../animation/types';
import { Cell, Maze } from './maze';
import { StackFrontier, QueueFrontier } from './frontier';

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

  maze.solve(StackFrontier);

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
