'use client';
import { useCallback } from 'react';
import { Button } from 'flowbite-react';
import { useBearStore } from '@/app/lib/store';

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
      <Button onClick={increasePopulation}>Run</Button>
    </div>
  );
}
