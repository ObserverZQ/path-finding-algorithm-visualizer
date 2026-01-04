'use client';
import { useSideBarStore } from '@/app/lib/sidebar';

export default function Trace() {
  const { metrics } = useSideBarStore();
  return (
    <div className='w-full rounded-md shadow-s p-5 bg-white border-1 border-neutral-200'>
      {/* <div className='text-lg text-neutral-900 font-[600] mb-2'>Trace</div> */}
      {/* <div className='bg-neutral-100 border-neutral-300 rounded-s-md w-full h-20 mb-2'>
        Log area
      </div> */}
      <div className='flex justify-between text-neutral-600'>
        <div>
          Runtime: <div className='text-neutral-900'>{metrics.runtime} ms</div>
        </div>
        <div>
          Operations:{' '}
          <div className='text-neutral-900'>{metrics.operations}</div>
        </div>
        <div>
          Path Length:{' '}
          <div className='text-neutral-900'>{metrics.pathLength}</div>
        </div>
      </div>
    </div>
  );
}
