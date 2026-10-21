"use client";

/**
 * Lazy loader for the MediaPipe pose model.
 *
 * The bundle and the model are served from `/public/mediapipe`, not a CDN, so
 * the workout gate keeps working offline and the first frame does not depend
 * on a third-party host. The library itself is imported dynamically: it is
 * ~13 MB of WASM and has no business in the initial page bundle.
 */

import type { PoseLandmarker, PoseLandmarkerOptions } from "@mediapipe/tasks-vision";

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/pose_landmarker_lite.task";

let pending: Promise<PoseLandmarker> | null = null;

async function create(): Promise<PoseLandmarker> {
  const { FilesetResolver, PoseLandmarker: Landmarker } = await import(
    "@mediapipe/tasks-vision"
  );

  const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);

  const options: PoseLandmarkerOptions = {
    baseOptions: {
      modelAssetPath: MODEL_PATH,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.5,
    minPosePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  };

  try {
    return await Landmarker.createFromOptions(fileset, options);
  } catch {
    // Older GPUs and some browsers reject the WebGL delegate; the CPU path is
    // slower but still fast enough for ~30 fps on a laptop.
    return await Landmarker.createFromOptions(fileset, {
      ...options,
      baseOptions: { ...options.baseOptions, delegate: "CPU" },
    });
  }
}

/** Shared across the session so a retry does not reload 19 MB. */
export function loadPoseLandmarker(): Promise<PoseLandmarker> {
  if (!pending) pending = create();
  return pending;
}

/**
 * Drop the cached instance, e.g. after a failed attempt left it in a bad state.
 * The next call rebuilds it.
 */
export function resetPoseLandmarker(): void {
  pending = null;
}
