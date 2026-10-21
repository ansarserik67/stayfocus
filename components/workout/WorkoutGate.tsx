"use client";

/**
 * The blocking workout gate.
 *
 * When a feed's budget is spent this overlay is the only way back: the user
 * picks push-ups (10) or squats (20) and the camera counts the set, checking
 * the joints with MediaPipe pose landmarks. Nothing is uploaded — the frames
 * are processed in the tab and thrown away.
 *
 * The overlay intentionally has no "just close" affordance. Leaving is allowed
 * only as an explicit action that keeps the channel locked.
 */

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Check,
  Dumbbell,
  Loader2,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";

import { useLang } from "@/components/i18n/LanguageProvider";
import {
  RepCounter,
  evaluateFrame,
  type CounterState,
  type ExerciseId,
  type FormFault,
  type Landmark,
} from "@/lib/workout/engine";
import { loadPoseLandmarker } from "@/lib/workout/pose-engine";

type Phase =
  | "choose"
  | "connecting"
  | "active"
  | "denied"
  | "error"
  | "finished";

/** Landmark pairs worth drawing: torso, both arms, both legs. */
const BONES: Array<[number, number]> = [
  [11, 12],
  [11, 23],
  [12, 24],
  [23, 24],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

const REQUIRED: Record<ExerciseId, number> = { pushup: 10, squat: 20 };

export function WorkoutGate({
  channelLabel,
  onLeave,
  onEarned,
}: {
  channelLabel: string;
  onLeave: () => void;
  onEarned: (minutes: number) => void;
}) {
  const { t } = useLang();
  const [exercise, setExercise] = useState<ExerciseId | null>(null);
  const [phase, setPhase] = useState<Phase>("choose");
  const [counter, setCounter] = useState<CounterState | null>(null);
  const [errorDetail, setErrorDetail] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const counterRef = useRef<RepCounter | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runningRef = useRef(false);
  const lastPaintRef = useRef(0);

  /** Release the camera and cancel the inference loop. */
  const stop = () => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    for (const track of streamRef.current?.getTracks() ?? []) track.stop();
    streamRef.current = null;
  };

  useEffect(() => stop, []);

  useEffect(() => {
    if (!exercise) return;
    let cancelled = false;

    const paint = (landmarks: Landmark[] | null) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (!landmarks) return;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
      ctx.lineCap = "round";
      for (const [from, to] of BONES) {
        const a = landmarks[from];
        const b = landmarks[to];
        if (!a || !b) continue;
        if ((a.visibility ?? 1) < 0.5 || (b.visibility ?? 1) < 0.5) continue;
        ctx.beginPath();
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(52, 211, 153, 0.95)";
      for (const point of landmarks) {
        if ((point.visibility ?? 1) < 0.5) continue;
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = async () => {
      setPhase("connecting");
      setCounter(null);
      counterRef.current = new RepCounter(exercise);

      // The <video> is rendered by the "connecting" phase, so it only exists
      // after React commits that render. Poll briefly for it — reading the ref
      // straight away yields null and the camera stream is never attached.
      for (let attempt = 0; attempt < 60 && !videoRef.current; attempt += 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, 16));
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }
        streamRef.current = stream;
        const element = videoRef.current;
        if (!element) {
          setPhase("error");
          return;
        }
        element.srcObject = stream;
        await element.play().catch(() => undefined);
      } catch (error) {
        if (cancelled) return;
        const name = error instanceof Error ? error.name : "";
        setErrorDetail(name);
        setPhase(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
        return;
      }

      try {
        const landmarker = await loadPoseLandmarker();
        if (cancelled) return;

        setPhase("active");
        runningRef.current = true;
        let lastTimestamp = 0;

        const tick = () => {
          if (!runningRef.current || cancelled) return;
          const element = videoRef.current;
          if (element && element.readyState >= 2) {
            const timestamp = Math.max(performance.now(), lastTimestamp + 1);
            lastTimestamp = timestamp;
            let landmarks: Landmark[] | null = null;
            try {
              const result = landmarker.detectForVideo(element, timestamp);
              landmarks = (result.landmarks?.[0] as Landmark[] | undefined) ?? null;
            } catch {
              landmarks = null;
            }

            const frame = evaluateFrame(exercise, landmarks);
            if (frame) {
              const next = counterRef.current?.push(frame);
              if (next) {
                const now = performance.now();
                if (now - lastPaintRef.current > 90) {
                  lastPaintRef.current = now;
                  setCounter(next);
                }
                if (next.done) {
                  runningRef.current = false;
                  stop();
                  setCounter(next);
                  setPhase("finished");
                  paint(null);
                  return;
                }
              }
            }
            if (performance.now() - lastPaintRef.current > 90) paint(landmarks);
          }
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (cancelled) return;
        setPhase("error");
      }
    };

    void start();

    return () => {
      cancelled = true;
      stop();
    };
  }, [exercise]);

  const required = exercise ? REQUIRED[exercise] : 0;
  const reps = counter?.reps ?? 0;
  const rejected = counter?.rejected ?? 0;
  const progress = required === 0 ? 0 : Math.min(1, reps / required);

  const faultKey = (fault: FormFault | undefined) => {
    switch (fault) {
      case "sagging":
        return "workout.fault.sagging";
      case "piking":
        return "workout.fault.piking";
      case "shallow":
        return "workout.fault.shallow";
      default:
        return "workout.fault.notVisible";
    }
  };
  const visibleFault = counter?.faults[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workout-title"
      className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-[#04070f]/85 p-4 backdrop-blur-sm"
    >
      <div className="card animate-rise relative my-auto w-full max-w-[600px] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-eyebrow flex items-center gap-2 text-amber">
              <Lock size={13} />
              {channelLabel}
            </span>
            <h2 id="workout-title" className="font-display mt-1.5 text-[22px] font-extrabold">
              {phase === "finished" ? t("workout.doneTitle") : t("workout.title")}
            </h2>
            <p className="mt-1 text-[13.5px] text-ink-soft">
              {phase === "finished" ? t("workout.doneText") : t("workout.lockedFor")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              stop();
              onLeave();
            }}
            aria-label={t("workout.leave")}
            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>

        {/* ---------- choose the set ---------- */}
        {phase === "choose" && (
          <>
            <p className="mt-4 rounded-2xl border border-line bg-surface-2/50 p-3.5 text-[12.5px] leading-relaxed text-ink-soft">
              {t("workout.chooseHint")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["pushup", "squat"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setExercise(id)}
                  className="group flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface-2/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan hover:shadow-[0_18px_36px_-24px_var(--glow-cyan)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
                    <Dumbbell size={18} />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">
                    {t(id === "pushup" ? "workout.pushup" : "workout.squat")}
                  </span>
                  <span className="text-[12.5px] text-ink-mute">
                    {REQUIRED[id]} {t("workout.repsRequired")} · +{id === "pushup" ? 10 : 15}{" "}
                    {t("limits.mins")}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ---------- camera ---------- */}
        {(phase === "connecting" || phase === "active") && (
          <>
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-[300px] w-full scale-x-[-1] object-cover sm:h-[340px]"
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1] object-cover"
              />
              {phase === "connecting" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-[13px] text-white/80">
                  <Loader2 size={22} className="animate-spin text-cyan" />
                  {t("workout.loadingModel")}
                </div>
              )}
              {phase === "active" && (
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white">
                  <Camera size={13} className="text-emerald" />
                  {t(exercise === "squat" ? "workout.squat" : "workout.pushup")}
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-end justify-between gap-3">
                <p className="font-display text-[28px] font-extrabold leading-none text-ink">
                  {reps}
                  <span className="ml-1 text-[15px] font-semibold text-ink-mute">
                    / {required} {t("workout.repsRequired")}
                  </span>
                </p>
                {rejected > 0 && (
                  <span className="chip !border-amber/40 !bg-amber/10 !text-amber">
                    {rejected} {t("workout.rejected")}
                  </span>
                )}
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-emerald transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <p
                className={`mt-3 flex items-center gap-2 text-[13px] ${
                  visibleFault ? "text-amber" : "text-emerald"
                }`}
              >
                {visibleFault ? <CameraOff size={15} /> : <Check size={15} />}
                {visibleFault
                  ? t(faultKey(visibleFault))
                  : t(counter?.phase === "bottom" ? "workout.goUp" : "workout.formOk")}
              </p>
            </div>
          </>
        )}

        {/* ---------- camera problems ---------- */}
        {(phase === "denied" || phase === "error") && (
          <div className="mt-5 rounded-2xl border border-line bg-surface-2/50 p-4">
            <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <CameraOff size={17} className="text-amber" />
              {t(phase === "denied" ? "workout.cameraDenied" : "workout.cameraError")}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {t(phase === "denied" ? "workout.cameraDeniedHelp" : "workout.cameraErrorHelp")}
            </p>
            {errorDetail && (
              <p className="mt-2 font-mono text-[11.5px] text-ink-mute">{errorDetail}</p>
            )}
            <button
              type="button"
              onClick={() => {
                const previous = exercise;
                setExercise(null);
                setPhase("choose");
                // Re-selecting the same exercise restarts the effect.
                window.setTimeout(() => setExercise(previous), 0);
              }}
              className="btn btn-secondary mt-4"
            >
              {t("workout.retry")}
            </button>
          </div>
        )}

        {/* ---------- finished ---------- */}
        {phase === "finished" && (
          <div className="mt-6 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-emerald text-[#04121a]">
              <ShieldCheck size={30} />
            </span>
            <p className="font-display mt-4 text-[20px] font-extrabold text-ink">
              {reps} {t("workout.repsRequired")} ·{" "}
              {t(exercise === "squat" ? "workout.squat" : "workout.pushup")}
            </p>
            <p className="mt-1.5 text-[13.5px] text-ink-soft">
              +{exercise === "squat" ? 15 : 10} {t("limits.mins")} → {channelLabel}
            </p>
            <button
              type="button"
              onClick={() => onEarned(exercise === "squat" ? 15 : 10)}
              className="btn btn-primary mt-5 w-full justify-center"
            >
              <Check size={17} />
              {t("workout.claim")}
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-[12px] text-ink-mute">
          <p>{t("workout.privacy")}</p>
          {phase !== "finished" && (
            <button
              type="button"
              onClick={() => {
                stop();
                onLeave();
              }}
              className="self-start text-[12.5px] font-semibold text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {t("workout.leave")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
