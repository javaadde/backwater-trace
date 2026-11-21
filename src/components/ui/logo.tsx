import Link from "next/link";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0f2a27" />
      <path d="M6 19c3 0 3-2.2 6-2.2s3 2.2 6 2.2 3-2.2 6-2.2 2 1.1 2 1.1" stroke="#2fc5a8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M6 24c3 0 3-2.2 6-2.2s3 2.2 6 2.2 3-2.2 6-2.2 2 1.1 2 1.1" stroke="#2fc5a8" strokeOpacity=".45" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="10.5" r="3.2" fill="none" stroke="#e7ecf3" strokeWidth="2" />
      <path d="M16 13.7v3" stroke="#e7ecf3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">Backwater Trace</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-fg-faint">Alappuzha · Incident verification</span>
      </span>
    </Link>
  );
}
