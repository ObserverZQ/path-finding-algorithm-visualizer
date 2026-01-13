'use client';

import dynamic from 'next/dynamic';

// This dynamic import tells Next.js to ONLY load this component on the client.
// Setting ssr: false ensures that the Konva dependency is never needed on the server.
const Maze = dynamic(() => import('@/app/ui/maze'), {
  ssr: false,
});

export default function MazeLoader() {
  return (
    <div className='relative w-[1015px] h-[580px] flex flex-col items-center bg-white border-1 border-neutral-200 rounded-md shadow-xs pt-3 mt-4'>
      <div className="absolute left-14 top-4 text-lg font-[600] text-neutral-900">I. Maze Setup</div>
      <div className='text-sm text-neutral-600 mb-3'>
        <p>
          a. Click then move along empty cells to set them as walls or vice versa.
        </p>
        <p>
          b. Drag the starting point and destination point to change their
          positions.
        </p>
      </div>
      <Maze />
    </div>
  );
}
