import React from 'react'

export default function AuthContainer({ children }) {
  return (
    <div className="w-screen h-screen bg-linear-to-br from-[#020618] via-[#162456] to-[#0F172B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 size-48 bg-[#2B7FFF10] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-48 bg-[#00D1FF10] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
