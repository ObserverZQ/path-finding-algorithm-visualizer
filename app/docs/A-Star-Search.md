A* Search is a powerful informed search algorithm that combines actual path cost and heuristic estimation. It evaluates nodes using:

`f(n) = g(n) + h(n)`

where `g(n)` is the cost from the start to the node and `h(n)` estimates the remaining cost to the goal.

By balancing past cost and future estimation, A* avoids unnecessary exploration while still guaranteeing optimal solutions **when the heuristic is admissible** (never overestimates the true cost).

A* commonly uses the same heuristics as GBFS:
- **Manhattan**
- **Euclidean**
- **Octile**
- **Chebyshev**

The algorithm expands nodes using a **priority queue** ordered by `f(n)`. With a good heuristic, A* is both efficient and reliable, making it widely used in games, navigation, and robotics.

**Complexity**
- Time: Exponential (improved with good heuristics)
- Space: Exponential
- Complete: Yes
- Optimal: Yes (admissible heuristic)