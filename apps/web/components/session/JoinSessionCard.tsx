"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { AccessCodeInput } from "./AccessCodeInput";

export const JoinSessionCard = () => {
  const [accessCode, setAccessCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    const trimmedCode = accessCode.trim();
    const trimmedName = displayName.trim();
    if (trimmedCode.length < 6 || trimmedName.length < 3) return;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("adda.displayName", trimmedName);
    }
    router.push(`/room/${encodeURIComponent(trimmedCode)}`);
  };

  const handleCreate = () => {
    // Handle create logic — future: call POST /api/rooms
    console.log("Creating room");
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center text-center">
      {/* Atmospheric Branding Element */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
        <div className="relative w-16 h-16 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container">
          <span
            className="material-symbols-outlined text-primary text-3xl"
            data-icon="graphic_eq"
          >
            graphic_eq
          </span>
        </div>
      </div>
      {/* Join Form Section */}
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
          Join a Session
        </h1>
        <p className="text-on-surface-variant text-sm font-medium">
          Enter the 6-digit access code to enter the void.
        </p>
      </header>
      <div className="w-full space-y-8">
        {/* Display Name Input */}
        <div className="flex flex-col gap-2 group text-left">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              Display Name
            </label>
          </div>
          <input
            autoComplete="name"
            className="w-full bg-surface-container-lowest border-none text-sm tracking-wide font-medium py-3 px-4 rounded-xl text-on-surface transition-all placeholder:text-zinc-600"
            maxLength={32}
            placeholder="Your name"
            spellCheck={false}
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        {/* Room Code Input */}
        <AccessCodeInput value={accessCode} onChange={setAccessCode} />
        {/* Primary Action */}
        <div className="flex flex-col gap-4">
          <Button variant="gradient" className="w-full" onClick={handleJoin}>
            Join Room
            <span
              className="material-symbols-outlined text-lg"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </Button>
          <div className="flex items-center gap-4 py-2">
            <div className="h-px grow bg-outline-variant/30"></div>
            <span className="text-[10px] uppercase tracking-tighter text-zinc-600 font-bold">
              Or
            </span>
            <div className="h-px grow bg-outline-variant/30"></div>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleCreate}>
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
};
