'use client';

import dynamic from 'next/dynamic';

// This dynamic import tells Next.js to ONLY load this component on the client.
// Setting ssr: false ensures that the Konva dependency is never needed on the server.
const Maze = dynamic(() => import('@/app/ui/maze'), {
  ssr: false,
});

export default function MazeLoader() {
  return (
    <div className='w-[1015px] h-[660px] flex justify-center items-center border-1 border-neutral-300 shadow-xs mt-4'>
      <Maze />
    </div>
  );
}
