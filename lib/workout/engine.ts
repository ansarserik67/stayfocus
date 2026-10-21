/**
 * Rep counting and form checking from pose landmarks.
 *
 * Deliberately dependency-free: everything here is plain geometry over the 33
 * MediaPipe pose landmarks, so the counting rules can be unit-tested without a
 * camera, a browser or the model. The React layer only feeds landmark frames
 * in and reads the counter's state out.
 *
 * Angles are 2D (x, y) because a webcam gives a frontal-ish view and depth is
 * noisy on single-camera input. Thresholds are chosen for that view: a push-up
 * starts near a straight elbow (~160°) and bottoms out around 90°, a squat goes
 * from a straight knee (~170°) to below parallel (~100°).
 */

export type ExerciseId = "pushup" | "squat";

/** Orthographic landmark as returned by MediaPipe (normalised 0–1). */
export interface Landmark {
  x: number;
  y: number;
  visibility?: number;
}

export type FormFault = "notVisible" | "sagging" | "piking" | "shallow";

export interface ExerciseConfig {
  id: ExerciseId;
  /** Angle at the working joint that counts as the bottom of the rep. */
  downAngle: number;
  /** Angle that counts as a full return to the start position. */
  upAngle: number;
  /** Reps required to unlock screen time. */
  requiredReps: number;
  /** Minutes of screen time granted per completed session. */
  rewardMinutes: number;
  /** Push-ups additionally require a straight body line (degrees). */
  bodyAngleMin?: number;
}

export const EXERCISES: Record<ExerciseId, ExerciseConfig> = {
  pushup: {
    id: "pushup",
    downAngle: 100,
    upAngle: 155,
    requiredReps: 10,
    rewardMinutes: 10,
    bodyAngleMin: 155,
  },
  squat: {
    id: "squat",
    downAngle: 105,
    upAngle: 160,
    requiredReps: 20,
    rewardMinutes: 15,
  },
};

/** MediaPipe pose landmark indices used by the checks below. */
export const POSE = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
} as const;

/** Below this visibility a landmark is treated as missing. */
const MIN_VISIBILITY = 0.5;

export function angleBetween(a: Landmark, b: Landmark, c: Landmark): number {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const magA = Math.hypot(abx, aby);
  const magC = Math.hypot(cbx, cby);
  if (magA === 0 || magC === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (magA * magC)));
  return (Math.acos(cos) * 180) / Math.PI;
}

function visibility(point: Landmark | undefined): number {
  return point?.visibility ?? 1;
}

/** Signed offset of `p` from the line a→b, in the same units as the input. */
function offsetFromLine(a: Landmark, b: Landmark, p: Landmark): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return ((p.x - a.x) * dy - (p.y - a.y) * dx) / len;
}

export interface EvaluatedFrame {
  /** Working joint angle (elbow for push-ups, knee for squats). */
  angle: number;
  /** Straightness of the body line, push-ups only. */
  bodyAngle: number | null;
  /** False when the necessary joints are not in frame. */
  visible: boolean;
  faults: FormFault[];
}

/**
 * Read one landmark frame and report the angles a counter needs.
 * `null` frames (no person detected) are reported as not visible.
 */
export function evaluateFrame(
  exercise: ExerciseId,
  landmarks: Landmark[] | null,
): EvaluatedFrame | null {
  if (!landmarks || landmarks.length < 29) return null;

  const leftScore =
    visibility(landmarks[POSE.leftShoulder]) +
    visibility(landmarks[POSE.leftElbow]) +
    visibility(landmarks[POSE.leftWrist]) +
    visibility(landmarks[POSE.leftHip]) +
    visibility(landmarks[POSE.leftKnee]) +
    visibility(landmarks[POSE.leftAnkle]);
  const rightScore =
    visibility(landmarks[POSE.rightShoulder]) +
    visibility(landmarks[POSE.rightElbow]) +
    visibility(landmarks[POSE.rightWrist]) +
    visibility(landmarks[POSE.rightHip]) +
    visibility(landmarks[POSE.rightKnee]) +
    visibility(landmarks[POSE.rightAnkle]);

  const left = leftScore >= rightScore;
  const shoulder = landmarks[left ? POSE.leftShoulder : POSE.rightShoulder];
  const elbow = landmarks[left ? POSE.leftElbow : POSE.rightElbow];
  const wrist = landmarks[left ? POSE.leftWrist : POSE.rightWrist];
  const hip = landmarks[left ? POSE.leftHip : POSE.rightHip];
  const knee = landmarks[left ? POSE.leftKnee : POSE.rightKnee];
  const ankle = landmarks[left ? POSE.leftAnkle : POSE.rightAnkle];

  const required = [shoulder, elbow, wrist, hip, knee, ankle];
  const visible = required.every(
    (point) => point !== undefined && visibility(point) >= MIN_VISIBILITY,
  );

  const angle =
    exercise === "pushup"
      ? angleBetween(shoulder, elbow, wrist)
      : angleBetween(hip, knee, ankle);

  if (!visible) {
    return { angle, bodyAngle: null, visible: false, faults: ["notVisible"] };
  }

  const faults: FormFault[] = [];
  const bodyAngle =
    exercise === "pushup" ? angleBetween(shoulder, hip, ankle) : null;

  if (exercise === "pushup") {
    const limit = EXERCISES.pushup.bodyAngleMin ?? 155;
    if (bodyAngle !== null && bodyAngle < limit) {
      // Hips below the shoulder→ankle line mean a sagging core; hips above it
      // mean the athlete is piking up instead of lowering the chest.
      const side = offsetFromLine(shoulder, ankle, hip);
      faults.push(side >= 0 ? "sagging" : "piking");
    }
  }

  return { angle, bodyAngle, visible: true, faults };
}

export interface CounterState {
  reps: number;
  /** Reps that moved but were not counted because the form failed. */
  rejected: number;
  phase: "top" | "bottom";
  /** Smoothed working angle, null before the first visible frame. */
  angle: number | null;
  /** Faults seen in the rep currently in progress. */
  faults: FormFault[];
  /** True once the target rep count is reached. */
  done: boolean;
}

/**
 * State machine that turns a stream of frames into counted reps.
 *
 * A rep counts only when the joint angle actually reaches `downAngle` and
 * returns above `upAngle`, and no form fault appeared during the movement.
 * Without the fault requirement the camera would happily count half-reps and
 * arched push-ups, which is exactly what the user must not be able to cheat.
 */
export class RepCounter {
  readonly config: ExerciseConfig;
  private smoothed: number | null = null;
  private phase: "top" | "bottom" = "top";
  private repFaults = new Set<FormFault>();
  private reachedBottom = false;
  private reps = 0;
  private rejected = 0;
  private lastFaults: FormFault[] = [];

  readonly exercise: ExerciseId;

  constructor(exercise: ExerciseId) {
    this.exercise = exercise;
    this.config = EXERCISES[exercise];
  }

  /** Feed one frame; returns the counter state after it. */
  push(frame: EvaluatedFrame | null): CounterState {
    if (!frame || !frame.visible) {
      // A person who steps out of frame cannot progress, but also must not
      // lose a partially completed rep — keep the phase and just report.
      return this.state(["notVisible"]);
    }

    // Exponential smoothing: single-frame jitter from the model can otherwise
    // cross a threshold twice and invent a rep.
    this.smoothed =
      this.smoothed === null ? frame.angle : this.smoothed * 0.65 + frame.angle * 0.35;
    const angle = this.smoothed;

    if (frame.faults.length > 0) {
      for (const fault of frame.faults) this.repFaults.add(fault);
    }

    if (this.phase === "top") {
      if (angle <= this.config.downAngle) {
        this.phase = "bottom";
        this.reachedBottom = true;
      }
    } else if (angle >= this.config.upAngle) {
      if (this.reachedBottom && this.repFaults.size === 0) this.reps += 1;
      else this.rejected += 1;
      this.phase = "top";
      this.reachedBottom = false;
      this.repFaults.clear();
    }

    // A dip that turns around before the bottom does not count as a rep, but
    // it is worth telling the user about.
    this.lastFaults = [...this.repFaults];

    return this.state(this.lastFaults);
  }

  private state(faults: FormFault[]): CounterState {
    return {
      reps: this.reps,
      rejected: this.rejected,
      phase: this.phase,
      angle: this.smoothed,
      faults: this.phase === "bottom" || faults.length > 0 ? faults : [],
      done: this.reps >= this.config.requiredReps,
    };
  }

  reset(): void {
    this.smoothed = null;
    this.phase = "top";
    this.repFaults.clear();
    this.reachedBottom = false;
    this.reps = 0;
    this.rejected = 0;
    this.lastFaults = [];
  }
}

/**
 * A demonstration helper used by the offline checks and the in-app simulator:
 * produce the landmark set for a given joint angle, keeping a straight body.
 * Not used by the camera path, where landmarks come from the model.
 */
export function syntheticFrame(
  exercise: ExerciseId,
  jointAngle: number,
  options: { sag?: number } = {},
): Landmark[] {
  const points: Landmark[] = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 0.99,
  }));

  const rad = (jointAngle * Math.PI) / 180;

  if (exercise === "pushup") {
    // Shoulder at the origin, body extends to the right-hand side.
    const shoulder = { x: 0.5, y: 0.4 };
    const hip = { x: 0.72, y: 0.4 + (options.sag ?? 0) };
    const ankle = { x: 0.92, y: 0.4 };
    const upper = 0.1;
    const elbow = { x: shoulder.x + upper, y: shoulder.y };
    const wrist = {
      x: elbow.x + upper * Math.cos(Math.PI - rad),
      y: elbow.y + upper * Math.sin(Math.PI - rad),
    };
    for (const index of [POSE.leftShoulder, POSE.rightShoulder]) {
      points[index] = { ...shoulder, visibility: 0.99 };
    }
    for (const index of [POSE.leftElbow, POSE.rightElbow]) {
      points[index] = { ...elbow, visibility: 0.99 };
    }
    for (const index of [POSE.leftWrist, POSE.rightWrist]) {
      points[index] = { ...wrist, visibility: 0.99 };
    }
    for (const index of [POSE.leftHip, POSE.rightHip]) {
      points[index] = { ...hip, visibility: 0.99 };
    }
    for (const index of [POSE.leftAnkle, POSE.rightAnkle]) {
      points[index] = { ...ankle, visibility: 0.99 };
    }
    return points;
  }

  const hip = { x: 0.5, y: 0.35 };
  const knee = { x: 0.5, y: 0.5 };
  // A straight leg points down from the knee, so the swing angle is π − joint.
  const swing = Math.PI - rad;
  const ankle = {
    x: knee.x + 0.14 * Math.sin(swing),
    y: knee.y + 0.14 * Math.cos(swing),
  };
  const shoulder = { x: 0.5, y: 0.2 };
  for (const index of [POSE.leftHip, POSE.rightHip]) {
    points[index] = { ...hip, visibility: 0.99 };
  }
  for (const index of [POSE.leftKnee, POSE.rightKnee]) {
    points[index] = { ...knee, visibility: 0.99 };
  }
  for (const index of [POSE.leftAnkle, POSE.rightAnkle]) {
    points[index] = { ...ankle, visibility: 0.99 };
  }
  for (const index of [POSE.leftShoulder, POSE.rightShoulder]) {
    points[index] = { ...shoulder, visibility: 0.99 };
  }
  return points;
}
