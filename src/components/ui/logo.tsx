import Image from "next/image";
import Link from "next/link";

// Brand logo: a water drop with a location pin over a winding canal.
// Ultramarine tile at public/brand/backwater-trace-mark.png; 1024px master in
// docs/brand/final/backwater-trace-logo.png (earlier tiles in docs/brand/final/archive/).
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <Image
      src="/brand/backwater-trace-mark.png"
      alt=""
      width={64}
      height={64}
      preload
      className={`${className} shrink-0`}
    />
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark className="size-9" />
      <span className="leading-tight">
        <span className="entry-head block text-[22px] leading-none">Backwater Trace</span>
        <span className="mt-0.5 block text-[12px] text-fg-faint">Alappuzha incident record</span>
      </span>
    </Link>
  );
}
