import Link from "next/link";

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-4 bg-[#131313]/70 backdrop-blur-xl z-50">
      <Link
        className="flex flex-col items-center justify-center text-violet-400 font-bold scale-active-0.98 transition-all"
        href="#"
      >
        <span
          className="material-symbols-outlined"
          data-icon="graphic_eq"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          graphic_eq
        </span>
        <span className="text-[11px] font-medium tracking-wide uppercase">
          Rooms
        </span>
      </Link>
      <Link
        className="flex flex-col items-center justify-center text-zinc-600 hover:bg-zinc-800/50 scale-active-0.98 transition-all"
        href="#"
      >
        <span className="material-symbols-outlined" data-icon="notifications">
          notifications
        </span>
        <span className="text-[11px] font-medium tracking-wide uppercase">
          Activity
        </span>
      </Link>
      <Link
        className="flex flex-col items-center justify-center text-zinc-600 hover:bg-zinc-800/50 scale-active-0.98 transition-all"
        href="#"
      >
        <span className="material-symbols-outlined" data-icon="settings">
          settings
        </span>
        <span className="text-[11px] font-medium tracking-wide uppercase">
          Settings
        </span>
      </Link>
    </nav>
  );
};
