export const SessionFooter = () => {
  return (
    <footer className="mt-12 flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          124 Rooms Live
        </span>
      </div>
      <div className="w-px h-3 bg-outline-variant"></div>
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-[14px]"
          data-icon="lock"
        >
          lock
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          End-to-End Encrypted
        </span>
      </div>
    </footer>
  );
};
