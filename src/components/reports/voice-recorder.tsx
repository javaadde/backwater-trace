"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Mic, RotateCcw, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { toWav16k } from "./wav";

const MAX_SECONDS = 30; // Sarvam's synchronous STT handles short clips

type State = "idle" | "recording" | "transcribing" | "done" | "error";

export function VoiceRecorder({
  onTranscript,
  onReset,
}: {
  onTranscript: (text: string, audio: Blob, mocked: boolean) => void;
  onReset?: () => void;
}) {
  const [state, setState] = useState<State>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<number[]>(Array(24).fill(0.08));
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const meterCtx = useRef<AudioContext | null>(null);

  const cleanup = () => {
    if (timer.current) clearInterval(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void meterCtx.current?.close();
    meterCtx.current = null;
  };
  useEffect(() => cleanup, []);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser can't record audio. Please type the report instead.");
      setState("error");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      stream.current = s;
      const rec = new MediaRecorder(s);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => void finish(new Blob(chunks.current, { type: rec.mimeType || "audio/webm" }));
      rec.start();
      recorder.current = rec;
      setSeconds(0);
      setState("recording");

      // live level meter
      const ctx = new AudioContext();
      meterCtx.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      ctx.createMediaStreamSource(s).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(buf);
        setLevel(Array.from(buf.slice(0, 24), (v) => Math.max(0.08, v / 255)));
        raf.current = requestAnimationFrame(tick);
      };
      tick();

      const startedAt = Date.now();
      timer.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startedAt) / 1000);
        setSeconds(sec);
        if (sec >= MAX_SECONDS) stop();
      }, 250);
    } catch {
      setError("Microphone access was blocked. Allow it in your browser, or type the report instead.");
      setState("error");
    }
  }

  function stop() {
    if (recorder.current?.state === "recording") recorder.current.stop();
    cleanup();
    setLevel(Array(24).fill(0.08));
  }

  async function finish(raw: Blob) {
    setState("transcribing");
    try {
      const wav = await toWav16k(raw);
      setAudioUrl(URL.createObjectURL(wav));
      const form = new FormData();
      form.append("audio", wav, "recording.wav");
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const json = (await res.json()) as { transcript?: string; error?: string; mocked?: boolean };
      if (!res.ok || !json.transcript) throw new Error(json.error ?? "Voice transcription failed. You can still type the report manually.");
      onTranscript(json.transcript, wav, Boolean(json.mocked));
      setState("done");
    } catch (e) {
      setError((e as Error).message || "Voice transcription failed. You can still type the report manually.");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setError(null);
    setSeconds(0);
    setAudioUrl(null);
    onReset?.();
  }

  const recording = state === "recording";
  return (
    <div className="border border-line-strong bg-panel-2 p-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={recording ? stop : start}
          disabled={state === "transcribing"}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className={cn(
            "relative grid size-16 shrink-0 place-items-center border transition-colors disabled:opacity-60",
            recording ? "border-danger bg-danger text-white shadow-[inset_0_0_0_3px_var(--danger),inset_0_0_0_4px_var(--panel)]" : "border-accent-press bg-accent text-accent-ink shadow-[inset_0_0_0_3px_var(--accent),inset_0_0_0_4px_var(--accent-ink)] hover:bg-accent-hover hover:shadow-[inset_0_0_0_3px_var(--accent-hover),inset_0_0_0_4px_var(--accent-ink)] active:bg-accent-press",
          )}
        >
          {recording && <span className="absolute inset-0 animate-ping bg-danger/40 motion-reduce:animate-none" />}
          {state === "transcribing" ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : recording ? (
            <Square className="relative size-5 fill-current" />
          ) : (
            <Mic className="size-6" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="entry-head text-[22px] leading-tight">
            {state === "idle" && "Speak your report in Malayalam"}
            {recording && "Listening…"}
            {state === "transcribing" && "Transcribing with Sarvam AI…"}
            {state === "done" && "Transcript ready, check it below"}
            {state === "error" && "Voice input unavailable"}
          </div>
          <div className="mt-0.5 font-ml text-[13px] text-fg-muted">
            {state === "idle" && "മലയാളത്തിൽ പറയൂ — എവിടെ, എന്ത് സംഭവിച്ചു"}
            {recording && (
              <span className="tabular font-sans">
                {String(Math.floor(seconds / 60)).padStart(1, "0")}:{String(seconds % 60).padStart(2, "0")} / 0:{MAX_SECONDS}, tap to stop
              </span>
            )}
            {state === "transcribing" && <span className="font-sans">This usually takes a few seconds.</span>}
            {state === "done" && <span className="font-sans">You can edit any word before submitting.</span>}
            {state === "error" && <span className="font-sans text-danger">{error}</span>}
          </div>
          {recording && (
            <div className="mt-2 flex h-6 items-end gap-[3px]" aria-hidden>
              {level.map((v, i) => (
                <span key={i} className="w-1 bg-danger/80" style={{ height: `${v * 100}%` }} />
              ))}
            </div>
          )}
        </div>
        {(state === "done" || state === "error") && (
          <button type="button" onClick={reset} className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg">
            <RotateCcw className="size-3.5" /> Re-record
          </button>
        )}
      </div>
      {audioUrl && state === "done" && <audio src={audioUrl} controls className="mt-3 h-9 w-full" />}
    </div>
  );
}
