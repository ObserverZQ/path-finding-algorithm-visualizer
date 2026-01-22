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
import { mazeEvents } from '@/app/lib/mazeEvents';
import PlayController from './play-controller';

const URLImage = React.memo(function URLImage({
  src,
  ...rest
}: {
  src: string;
  [key: string]: unknown;
}) {
  const [image] = useImage(src, 'anonymous');
  return <Image image={image} alt='' {...rest} />;
});
URLImage.displayName = 'URLImage';

export default function Maze() {
  const gridSize = 40;
  const row = 12;
  const col = 22;
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
    start: { i: 5, j: 7 },
    goal: { i: 5, j: 13 },
  });
  const stageLayerRef = useRef(null);
  const [painting, setPainting] = useState('');
  const [walls, setWalls] = useState<string[]>([]);
  const wallsRef = useRef<string[]>([]);
  const lastPassedGridRef = useRef<string>('');
  // useEffect(() => {
  //   console.log('The latest points is:', points);
  // }, [points]);
  // useEffect(() => {
  //   console.log('The latest walls are:', walls);
  // }, [walls]);
  const switchGridAttrs = (rect: Node, force = '') => {
    const id = rect.attrs.id;
    if (force) {
      setPainting(force);
    }
    if (painting === 'remove' || force === 'remove') {
      rect.setAttrs({ fill: 'rgb(255,255,255) ' });
      wallsRef.current = wallsRef.current.filter((wall) => wall != id);
    } else if (painting === 'add' || force === 'add') {
      rect.setAttrs({ fill: 'rgba(222,225,230,1)' });
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
        // console.log('drawing', e.target.attrs.id);
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

  const generateWallsGrid = (walls: string[]) => {
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

  /**
   * Listens to SideBar Control and Controller Events
   */
  const { status, algorithm, setStatus, setMetrics } = useSideBarStore();
  const [animator, setAnimator] = useState<Animator | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showController, setShowController] = useState(false);
  // const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // const algorithmSteps = useRef<AnimationStep[]>([]);
  // Listen for manual step events
  useEffect(() => {
    const unsubscribeManualStep = mazeEvents.on('manualStep', () => {
      setShowController(true);
    });

    return () => {
      unsubscribeManualStep();
    };
  }, []);

  // Listen for Default Run
  useEffect(() => {
    // console.log('status, algorithm, ', status, algorithm);
    // return;
    if (status === SearchStatus.Running) {
      // clear previous path and steps on grids
      clearPaths();
      // Convert grid to 2D array (walls: true = blocked, false = passable)
      const mazeGrid = generateWallsGrid(walls);
      // console.log('maze grid:', mazeGrid);
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
        { ...algorithm.options, heuristic: algorithm.heuristic }
      );
      console.log('Algorithm result:', result);
      setMetrics({
        runtime: result.runtime || 0,
        operations: result.steps?.length || 0,
        visitedNodes: result.nodesExplored || 0,
        pathLength: result.path?.length || 0,
      });
      const animator = new Animator(result);
      setAnimator(animator);
      setCurrentStepIndex(0);
      // algorithmSteps.current = result.steps;
      // console.log('animator', animator);
      // animator.play();
      // setStatus(SearchStatus.Paused);
    }
    // console.log('Algorithm status changed to:', status);
  }, [status, algorithm, points, walls]);

  // Effect 2: Handle animation loop separately
  useEffect(() => {
    if (!animator || status !== SearchStatus.Running) return;

    let lastUpdateTime = Date.now();
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout | null = null;

    const animate = () => {
      const now = Date.now();

      // Only update if enough time has passed based on animator.speed
      if (now - lastUpdateTime >= animator.speed) {
        setCurrentStepIndex((prev) => {
          const next = Math.min(prev + 1, animator.result.steps.length - 1);
          if (next >= animator.result.steps.length - 1) {
            timeoutId = setTimeout(() => setStatus(SearchStatus.Idle), 0);
          }
          // console.log('Current Step Index:', next);
          return next;
        });
        lastUpdateTime = now;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animator, status, setStatus]);

  // Memoize color calculation
  const colorMap = useMemo(() => {
    const colorMap = {
      [StepType.NodeAdded]: 'rgb(230, 255, 251)',
      [StepType.NodeExplored]: '#B2EBF2',
      [StepType.PathFound]: '#FFD78F',
      // [StepType.PathFound]: 'yellow',
    };
    const map = new Map<string, string>();
    if (!animator) {
      return map;
    }
    const steps = animator.result.steps.slice(0, currentStepIndex + 1);
    steps.forEach((step) => {
      const color = colorMap[step.type];
      const id = `${step.position[0]}, ${step.position[1]}`;
      map.set(id, color);
    });
    return map;
  }, [animator, currentStepIndex]);

  // listen to clear path and clear all events
  const clearPaths = () => {
    setAnimator((prev) => {
      prev?.destroy();  // Clean up interval
      return null;
    });
  };
  useEffect(() => {
    const unsubscribePath = mazeEvents.on('clearPath', clearPaths);

    const unsubscribeAll = mazeEvents.on('clearAll', () => {
      // clear the path and steps
      clearPaths();
      const layer = stageLayerRef.current as any;
      if (layer) {
        const groups = layer.children;
        groups.forEach((gp: any) => {
          if (gp.children && gp.children.length > 1) {
            gp?.children[0]?.setAttrs({ fill: 'rgb(255,255,255) ' });
          }
        });
      }
    });

    return () => {
      unsubscribePath();
      unsubscribeAll();
    };
  }, []);
  return (
    <div className='flex flex-col'>
      <Stage
        width={900}
        height={500}
        onMouseDown={onStageMouseDown}
        onMouseUp={onStageMouseUp}
        onMouseMove={onStageMouseMove}
      >
        <Layer ref={stageLayerRef}>
          {grids.map(({ id, x, y }) => (
            <Group x={x} y={y} key={id}>
              <Rect
                name='wall'
                width={gridSize}
                height={gridSize}
                stroke='rgba(222,225,230,1)'
                strokeWidth={1}
                id={id}
                fill={colorMap.get(id) || 'rgb(255,255,255)'}
              />
              <Text
                text={id}
                fontSize={12}
                fontFamily='Calibri'
                fill='rgba(150,150,150,1)'
              />
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
      {showController && animator && (
        <PlayController
          animator={animator}
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
          onClose={() => setShowController(false)}
        />
      )}
    </div>
  );
}
