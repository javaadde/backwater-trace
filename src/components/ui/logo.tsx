import Image from "next/image";
import Link from "next/link";

// Project icon — source artwork lives at public/brand/app-icon.png.
// The earlier "Canal B" mark is archived in docs/brand/.
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <Image
      src="/brand/app-icon.png"
      alt=""
      width={64}
      height={64}
      priority
      className={`${className} shrink-0`}
    />
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
