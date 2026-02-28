import { useState, useCallback, useMemo } from "react";

const STREAK_KEY = "learning-streak";
const GOAL_KEY = "daily-learning-goal";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayCompleted: number;
  history: Record<string, number>; // date -> topics completed
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastActiveDate: "", todayCompleted: 0, history: {} };
    const data: StreakData = JSON.parse(raw);
    // Reset todayCompleted if it's a new day
    if (data.lastActiveDate !== today()) {
      data.todayCompleted = 0;
    }
    return data;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: "", todayCompleted: 0, history: {} };
  }
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function loadDailyGoal(): number {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? Number(raw) : 3;
  } catch {
    return 3;
  }
}

function saveDailyGoal(goal: number) {
  localStorage.setItem(GOAL_KEY, String(goal));
}

/** Derive streak from roadmap-progress changes */

const MILESTONES = [3, 7, 14, 30] as const;

const MILESTONE_MESSAGES: Record<number, { emoji: string; title: string; description: string }> = {
  3: { emoji: "✨", title: "3-Day Streak!", description: "You're building a habit — keep it going!" },
  7: { emoji: "🔥", title: "7-Day Streak!", description: "A whole week of learning — incredible!" },
  14: { emoji: "⚡", title: "14-Day Streak!", description: "Two weeks strong — you're unstoppable!" },
  30: { emoji: "👑", title: "30-Day Streak!", description: "A full month — legendary dedication!" },
};

export function useLearningStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);
  const [dailyGoal, setDailyGoalState] = useState<number>(loadDailyGoal);
  const [newMilestone, setNewMilestone] = useState<number | null>(null);

  const recordActivity = useCallback(() => {
    setStreak((prev) => {
      const todayStr = today();
      const yesterdayStr = yesterday();

      let newStreak = prev.currentStreak;
      if (prev.lastActiveDate === todayStr) {
        // Already active today, just increment count
      } else if (prev.lastActiveDate === yesterdayStr) {
        newStreak = prev.currentStreak + 1;
      } else if (prev.lastActiveDate === "") {
        newStreak = 1;
      } else {
        newStreak = 1; // streak broken
      }

      // Check if a milestone was just crossed
      for (const m of MILESTONES) {
        if (newStreak >= m && prev.currentStreak < m) {
          setNewMilestone(m);
          break;
        }
      }

      const newData: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: todayStr,
        todayCompleted: prev.lastActiveDate === todayStr ? prev.todayCompleted + 1 : 1,
        history: {
          ...prev.history,
          [todayStr]: (prev.lastActiveDate === todayStr ? prev.todayCompleted : 0) + 1,
        },
      };
      saveStreak(newData);
      return newData;
    });
  }, []);

  const clearMilestone = useCallback(() => setNewMilestone(null), []);

  const setDailyGoal = useCallback((goal: number) => {
    saveDailyGoal(goal);
    setDailyGoalState(goal);
  }, []);

  const goalProgress = useMemo(
    () => (dailyGoal > 0 ? Math.min(Math.round((streak.todayCompleted / dailyGoal) * 100), 100) : 0),
    [streak.todayCompleted, dailyGoal]
  );

  const goalReached = streak.todayCompleted >= dailyGoal && dailyGoal > 0;

  // Get last 7 days activity
  const weekActivity = useMemo(() => {
    const days: { date: string; count: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ date: dateStr, count: streak.history[dateStr] ?? 0, label: dayLabel });
    }
    return days;
  }, [streak.history]);

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    todayCompleted: streak.todayCompleted,
    dailyGoal,
    setDailyGoal,
    goalProgress,
    goalReached,
    weekActivity,
    recordActivity,
    newMilestone,
    milestoneMessage: newMilestone ? MILESTONE_MESSAGES[newMilestone] : null,
    clearMilestone,
  };
}

export { MILESTONE_MESSAGES };
