import MazeLoader from '@/app/ui/maze/loader';
import SideBar from '@/app/ui/side-bar';

export default async function Page() {
  return (
    <div>
      <MazeLoader />
      <SideBar />
    </div>
  );
}
