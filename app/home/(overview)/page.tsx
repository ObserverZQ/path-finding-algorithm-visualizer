import Header from '@/app/ui/header';
import MazeLoader from '@/app/ui/maze/loader';
import SideBar from '@/app/ui/side-bar';

export default async function Page() {
  return (
    <div className='w-full flex flex-col items-center'>
      <Header />
      <div className='w-[1440px] flex justify-between'>
        <MazeLoader />
        <SideBar />
      </div>
    </div>
  );
}
