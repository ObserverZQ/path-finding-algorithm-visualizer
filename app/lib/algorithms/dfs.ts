import { AnimationResult, AnimationStep, StepType } from '../animation/types';
import { Cell, Maze } from './maze';
import type { Position } from './types';
import { StackFrontier, QueueFrontier, BidirectionalStackFrontier, BidirectionalQueueFrontier } from './frontier';

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

  if (options?.biDirectional) {
    return solveBidirectionalDFS(maze, walls);
  } else {
    maze.solve(StackFrontier);
  }

  // todo: Generate animation steps from the explored nodes and solution path
  return {
    path: (maze.solution as any).cells || [],
    nodesExplored: maze.numExplored,
    steps: maze.steps,
    runtime: maze.runtime,
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
  if (options?.biDirectional) {
    return solveBidirectionalBFS(maze, walls);
  }
  maze.solve(QueueFrontier);
  // todo: Generate animation steps from the explored nodes and solution path
  return {
    path: (maze.solution as any).cells || [],
    nodesExplored: maze.numExplored,
    steps: maze.steps,
    runtime: maze.runtime,
  };
};


// Helper function to reconstruct path from both directions
function reconstructBidirectionalPath(
  cellStart: Cell,
  cellGoal: Cell
): Position[] {
  const path: Position[] = [];

  // Trace back from start to meeting point
  let current: Cell | undefined = cellStart;
  const startPath: Position[] = [];
  while (current) {
    startPath.push(current.state);
    current = current.parent;
  }
  startPath.reverse();

  // Trace back from goal to meeting point
  current = cellGoal;
  const goalPath: Position[] = [];
  while (current) {
    goalPath.push(current.state);
    current = current.parent;
  }

  // Combine paths
  path.push(...startPath.slice(1));
  path.push(...goalPath.slice(1));

  return path;
}

function solveBidirectionalDFS(maze: Maze, walls: boolean[][]): AnimationResult {
  const startTime = performance.now();
  let nodesExplored = 0;
  const steps: AnimationStep[] = [];

  const startCell = new Cell(maze.start, undefined, '');
  const goalCell = new Cell(maze.goal, undefined, '');

  const frontier = new BidirectionalStackFrontier(startCell, goalCell);
  const exploredStart = new Set<string>();
  const exploredGoal = new Set<string>();
  const parentStart = new Map<string, Cell>();
  const parentGoal = new Map<string, Cell>();

  parentStart.set(`${maze.start[0]},${maze.start[1]}`, startCell);
  parentGoal.set(`${maze.goal[0]},${maze.goal[1]}`, goalCell);

  let meetingPoint: Position | null = null;
  let cellFromStart: Cell | null = null;
  let cellFromGoal: Cell | null = null;

  while (!frontier.emptyStart() && !frontier.emptyGoal()) {
    // Expand from start
    if (!frontier.emptyStart()) {
      const cell = frontier.removeFromStart();
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      if (!exploredStart.has(stateKey)) {
        exploredStart.add(stateKey);
        nodesExplored++;
        steps.push({
          type: StepType.NodeExplored,
          position: cell.state,
        });

        // Check if we met the other search
        if (exploredGoal.has(stateKey)) {
          meetingPoint = cell.state;
          cellFromStart = cell;
          cellFromGoal = parentGoal.get(stateKey)!;
          break;
        }
        const neighbors = maze.neighbors(cell.state);
        for (const [action, state] of Object.entries(neighbors)) {
          const neighborKey = `${state[0]},${state[1]}`;
          if (!exploredStart.has(neighborKey) && !parentStart.has(neighborKey)) {
            const child = new Cell(state, cell, action);
            parentStart.set(neighborKey, child);
            frontier.addToStart(child);
            steps.push({
              type: StepType.NodeAdded,
              position: state,
            });
          }
        }
      }
    }

    // Expand from goal
    if (!frontier.emptyGoal() && !meetingPoint) {
      const cell = frontier.removeFromGoal();
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      if (!exploredGoal.has(stateKey)) {
        exploredGoal.add(stateKey);
        nodesExplored++;
        steps.push({
          type: StepType.NodeExplored,
          position: cell.state,
        });

        // Check if we met the other search
        if (exploredStart.has(stateKey)) {
          meetingPoint = cell.state;
          cellFromGoal = cell;
          cellFromStart = parentStart.get(stateKey)!;
          break;
        }
        const neighbors = maze.neighbors(cell.state);
        for (const [action, state] of Object.entries(neighbors)) {
          const neighborKey = `${state[0]},${state[1]}`;
          if (!exploredGoal.has(neighborKey) && !parentGoal.has(neighborKey)) {
            const child = new Cell(state, cell, action);
            parentGoal.set(neighborKey, child);
            frontier.addToGoal(child);
            steps.push({
              type: StepType.NodeAdded,
              position: state,
            });
          }
        }
      }
    }
  }
  const endTime = performance.now();

  if (meetingPoint && cellFromStart && cellFromGoal) {
    const path = reconstructBidirectionalPath(cellFromStart, cellFromGoal);
    path.forEach((pos) => {
      steps.push({
        type: StepType.PathFound,
        position: pos,
      });
    });

    return {
      path,
      nodesExplored,
      steps,
      runtime: endTime - startTime,
    };
  }

  return {
    path: [],
    nodesExplored,
    steps,
    runtime: endTime - startTime,
  };
}

function solveBidirectionalBFS(maze: Maze, walls: boolean[][]): AnimationResult {
  const startTime = performance.now();
  let nodesExplored = 0;
  const steps: AnimationStep[] = [];

  const startCell = new Cell(maze.start, undefined, '');
  const goalCell = new Cell(maze.goal, undefined, '');

  const frontier = new BidirectionalQueueFrontier(startCell, goalCell);
  const exploredStart = new Set<string>();
  const exploredGoal = new Set<string>();
  const parentStart = new Map<string, Cell>();
  const parentGoal = new Map<string, Cell>();

  parentStart.set(`${maze.start[0]},${maze.start[1]}`, startCell);
  parentGoal.set(`${maze.goal[0]},${maze.goal[1]}`, goalCell);

  let meetingPoint: Position | null = null;
  let cellFromStart: Cell | null = null;
  let cellFromGoal: Cell | null = null;

  while (!frontier.emptyStart() && !frontier.emptyGoal()) {
    // Expand from start
    if (!frontier.emptyStart()) {
      const cell = frontier.removeFromStart();
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      if (!exploredStart.has(stateKey)) {
        exploredStart.add(stateKey);
        nodesExplored++;
        steps.push({
          type: StepType.NodeExplored,
          position: cell.state,
        });
        // check if the node has been explored by goal search,
        // if yes, we found the meeting point and the path
        if (exploredGoal.has(stateKey)) {
          meetingPoint = cell.state;
          cellFromStart = cell;
          cellFromGoal = parentGoal.get(stateKey)!;
          break;
        }

        const neighbors = maze.neighbors(cell.state);
        for (const [action, state] of Object.entries(neighbors)) {
          const neighborKey = `${state[0]},${state[1]}`;
          if (!exploredStart.has(neighborKey) && !parentStart.has(neighborKey)) {
            const child = new Cell(state, cell, action);
            parentStart.set(neighborKey, child);
            frontier.addToStart(child);
            steps.push({
              type: StepType.NodeAdded,
              position: state,
            });
          }
        }
      }
    }

    // Expand from goal
    if (!frontier.emptyGoal() && !meetingPoint) {
      const cell = frontier.removeFromGoal();
      const stateKey = `${cell.state[0]},${cell.state[1]}`;

      if (!exploredGoal.has(stateKey)) {
        exploredGoal.add(stateKey);
        nodesExplored++;
        steps.push({
          type: StepType.NodeExplored,
          position: cell.state,
        });
        // check if the node has been explored by start search,
        // if yes, we found the meeting point and the path
        if (exploredStart.has(stateKey)) {
          meetingPoint = cell.state;
          cellFromGoal = cell;
          cellFromStart = parentStart.get(stateKey)!;
          break;
        }

        const neighbors = maze.neighbors(cell.state);
        for (const [action, state] of Object.entries(neighbors)) {
          const neighborKey = `${state[0]},${state[1]}`;
          if (!exploredGoal.has(neighborKey) && !parentGoal.has(neighborKey)) {
            const child = new Cell(state, cell, action);
            parentGoal.set(neighborKey, child);
            frontier.addToGoal(child);
            steps.push({
              type: StepType.NodeAdded,
              position: state,
            });
          }
        }
      }
    }
  }

  const endTime = performance.now();

  if (meetingPoint && cellFromStart && cellFromGoal) {
    const path = reconstructBidirectionalPath(cellFromStart, cellFromGoal);
    path.forEach((pos) => {
      steps.push({
        type: StepType.PathFound,
        position: pos,
      });
    });

    return {
      path,
      nodesExplored,
      steps,
      runtime: endTime - startTime,
    };
  }

  return {
    path: [],
    nodesExplored,
    steps,
    runtime: endTime - startTime,
  };
}