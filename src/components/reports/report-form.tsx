"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, ChevronRight, Crosshair, LoaderCircle, MapPin, Sparkles, TriangleExclamationPoint, X } from "lucide-react";
import type {
  Category,
  Contradiction,
  ExtractedDetails,
  Incident,
  RoadStatus,
  Severity,
  SituationStatus,
  WaterLevel,
} from "@/types/domain";
import { CATEGORIES, ROAD_STATUSES, SEVERITIES, SITUATION_STATUSES, WATER_LEVELS } from "@/types/domain";
import {
  CATEGORY_LABEL,
  CATEGORY_LABEL_ML,
  FIELD_LABEL,
  ROAD_LABEL,
  SEVERITY_LABEL,
  SITUATION_LABEL,
  WATER_LABEL,
  fieldValueLabel,
} from "@/lib/labels";
import { LANDMARKS } from "@/lib/engine/landmarks";
import { isWithinAlappuzha } from "@/lib/engine/geo";
import { LocationPicker } from "@/components/map";
import { Button, buttonClass } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badges";
import { CategoryIcon } from "@/components/ui/category-icon";
import { cn } from "@/lib/utils";
import { VoiceRecorder } from "./voice-recorder";

type LatLng = { latitude: number; longitude: number };

interface Fields {
  category: Category | null;
  roadStatus: RoadStatus | null;
  waterLevel: WaterLevel | null;
  severity: Severity | null;
  situationStatus: SituationStatus | null;
}
type FieldKey = keyof Fields;

interface SubmitResult {
  report: { id: string };
  incident: Incident;
  match: { score: number; reasons: string[] } | null;
  newContradictions: Contradiction[];
  warnings: string[];
}

const STEPS = ["Describe", "Locate", "Attach", "Review"] as const;

/** Synthetic sample reports for rehearsing the demo without a microphone. */
const SAMPLES = [
  { label: "Waist-deep at KSRTC (EN)", text: "Water has reached waist level near the KSRTC bus stand and the road appears completely blocked." },
  { label: "Canal choked (ML)", text: "വാടക്കനാലിൽ പോള നിറഞ്ഞ് ഒഴുക്ക് നിലച്ചു, ഇപ്പോഴും വൃത്തിയാക്കിയിട്ടില്ല." },
];

export function ReportForm() {
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [mocked, setMocked] = useState(false);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [locationText, setLocationText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [reporterName, setReporterName] = useState("");
  const [fields, setFields] = useState<Fields>({ category: null, roadStatus: null, waterLevel: null, severity: null, situationStatus: null });
  const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
  const [analysis, setAnalysis] = useState<ExtractedDetails | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const locationTouched = useRef(false);

  // Rule-based suggestions as the reporter types/edits (advisory only).
  useEffect(() => {
    const text = description.trim();
    if (text.length < 5) return;
    const t = setTimeout(async () => {
      setAnalyzing(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) return;
        const a = (await res.json()) as ExtractedDetails;
        setAnalysis(a);
        setFields((f) => ({
          category: touched.has("category") ? f.category : a.category,
          roadStatus: touched.has("roadStatus") ? f.roadStatus : a.roadStatus,
          waterLevel: touched.has("waterLevel") ? f.waterLevel : a.waterLevel,
          severity: touched.has("severity") ? f.severity : a.severity,
          situationStatus: touched.has("situationStatus") ? f.situationStatus : a.situationStatus,
        }));
        if (a.landmark && !locationTouched.current) {
          setLocation({ latitude: a.landmark.latitude, longitude: a.landmark.longitude });
          setLocationText(a.landmark.name);
        } else if (a.locationText && !locationTouched.current && !locationText) {
          setLocationText(a.locationText);
        }
      } finally {
        setAnalyzing(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [description]); // eslint-disable-line react-hooks/exhaustive-deps

  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

  const setField = <K extends FieldKey>(k: K, v: Fields[K]) => {
    setFields((f) => ({ ...f, [k]: v }));
    setTouched((t) => new Set(t).add(k));
  };

  const canNext = [description.trim().length >= 5, location !== null, true, true][step];

  async function submit() {
    if (!location) return;
    setSubmitting(true);
    setError(null);
    const form = new FormData();
    form.append("description", description.trim());
    if (transcript) form.append("transcript", transcript);
    form.append("latitude", String(location.latitude));
    form.append("longitude", String(location.longitude));
    if (locationText) form.append("locationText", locationText);
    if (reporterName) form.append("reporterName", reporterName);
    form.append("reportedAt", new Date().toISOString());
    form.append("sourceType", audio && transcript ? "voice" : "text");
    for (const [k, v] of Object.entries(fields)) if (v) form.append(k, v);
    if (photo) form.append("photo", photo);
    if (audio) form.append("audio", audio, "recording.wav");
    try {
      const res = await fetch("/api/reports", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setResult(json as SubmitResult);
    } catch (e) {
      setError((e as Error).message || "Submission failed. Your report is still here — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <SubmitSuccess result={result} onAnother={() => window.location.reload()} />;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link href="/dashboard" className="legend inline-flex items-center gap-1 text-fg-muted hover:text-fg">
        <ArrowLeft className="size-3.5" /> Incident board
      </Link>
      <h1 className="mt-3 font-display text-[40px] leading-none font-semibold uppercase tracking-[0.01em]">Report an incident</h1>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-fg-muted">
        Flooded roads, waterlogging, blocked canals, waste dumping or damaged infrastructure in Alappuzha. Speak in Malayalam or type in any language.
      </p>

      {/* Stepper */}
      <ol className="mt-6 grid grid-cols-4 border border-z0">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "flex h-10 w-full items-center gap-2 border-l border-z0 px-3 text-left disabled:cursor-default",
                i === 0 && "border-l-0",
                i === step ? "bg-z0 text-z10" : i < step ? "hatch bg-panel text-fg [color:var(--z8)] hover:bg-panel-3" : "bg-panel text-fg-faint",
              )}
            >
              <span className={cn("tabular font-mono text-[11px]", i === step ? "text-accent" : i < step ? "text-fg" : "")}>{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("legend", i < step && "text-fg")}>{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="border-x border-b border-z0 bg-panel p-5">
        {step === 0 && (
          <div className="space-y-4">
            <VoiceRecorder
              onTranscript={(text, blob, wasMocked) => {
                setTranscript(text);
                setDescription(text);
                setAudio(blob);
                setMocked(wasMocked);
              }}
              onReset={() => {
                setTranscript(null);
                setAudio(null);
              }}
            />
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="desc" className="text-sm font-medium">
                  {transcript ? "Transcript — edit anything that's wrong" : "Or type what you see"}
                </label>
                {transcript && (
                  <span className="text-[11px] text-accent-text">{mocked ? "Demo transcript (mock mode)" : "Transcribed by Sarvam AI"}</span>
                )}
              </div>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. Knee-deep water near KSRTC bus stand, vehicles struggling to pass."
                className="mt-2 w-full resize-y rounded-sm border border-z0 bg-panel px-3.5 py-3 text-[16px] leading-relaxed text-fg placeholder:text-fg-faint"
              />
              {!transcript && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-fg-faint">
                  Demo samples:
                  {SAMPLES.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setDescription(s.text)}
                      className="rounded-sm border border-line-strong bg-panel px-2 py-0.5 text-fg-muted hover:border-z0 hover:text-fg"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Suggestions analysis={analysis} analyzing={analyzing} fields={fields} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Where is it?</h2>
                <p className="text-sm text-fg-muted">Tap the map or drag the pin inside the dashed Alappuzha border. Pick a landmark to jump there.</p>
              </div>
              <GeoButton
                onLocate={(p) => {
                  locationTouched.current = true;
                  setLocation(p);
                }}
              />
            </div>
            {analysis?.landmark && (
              <div className="flex items-center gap-2 border border-deep-canal bg-[#dff4ef] px-3 py-2 text-[13px] text-fg-muted">
                <Sparkles className="size-3.5 text-accent-text" /> Detected <b className="text-fg">{analysis.landmark.name}</b> in your report and placed the pin there. Adjust if needed.
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {LANDMARKS.slice(0, 10).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    locationTouched.current = true;
                    setLocation({ latitude: l.latitude, longitude: l.longitude });
                    setLocationText(l.name);
                  }}
                  className={cn(
                    "rounded-sm border px-2.5 py-1 text-[13px] transition-colors",
                    locationText === l.name ? "border-z0 bg-z0 text-z10" : "border-line-strong bg-panel text-fg-muted hover:border-z0 hover:text-fg",
                  )}
                >
                  {l.name}
                </button>
              ))}
            </div>
            <div className="h-80 overflow-hidden border border-z0">
              <LocationPicker
                value={location}
                onChange={(p) => {
                  locationTouched.current = true;
                  setLocation(p);
                }}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Place name or landmark (optional)"
                className="h-10 rounded-sm border border-z0 bg-panel px-3 text-sm"
              />
              <div className="tabular flex h-10 items-center gap-1.5 rounded-sm border border-z0 bg-panel px-3 font-mono text-xs text-fg-muted">
                <MapPin className="size-3.5" />
                {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : "No point selected"}
              </div>
            </div>
            {location && !isWithinAlappuzha(location.latitude, location.longitude) && (
              <p className="text-xs text-warn">This point is outside Alappuzha district and will be rejected.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold">Add a photo (optional)</h2>
              <p className="text-sm text-fg-muted">Photos are stored privately and only shown through short-lived links. Avoid faces and number plates.</p>
              {photoUrl ? (
                <div className="relative mt-3 overflow-hidden border border-z0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Selected evidence" className="max-h-72 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-bg/80 text-fg hover:bg-bg"
                    aria-label="Remove photo"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-z5 bg-panel px-4 py-10 text-sm text-fg-muted hover:border-z0 hover:text-fg">
                  <Camera className="size-6" />
                  Choose or take a photo
                  <span className="text-[11px] text-fg-faint">JPEG, PNG or WebP · up to 8 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 8 * 1024 * 1024) {
                        setError("Photo is larger than 8 MB.");
                        return;
                      }
                      setError(null);
                      setPhoto(f);
                    }}
                  />
                </label>
              )}
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Your name or role <span className="font-normal text-fg-faint">(optional)</span>
              </label>
              <input
                id="name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                maxLength={80}
                placeholder="e.g. Ward volunteer"
                className="mt-2 h-10 w-full rounded-sm border border-z0 bg-panel px-3 text-sm"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold">Review</h2>
              <p className="text-sm text-fg-muted">
                These details were suggested from your words. Change anything that&apos;s wrong — they help group your report with others.
              </p>
            </div>
            <div className="border border-line-strong bg-panel p-4">
              <div className="legend text-fg-muted">
                {audio && transcript ? "Voice report · transcript" : "Written report"}
              </div>
              <p className="mt-1 text-[15px] leading-relaxed">{description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {locationText || `${location?.latitude.toFixed(4)}, ${location?.longitude.toFixed(4)}`}
                </span>
                {photo && <span className="flex items-center gap-1"><Camera className="size-3.5" /> 1 photo</span>}
                {reporterName && <span>By {reporterName}</span>}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Category</div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setField("category", c)}
                    className={cn(
                      "flex items-center gap-2 rounded-sm border px-3 py-2 text-left text-sm transition-colors",
                      fields.category === c ? "border-z0 bg-z0 text-z10 [&_.font-ml]:text-z7" : "border-line-strong bg-panel hover:border-z0",
                    )}
                  >
                    <span style={{ color: `var(--cat-${c})` }}>
                      <CategoryIcon category={c} className="size-4" />
                    </span>
                    <span className="leading-tight">
                      {CATEGORY_LABEL[c]}
                      <span className="block font-ml text-[11px] text-fg-faint">{CATEGORY_LABEL_ML[c]}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FieldSelect label="Water level" value={fields.waterLevel} options={WATER_LEVELS} labels={WATER_LABEL} onChange={(v) => setField("waterLevel", v)} />
              <FieldSelect label="Road status" value={fields.roadStatus} options={ROAD_STATUSES} labels={ROAD_LABEL} onChange={(v) => setField("roadStatus", v)} />
              <FieldSelect label="How serious does it look?" value={fields.severity} options={SEVERITIES} labels={SEVERITY_LABEL} onChange={(v) => setField("severity", v)} />
              <FieldSelect label="Situation" value={fields.situationStatus} options={SITUATION_STATUSES} labels={SITUATION_LABEL} onChange={(v) => setField("situationStatus", v)} />
            </div>
            <p className="text-[11px] text-fg-faint">
              Severity here is your impression, not an official emergency rating.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 border border-danger bg-[#f7e3e0] px-3 py-2 text-sm text-danger">
            <TriangleExclamationPoint className="mt-0.5 size-4 shrink-0" /> {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || submitting}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              {step === 2 && !photo ? "Skip" : "Continue"} <ChevronRight />
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={submit} disabled={submitting || !location}>
              {submitting ? <LoaderCircle className="animate-spin" /> : <Check />}
              {submitting ? "Submitting…" : "Submit report"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Suggestions({ analysis, analyzing, fields }: { analysis: ExtractedDetails | null; analyzing: boolean; fields: Fields }) {
  if (!analysis && !analyzing) return null;
  const chips: string[] = [];
  if (fields.category) chips.push(CATEGORY_LABEL[fields.category]);
  if (fields.waterLevel) chips.push(WATER_LABEL[fields.waterLevel]);
  if (fields.roadStatus) chips.push(`Road: ${ROAD_LABEL[fields.roadStatus].toLowerCase()}`);
  if (analysis?.landmark) chips.push(`Near ${analysis.landmark.name}`);
  else if (analysis?.locationText) chips.push(`Near ${analysis.locationText}`);
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="flex items-center gap-1 text-fg-faint">
        {analyzing ? <LoaderCircle className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-accent-text" />}
        Detected
      </span>
      {chips.length === 0 && !analyzing && <span className="text-fg-faint">nothing yet — add where and what you see</span>}
      {chips.map((c) => (
        <span key={c} className="border border-line-strong bg-panel px-2 py-0.5 text-fg">
          {c}
        </span>
      ))}
    </div>
  );
}

function FieldSelect<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: T | null;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as T | null)}
        className="select mt-1.5 h-10 w-full text-sm"
      >
        <option value="">Not mentioned</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {labels[o]}
          </option>
        ))}
      </select>
    </label>
  );
}

function GeoButton({ onLocate }: { onLocate: (p: LatLng) => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="text-right">
      <Button
        variant="secondary"
        size="sm"
        disabled={busy}
        onClick={() => {
          if (!navigator.geolocation) return setMsg("Location not available");
          setBusy(true);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setBusy(false);
              const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
              if (!isWithinAlappuzha(p.latitude, p.longitude)) return setMsg("You seem to be outside Alappuzha");
              setMsg(null);
              onLocate(p);
            },
            () => {
              setBusy(false);
              setMsg("Couldn't get your location");
            },
            { enableHighAccuracy: true, timeout: 8000 },
          );
        }}
      >
        {busy ? <LoaderCircle className="animate-spin" /> : <Crosshair />} Use my location
      </Button>
      {msg && <div className="mt-1 text-[11px] text-warn">{msg}</div>}
    </div>
  );
}

function SubmitSuccess({ result, onAnother }: { result: SubmitResult; onAnother: () => void }) {
  const { incident, match, newContradictions, warnings } = result;
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="settle border border-z0 bg-panel p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center border border-ok text-ok">
            <Check className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-[28px] leading-none font-semibold uppercase">Report submitted</h1>
            <p className="text-sm text-fg-muted">Thank you. It is now visible on the incident board as an unverified report.</p>
          </div>
        </div>

        <div className="mt-6 border border-line-strong bg-panel p-4">
          <div className="legend text-fg-muted">
            {match ? "Grouped with an existing incident" : "New incident created"}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-semibold">{incident.title}</span>
            <StatusBadge status={incident.status} />
          </div>
          {match && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <span className="border border-deep-canal bg-accent px-2 py-0.5 font-mono font-medium text-accent-ink">Match score {match.score}</span>
              {match.reasons.map((r) => (
                <span key={r} className="rounded-md bg-panel-3 px-2 py-0.5 text-fg-muted">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {newContradictions.length > 0 && (
          <div className="mt-3 border border-conflict bg-panel p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-conflict">
              <span aria-hidden className="hatch-cross size-4 border border-conflict" /> Your report differs from earlier reports
            </div>
            <ul className="mt-2 space-y-1 text-sm text-fg-muted">
              {[...new Map(newContradictions.map((c) => [`${c.field}:${c.value_a}`, c])).values()].map((c) => (
                <li key={c.id}>
                  {FIELD_LABEL[c.field]}: earlier <b className="text-fg">{fieldValueLabel(c.field, c.value_a)}</b>, yours{" "}
                  <b className="text-fg">{fieldValueLabel(c.field, c.value_b)}</b>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-fg-faint">Flagged as a possible conflict for coordinators to verify. Conditions may have changed.</p>
          </div>
        )}

        {warnings.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-warn">
            {warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/incidents/${incident.id}`} className={buttonClass("primary", "md")}>
            Open incident <ChevronRight />
          </Link>
          <Link href="/dashboard" className={buttonClass("secondary", "md")}>
            Incident board
          </Link>
          <Button variant="ghost" onClick={onAnother}>
            Submit another
          </Button>
        </div>
      </div>
    </div>
  );
}
