import type { Row, Position } from './types';

class Cell {
    state: Position;
    parent: Cell | undefined;
    action: string;

    constructor(state: Position, parent: Cell | undefined, action: string) {
        this.state = state;
        this.parent = parent;
        this.action = action;
    }
};

class StackFrontier {
    frontier: Array<Cell>;

    constructor(cells: Array<Cell>) {
        this.frontier = cells;
    }

    add(cell: Cell) {
        this.frontier.push(cell);
    }

    contains_state(state: Position): boolean {
        return this.frontier.some(cell => cell.state[0] === state[0] && cell.state[1] === state[1]);
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

class Maze {
    maze: Array<Array<string>>;
    width: number;
    height: number;
    walls: Array<Row>;
    solution: Object;
    start: Position;
    goal: Position;
    numExplored: number;

    constructor(width: number, height: number) {
        this.maze = [];
        this.width = width;
        this.height = height;
        this.walls = [];
        this.solution = {};
        this.start = [0, 0];
        this.goal = [0, 0];
        this.numExplored = 0;

        // keep track of walls
        for (let i = 0; i < height; i++) {
            const row: Row = [];
            for (let j = 0; j < width; j++) {
                if (this.maze[i][j] === 'start') {
                    this.start = [i, j];
                    row.push(false);
                } else if (this.maze[i][j] === 'goal') {
                    this.goal = [i, j];
                    row.push(false);
                } else if (this.maze[i][j] === '') {
                    row.push(false);
                } else {
                    row.push(true);
                }
            }
            this.walls.push(row);
        }
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
        for (const [key, value] of Object.entries(candidates) as [string, Position][]) {
            const [r, c] = value;
            if (0 <= r && r < this.height && 0 <= c && c < this.width && !this.walls[r][c]) {
                result[key] = value;
            }
        }
        return result;
    }

    solve() {
        // Keep track of number of states explored
        this.numExplored = 0;
        const start = new Cell(this.start, undefined, '');
        // Initialize frontier to just the starting position
        const frontier = new StackFrontier([start]);
        // Initialize an empty explored set
        const explored = new Set();

        while (true) {
            if (frontier.empty()) {
                throw Error('no solution');
            }

            // Choose a node from the frontier
            let cell = frontier.remove() as Cell;
            this.numExplored += 1;

            // If we find the goal in the frontier, record the path and return
            if (cell.state === this.goal) {
                const actions = [];
                const cells = [];
                while (cell.parent) {
                    actions.push(cell.action);
                    cells.push(cell.state);
                    cell = cell.parent;
                }
                actions.reverse();
                cells.reverse();
                this.solution = {
                    actions, cells
                };
                return;
            }

            // Mark node as explored
            explored.add(cell);

            // Add neighbors to frontier
            const neighbors = this.neighbors(cell.state);
            for (const [action, state] of Object.entries(neighbors)) {
                // If the state is not in the frontier and not explored, add it
                if (!frontier.contains_state(state) && !explored.has(state)) {
                    const child = new Cell(state, cell, action);
                    frontier.add(child);
                }
            }
        }
    }
}