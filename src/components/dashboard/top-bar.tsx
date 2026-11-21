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
    <span className="tabular hidden font-mono text-xs text-fg-muted md:inline" suppressHydrationWarning>
      {now ? now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"} IST
    </span>
  );
}

const NAV = [
  { href: "/dashboard", label: "Incident board" },
  { href: "/report", label: "Submit report" },
];

export function TopBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-[1000] flex h-14 shrink-0 items-center gap-4 border-b border-line bg-bg/90 px-4 backdrop-blur">
      <Logo />
      <nav className="ml-4 hidden items-center gap-1 md:flex">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
              path.startsWith(n.href) ? "bg-panel-2 text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <Clock />
        <Link href="/report" className={buttonClass("primary", "sm")}>
          <Plus /> Report issue
        </Link>
      </div>
    </header>
  );
}
