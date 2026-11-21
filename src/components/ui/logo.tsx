import Link from "next/link";

// "Canal B" mark — master artwork and guidelines live in docs/brand/.
const B_TOP =
  "M62 36 H138 A44 44 0 0 1 138 124 H138 A6.03 6.03 0 0 1 132.56 120.56 A22.03 22.03 0 0 0 92.78 120.56 A6.03 6.03 0 0 1 81.89 120.56 A22.03 22.03 0 0 0 62 108 Z M104 60 H138 A13 13 0 0 1 138 86 H104 Z";
const B_BOTTOM =
  "M62 124 A6.03 6.03 0 0 1 67.44 127.44 A22.03 22.03 0 0 0 107.22 127.44 A6.03 6.03 0 0 1 118.11 127.44 A22.03 22.03 0 0 0 138 140 H182.66 A50 50 0 0 1 146 224 H62 Z M104 160 H146 A18 18 0 0 1 146 196 H104 Z";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <rect width="256" height="256" rx="58" fill="#2FC5A8" />
      <g transform="translate(30 30) scale(.766)" fill="#0B3B35" fillRule="evenodd">
        <path d={B_TOP} />
        <path d={B_BOTTOM} />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">Backwater Trace</span>
        <span className="block text-[12px] text-fg-faint">Alappuzha incident record</span>
      </span>
    </Link>
  );
}
