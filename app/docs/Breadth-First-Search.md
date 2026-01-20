Breadth-First Search (BFS) is an uninformed search algorithm that explores a state space level by level. Starting from the initial state, BFS expands all neighboring states before moving on to states at greater depth. It uses a **queue (FIFO)** to ensure the shallowest unexplored node is always selected first.

BFS is the simplest algorithm that guarantees correctness. When all actions have equal cost, BFS is **complete and optimal**, meaning it will always find a solution if one exists and that solution will be the shortest in terms of steps. This makes BFS suitable for unweighted graphs, mazes, and grid problems with uniform movement cost.

The main drawback of BFS is its **high memory usage**s. Because it must store every node at the current depth, the frontier can grow exponentially in wide search spaces. As a result, BFS becomes impractical for large problems despite its optimality.

**Complexity**

* Time: O(b^d)

* Space: O(b^d)

* Complete: Yes

* Optimal: Yes

**Complexity Notation**

- **`b` (branching factor)**  
  The average number of successor states generated from each node.  
  For example, in a grid-based environment, `b` is typically up to 4 for four-directional movement, and up to 8 when diagonal movement is allowed

- **`d` (depth of the solution)**  
  The depth of the shallowest goal state, measured as the number of steps from the initial state to the nearest solution.

Expressions such as `O(b^d)` indicate that, in the worst case, the algorithm may need to explore all possible nodes up to depth `d`, with each node branching into approximately `b` new nodes. As either `b` or `d` increases, the search space grows exponentially, which explains why uninformed search algorithms can quickly become computationally expensive.
