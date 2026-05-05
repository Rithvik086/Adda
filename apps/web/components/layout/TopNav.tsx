import Link from "next/link";

export const TopNav = () => {
  return (
    <nav className="bg-[#0e0e0e] w-full top-0 sticky z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        <div className="text-lg font-bold tracking-tighter text-white font-headline">
          Adda
        </div>
        <div className="hidden md:flex space-x-8 font-sans tracking-tight text-sm font-medium">
          <Link
            className="text-zinc-500 hover:text-violet-400 transition-colors active:scale-95 duration-200"
            href="#"
          >
            Rooms
          </Link>
          <Link
            className="text-zinc-500 hover:text-violet-400 transition-colors active:scale-95 duration-200"
            href="#"
          >
            Activity
          </Link>
          <Link
            className="text-zinc-500 hover:text-violet-400 transition-colors active:scale-95 duration-200"
            href="#"
          >
            Settings
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined" data-icon="search">
              search
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
