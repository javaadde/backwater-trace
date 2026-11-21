"use client";

import { type CSSProperties, useRef, useState } from "react";

export function MascotLauncher() {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
  const moved = useRef(false);
  const distance = useRef(0);
  const [stepAngle, setStepAngle] = useState(0);

  return (
    <div className="fixed z-[1100] h-28 w-24" style={point ? {
      left: `clamp(0px, ${point.x}px, 100vw - 6rem)`,
      top: `clamp(0px, ${point.y}px, 100dvh - 7rem)`,
    } : { right: "max(1rem, env(safe-area-inset-right))", bottom: "max(1rem, env(safe-area-inset-bottom))" }}>
      {open && (
        <div role="status" className="absolute w-40 rounded-xl bg-[#24458B] px-3 py-2 text-sm text-white shadow-md"
          style={{ [point && point.y < 90 ? "top" : "bottom"]: "100%", [point && point.x < window.innerWidth / 2 ? "left" : "right"]: 0 }}>
          Voice assistance is coming soon!
        </div>
      )}
      <button type="button" aria-label="Backwater Buddy" aria-expanded={open}
        className="size-full touch-none cursor-grab select-none rounded-full focus-visible:outline-2 focus-visible:outline-[#24458B] active:cursor-grabbing"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: rect.left, top: rect.top };
          moved.current = false;
          distance.current = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const start = drag.current;
          if (start?.id !== e.pointerId || !start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (!moved.current && Math.hypot(dx, dy) < 5) return;
          moved.current = true;
          setOpen(false);
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(window.innerWidth - rect.width, start.left + dx));
          const y = Math.max(0, Math.min(window.innerHeight - rect.height, start.top + dy));
          distance.current += Math.hypot(x - (point?.x ?? start.left), y - (point?.y ?? start.top));
          setStepAngle(12 * Math.sin(distance.current / 12));
          setPoint({ x, y });
        }}
        onLostPointerCapture={() => { drag.current = null; setStepAngle(0); }}
        onClick={(e) => { if (!moved.current || e.detail === 0) setOpen(!open); }}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
      >
        <svg aria-hidden="true" viewBox="0 0 112 126" className="buddy-mascot size-full drop-shadow-sm"
          style={{ "--buddy-step": `${stepAngle}deg` } as CSSProperties}
          stroke="#123954" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          <defs>
            <radialGradient id="buddy-water" cx=".35" cy=".35" r=".8">
              <stop stopColor="#a2f3ff"/><stop offset=".55" stopColor="#54ccfa"/><stop offset="1" stopColor="#1682c7"/>
            </radialGradient>
          </defs>
          {[false, true].map((right) => (
            <g key={String(right)} transform={right ? "translate(121 0) scale(-1 1)" : undefined}>
              <g className={right ? "buddy-leg buddy-leg-other" : "buddy-leg"}>
                <path fill="#50bfe9" d="M46 87h7l-2 20-6 1z"/>
                <path fill="#a5dc60" d="M41 103q6 2 12-1l3 12q-9 7-28 3l3-8z"/>
                <path fill="#fff" d="M23 116q0-9 10-10 10 0 12 11z"/>
                <path fill="#e0f2f8" d="M23 115q15 3 33-2v5q-15 5-33 1z"/>
              </g>
            </g>
          ))}
          <path fill="#54c8ee" d="M33 68Q20 73 16 59l-5 3q5 21 25 13z"/>
          <path fill="#fff" d="M11 63Q6 60 5 54L2 46Q1 42 4 42Q6 42 9 48L6 36Q5 32 8 32Q10 32 11 35L14 45L14 32Q14 28 17 29Q19 29 19 33L19 45L22 36Q24 32 26 35Q27 36 26 39L23 51L27 47Q30 45 31 48Q32 50 29 53L22 61Q18 67 11 63Z"/>
          <path fill="none" stroke="#75a1b4" strokeWidth="1.4" d="M11 52q5-2 8 1m3-2q-5 2-5 7"/>
          <path fill="#e0f2f8" d="m10 61 10-2q3 1 2 4l-10 3q-3-1-2-5z"/>
          <path fill="url(#buddy-water)" d="M82 5c-3 12-1 22 5 34 7 14 13 28 6 42-6 12-19 17-34 16-21-1-35-13-35-32 0-18 11-33 28-45C64 12 75 8 82 5Z"/>
          <path fill="none" stroke="#d4faff" strokeWidth="4" d="M42 37q9-12 23-18"/>
          <path fill="#233f58" d="M37 48q4-10 16-8l2 4q-10-2-18 4zm24-9q10-7 19 2l-1 3q-8-5-17-2z"/>
          <g className="buddy-eyes">
            <ellipse fill="#fff" cx="48" cy="58" rx="10" ry="12"/>
            <ellipse fill="#fff" cx="68" cy="56" rx="11" ry="13"/>
            {[50, 69].map((x) => <g key={x} transform={`translate(${x} ${x === 50 ? 59 : 57})`}>
              <ellipse fill="#267c9f" rx="5" ry="7"/><ellipse fill="#102b42" rx="2" ry="4"/>
              <circle stroke="none" fill="#fff" cx="-1.5" cy="-3" r="2"/>
            </g>)}
          </g>
          <path fill="#48253e" d="M42 74q15 4 34-4-5 18-17 19-10 0-17-15z"/>
          <path fill="#fff" stroke="none" d="M46 76q13 2 26-3l-3 5q-12 4-20 1z"/>
          <path fill="#fa7182" stroke="none" d="M53 85q6-5 13-2-6 7-13 2z"/>
          <path fill="#53bce8" d="M91 58q15 9 13 21l-6 1q0-9-10-14"/>
          <path fill="#fff" d="M98 75q7-2 9 4l-1 9q-1 4-5 2-3 3-6 0-5 0-5-5l1-5q1-4 7-5z"/>
        </svg>
      </button>
    </div>
  );
}
