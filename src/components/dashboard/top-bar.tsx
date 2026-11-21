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
    <header className="sticky top-0 z-[1000] flex h-14 shrink-0 items-center gap-4 border-b border-line bg-panel px-4 text-fg">
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
                "flex h-8 items-center rounded-md px-3 text-[13px] font-medium transition-colors",
                active ? "bg-panel-3 text-fg" : "text-fg-muted hover:bg-panel-2 hover:text-fg",
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
