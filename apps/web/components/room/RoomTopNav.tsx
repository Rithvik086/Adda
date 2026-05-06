import Link from "next/link";

interface RoomTopNavProps {
  sessionCode: string;
}

export const RoomTopNav = ({ sessionCode }: RoomTopNavProps) => {
  return (
    <nav className="w-full top-0 sticky z-50 bg-background">
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        {/* Left: Brand + Room Code */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tighter text-white font-headline">
            Adda
          </span>
          <div className="w-px h-4 bg-outline-variant/40" />
          <span className="text-sm font-semibold tracking-tight text-primary">
            #{sessionCode}
          </span>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex space-x-8 font-sans tracking-tight text-sm font-medium">
          <Link
            className="text-on-surface hover:text-primary transition-colors duration-200"
            href="#"
          >
            Rooms
          </Link>
          <Link
            className="text-zinc-500 hover:text-primary transition-colors duration-200"
            href="#"
          >
            Activity
          </Link>
          <Link
            className="text-zinc-500 hover:text-primary transition-colors duration-200"
            href="#"
          >
            Settings
          </Link>
        </div>

        {/* Right: LIVE badge */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Live
          </span>
        </div>
      </div>
    </nav>
  );
};
