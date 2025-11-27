'use client';

import { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node';
import { Shape } from 'konva/lib/Shape';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Group, Text, Image } from 'react-konva';
import useImage from 'use-image';
import { useBearStore } from '@/app/lib/store';
import { useSideBarStore } from '@/app/lib/sidebar';
import { AnimationStep } from '@/app/lib/animation/types';

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
  const algorithmState = useSideBarStore((s) => s.algorithm);
  const algorithmSteps = useRef<AnimationStep[]>([]);

  useEffect(() => {
    // todo: listen to algorithm result and start painting paths
    // if (algorithmState.name) {
    // const result = runAlgorithm(/** */);
    // animationSteps.current = result.steps;
    // }
  }, [algorithmState]);

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
  // subscribe only to what this component needs
  const bears = useBearStore((s) => s.bears);
  useEffect(() => {
    console.log('bears changed and heard in maze', bears);
  }, [bears]);

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
