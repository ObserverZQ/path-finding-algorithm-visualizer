export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='w-full h-15 border-b-1 border-b-neutral-300 p-5'>
        header
      </div>
      {children}
    </div>
  );
}
