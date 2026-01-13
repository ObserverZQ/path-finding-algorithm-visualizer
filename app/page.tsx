import Header from '@/app/ui/header';
import MazeLoader from '@/app/ui/maze/loader';
import SideBar from '@/app/ui/side-bar';
import Trace from '@/app/ui/trace';

export default async function Page() {
  return (
    <div className='w-full flex flex-col items-center bg-neutral-50'>
      <Header />
      <div className='w-full flex justify-center overflow-auto'>
        <div className='w-[1440px] flex justify-between h-[calc(100vh-60px)]'>
          <div className='flex flex-col gap-5'>
            <MazeLoader />
            <Trace />
          </div>
          <SideBar />
        </div>
      </div>

    </div>
  );
}
