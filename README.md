# Path-Finding Algorithm Visualizer
An interactive canvas-based tool designed to visualize the mechanics and efficiency of classic search algorithms on a 2D grid.

[Live Demo](https://path-finding-algorithm-visualizer-gamma.vercel.app/)

## 🎓 Motivation
This project was inspired by Harvard’s [CS50 Introduction to Artificial Intelligence with Python](https://cs50.harvard.edu/ai/), specifically the lecture on [Search](https://cs50.harvard.edu/ai/weeks/0/). I wanted to translate the abstract concepts of frontier expansion and heuristic-based search (A*) into a tangible, interactive frontend experience to experimentally evaluate algorithmic tradeoffs between optimality, exploration cost, and heuristic guidance in real time.

## 🛠 Core Functionality
* **Search Suite**: Implements Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First Search, and A* Search.

* **Interactive Environment**: Allows users to dynamically place obstacles, adjust start/destination nodes, modify playback speed and choose running mode(continuously or step-by-step(WIP)) to observe how different algorithms navigate constraints.

* **Technical Log**: Features a real-time monitor that tracks Runtime, Operations Count, Visited Nodes, and Path Length, providing empirical data to support theoretical complexity analysis.

* **Algorithm Learning(WIP)**: Introduces each algorithm briefly, including bi-directional and heuristics settings, and supports algorithm comparisons in terms of complexity and path length through various sample maze setups.

## 🏗 Technical Implementation
* **State Management**: Built with zustand to ensure the search frontier and explored sets stay synchronized with the UI during high-speed animations.

* **Modular Design**: Structured the codebase to allow for easy extensibility of new heuristic functions, such as Manhattan or Euclidean distance for A* Search.

## 🔬 Algorithm Comparison: Greedy Best-First Search vs A*

The visualizer is designed not only as a teaching tool, but as an experimental platform for analyzing algorithmic tradeoffs.

Below is a controlled comparison between Greedy Best-First Search and A* on the same maze configuration.

![GBFS vs A* Comparison](./examples/gbfs_vs_astar_comparison.png)

**Observations:**
- Greedy Best-First Search explores fewer nodes initially but produces a longer, suboptimal path.
- A* explores a slightly larger frontier but guarantees the optimal path by balancing path cost and heuristic guidance.
- This demonstrates the tradeoff between exploration efficiency and solution optimality, reinforcing theoretical complexity analysis with empirical measurement.


## 💻 Tech Stack

* **Framework**: Next.js (App Router), React, zustand, Konva

* **Language**: TypeScript

* **Styling**: Tailwind CSS

* **Deployment**: Vercel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔨 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

