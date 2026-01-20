Greedy Best-First Search (GBFS) is an informed search algorithm that uses a heuristic function `h(n)` to estimate how close a state is to the goal. The algorithm always expands the node with the lowest heuristic value, using a **priority queue** to manage the frontier.

GBFS demonstrates how heuristics can guide search efficiently. By focusing on promising states, GBFS often finds a solution quickly in large search spaces.

Common heuristics include:
- **Manhattan distance**: `|dx| + |dy|` for 4-directional grids
- **Euclidean distance**: straight-line distance
- **Octile distance**: for 8-directional grids with diagonal movement
- **Chebyshev distance**: when diagonal and straight moves cost the same

However, GBFS ignores the cost already incurred, so it does not guarantee optimal solutions and can be misled by poor heuristics.

**Complexity**
- Time: Exponential (heuristic-dependent)
- Space: Exponential
- Complete: No
- Optimal: No