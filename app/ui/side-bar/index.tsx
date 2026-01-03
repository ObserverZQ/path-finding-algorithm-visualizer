'use client';
import { useCallback } from 'react';
import { Button } from 'flowbite-react';
// import { Button } from '@headlessui/react';
import { SearchStatus, useSideBarStore } from '@/app/lib/sidebar';
import Counter from './counter';
import AlgorithmSelection from './algorithm-selection';
import AnimationControl from './animation-control';

export default function SideBar() {
  return (
    <div className='w-[378px] h-full border-l-1 border-l-neutral-300 p-7 flex flex-col'>
      <AlgorithmSelection />
      <AnimationControl />
      {/* <Button as="span" className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500" onClick={changeSearchStatus}>{
        status === SearchStatus.Idle ? 'Run' : 'Cancel'
      }</Button>
      <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
        Save changes
      </Button>
      <Counter /> */}
    </div>
  );
}

// export default function SideBar() {
//     return <div><Counter /></div>
// }
