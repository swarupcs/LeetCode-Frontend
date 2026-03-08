import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'roadmap-progress';

type ProgressMap = Record<string, string[]>; // roadmapId -> completedTopicIds[]

function loadLocalProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(data: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface UseRoadmapProgressOptions {
  /** If provided, syncs with backend instead of localStorage */
  currentUserId?: string | null;
  /** Completed IDs from the server (for logged-in users) */
  serverCompletedIds?: string[];
  /** Whether the server data has finished loading */
  isServerLoaded?: boolean;
  /** Called with the new completed IDs array when a topic is toggled (logged-in only) */
  onSave?: (ids: string[]) => void;
  /** Called when progress is reset (logged-in only) */
  onReset?: () => void;
}

export function useRoadmapProgress(
  roadmapId: string,
  options: UseRoadmapProgressOptions = {},
) {
  const { currentUserId, serverCompletedIds = [], isServerLoaded = false, onSave, onReset } =
    options;

  const [completed, setCompleted] = useState<string[]>(() => {
    // For anonymous users initialise from localStorage immediately
    if (!currentUserId) {
      return loadLocalProgress()[roadmapId] ?? [];
    }
    return [];
  });

  // Once server data loads (for logged-in users), sync local state to it
  useEffect(() => {
    if (currentUserId && isServerLoaded) {
      setCompleted(serverCompletedIds);
    }
  }, [currentUserId, isServerLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTopic = useCallback(
    (topicId: string) => {
      setCompleted((prev) => {
        const next = prev.includes(topicId)
          ? prev.filter((id) => id !== topicId)
          : [...prev, topicId];

        if (currentUserId) {
          onSave?.(next);
        } else {
          const all = loadLocalProgress();
          all[roadmapId] = next;
          saveLocalProgress(all);
        }

        return next;
      });
    },
    [roadmapId, currentUserId, onSave],
  );

  const isCompleted = useCallback(
    (topicId: string) => completed.includes(topicId),
    [completed],
  );

  const resetProgress = useCallback(() => {
    if (currentUserId) {
      onReset?.();
    } else {
      const all = loadLocalProgress();
      delete all[roadmapId];
      saveLocalProgress(all);
    }
    setCompleted([]);
  }, [roadmapId, currentUserId, onReset]);

  return { completed, toggleTopic, isCompleted, completedCount: completed.length, resetProgress };
}
