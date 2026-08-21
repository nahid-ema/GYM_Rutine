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
  name: string;
  isRest: boolean;
  muscleGroupIds: string[];
};

export const workoutSchedule: WorkoutDay[] = [
  { dayNumber: 1, name: "Chest & Triceps", isRest: false, muscleGroupIds: ["chest", "triceps"] },
  { dayNumber: 2, name: "Back & Biceps", isRest: false, muscleGroupIds: ["back", "biceps"] },
  { dayNumber: 3, name: "Legs & Shoulders", isRest: false, muscleGroupIds: ["legs", "shoulders"] },
  { dayNumber: 4, name: "Rest", isRest: true, muscleGroupIds: [] },
];

export const routineData: MuscleGroup[] = [
  {
    id: "chest",
    name: "Chest",
    exercises: [
      { id: "chest-1", name: "Incline Dumbbell Press", maxSets: 4, repsText: "8-12 reps" },
      { id: "chest-2", name: "Flat Dumbbell Press", maxSets: 4, repsText: "8-12 reps" },
      { id: "chest-3", name: "Pec Deck Fly", maxSets: 3, repsText: "12-15 reps" },
      { id: "chest-4", name: "Dumbbell Pullover", maxSets: 3, repsText: "10-12 reps" },
    ],
  },
  {
    id: "triceps",
    name: "Triceps",
    exercises: [
      { id: "triceps-1", name: "Dumbbell Overhead Extension", maxSets: 3, repsText: "10-12 reps" },
      { id: "triceps-2", name: "Rope Pushdown", maxSets: 4, repsText: "12-15 reps" },
      { id: "triceps-3", name: "Straight Bar Pushdown", maxSets: 3, repsText: "10-12 reps" },
      { id: "triceps-4", name: "Skull Crushers", maxSets: 3, repsText: "10-12 reps" },
    ],
  },
  {
    id: "back",
    name: "Back",
    exercises: [
      { id: "back-1", name: "Lat Pulldown", maxSets: 4, repsText: "8-12 reps" },
      { id: "back-2", name: "Seated Cable Row", maxSets: 4, repsText: "10-12 reps" },
      { id: "back-3", name: "One-Arm Dumbbell Row", maxSets: 3, repsText: "8-10 reps each arm" },
      { id: "back-4", name: "Bent-Over Row", maxSets: 4, repsText: "8-10 reps" },
    ],
  },
  {
    id: "biceps",
    name: "Biceps",
    exercises: [
      { id: "biceps-1", name: "Dumbbell Curl", maxSets: 4, repsText: "10-12 reps" },
      { id: "biceps-2", name: "Hammer Curl", maxSets: 3, repsText: "10-12 reps" },
      { id: "biceps-3", name: "Preacher Curl", maxSets: 3, repsText: "10-12 reps" },
      { id: "biceps-4", name: "Cable Reverse Curl", maxSets: 3, repsText: "12-15 reps" },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    exercises: [
      { id: "legs-1", name: "Barbell Squats", maxSets: 4, repsText: "6-10 reps" },
      { id: "legs-2", name: "Leg Press", maxSets: 4, repsText: "10-12 reps" },
      { id: "legs-3", name: "Leg Extension", maxSets: 3, repsText: "12-15 reps" },
      { id: "legs-4", name: "Leg Curl", maxSets: 3, repsText: "12-15 reps" },
    ],
  },
  {
    id: "shoulders",
    name: "Shoulders",
    exercises: [
      { id: "shoulders-1", name: "Dumbbell Shoulder Press", maxSets: 4, repsText: "8-12 reps" },
      { id: "shoulders-2", name: "Side Lateral Raise", maxSets: 4, repsText: "12-15 reps" },
      { id: "shoulders-3", name: "Front Raise", maxSets: 3, repsText: "12-15 reps" },
      { id: "shoulders-4", name: "Face Pull", maxSets: 4, repsText: "15-20 reps" },
      { id: "shoulders-5", name: "Dumbbell Shrugs", maxSets: 4, repsText: "12-15 reps" },
    ],
  }
];
