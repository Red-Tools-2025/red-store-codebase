type LoadingType = "activate" | "finish";

interface ScheduleEntry {
  targetTime: number;
  countdownTime: number;
  loadingType: LoadingType;
  isLoading: boolean; // NEW: Tracks if the action is still in progress
}

export { type ScheduleEntry };
