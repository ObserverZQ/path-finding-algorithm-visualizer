import Header from '@/app/ui/header';
import MazeLoader from '@/app/ui/maze/loader';
import SideBar from '@/app/ui/side-bar';

export default async function Page() {
  return (
    <div className='w-[1440px] flex flex-col'>
      <Header />
      <div className='flex'>
        <MazeLoader />
        <SideBar />
      </div>
    </div>
  );
}
