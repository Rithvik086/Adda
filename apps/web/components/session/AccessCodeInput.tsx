"use client";

import { useState } from "react";

interface AccessCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AccessCodeInput = ({ value, onChange }: AccessCodeInputProps) => {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          Access Code
        </label>
        <span className="text-[10px] text-primary-dim font-medium opacity-0 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">
          Awaiting Input
        </span>
      </div>
      <div className="flex gap-2 justify-center">
        <input
          autoComplete="off"
          className="w-full bg-surface-container-lowest border-none text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-xl code-input text-primary transition-all placeholder:text-zinc-800"
          maxLength={6}
          placeholder="000000"
          spellCheck={false}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};
