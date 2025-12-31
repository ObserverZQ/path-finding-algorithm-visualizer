'use client';
import { Button } from 'flowbite-react';
import { SearchStatus, useSideBarStore } from '@/app/lib/sidebar';
import {
  VscPlay,
  VscDebugContinue,
  VscClearAll,
  VscRemove,
} from 'react-icons/vsc';
import { mazeEvents } from '@/app/lib/mazeEvents';

export default function AnimationControl() {
  const { status, setStatus } = useSideBarStore();
  const changeSearchStatus = () => {
    setStatus(
      status === SearchStatus.Idle ? SearchStatus.Running : SearchStatus.Idle
    );
  };

  const onClickClearPath = () => {
    // Custom logic to clear only the path
    console.log('Clear Path clicked');
    mazeEvents.emit('clearPath');
  };

  const onClickClearAll = () => {
    // Custom logic to clear all
    console.log('Clear All clicked');
    mazeEvents.emit('clearAll');
  };
  return (
    <div>
      <div className='text-lg font-[600] text-neutral-900 mt-5'>
        Animation Control
      </div>
      <div className='mt-4 flex gap-2'>
        <Button
          className='w-[50%]'
          disabled={status === SearchStatus.Running}
          onClick={changeSearchStatus}
        >
          <VscPlay className='w-5 h-5 mr-2' />
          Run
        </Button>
        <Button as='span' className='w-[50%]' color='green'>
          <VscDebugContinue className='w-5 h-5 mr-2' />
          Manual Step
        </Button>
      </div>
      <div className='mt-4 flex gap-2'>
        <Button
          as='span'
          className='w-[50%]'
          color='alternative'
          onClick={onClickClearAll}
        >
          <VscClearAll className='w-5 h-5 mr-2' />
          Clear All
        </Button>
        <Button
          as='span'
          className='w-[50%]'
          color='alternative'
          onClick={onClickClearPath}
        >
          <VscRemove className='w-5 h-5 mr-2' />
          Clear Path
        </Button>
      </div>
    </div>
  );
}
