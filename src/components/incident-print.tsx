export type PrintKind = "bus" | "canal" | "gauge";

/** Three two-colour field prints. All labels and source text live in the surrounding HTML. */
export function IncidentPrint({ kind }: { kind: PrintKind }) {
  return (
    <svg viewBox="0 0 420 260" width="420" height="260" aria-hidden="true" focusable="false">
      {kind === "bus" ? <Bus /> : kind === "canal" ? <Canal /> : <Gauge />}
    </svg>
  );
}

function Bus() {
  return (
    <g>
      <rect width="420" height="260" fill="#f0bd65" />
      <circle cx="309" cy="83" r="49" fill="#ffe5aa" />
      <path d="M0 159h27v-18h22v18h17v-32h37v32h40v-14h21v14h110v-24h37v24h32v-19h53v19h24v101H0Z" fill="#c98448" />
      <g transform="translate(53 68)" fill="#263b35">
        <path d="M7 29Q8 16 26 15L256 9Q280 9 287 29l10 39v26q0 9-10 10H10q-8 0-8-9z" />
        <path d="M12 37l235-7 8 37-246 4z" fill="#ffde98" />
        <path d="M18 41l51-2-1 25-52 1zm59-2 48-2v25l-49 2zm56-2 49-2 2 26-51 1zm57-2 49-2 5 27-52 1zm65-5 17-1q9 0 12 10l7 23-29-1z" />
        <path d="M8 77l284-6v8L7 86z" fill="#f0bd65" />
        {[54, 246].map(x => <g key={x}><circle cx={x} cy="100" r="19" /><circle cx={x} cy="100" r="9" fill="#c98448" /></g>)}
      </g>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M-40 ${178 + i * 10}q48 -9 99 0t105 0t98 0t105 0t80 0`} fill="none" stroke={i % 2 ? "#c98448" : "#ffdfa0"} strokeWidth={i % 3 ? 2 : 4} />)}
    </g>
  );
}

function Canal() {
  const channel = "M290 -60C155 7 356 85 210 126S77 213 147 310";
  return (
    <g>
      <defs>
        <pattern id="canal-fields" width="47" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(-21)">
          <rect width="47" height="32" fill="#c9dcad" />
          <path d="M0 0H47V32H0Z M6 5H41M6 10H41M6 15H41M6 20H41M6 25H41" fill="none" stroke="#8ca684" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="420" height="260" fill="url(#canal-fields)" />
      <path d="M-20 44l139 39 51-36L318 82l125-48M-10 227l103-44 77 17 180-59 87 23" fill="none" stroke="#f4efd0" strokeWidth="9" />
      <path d={channel} fill="none" stroke="#f1edc8" strokeWidth="80" />
      <path d={channel} fill="none" stroke="#23675d" strokeWidth="68" />
      <path d={channel} fill="none" stroke="#77aa8d" strokeWidth="1.6" strokeDasharray="6 8" />
      <path d="M161 85l70 74" fill="none" stroke="#394e3f" strokeWidth="11" />
      <path d="M161 85l70 74" fill="none" stroke="#eaebbf" strokeWidth="5" />
      <circle cx="231" cy="113" r="16" fill="#f1edc8" /><circle cx="231" cy="113" r="8" fill="#184e45" />
    </g>
  );
}

function Gauge() {
  return (
    <g>
      <rect width="420" height="260" fill="#22495c" />
      {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M-20 ${65 + i * 9}C85 ${-48 + i * 10} 148 ${140 + i * 7} 254 ${58 + i * 9}S396 ${53 + i * 8} 449 ${22 + i * 9}`} fill="none" stroke={i % 4 === 0 ? "#a3ced3" : "#639ba9"} strokeWidth={i % 4 === 0 ? 2 : 1} />)}
      <g transform="rotate(9 219 130)">
        <rect x="186" y="-20" width="66" height="310" fill="#eee9cd" />
        {Array.from({ length: 27 }, (_, i) => <path key={i} d={`M187 ${i * 10}h${i % 5 === 0 ? 37 : i % 2 ? 14 : 22}`} stroke="#244959" strokeWidth="3" />)}
        <path d="M186 141h66v12h-66z" fill="#d17d43" />
      </g>
      <path d="M0 194q63-22 130 0t130 0t160 0v66H0Z" fill="#183b50" />
      <path d="M0 194q63-22 130 0t130 0t160 0" fill="none" stroke="#aacfd0" strokeWidth="3" />
    </g>
  );
}
