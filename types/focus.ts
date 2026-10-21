/** Domain types for the StayFocus cabinet. */

export type HabitId =
  | "sport"
  | "study"
  | "reading"
  | "project"
  | "walk"
  | "family"
  | "noReels";

export interface ScreenTimeDay {
  /** Translation key of the short weekday label. */
  dayKey:
    | "dash.day.mon"
    | "dash.day.tue"
    | "dash.day.wed"
    | "dash.day.thu"
    | "dash.day.fri"
    | "dash.day.sat"
    | "dash.day.sun";
  /** Hours per app for this day. */
  instagram: number;
  tiktok: number;
  youtube: number;
  /** The same day before StayFocus, used for the before/after comparison. */
  baseline: number;
}

/** A real-world deed that saved scrolling hours turn into. */
export interface SavedActivity {
  labelKey:
    | "dash.saved.book"
    | "dash.saved.workout"
    | "dash.saved.lesson"
    | "dash.saved.project"
    | "dash.saved.family";
  /** Units produced per one saved hour. */
  perHour: number;
}

/** Checkbox state for the weekly planner: day index → habit → done. */
export type PlannerState = Record<string, boolean>;
