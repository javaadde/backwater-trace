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
    <span className="tabular hidden font-mono text-xs text-z7 md:inline" suppressHydrationWarning>
      {now ? now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"} IST
    </span>
  );
}

const NAV = [{ href: "/dashboard", label: "Incident board" }];

export function TopBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-[1000] flex h-14 shrink-0 items-center gap-4 bg-z0 px-4 text-z10">
      <Logo />
      <nav className="ml-4 hidden h-full items-stretch md:flex">
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "legend flex items-center border-x border-transparent px-3.5 transition-colors",
                active ? "border-z3 bg-z1 text-z10" : "text-z7 hover:text-z10",
              )}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <span className="legend hidden !text-[10.5px] text-z7 lg:inline">Synthetic demo data</span>
        <Clock />
        <Link href="/report" aria-current={path.startsWith("/report") ? "page" : undefined} className={buttonClass("primary", "sm")}>
          <Plus /> Report incident
        </Link>
      </div>
    </header>
  );
}
