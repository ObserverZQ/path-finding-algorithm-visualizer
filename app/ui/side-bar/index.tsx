'use client';
import { useCallback } from 'react';
// import { Button } from 'flowbite-react';
import { Button } from '@headlessui/react';
import { useBearStore } from '@/app/lib/store';
import Counter from './counter';
export default function SideBar() {
  const increase = useBearStore((state) => state.increase);
  const increasePopulation = () => {
    increase(2);
  };
  // todo check if need useCallback hook
  // const increasePopulation = useCallback(() => {
  //   increase(2);
  // }, [increase]);

  return (
    <div className='w-[378px] h-full bg-amber-100'>
      <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500" onClick={increasePopulation}>Run</Button>
      <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
        Save changes
      </Button>
      <Counter />
    </div>
  );
}


// export default function SideBar() {
//     return <div><Counter /></div>
// }
