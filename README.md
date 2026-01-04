# Path-Finding Algorithm Visualizer
An interactive canvas-based tool designed to visualize the mechanics and efficiency of classic search algorithms on a 2D grid.

[Live Demo](https://path-finding-algorithm-visualizer-gamma.vercel.app/)

## 🎓 Motivation
This project was inspired by Harvard’s CS50 Introduction to Artificial Intelligence with Python, specifically the lecture on Search. I wanted to translate the abstract concepts of frontier expansion and heuristic-based search (A*) into a tangible, interactive frontend experience to better understand the performance trade-offs in real-time.

## 🛠 Core Functionality
* **Search Suite**: Implements Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First Search, and A* Search.

* **Interactive Environment**: Allows users to dynamically place obstacles, adjust start/destination nodes, and modify playback speed to observe how different algorithms navigate constraints.

* **Technical Log**: Features a real-time monitor that tracks Runtime, Operations Count, and Path Length, providing empirical data to support theoretical complexity analysis.

## 🏗 Technical Implementation
* **State Management**: Built with zustand t to ensure the search frontier and explored sets stay synchronized with the UI during high-speed animations.

* **Modular Design**: Structured the codebase to allow for easy extensibility of new heuristic functions, such as Manhattan or Euclidean distance for A* Search.

* **Responsive Rendering**: Optimized for various viewport sizes using Tailwind CSS, ensuring the grid remains usable on different devices.

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

