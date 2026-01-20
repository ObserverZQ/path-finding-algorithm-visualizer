
Depth-First Search (DFS) is an uninformed search algorithm that explores a state space by following one path as deeply as possible before backtracking. Instead of expanding all neighbors first, DFS selects a successor and continues until it reaches a goal or dead end. It is implemented using a **stack (LIFO)** or recursion.

DFS highlights the trade-off between memory and optimality. DFS is **memory-efficient**, since it only stores the current path and a small number of alternative branches. This makes it useful in deep search spaces where BFS would require too much memory.

However, DFS does not guarantee finding the shortest path and may fail to find a solution in infinite or cyclic spaces unless a visited set or depth limit is applied. It can also spend excessive time exploring unproductive branches while better solutions exist elsewhere.

DFS is best suited for scenarios where any solution is acceptable and memory is limited.

**Complexity**
- Time: `O(b^d)`
- Space: `O(bd)`
- Complete: No (without limits)
- Optimal: No
