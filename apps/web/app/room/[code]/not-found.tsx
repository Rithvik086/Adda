import Link from "next/link";

export default function RoomNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-error/20 blur-3xl rounded-full scale-150" />
        <div className="relative w-16 h-16 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container">
          <span className="material-symbols-outlined text-error text-3xl">
            error_outline
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
        Room Not Found
      </h1>
      <p className="text-on-surface-variant text-sm font-medium mb-8 max-w-sm">
        The access code you entered doesn&apos;t match any active room. It may
        have expired or the code might be incorrect.
      </p>
      <Link
        className="gradient-button text-on-primary py-3 px-8 rounded-xl font-bold text-sm uppercase tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
        href="/"
      >
        Back to Home
      </Link>
    </div>
  );
}
