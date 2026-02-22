import { useState, useCallback } from "react";

const STORAGE_KEY = "roadmap-progress";

type ProgressMap = Record<string, string[]>; // roadmapId -> completedTopicIds[]

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useRoadmapProgress(roadmapId: string) {
  const [completed, setCompleted] = useState<string[]>(() => {
    return loadProgress()[roadmapId] ?? [];
  });

  const toggleTopic = useCallback(
    (topicId: string) => {
      setCompleted((prev) => {
        const next = prev.includes(topicId)
          ? prev.filter((id) => id !== topicId)
          : [...prev, topicId];
        const all = loadProgress();
        all[roadmapId] = next;
        saveProgress(all);
        return next;
      });
    },
    [roadmapId]
  );

  const isCompleted = useCallback(
    (topicId: string) => completed.includes(topicId),
    [completed]
  );

  const resetProgress = useCallback(() => {
    const all = loadProgress();
    delete all[roadmapId];
    saveProgress(all);
    setCompleted([]);
  }, [roadmapId]);

  const completedCount = completed.length;

  return { completed, toggleTopic, isCompleted, completedCount, resetProgress };
}
