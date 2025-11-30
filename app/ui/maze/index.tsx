'use client';

import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Group, Text, Image } from 'react-konva';
import useImage from 'use-image';
import { SearchStatus, useSideBarStore } from '@/app/lib/sidebar';
import { AnimationStep, StepType } from '@/app/lib/animation/types';
import { runAlgorithm } from '@/app/lib/algorithms/runner';
import { Animator } from '@/app/lib/animation/animator';

const URLImage = React.memo(function URLImage({
  src,
  ...rest
}: {
  src: string;
  [key: string]: unknown;
}) {
  const [image] = useImage(src, 'anonymous');
  return <Image image={image} {...rest} />;
});
URLImage.displayName = 'URLImage';

export default function Maze() {
  const gridSize = 40;
  const row = 15;
  const col = 20;
  const xBoundary = [0, 40 * (col - 1)];
  const yBoundary = [0, 40 * (row - 1)];
  // use React.useMemo to memoize the draggable shapes to avoid re-render and re-computation.
  const grids = useMemo(() => {
    const items = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        const x = j * gridSize;
        const y = i * gridSize;
        items.push({
          id: `${i}, ${j}`,
          x,
          y,
        });
      }
    }
    return items;
  }, []);

  const coordToPx = (coord: number) => coord * gridSize;
  const pxToCoord = (px: number) => px / gridSize;
  const [points, setPoints] = useState({
    start: { i: 6, j: 3 },
    goal: { i: 6, j: 15 },
  });
  const [painting, setPainting] = useState('');
  const [walls, setWalls] = useState<string[]>([]);
  const wallsRef = useRef<string[]>([]);
  const lastPassedGridRef = useRef<string>('');
  useEffect(() => {
    console.log('The latest points is:', points);
  }, [points]);
  useEffect(() => {
    console.log('The latest walls are:', walls);
  }, [walls]);
  const switchGridAttrs = (rect: Node, force = '') => {
    const id = rect.attrs.id;
    if (force) {
      setPainting(force);
    }
    if (painting === 'remove' || force === 'remove') {
      rect.setAttrs({ fill: 'rgb(255,255,255) ' });
      wallsRef.current = wallsRef.current.filter((wall) => wall != id);
    } else if (painting === 'add' || force === 'add') {
      rect.setAttrs({ fill: 'rgb(179,179,179) ' });
      if (!wallsRef.current.includes(id)) {
        wallsRef.current.push(id);
      }
    }
  };
  const onStageMouseDown = (
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
  ) => {
    if (e.target.getClassName() == 'Rect') {
      const id = e.target?.attrs?.id;
      if (!id) {
        return;
      }
      lastPassedGridRef.current = id;
      if (wallsRef.current.includes(id)) {
        switchGridAttrs(e.target as Shape, 'remove');
      } else {
        switchGridAttrs(e.target as Shape, 'add');
      }
    }
  };
  const onStageMouseUp = (
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
  ) => {
    setPainting('');
    setWalls([...wallsRef.current]);
  };
  const onStageMouseMove = (
    e: KonvaEventObject<MouseEvent, Node<NodeConfig>>
  ) => {
    if (painting) {
      const id = e.target?.attrs?.id;
      if (id && id !== lastPassedGridRef.current) {
        console.log('drawing', e.target.attrs.id);
        lastPassedGridRef.current = id;
        switchGridAttrs(e.target as Shape);
      }
    }
  };
  /** Deal with the dragging of starting and goal point on the maze. */
  const onDragPoint = (
    e: KonvaEventObject<DragEvent, Node<NodeConfig>>,
    type: 'start' | 'goal'
  ) => {
    const getValidCoordinate = (val: number, boundary: number[]) => {
      if (val >= boundary[0] && val <= boundary[1]) {
        return val;
      } else if (Math.abs(val - boundary[0]) < Math.abs(val - boundary[1])) {
        return boundary[0];
      } else {
        return boundary[1];
      }
    };
    const target = e.target;
    const fixedX = getValidCoordinate(
      Math.round(target?.x() / gridSize) * gridSize,
      xBoundary
    );
    const fixedY = getValidCoordinate(
      Math.round(target?.y() / gridSize) * gridSize,
      yBoundary
    );
    setPoints((prevPoints) => ({
      ...prevPoints,
      [type]: { i: pxToCoord(fixedY), j: pxToCoord(fixedX) },
    }));
  };

  /**
   * Listens to SideBar Control Events
   */
  const { status, algorithm, setStatus } = useSideBarStore();
  const [animator, setAnimator] = useState<Animator | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const algorithmSteps = useRef<AnimationStep[]>([]);
  useEffect(() => {
    if (status === SearchStatus.Running) {
      // Convert grid to 2D array (walls: true = blocked, false = passable)
      const mazeGrid = generateWallsGrid(walls, points);
      console.log('maze grid:', mazeGrid);
      console.log(
        'Running algorithm:',
        algorithm.name,
        algorithm.options,
        [points.start.i, points.start.j],
        [points.goal.i, points.goal.j]
      );
      const result = runAlgorithm(
        algorithm.name,
        mazeGrid,
        [points.start.i, points.start.j],
        [points.goal.i, points.goal.j],
        algorithm.options
      );
      console.log('Algorithm result:', result);
      const animator = new Animator(result);
      setAnimator(animator);
      setCurrentStepIndex(0);
      // algorithmSteps.current = result.steps;
      setStatus(SearchStatus.Paused);
    }
    console.log('Algorithm status changed to:', status);
  }, [status, algorithm, points, walls]);

  // render explored/frontier/path cells with animator
  const getRectColor = (id: string): string => {
    if (!animator) return 'rgb(255,255,255)';

    const [i, j] = id.split(', ').map(Number) as [number, number];
    const explored = animator.getSpecificPositions(StepType.NodeExplored);
    const frontier = animator.getSpecificPositions(StepType.NodeAdded);
    const path = animator.getSpecificPositions(StepType.PathFound);

    if (path.some((p) => p[0] === i && p[1] === j)) {
      return 'rgb(255, 255, 0)'; // yellow = path
    }
    if (explored.some((p) => p[0] === i && p[1] === j)) {
      return 'rgb(100, 149, 237)'; // cornflowerblue = explored
    }
    if (frontier.some((p) => p[0] === i && p[1] === j)) {
      return 'rgb(200, 100, 255)'; // light purple = frontier
    }
    if (walls.includes(id)) {
      return 'rgb(179, 179, 179)'; // gray = wall
    }
    return 'rgb(255, 255, 255)'; // white = empty
  };

  const generateWallsGrid = (
    walls: string[],
    points: { start: { i: number; j: number }; goal: { i: number; j: number } }
  ) => {
    const grid: boolean[][] = [];
    for (let i = 0; i < row; i++) {
      const rowArr: boolean[] = [];
      for (let j = 0; j < col; j++) {
        if (walls.includes(`${i}, ${j}`)) {
          rowArr.push(true);
        } else {
          rowArr.push(false);
        }
      }
      grid.push(rowArr);
    }
    return grid;
  };
  return (
    <Stage
      width={900}
      height={600}
      onMouseDown={onStageMouseDown}
      onMouseUp={onStageMouseUp}
      onMouseMove={onStageMouseMove}
    >
      <Layer>
        {grids.map(({ id, x, y }) => (
          <Group x={x} y={y} key={id}>
            <Rect
              name='wall'
              width={gridSize}
              height={gridSize}
              stroke='grey'
              strokeWidth={1}
              id={id}
            />
            <Text text={id} fontSize={12} fontFamily='Calibri' fill='green' />
          </Group>
        ))}
        {/* starting point */}
        <URLImage
          name='start'
          src='/starting-point.png'
          x={coordToPx(points.start.j)}
          y={coordToPx(points.start.i)}
          width={40}
          height={40}
          draggable
          onDragEnd={(e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => {
            onDragPoint(e, 'start');
          }}
          onMouseEnter={() => {
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={() => {
            document.body.style.cursor = 'default';
          }}
        />

        {/* destination point */}
        <URLImage
          name='goal'
          src='/destination.png'
          x={coordToPx(points.goal.j)}
          y={coordToPx(points.goal.i)}
          width={40}
          height={40}
          draggable
          onDragEnd={(e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => {
            onDragPoint(e, 'goal');
          }}
          onMouseEnter={() => {
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={() => {
            document.body.style.cursor = 'default';
          }}
        />
      </Layer>
    </Stage>
  );
}
