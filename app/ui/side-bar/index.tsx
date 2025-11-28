'use client';
import { useCallback } from 'react';
// import { Button } from 'flowbite-react';
import { Button } from '@headlessui/react';
import { SearchStatus, useSideBarStore } from '@/app/lib/sidebar';
import Counter from './counter';
export default function SideBar() {

  const { status, setStatus } = useSideBarStore();
  const changeSearchStatus = () => {
    setStatus(status === SearchStatus.Idle ? SearchStatus.Running : SearchStatus.Idle);
  };

  return (
    <div className='w-[378px] h-full bg-amber-100'>
      <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500" onClick={changeSearchStatus}>{
        status === SearchStatus.Idle ? 'Run' : 'Cancel'
      }</Button>
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
