import { problems, type Problem } from './problems';

export interface SheetTopic {
  name: string;
  problemIds: number[]; // references Problem.id
}

export interface Sheet {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  tags: string[];
  topics: SheetTopic[];
  isPublished: boolean;
}

export const sheets: Sheet[] = [
  {
    id: '1',
    name: "Striver's SDE Sheet",
    description:
      'Top 180 DSA problems for cracking SDE interviews at top product companies',
    difficulty: 'Mixed',
    tags: ['Array', 'Linked List', 'Tree', 'Graph', 'DP'],
    isPublished: true,
    topics: [
      { name: 'Arrays & Hashing', problemIds: [1, 6, 8, 13, 14, 17] },
      { name: 'Two Pointers', problemIds: [7, 8, 12] },
      { name: 'Linked List', problemIds: [2, 10, 11] },
      { name: 'Strings', problemIds: [3, 5, 16] },
      { name: 'Dynamic Programming', problemIds: [14, 15, 17] },
      { name: 'Graphs', problemIds: [18] },
    ],
  },
  {
    id: '2',
    name: 'Blind 75',
    description:
      'The essential 75 problems to prepare for coding interviews efficiently',
    difficulty: 'Mixed',
    tags: ['Array', 'String', 'Binary', 'DP', 'Graph'],
    isPublished: true,
    topics: [
      { name: 'Array', problemIds: [1, 7, 14, 17] },
      { name: 'String', problemIds: [3, 5, 13] },
      { name: 'Linked List', problemIds: [2, 10, 11] },
      { name: 'Binary Search', problemIds: [4] },
      { name: 'Dynamic Programming', problemIds: [15] },
    ],
  },
  {
    id: '3',
    name: 'NeetCode 150',
    description:
      'Comprehensive problem list covering all major DSA topics for interviews',
    difficulty: 'Mixed',
    tags: ['Two Pointers', 'Sliding Window', 'Stack', 'Tree'],
    isPublished: true,
    topics: [
      { name: 'Arrays & Hashing', problemIds: [1, 13, 14] },
      { name: 'Two Pointers', problemIds: [7, 8, 12] },
      { name: 'Sliding Window', problemIds: [3, 16] },
      { name: 'Stack', problemIds: [9] },
      { name: 'Math & Geometry', problemIds: [6] },
      { name: 'Linked List', problemIds: [2, 10, 11] },
    ],
  },
  {
    id: '4',
    name: 'Dynamic Programming Mastery',
    description:
      'Deep dive into DP patterns: knapsack, LCS, matrix chain, and more',
    difficulty: 'Hard',
    tags: ['DP', 'Memoization', 'Tabulation'],
    isPublished: true,
    topics: [
      { name: '1D DP', problemIds: [15, 17] },
      { name: 'String DP', problemIds: [5] },
      { name: 'Array DP', problemIds: [14] },
    ],
  },
  {
    id: '5',
    name: 'Graph Algorithms',
    description:
      'BFS, DFS, Dijkstra, topological sort, and advanced graph problems',
    difficulty: 'Medium',
    tags: ['BFS', 'DFS', 'Dijkstra', 'MST'],
    isPublished: false,
    topics: [
      { name: 'Graph Traversal', problemIds: [18] },
      { name: 'Advanced Graphs', problemIds: [11] },
    ],
  },
  {
    id: '6',
    name: 'Array & String Basics',
    description:
      'Build strong foundations with fundamental array and string problems',
    difficulty: 'Easy',
    tags: ['Array', 'String', 'Two Pointers'],
    isPublished: true,
    topics: [
      { name: 'Basic Arrays', problemIds: [1, 6, 17] },
      { name: 'Strings', problemIds: [3, 5, 9] },
      { name: 'Two Pointers', problemIds: [7, 8] },
    ],
  },
];

/** Resolve a sheet's topic problem IDs to full Problem objects */
export function getSheetProblems(
  sheet: Sheet,
): { topic: string; problems: Problem[] }[] {
  return sheet.topics.map((t) => ({
    topic: t.name,
    problems: t.problemIds
      .map((id) => problems.find((p) => p.id === id))
      .filter(Boolean) as Problem[],
  }));
}

/** Get total / solved counts for a sheet */
export function getSheetStats(sheet: Sheet) {
  const allIds = new Set(sheet.topics.flatMap((t) => t.problemIds));
  const all = [...allIds]
    .map((id) => problems.find((p) => p.id === id))
    .filter(Boolean) as Problem[];
  return {
    total: all.length,
    solved: all.filter((p) => p.solved).length,
    easy: all.filter((p) => p.difficulty === 'Easy').length,
    medium: all.filter((p) => p.difficulty === 'Medium').length,
    hard: all.filter((p) => p.difficulty === 'Hard').length,
  };
}
