export default function Header() {
  return (
    <div className='w-full h-15 bg-white border-b-1 border-b-neutral-300 shadow-xs flex items-center justify-center'>
      <div className="w-[1440px] h-full flex items-center justify-between">
        <img className="h-full" src="/logo.png" alt="" />
        {/* buttons */}
        <div className="flex items-center gap-7 text-sm text-neutral-900">
          <div className="flex items-center cursor-pointer">
            <img className="w-6 mr-1" src="/image-text.png" alt="" />
            <div>Intro</div>
          </div>
          <div className="flex items-center cursor-pointer">
            <img className="w-6 mr-1" src="/book.png" alt="" />
            <div>Blog</div>
          </div>
          <div className="flex items-center cursor-pointer">
            <img className="w-6 mr-1" src="/github.png" alt="" />
            <div>GitHub</div>
          </div>
        </div>
      </div>
    </div>
  );
}
