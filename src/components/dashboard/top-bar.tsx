"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);
  return (
    <span className="tabular hidden text-[13px] text-fg-faint md:inline" suppressHydrationWarning>
      {now ? now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"} IST
    </span>
  );
}

const NAV = [{ href: "/dashboard", label: "Incident board" }];

export function TopBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-[1000] flex h-16 shrink-0 items-center gap-4 border-b-[3px] border-double border-fg bg-panel px-4 text-fg">
      <Logo />
      <nav className="ml-4 hidden items-center md:flex">
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-9 items-center px-3 text-[14px] font-medium underline-offset-[6px] transition-colors",
                active ? "text-fg underline decoration-fg decoration-2" : "text-fg-muted hover:text-fg hover:underline hover:decoration-line-strong",
              )}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden text-[13px] text-fg-faint lg:inline">Synthetic demo data</span>
        <Clock />
        <Link href="/report" aria-current={path.startsWith("/report") ? "page" : undefined} className={buttonClass("primary", "sm")}>
          <Plus /> Report incident
        </Link>
      </div>
    </header>
  );
}
