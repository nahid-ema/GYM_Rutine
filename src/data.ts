export type Exercise = {
  id: string;
  name: string;
  maxSets: number;
  repsText: string;
};

export type MuscleGroup = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export type WorkoutDay = {
  dayNumber: number;
  dayOfWeek: string;
  fullDayName: string;
  name: string;
  shortLabel: string;
  title: string;
  isRest: boolean;
  restDescription?: string;
  groups: MuscleGroup[];
};

export const workoutSchedule: WorkoutDay[] = [
  {
    dayNumber: 1,
    dayOfWeek: "Sat",
    fullDayName: "Saturday",
    name: "Push A",
    shortLabel: "Push A",
    title: "Push A - Chest & Triceps",
    isRest: false,
    groups: [
      {
        id: "sat-chest",
        name: "Chest",
        exercises: [
          {
            id: "sat-inc-db-press",
            name: "Incline Dumbbell Press",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "sat-flat-machine-press",
            name: "Flat Machine Chest Press",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "sat-pec-deck-fly",
            name: "Pec Deck Fly",
            maxSets: 3,
            repsText: "10-12 reps",
          },
        ],
      },
      {
        id: "sat-triceps",
        name: "Triceps",
        exercises: [
          {
            id: "sat-overhead-extension",
            name: "Overhead Cable or Dumbbell Extension",
            maxSets: 3,
            repsText: "10-12 reps",
          },
        ],
      },
    ],
  },
  {
    dayNumber: 2,
    dayOfWeek: "Sun",
    fullDayName: "Sunday",
    name: "Pull",
    shortLabel: "Pull",
    title: "Pull - Back & Biceps",
    isRest: false,
    groups: [
      {
        id: "sun-back",
        name: "Back",
        exercises: [
          {
            id: "sun-lat-pulldown",
            name: "Lat Pulldown (or Pull-ups)",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "sun-seated-cable-row",
            name: "Seated Cable Row",
            maxSets: 3,
            repsText: "8-10 reps",
          },
        ],
      },
      {
        id: "sun-biceps",
        name: "Biceps",
        exercises: [
          {
            id: "sun-inc-db-curl",
            name: "Incline Dumbbell Curl",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "sun-hammer-curl",
            name: "Hammer Curl",
            maxSets: 3,
            repsText: "10-12 reps",
          },
        ],
      },
    ],
  },
  {
    dayNumber: 3,
    dayOfWeek: "Mon",
    fullDayName: "Monday",
    name: "Rest",
    shortLabel: "Rest",
    title: "Rest Day",
    isRest: true,
    restDescription: "Prioritize high protein, hydration, and 8 hours of sleep",
    groups: [],
  },
  {
    dayNumber: 4,
    dayOfWeek: "Tue",
    fullDayName: "Tuesday",
    name: "Legs",
    shortLabel: "Legs",
    title: "Legs - Quads, Hamstrings & Calves",
    isRest: false,
    groups: [
      {
        id: "tue-quads-hams",
        name: "Quads & Hamstrings",
        exercises: [
          {
            id: "tue-hack-squat",
            name: "Hack Squat (or Leg Press)",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "tue-leg-curl",
            name: "Lying or Seated Leg Curl",
            maxSets: 3,
            repsText: "10-12 reps",
          },
          {
            id: "tue-leg-extension",
            name: "Leg Extension",
            maxSets: 3,
            repsText: "12-15 reps",
          },
        ],
      },
      {
        id: "tue-calves",
        name: "Calves",
        exercises: [
          {
            id: "tue-standing-calf-raise",
            name: "Standing Calf Raise",
            maxSets: 3,
            repsText: "12-15 reps",
          },
        ],
      },
    ],
  },
  {
    dayNumber: 5,
    dayOfWeek: "Wed",
    fullDayName: "Wednesday",
    name: "Shoulders & Abs",
    shortLabel: "Shldrs",
    title: "Shoulders & Abs",
    isRest: false,
    groups: [
      {
        id: "wed-shoulders",
        name: "Shoulders",
        exercises: [
          {
            id: "wed-db-shoulder-press",
            name: "Dumbbell Shoulder Press",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "wed-lateral-raise",
            name: "Lateral Raise (Cable or Dumbbell)",
            maxSets: 4,
            repsText: "12-15 reps",
          },
          {
            id: "wed-face-pulls",
            name: "Face Pulls",
            maxSets: 3,
            repsText: "12-15 reps",
          },
        ],
      },
      {
        id: "wed-abs",
        name: "Abs",
        exercises: [
          {
            id: "wed-hanging-knee-raise",
            name: "Hanging Knee or Leg Raise",
            maxSets: 3,
            repsText: "12-15 reps",
          },
        ],
      },
    ],
  },
  {
    dayNumber: 6,
    dayOfWeek: "Thu",
    fullDayName: "Thursday",
    name: "Push B",
    shortLabel: "Push B",
    title: "Push B - Chest & Triceps",
    isRest: false,
    groups: [
      {
        id: "thu-chest",
        name: "Chest",
        exercises: [
          {
            id: "thu-flat-db-press",
            name: "Flat Dumbbell Press",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "thu-incline-machine-press",
            name: "Incline Machine Press",
            maxSets: 3,
            repsText: "8-10 reps",
          },
          {
            id: "thu-low-to-high-cable-fly",
            name: "Low-to-High Cable Fly",
            maxSets: 3,
            repsText: "10-12 reps",
          },
        ],
      },
      {
        id: "thu-triceps",
        name: "Triceps",
        exercises: [
          {
            id: "thu-triceps-rope-pushdown",
            name: "Triceps Rope Pushdown",
            maxSets: 3,
            repsText: "10-12 reps",
          },
        ],
      },
    ],
  },
  {
    dayNumber: 7,
    dayOfWeek: "Fri",
    fullDayName: "Friday",
    name: "Rest",
    shortLabel: "Rest",
    title: "Rest Day",
    isRest: true,
    restDescription: "Log lifts, recover, and eat in a caloric surplus",
    groups: [],
  },
];

// Fallback / legacy export
export const routineData: MuscleGroup[] = workoutSchedule.flatMap((d) => d.groups);
