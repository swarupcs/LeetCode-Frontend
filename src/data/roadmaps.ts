export interface RoadmapResource {
  title: string;
  url?: string; // optional external link
  type: 'article' | 'video' | 'course' | 'documentation' | 'practice' | 'book';
}

export interface RoadmapSubtopic {
  id: string;
  name: string;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number; // estimated time in minutes
  resources: RoadmapResource[];
  subtopics: RoadmapSubtopic[];
  isCompleted?: boolean;
}

export interface RoadmapSection {
  id: string;
  name: string;
  description?: string;
  topics: RoadmapTopic[];
}

export interface Roadmap {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sections: RoadmapSection[];
  isPublished: boolean;
}

export const roadmaps: Roadmap[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    slug: 'dsa',
    description:
      'Master essential data structures and algorithms for coding interviews and competitive programming.',
    icon: 'Binary',
    color: 'emerald',
    isPublished: true,
    sections: [
      {
        id: 's1',
        name: 'Fundamentals',
        description:
          'Build a strong foundation with complexity analysis and basic data structures.',
        topics: [
          {
            id: 't1',
            name: 'Time & Space Complexity',
            description:
              'Learn Big-O, Big-Theta, Big-Omega notation. Understand amortized analysis and how to evaluate algorithm efficiency.',
            difficulty: 'beginner',
            estimatedMinutes: 60,
            resources: [
              { title: 'Introduction to Algorithms — CLRS Ch.3', type: 'book' },
              {
                title: 'Big-O Cheat Sheet',
                url: 'https://www.bigocheatsheet.com',
                type: 'article',
              },
              {
                title: 'Abdul Bari — Asymptotic Notations',
                url: 'https://youtube.com',
                type: 'video',
              },
            ],
            subtopics: [
              { id: 'st1', name: 'Big-O Notation' },
              { id: 'st2', name: 'Big-Theta & Big-Omega' },
              { id: 'st3', name: 'Amortized Analysis' },
              { id: 'st4', name: 'Space Complexity' },
              { id: 'st5', name: 'Best/Worst/Average Case' },
              { id: 'st6', name: 'Recurrence Relations' },
            ],
          },
          {
            id: 't2',
            name: 'Arrays & Strings',
            description:
              "Master array manipulation techniques including sliding window, two pointers, prefix sums, and kadane's algorithm.",
            difficulty: 'beginner',
            estimatedMinutes: 150,
            resources: [
              {
                title: 'LeetCode Array Problems',
                url: 'https://leetcode.com/tag/array/',
                type: 'practice',
              },
              { title: 'Two Pointers Technique', type: 'article' },
              { title: 'Sliding Window Pattern', type: 'article' },
            ],
            subtopics: [
              { id: 'st7', name: 'Two Pointers' },
              { id: 'st8', name: 'Sliding Window' },
              { id: 'st9', name: 'Prefix Sums' },
              { id: 'st10', name: "Kadane's Algorithm" },
              { id: 'st11', name: 'String Matching (KMP)' },
              { id: 'st12', name: 'Rabin-Karp Hashing' },
              { id: 'st13', name: 'Dutch National Flag' },
              { id: 'st14', name: 'Matrix Traversal Patterns' },
            ],
          },
          {
            id: 't3',
            name: 'Hashing',
            description:
              'Hash maps, hash sets, collision resolution strategies, and practical hashing patterns for interview problems.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              { title: 'Hash Table Design Patterns', type: 'article' },
              {
                title: 'LeetCode Hash Table Problems',
                url: 'https://leetcode.com/tag/hash-table/',
                type: 'practice',
              },
            ],
            subtopics: [
              { id: 'st15', name: 'Hash Maps' },
              { id: 'st16', name: 'Hash Sets' },
              { id: 'st17', name: 'Collision Handling (Chaining)' },
              { id: 'st18', name: 'Open Addressing' },
              { id: 'st19', name: 'Rolling Hash' },
              { id: 'st20', name: 'Frequency Counting Pattern' },
            ],
          },
          {
            id: 't4',
            name: 'Sorting Algorithms',
            description:
              'Understand comparison-based and non-comparison-based sorting, their complexities, and when to use each.',
            difficulty: 'beginner',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Visualgo — Sorting',
                url: 'https://visualgo.net/en/sorting',
                type: 'article',
              },
              { title: 'Sorting Algorithms Explained', type: 'video' },
            ],
            subtopics: [
              { id: 'st21', name: 'Bubble Sort' },
              { id: 'st22', name: 'Selection Sort' },
              { id: 'st23', name: 'Insertion Sort' },
              { id: 'st24', name: 'Merge Sort' },
              { id: 'st25', name: 'Quick Sort' },
              { id: 'st26', name: 'Heap Sort' },
              { id: 'st27', name: 'Counting Sort' },
              { id: 'st28', name: 'Radix Sort' },
              { id: 'st29', name: 'Bucket Sort' },
              { id: 'st30', name: 'Stability in Sorting' },
            ],
          },
          {
            id: 't5',
            name: 'Recursion & Divide and Conquer',
            description:
              'Master recursive thinking, base cases, and how to break problems into smaller subproblems.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Recursion Patterns for Interviews', type: 'article' },
              { title: 'Divide and Conquer Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st31', name: 'Base Cases & Termination' },
              { id: 'st32', name: 'Recursive Trees' },
              { id: 'st33', name: 'Master Theorem' },
              { id: 'st34', name: 'Merge Sort (D&C)' },
              { id: 'st35', name: 'Quick Select' },
              { id: 'st36', name: 'Closest Pair of Points' },
              { id: 'st37', name: 'Tail Recursion' },
            ],
          },
          {
            id: 't5b',
            name: 'Mathematical Foundations',
            description:
              'Number theory, modular arithmetic, GCD/LCM, prime numbers, and combinatorics for competitive programming.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'CP Algorithms — Algebra',
                url: 'https://cp-algorithms.com/algebra/',
                type: 'article',
              },
              { title: 'Number Theory for CP', type: 'video' },
            ],
            subtopics: [
              { id: 'st38', name: 'GCD & LCM (Euclidean)' },
              { id: 'st39', name: 'Modular Arithmetic' },
              { id: 'st40', name: 'Sieve of Eratosthenes' },
              { id: 'st41', name: 'Fast Exponentiation' },
              { id: 'st42', name: 'Combinatorics (nCr, nPr)' },
              { id: 'st43', name: 'Catalan Numbers' },
            ],
          },
        ],
      },
      {
        id: 's2',
        name: 'Core Structures',
        description:
          'Deep dive into essential data structures used in every codebase.',
        topics: [
          {
            id: 't6',
            name: 'Linked Lists',
            description:
              'Singly, doubly, and circular linked lists. Fast & slow pointers, reversal, merge techniques.',
            difficulty: 'beginner',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Visualgo — Linked List',
                url: 'https://visualgo.net/en/list',
                type: 'article',
              },
              { title: 'Linked List Interview Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st44', name: 'Singly Linked' },
              { id: 'st45', name: 'Doubly Linked' },
              { id: 'st46', name: 'Circular Linked List' },
              { id: 'st47', name: 'Fast & Slow Pointers' },
              { id: 'st48', name: 'Reversal Techniques' },
              { id: 'st49', name: 'Merge Two Sorted Lists' },
              { id: 'st50', name: 'Detect & Remove Cycle' },
              { id: 'st51', name: 'LRU Cache Implementation' },
            ],
          },
          {
            id: 't7',
            name: 'Stacks & Queues',
            description:
              'Monotonic stacks, deques, priority queues, and their applications in parsing and scheduling.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Monotonic Stack Problems', type: 'practice' },
              { title: 'CP Algorithms — Stack', type: 'article' },
            ],
            subtopics: [
              { id: 'st52', name: 'Stack Implementation' },
              { id: 'st53', name: 'Monotonic Stack' },
              { id: 'st54', name: 'Next Greater Element' },
              { id: 'st55', name: 'Queue using Stacks' },
              { id: 'st56', name: 'Deque' },
              { id: 'st57', name: 'Stack-based Parsing' },
              { id: 'st58', name: 'Min Stack' },
              { id: 'st59', name: 'Circular Queue' },
            ],
          },
          {
            id: 't8',
            name: 'Trees & Binary Search Trees',
            description:
              'Traversals (inorder, preorder, postorder, level-order), BST operations, balanced trees.',
            difficulty: 'intermediate',
            estimatedMinutes: 180,
            resources: [
              { title: 'Binary Tree Patterns', type: 'article' },
              { title: 'Tree Traversal Visualization', type: 'video' },
              {
                title: 'LeetCode Tree Problems',
                url: 'https://leetcode.com/tag/tree/',
                type: 'practice',
              },
            ],
            subtopics: [
              { id: 'st60', name: 'Inorder Traversal' },
              { id: 'st61', name: 'Preorder Traversal' },
              { id: 'st62', name: 'Postorder Traversal' },
              { id: 'st63', name: 'Level Order (BFS)' },
              { id: 'st64', name: 'BST Insert/Delete/Search' },
              { id: 'st65', name: 'Lowest Common Ancestor' },
              { id: 'st66', name: 'Tree Diameter & Height' },
              { id: 'st67', name: 'Serialize/Deserialize Tree' },
              { id: 'st68', name: 'AVL Trees' },
              { id: 'st69', name: 'Red-Black Trees' },
            ],
          },
          {
            id: 't9',
            name: 'Heaps & Priority Queues',
            description:
              'Min/max heaps, heap sort, k-way merge, top-K problems, median maintenance.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Heap Problems on LeetCode',
                url: 'https://leetcode.com/tag/heap-priority-queue/',
                type: 'practice',
              },
              { title: 'Priority Queue Deep Dive', type: 'article' },
            ],
            subtopics: [
              { id: 'st70', name: 'Min Heap' },
              { id: 'st71', name: 'Max Heap' },
              { id: 'st72', name: 'Build Heap (Heapify)' },
              { id: 'st73', name: 'Heap Sort' },
              { id: 'st74', name: 'Top-K Pattern' },
              { id: 'st75', name: 'Two Heaps (Median)' },
              { id: 'st76', name: 'K-Way Merge' },
              { id: 'st77', name: 'Sliding Window Median' },
            ],
          },
          {
            id: 't10',
            name: 'Tries',
            description:
              'Prefix trees for string searching, autocomplete, and dictionary operations.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'Trie Implementation Guide', type: 'article' },
              {
                title: 'LeetCode Trie Problems',
                url: 'https://leetcode.com/tag/trie/',
                type: 'practice',
              },
            ],
            subtopics: [
              { id: 'st78', name: 'Prefix Trie Insert/Search' },
              { id: 'st79', name: 'Autocomplete System' },
              { id: 'st80', name: 'Word Search II' },
              { id: 'st81', name: 'Compressed Trie (Radix)' },
            ],
          },
          {
            id: 't10b',
            name: 'Disjoint Set Union (Union-Find)',
            description:
              "Union by rank, path compression, and applications in connected components and Kruskal's algorithm.",
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'CP Algorithms — DSU',
                url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html',
                type: 'article',
              },
              { title: 'Union-Find Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st82', name: 'Union by Rank' },
              { id: 'st83', name: 'Path Compression' },
              { id: 'st84', name: 'Connected Components' },
              { id: 'st85', name: 'Cycle Detection in Undirected Graph' },
              { id: 'st86', name: 'Accounts Merge Pattern' },
            ],
          },
        ],
      },
      {
        id: 's3',
        name: 'Graphs',
        description: 'Master graph representations and traversal algorithms.',
        topics: [
          {
            id: 't11',
            name: 'Graph Representations',
            description:
              'Adjacency list vs matrix, edge list, weighted & directed graphs.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'Graph Theory Primer', type: 'article' },
              { title: 'Graph Representation Comparison', type: 'video' },
            ],
            subtopics: [
              { id: 'st87', name: 'Adjacency List' },
              { id: 'st88', name: 'Adjacency Matrix' },
              { id: 'st89', name: 'Edge List' },
              { id: 'st90', name: 'Implicit Graphs' },
              { id: 'st91', name: 'Weighted vs Unweighted' },
            ],
          },
          {
            id: 't12',
            name: 'BFS & DFS',
            description:
              'Breadth-first and depth-first search, connected components, cycle detection, bipartite checking.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'BFS/DFS Visualization',
                url: 'https://visualgo.net/en/dfsbfs',
                type: 'article',
              },
              { title: 'Graph Traversal Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st92', name: 'BFS (Level Order)' },
              { id: 'st93', name: 'DFS (Recursive & Iterative)' },
              { id: 'st94', name: 'Cycle Detection (Directed)' },
              { id: 'st95', name: 'Cycle Detection (Undirected)' },
              { id: 'st96', name: 'Connected Components' },
              { id: 'st97', name: 'Bipartite Check' },
              { id: 'st98', name: 'Multi-source BFS' },
              { id: 'st99', name: 'Islands Pattern' },
            ],
          },
          {
            id: 't13',
            name: 'Shortest Path Algorithms',
            description:
              "Dijkstra's, Bellman-Ford, Floyd-Warshall, and 0-1 BFS for weighted graph shortest paths.",
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              { title: "Dijkstra's Algorithm Explained", type: 'video' },
              { title: 'Shortest Path Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st100', name: "Dijkstra's Algorithm" },
              { id: 'st101', name: 'Bellman-Ford' },
              { id: 'st102', name: 'Floyd-Warshall' },
              { id: 'st103', name: '0-1 BFS' },
              { id: 'st104', name: 'Shortest Path in DAG' },
              { id: 'st105', name: 'A* Search Algorithm' },
              { id: 'st106', name: 'Negative Cycle Detection' },
            ],
          },
          {
            id: 't14',
            name: 'Topological Sort & MST',
            description:
              "DAG ordering, Kruskal's and Prim's algorithms for minimum spanning trees.",
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Topological Sort Tutorial', type: 'article' },
              { title: 'MST Algorithms Comparison', type: 'video' },
            ],
            subtopics: [
              { id: 'st107', name: "Kahn's Algorithm (BFS)" },
              { id: 'st108', name: 'DFS Topological Sort' },
              { id: 'st109', name: "Kruskal's Algorithm" },
              { id: 'st110', name: "Prim's Algorithm" },
              { id: 'st111', name: 'Course Schedule Pattern' },
            ],
          },
          {
            id: 't14b',
            name: 'Advanced Graph Algorithms',
            description:
              'Strongly connected components, bridges, articulation points, Euler paths, and network flow.',
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              { title: "Tarjan's SCC Algorithm", type: 'article' },
              { title: 'Advanced Graph Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st112', name: "Tarjan's SCC" },
              { id: 'st113', name: "Kosaraju's Algorithm" },
              { id: 'st114', name: 'Bridges & Articulation Points' },
              { id: 'st115', name: 'Euler Path & Circuit' },
              { id: 'st116', name: 'Max Flow (Ford-Fulkerson)' },
              { id: 'st117', name: 'Bipartite Matching' },
            ],
          },
        ],
      },
      {
        id: 's4',
        name: 'Dynamic Programming',
        description:
          'Learn to solve optimization problems using overlapping subproblems.',
        topics: [
          {
            id: 't15',
            name: 'DP Foundations',
            description:
              'Memoization vs tabulation, identifying DP problems, state definition, and space optimization.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'DP Roadmap by Striver', type: 'article' },
              { title: 'Dynamic Programming Made Easy', type: 'video' },
            ],
            subtopics: [
              { id: 'st118', name: 'Memoization (Top-Down)' },
              { id: 'st119', name: 'Tabulation (Bottom-Up)' },
              { id: 'st120', name: 'State Definition' },
              { id: 'st121', name: 'Overlapping Subproblems' },
              { id: 'st122', name: 'Optimal Substructure' },
              { id: 'st123', name: 'Space Optimization' },
            ],
          },
          {
            id: 't16',
            name: '1D DP Patterns',
            description:
              'Fibonacci variants, climbing stairs, house robber, coin change, and longest increasing subsequence.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: '1D DP Problem Set', type: 'practice' },
              { title: 'Common 1D DP Patterns', type: 'article' },
            ],
            subtopics: [
              { id: 'st124', name: 'Fibonacci Variants' },
              { id: 'st125', name: 'Climbing Stairs' },
              { id: 'st126', name: 'House Robber' },
              { id: 'st127', name: 'Coin Change' },
              { id: 'st128', name: 'Longest Increasing Subsequence' },
              { id: 'st129', name: 'Word Break' },
              { id: 'st130', name: 'Decode Ways' },
              { id: 'st131', name: 'Maximum Product Subarray' },
            ],
          },
          {
            id: 't17',
            name: '2D DP & Grid Problems',
            description:
              'Matrix path problems, edit distance, LCS, knapsack variants, and partition problems.',
            difficulty: 'advanced',
            estimatedMinutes: 180,
            resources: [
              { title: '2D DP Visualization', type: 'video' },
              { title: 'LCS & Edit Distance', type: 'article' },
              { title: 'Knapsack Variants', type: 'practice' },
            ],
            subtopics: [
              { id: 'st132', name: 'Unique Paths' },
              { id: 'st133', name: 'Minimum Path Sum' },
              { id: 'st134', name: 'Longest Common Subsequence' },
              { id: 'st135', name: 'Edit Distance' },
              { id: 'st136', name: '0/1 Knapsack' },
              { id: 'st137', name: 'Unbounded Knapsack' },
              { id: 'st138', name: 'Partition Equal Subset Sum' },
              { id: 'st139', name: 'Longest Palindromic Subsequence' },
              { id: 'st140', name: 'Wildcard Matching' },
            ],
          },
          {
            id: 't18',
            name: 'Advanced DP',
            description:
              'DP on trees, bitmask DP, interval DP, digit DP, and DP with combinatorics.',
            difficulty: 'advanced',
            estimatedMinutes: 210,
            resources: [
              { title: 'Advanced DP Techniques', type: 'article' },
              { title: 'Bitmask DP Tutorial', type: 'video' },
            ],
            subtopics: [
              { id: 'st141', name: 'DP on Trees' },
              { id: 'st142', name: 'Bitmask DP (TSP)' },
              { id: 'st143', name: 'Interval DP (MCM)' },
              { id: 'st144', name: 'Digit DP' },
              { id: 'st145', name: 'Profile DP (Broken)' },
              { id: 'st146', name: 'DP with Probability' },
              { id: 'st147', name: 'SOS DP (Sum over Subsets)' },
            ],
          },
          {
            id: 't18b',
            name: 'DP Optimization Techniques',
            description:
              "Convex hull trick, divide and conquer optimization, Knuth's optimization, and Li Chao tree.",
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'DP Optimization — CP Algorithms', type: 'article' },
              { title: 'Convex Hull Trick Tutorial', type: 'video' },
            ],
            subtopics: [
              { id: 'st148', name: 'Convex Hull Trick' },
              { id: 'st149', name: 'Divide & Conquer Optimization' },
              { id: 'st150', name: "Knuth's Optimization" },
              { id: 'st151', name: 'Aliens Trick (Lambda)' },
            ],
          },
        ],
      },
      {
        id: 's5',
        name: 'Advanced Algorithms',
        description:
          'Greedy approaches, backtracking, and specialized techniques.',
        topics: [
          {
            id: 't19',
            name: 'Greedy Algorithms',
            description:
              'Activity selection, interval scheduling, Huffman coding, fractional knapsack, and exchange arguments.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Greedy Algorithm Problems', type: 'practice' },
              { title: 'Greedy vs DP — When to Use', type: 'article' },
            ],
            subtopics: [
              { id: 'st152', name: 'Activity Selection' },
              { id: 'st153', name: 'Interval Scheduling' },
              { id: 'st154', name: 'Huffman Coding' },
              { id: 'st155', name: 'Fractional Knapsack' },
              { id: 'st156', name: 'Job Sequencing' },
              { id: 'st157', name: 'Minimum Platforms' },
              { id: 'st158', name: 'Exchange Argument Proofs' },
            ],
          },
          {
            id: 't20',
            name: 'Backtracking',
            description:
              'N-Queens, subsets, permutations, Sudoku solver, constraint satisfaction, and pruning techniques.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Backtracking Template', type: 'article' },
              { title: 'Backtracking Problems Set', type: 'practice' },
            ],
            subtopics: [
              { id: 'st159', name: 'N-Queens' },
              { id: 'st160', name: 'Subsets & Power Set' },
              { id: 'st161', name: 'Permutations' },
              { id: 'st162', name: 'Combination Sum' },
              { id: 'st163', name: 'Sudoku Solver' },
              { id: 'st164', name: 'Word Search' },
              { id: 'st165', name: 'Palindrome Partitioning' },
              { id: 'st166', name: 'Pruning Strategies' },
            ],
          },
          {
            id: 't21',
            name: 'Binary Search Advanced',
            description:
              'Binary search on answer, rotated arrays, matrix search, minimizing maximum, and predicate-based search.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Binary Search Patterns', type: 'article' },
              { title: 'Advanced Binary Search Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st167', name: 'Search on Answer' },
              { id: 'st168', name: 'Rotated Sorted Array' },
              { id: 'st169', name: 'Matrix Search' },
              { id: 'st170', name: 'Minimize Maximum' },
              { id: 'st171', name: 'Aggressive Cows / Books Allocation' },
              { id: 'st172', name: 'Median of Two Sorted Arrays' },
            ],
          },
          {
            id: 't22',
            name: 'Bit Manipulation',
            description:
              'XOR tricks, bit masking, power of 2, counting bits, single number variants, and bitwise DP.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Bit Manipulation Tricks', type: 'article' },
              {
                title: 'LeetCode Bit Problems',
                url: 'https://leetcode.com/tag/bit-manipulation/',
                type: 'practice',
              },
            ],
            subtopics: [
              { id: 'st173', name: 'XOR Properties' },
              { id: 'st174', name: 'Bit Masks' },
              { id: 'st175', name: 'Counting Set Bits' },
              { id: 'st176', name: 'Single Number (I, II, III)' },
              { id: 'st177', name: 'Power of Two' },
              { id: 'st178', name: 'Subset Enumeration via Bits' },
            ],
          },
        ],
      },
      {
        id: 's6',
        name: 'Advanced Data Structures',
        description:
          'Specialized data structures for competitive programming and system design.',
        topics: [
          {
            id: 't23',
            name: 'Segment Trees',
            description:
              'Point update, range query, lazy propagation, and persistent segment trees.',
            difficulty: 'advanced',
            estimatedMinutes: 180,
            resources: [
              {
                title: 'CP Algorithms — Segment Tree',
                url: 'https://cp-algorithms.com/data_structures/segment_tree.html',
                type: 'article',
              },
              { title: 'Segment Tree Visualization', type: 'video' },
            ],
            subtopics: [
              { id: 'st179', name: 'Build & Query' },
              { id: 'st180', name: 'Point Update' },
              { id: 'st181', name: 'Range Update (Lazy)' },
              { id: 'st182', name: 'Merge Sort Tree' },
              { id: 'st183', name: 'Persistent Segment Tree' },
            ],
          },
          {
            id: 't24',
            name: 'Fenwick Tree (BIT)',
            description:
              'Binary Indexed Tree for prefix sums, range updates, and 2D BIT.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Fenwick Tree Tutorial', type: 'article' },
              { title: 'BIT Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st184', name: 'Point Update & Prefix Query' },
              { id: 'st185', name: 'Range Update & Point Query' },
              { id: 'st186', name: '2D Fenwick Tree' },
              { id: 'st187', name: 'Order Statistics' },
            ],
          },
          {
            id: 't25',
            name: 'Sparse Table & RMQ',
            description:
              'O(1) range minimum/maximum queries with O(n log n) preprocessing.',
            difficulty: 'advanced',
            estimatedMinutes: 60,
            resources: [
              { title: 'Sparse Table — CP Algorithms', type: 'article' },
              { title: 'RMQ Problems', type: 'practice' },
            ],
            subtopics: [
              { id: 'st188', name: 'Sparse Table Construction' },
              { id: 'st189', name: 'Range Min/Max Query' },
              { id: 'st190', name: 'GCD Queries' },
            ],
          },
          {
            id: 't26',
            name: 'Advanced Trees',
            description: 'Balanced BSTs, B-Trees, splay trees, and skip lists.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Self-Balancing BST Overview', type: 'article' },
              { title: 'Skip List Tutorial', type: 'video' },
            ],
            subtopics: [
              { id: 'st191', name: 'Treap' },
              { id: 'st192', name: 'Splay Tree' },
              { id: 'st193', name: 'B-Tree / B+ Tree' },
              { id: 'st194', name: 'Skip List' },
              { id: 'st195', name: 'Interval Tree' },
              { id: 'st196', name: 'K-D Tree' },
            ],
          },
        ],
      },
      {
        id: 's7',
        name: 'String Algorithms',
        description:
          'Advanced string processing and pattern matching algorithms.',
        topics: [
          {
            id: 't27',
            name: 'Pattern Matching',
            description:
              'KMP, Z-algorithm, Aho-Corasick for efficient string searching.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'KMP Algorithm Tutorial', type: 'article' },
              { title: 'Z-Algorithm Explained', type: 'video' },
            ],
            subtopics: [
              { id: 'st197', name: 'KMP Algorithm' },
              { id: 'st198', name: 'Z-Algorithm' },
              { id: 'st199', name: 'Aho-Corasick' },
              { id: 'st200', name: 'Robin-Karp (Multi-Pattern)' },
            ],
          },
          {
            id: 't28',
            name: 'Suffix Structures',
            description:
              'Suffix arrays, suffix trees, and LCP arrays for advanced string problems.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Suffix Array — CP Algorithms', type: 'article' },
              { title: 'Suffix Tree Applications', type: 'article' },
            ],
            subtopics: [
              { id: 'st201', name: 'Suffix Array Construction' },
              { id: 'st202', name: 'LCP Array' },
              { id: 'st203', name: 'Suffix Automaton' },
              { id: 'st204', name: 'Palindromic Tree (Eertree)' },
              { id: 'st205', name: "Manacher's Algorithm" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Frontend Development',
    slug: 'frontend',
    description:
      'Learn modern frontend technologies from HTML/CSS basics to advanced React patterns and performance optimization.',
    icon: 'Monitor',
    color: 'cyan',
    isPublished: true,
    sections: [
      {
        id: 's1',
        name: 'Web Foundations',
        description:
          'Core web technologies every frontend developer must know.',
        topics: [
          {
            id: 't1',
            name: 'HTML5 Semantics & Accessibility',
            description:
              'Semantic elements, ARIA attributes, forms, media, SEO-friendly markup.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'MDN HTML Guide',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                type: 'documentation',
              },
              { title: 'HTML5 Semantic Elements', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st1',
                name: 'Semantic HTML (header, nav, main, article, section, aside, footer)',
              },
              {
                id: 'st2',
                name: 'Forms & Input Types (email, date, range, color, pattern)',
              },
              {
                id: 'st3',
                name: 'Form Validation (required, pattern, custom validity)',
              },
              {
                id: 'st4',
                name: 'ARIA Attributes (roles, states, properties)',
              },
              {
                id: 'st5',
                name: 'Media Elements (video, audio, picture, source)',
              },
              {
                id: 'st6',
                name: 'Meta Tags & SEO (Open Graph, Twitter Cards, canonical)',
              },
              { id: 'st7', name: 'HTML Templates & Slots' },
              { id: 'st8', name: 'Data Attributes & Microdata' },
            ],
          },
          {
            id: 't2',
            name: 'CSS3 & Modern Layout',
            description:
              'Flexbox, Grid, custom properties, animations, responsive design, and modern CSS features.',
            difficulty: 'beginner',
            estimatedMinutes: 150,
            resources: [
              {
                title: 'CSS Tricks — Flexbox Guide',
                url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
                type: 'article',
              },
              {
                title: 'CSS Grid Guide',
                url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
                type: 'article',
              },
              { title: 'Modern CSS Course', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st9',
                name: 'Flexbox (align, justify, wrap, order, grow/shrink)',
              },
              {
                id: 'st10',
                name: 'CSS Grid (template areas, auto-fill, minmax, subgrid)',
              },
              {
                id: 'st11',
                name: 'Custom Properties (CSS variables, scoping, fallbacks)',
              },
              {
                id: 'st12',
                name: 'Animations (keyframes, timing functions, animation events)',
              },
              {
                id: 'st13',
                name: 'Transitions (property, duration, easing, delay)',
              },
              {
                id: 'st14',
                name: 'Transforms (translate, rotate, scale, perspective, 3D)',
              },
              {
                id: 'st15',
                name: 'Selectors (pseudo-classes, pseudo-elements, combinators, :has(), :is(), :where())',
              },
              {
                id: 'st16',
                name: 'Box Model & Sizing (border-box, margin collapse, aspect-ratio)',
              },
              {
                id: 'st17',
                name: 'Cascade Layers (@layer, specificity management)',
              },
              { id: 'st18', name: 'CSS Nesting (native nesting syntax)' },
            ],
          },
          {
            id: 't3',
            name: 'JavaScript ES6+',
            description:
              'Modern JavaScript features including closures, promises, async/await, modules, destructuring.',
            difficulty: 'beginner',
            estimatedMinutes: 180,
            resources: [
              {
                title: 'JavaScript.info',
                url: 'https://javascript.info',
                type: 'documentation',
              },
              { title: 'ES6 Features Overview', type: 'article' },
              {
                title: 'JavaScript 30 Challenge',
                url: 'https://javascript30.com',
                type: 'course',
              },
            ],
            subtopics: [
              { id: 'st19', name: 'Closures & Lexical Scope' },
              {
                id: 'st20',
                name: 'Promises (chaining, Promise.all, Promise.race, Promise.allSettled)',
              },
              { id: 'st21', name: 'Async/Await & Error Handling' },
              {
                id: 'st22',
                name: 'ES Modules (import/export, dynamic import())',
              },
              {
                id: 'st23',
                name: 'Destructuring (arrays, objects, nested, default values)',
              },
              { id: 'st24', name: 'Spread & Rest Operators' },
              { id: 'st25', name: 'Template Literals & Tagged Templates' },
              { id: 'st26', name: 'Map, Set, WeakMap, WeakSet' },
              {
                id: 'st27',
                name: 'Iterators & Generators (Symbol.iterator, yield)',
              },
              { id: 'st28', name: 'Proxy & Reflect' },
              { id: 'st29', name: 'Optional Chaining & Nullish Coalescing' },
              {
                id: 'st30',
                name: 'Array Methods (map, filter, reduce, flatMap, at, findLast)',
              },
              { id: 'st31', name: 'Event Loop & Microtasks' },
              { id: 'st32', name: 'Structured Clone & Deep Copy' },
            ],
          },
          {
            id: 't4',
            name: 'TypeScript Essentials',
            description:
              'Static typing, generics, utility types, declaration files, and TypeScript best practices.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'TypeScript Handbook',
                url: 'https://www.typescriptlang.org/docs/handbook/',
                type: 'documentation',
              },
              { title: 'TypeScript Deep Dive', type: 'book' },
            ],
            subtopics: [
              { id: 'st33', name: 'Type Annotations & Inference' },
              { id: 'st34', name: 'Interfaces vs Types' },
              {
                id: 'st35',
                name: 'Generics (constraints, conditional types, infer)',
              },
              {
                id: 'st36',
                name: 'Utility Types (Partial, Required, Pick, Omit, Record)',
              },
              {
                id: 'st37',
                name: 'Type Guards (typeof, instanceof, in, custom predicates)',
              },
              { id: 'st38', name: 'Discriminated Unions & Exhaustive Checks' },
              { id: 'st39', name: 'Template Literal Types' },
              {
                id: 'st40',
                name: 'Declaration Files (.d.ts) & Module Augmentation',
              },
              { id: 'st41', name: 'Enums vs Const Assertions' },
              { id: 'st42', name: 'Strict Mode & tsconfig Configuration' },
            ],
          },
          {
            id: 't4b',
            name: 'Browser APIs & DOM',
            description:
              'DOM manipulation, event delegation, Intersection Observer, Mutation Observer, Web Storage, and Fetch API.',
            difficulty: 'beginner',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'MDN Web APIs',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API',
                type: 'documentation',
              },
              { title: 'DOM Manipulation Deep Dive', type: 'article' },
              { title: 'Browser Events Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st43',
                name: 'DOM Traversal & Manipulation (querySelector, createElement)',
              },
              { id: 'st44', name: 'Event Delegation & Bubbling/Capturing' },
              {
                id: 'st45',
                name: 'Intersection Observer (lazy loading, infinite scroll)',
              },
              { id: 'st46', name: 'Mutation Observer (DOM change detection)' },
              {
                id: 'st47',
                name: 'Web Storage API (localStorage, sessionStorage)',
              },
              { id: 'st48', name: 'Fetch API & AbortController' },
              { id: 'st49', name: 'History API & URL Manipulation' },
              { id: 'st50', name: 'Clipboard API & Drag and Drop' },
              { id: 'st51', name: 'Geolocation & Permissions API' },
              { id: 'st52', name: 'ResizeObserver & Performance Observer' },
            ],
          },
          {
            id: 't4c',
            name: 'Git & Version Control',
            description:
              'Branching strategies, merge vs rebase, interactive rebase, conflict resolution, Git hooks, and monorepo tools.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Pro Git Book',
                url: 'https://git-scm.com/book/en/v2',
                type: 'book',
              },
              {
                title: 'Git Branching Interactive',
                url: 'https://learngitbranching.js.org',
                type: 'practice',
              },
            ],
            subtopics: [
              {
                id: 'st53',
                name: 'Branching Strategies (Git Flow, Trunk-Based)',
              },
              { id: 'st54', name: 'Merge vs Rebase (when to use each)' },
              {
                id: 'st55',
                name: 'Interactive Rebase (squash, fixup, reorder)',
              },
              { id: 'st56', name: 'Conflict Resolution Techniques' },
              { id: 'st57', name: 'Git Hooks (pre-commit, pre-push, husky)' },
              { id: 'st58', name: 'Git Bisect & Blame' },
              {
                id: 'st59',
                name: 'Monorepo Tools (Nx, Turborepo, pnpm workspaces)',
              },
            ],
          },
        ],
      },
      {
        id: 's2',
        name: 'React Ecosystem',
        description:
          'Master React and its surrounding ecosystem of tools and libraries.',
        topics: [
          {
            id: 't5',
            name: 'React Fundamentals',
            description:
              'Components, JSX, hooks (useState, useEffect, useRef, useMemo), lifecycle, composition patterns.',
            difficulty: 'intermediate',
            estimatedMinutes: 180,
            resources: [
              {
                title: 'React Official Docs',
                url: 'https://react.dev',
                type: 'documentation',
              },
              { title: 'React Hooks Guide', type: 'article' },
            ],
            subtopics: [
              { id: 'st60', name: 'JSX Syntax & Expressions' },
              { id: 'st61', name: 'Functional Components & Props' },
              {
                id: 'st62',
                name: 'useState (primitives, objects, lazy initialization)',
              },
              {
                id: 'st63',
                name: 'useEffect (dependencies, cleanup, race conditions)',
              },
              {
                id: 'st64',
                name: 'useRef (DOM refs, mutable values, forwarding refs)',
              },
              {
                id: 'st65',
                name: 'useMemo & useCallback (memoization, when to use)',
              },
              {
                id: 'st66',
                name: 'useReducer (complex state, dispatch patterns)',
              },
              { id: 'st67', name: 'useId, useDeferredValue, useTransition' },
              {
                id: 'st68',
                name: 'Component Composition (children, slots, compound)',
              },
              { id: 'st69', name: 'Controlled vs Uncontrolled Components' },
              { id: 'st70', name: 'React.memo & Preventing Re-renders' },
              { id: 'st71', name: 'Keys & Reconciliation Algorithm' },
            ],
          },
          {
            id: 't5b',
            name: 'Custom Hooks',
            description:
              'Building reusable custom hooks for data fetching, forms, media queries, and complex logic.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'React Custom Hooks Guide',
                url: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
                type: 'documentation',
              },
              {
                title: 'usehooks.com',
                url: 'https://usehooks.com',
                type: 'article',
              },
            ],
            subtopics: [
              {
                id: 'st72',
                name: 'Custom Hook Conventions (use prefix, rules of hooks)',
              },
              { id: 'st73', name: 'Data Fetching Hooks (useQuery pattern)' },
              { id: 'st74', name: 'Form Hooks (useForm, validation)' },
              {
                id: 'st75',
                name: 'Media Query Hooks (useMediaQuery, useBreakpoint)',
              },
              { id: 'st76', name: 'Debounce & Throttle Hooks' },
              { id: 'st77', name: 'Local Storage Hooks (persistence, sync)' },
              { id: 'st78', name: 'Intersection Observer Hooks' },
            ],
          },
          {
            id: 't6',
            name: 'State Management',
            description:
              'Context API, Redux Toolkit, Zustand, Jotai — choosing the right state management solution.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'State Management Comparison', type: 'article' },
              {
                title: 'Redux Toolkit Docs',
                url: 'https://redux-toolkit.js.org',
                type: 'documentation',
              },
              { title: 'Zustand Tutorial', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st79',
                name: 'Context API (createContext, useContext, provider pattern)',
              },
              {
                id: 'st80',
                name: 'Context Performance (splitting, memoization)',
              },
              {
                id: 'st81',
                name: 'Redux Toolkit (slices, createAsyncThunk, RTK Query)',
              },
              { id: 'st82', name: 'Redux DevTools & Middleware' },
              { id: 'st83', name: 'Zustand (stores, selectors, middleware)' },
              { id: 'st84', name: 'Jotai (atoms, derived atoms, async atoms)' },
              { id: 'st85', name: 'Server State vs Client State' },
              { id: 'st86', name: 'React Query as State Manager' },
            ],
          },
          {
            id: 't7',
            name: 'Routing & Navigation',
            description:
              'React Router v6, nested routes, route guards, dynamic routing, lazy loading routes.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'React Router Docs',
                url: 'https://reactrouter.com',
                type: 'documentation',
              },
              { title: 'Routing Patterns', type: 'article' },
            ],
            subtopics: [
              { id: 'st87', name: 'Nested Routes & Outlet' },
              { id: 'st88', name: 'Route Guards & Protected Routes' },
              { id: 'st89', name: 'Dynamic Routes & URL Parameters' },
              {
                id: 'st90',
                name: 'Lazy Loading Routes (React.lazy, Suspense)',
              },
              { id: 'st91', name: 'Search Params & Query Strings' },
              { id: 'st92', name: 'Navigation Guards (useBlocker, usePrompt)' },
              { id: 'st93', name: 'Route-based Code Splitting' },
            ],
          },
          {
            id: 't8',
            name: 'Forms & Validation',
            description:
              'React Hook Form, Zod validation, controlled vs uncontrolled components, complex form patterns.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'React Hook Form Docs',
                url: 'https://react-hook-form.com',
                type: 'documentation',
              },
              { title: 'Form Validation with Zod', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st94',
                name: 'React Hook Form (register, handleSubmit, formState)',
              },
              {
                id: 'st95',
                name: 'Zod Schemas (object, array, union, transform)',
              },
              { id: 'st96', name: 'Dynamic Form Fields (useFieldArray)' },
              { id: 'st97', name: 'Multi-step Forms & Wizards' },
              { id: 'st98', name: 'File Upload Handling' },
              {
                id: 'st99',
                name: 'Form Accessibility (labels, errors, focus management)',
              },
              { id: 'st100', name: 'Debounced Validation & Async Validation' },
            ],
          },
          {
            id: 't9',
            name: 'Testing React Apps',
            description:
              'Vitest, React Testing Library, Cypress/Playwright for E2E, testing strategies and best practices.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Testing Library Docs',
                url: 'https://testing-library.com',
                type: 'documentation',
              },
              { title: 'React Testing Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st101',
                name: 'Unit Testing with Vitest (describe, it, expect)',
              },
              {
                id: 'st102',
                name: 'React Testing Library (render, screen, userEvent)',
              },
              { id: 'st103', name: 'Testing Hooks (renderHook, act)' },
              { id: 'st104', name: 'Mocking (vi.mock, vi.fn, vi.spyOn)' },
              {
                id: 'st105',
                name: 'MSW for API Mocking (handlers, server setup)',
              },
              { id: 'st106', name: 'Snapshot Testing (when to use, pitfalls)' },
              {
                id: 'st107',
                name: 'E2E Testing with Playwright (page objects, assertions)',
              },
              { id: 'st108', name: 'Test Coverage & CI Integration' },
            ],
          },
          {
            id: 't9b',
            name: 'React Design Patterns',
            description:
              'Compound components, render props, higher-order components, custom hooks patterns, and provider patterns.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Patterns.dev — React',
                url: 'https://www.patterns.dev/react',
                type: 'article',
              },
              { title: 'Advanced React Patterns', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st109',
                name: 'Compound Components (implicit state sharing)',
              },
              { id: 'st110', name: 'Render Props Pattern' },
              {
                id: 'st111',
                name: 'Higher-Order Components (HOC, withAuth, withTheme)',
              },
              {
                id: 'st112',
                name: 'Provider Pattern (nested providers, context composition)',
              },
              { id: 'st113', name: 'Container/Presentational Pattern' },
              {
                id: 'st114',
                name: 'Hooks Pattern (replacing HOCs and render props)',
              },
              { id: 'st115', name: 'State Reducer Pattern' },
              { id: 'st116', name: 'Props Getter Pattern' },
            ],
          },
          {
            id: 't9c',
            name: 'Error Handling & Boundaries',
            description:
              'React Error Boundaries, Suspense for data fetching, fallback UIs, and graceful degradation strategies.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'React Error Boundaries',
                url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
                type: 'documentation',
              },
              { title: 'Suspense & Error Handling', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st117',
                name: 'Error Boundaries (componentDidCatch, getDerivedStateFromError)',
              },
              { id: 'st118', name: 'Suspense for Data Fetching' },
              { id: 'st119', name: 'Fallback UIs & Loading Skeletons' },
              { id: 'st120', name: 'Graceful Degradation Strategies' },
              {
                id: 'st121',
                name: 'Global Error Handling (window.onerror, unhandledrejection)',
              },
              {
                id: 'st122',
                name: 'Error Logging & Monitoring (Sentry, LogRocket)',
              },
            ],
          },
        ],
      },
      {
        id: 's3',
        name: 'Styling & UI',
        description:
          'Modern CSS frameworks, component libraries, and design system creation.',
        topics: [
          {
            id: 't10',
            name: 'Tailwind CSS',
            description:
              'Utility-first CSS, configuration, plugins, responsive design, and custom design systems with Tailwind.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Tailwind CSS Docs',
                url: 'https://tailwindcss.com/docs',
                type: 'documentation',
              },
              { title: 'Tailwind UI Components', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st123',
                name: 'Utility Classes (spacing, typography, colors)',
              },
              {
                id: 'st124',
                name: 'Responsive Prefixes (sm, md, lg, xl, 2xl)',
              },
              {
                id: 'st125',
                name: 'State Variants (hover, focus, active, group, peer)',
              },
              {
                id: 'st126',
                name: 'Custom Configuration (theme extend, colors, fonts)',
              },
              { id: 'st127', name: 'Custom Plugins & Presets' },
              { id: 'st128', name: 'Arbitrary Values & JIT Mode' },
              {
                id: 'st129',
                name: 'Dark Mode (class strategy, media strategy)',
              },
              { id: 'st130', name: '@apply & Component Extraction' },
            ],
          },
          {
            id: 't11',
            name: 'Component Libraries',
            description:
              'Shadcn/UI, Radix UI, Headless UI — building accessible, composable component systems.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Shadcn/UI Docs',
                url: 'https://ui.shadcn.com',
                type: 'documentation',
              },
              {
                title: 'Radix UI Primitives',
                url: 'https://www.radix-ui.com',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st131',
                name: 'Shadcn/UI (installation, theming, customization)',
              },
              {
                id: 'st132',
                name: 'Radix Primitives (Dialog, Popover, Select, Tabs)',
              },
              {
                id: 'st133',
                name: 'Headless UI (unstyled, accessible components)',
              },
              { id: 'st134', name: 'Component Composition & Slots' },
              { id: 'st135', name: 'Accessibility in Component Libraries' },
              {
                id: 'st136',
                name: 'Storybook (documentation, visual testing)',
              },
            ],
          },
          {
            id: 't12',
            name: 'Animation & Motion',
            description:
              'Framer Motion, CSS animations, page transitions, gesture-based interactions.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Framer Motion Docs',
                url: 'https://www.framer.com/motion/',
                type: 'documentation',
              },
              { title: 'Animation Patterns', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st137',
                name: 'Framer Motion (motion components, variants, AnimatePresence)',
              },
              {
                id: 'st138',
                name: 'Layout Animations (layoutId, shared layout)',
              },
              {
                id: 'st139',
                name: 'Gesture Animations (drag, pan, tap, hover)',
              },
              {
                id: 'st140',
                name: 'Scroll-triggered Animations (useScroll, useInView)',
              },
              { id: 'st141', name: 'CSS Keyframe Animations' },
              {
                id: 'st142',
                name: 'Page Transitions (route-based animations)',
              },
              { id: 'st143', name: 'Spring Physics & Easing Functions' },
              { id: 'st144', name: 'Staggered & Orchestrated Animations' },
            ],
          },
          {
            id: 't12b',
            name: 'Design Systems & Tokens',
            description:
              'Building scalable design systems with design tokens, theming, dark mode, and consistent component APIs.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Design Tokens Spec',
                url: 'https://design-tokens.github.io/community-group/format/',
                type: 'documentation',
              },
              { title: 'Building Design Systems', type: 'course' },
              { title: 'Theming with CSS Variables', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st145',
                name: 'Design Tokens (color, spacing, typography scales)',
              },
              {
                id: 'st146',
                name: 'Theming Architecture (CSS variables, theme providers)',
              },
              { id: 'st147', name: 'Dark Mode Implementation' },
              {
                id: 'st148',
                name: 'Component API Design (variants, sizes, compound)',
              },
              {
                id: 'st149',
                name: 'Token Naming Conventions (semantic vs primitive)',
              },
              {
                id: 'st150',
                name: 'Design System Documentation (Storybook, Docusaurus)',
              },
              { id: 'st151', name: 'Multi-brand Theming' },
            ],
          },
          {
            id: 't12c',
            name: 'Responsive & Adaptive Design',
            description:
              'Mobile-first development, container queries, responsive images, fluid typography, and breakpoint strategies.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Responsive Design Guide',
                url: 'https://web.dev/responsive-web-design-basics/',
                type: 'documentation',
              },
              { title: 'Container Queries Explained', type: 'article' },
            ],
            subtopics: [
              { id: 'st152', name: 'Mobile-First Approach' },
              {
                id: 'st153',
                name: 'Container Queries (@container, container-type)',
              },
              {
                id: 'st154',
                name: 'Fluid Typography (clamp(), viewport units)',
              },
              {
                id: 'st155',
                name: 'Responsive Images (srcset, sizes, picture element)',
              },
              {
                id: 'st156',
                name: 'Breakpoint Strategy (device vs content breakpoints)',
              },
              { id: 'st157', name: 'Touch vs Pointer Interactions' },
            ],
          },
          {
            id: 't12d',
            name: 'CSS-in-JS & Preprocessors',
            description:
              'Styled-components, Emotion, CSS Modules, Sass — comparing approaches and migration strategies.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'Styled-Components Docs',
                url: 'https://styled-components.com',
                type: 'documentation',
              },
              { title: 'CSS Modules Guide', type: 'article' },
            ],
            subtopics: [
              { id: 'st158', name: 'CSS Modules (scoping, composition)' },
              {
                id: 'st159',
                name: 'Styled-Components (theming, global styles)',
              },
              { id: 'st160', name: 'Emotion (css prop, styled API)' },
              { id: 'st161', name: 'Sass/SCSS (variables, mixins, nesting)' },
              {
                id: 'st162',
                name: 'Zero-Runtime CSS (Vanilla Extract, Linaria)',
              },
              { id: 'st163', name: 'Choosing the Right Approach' },
            ],
          },
        ],
      },
      {
        id: 's5',
        name: 'API Integration & Data Fetching',
        description:
          'Connect to backends, manage server state, and handle real-time data.',
        topics: [
          {
            id: 't17',
            name: 'REST API Consumption',
            description:
              'Fetch API, Axios, request/response interceptors, error handling, retries, and API client patterns.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'MDN Fetch API',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
                type: 'documentation',
              },
              { title: 'Axios vs Fetch Comparison', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st164',
                name: 'Fetch API (headers, body, signal, streaming)',
              },
              {
                id: 'st165',
                name: 'Axios (instances, interceptors, cancel tokens)',
              },
              {
                id: 'st166',
                name: 'Error Handling (retry logic, exponential backoff)',
              },
              { id: 'st167', name: 'Request/Response Interceptors' },
              {
                id: 'st168',
                name: 'API Client Pattern (base URL, auth headers, serialization)',
              },
              {
                id: 'st169',
                name: 'File Upload (FormData, progress tracking)',
              },
              {
                id: 'st170',
                name: 'Pagination Patterns (cursor, offset, infinite)',
              },
            ],
          },
          {
            id: 't18',
            name: 'React Query / TanStack Query',
            description:
              'Server state management, caching, pagination, infinite scrolling, optimistic updates, and query invalidation.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'TanStack Query Docs',
                url: 'https://tanstack.com/query/latest',
                type: 'documentation',
              },
              { title: 'React Query Tutorial', type: 'video' },
              { title: 'Practical React Query', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st171',
                name: 'useQuery (queryKey, queryFn, staleTime, gcTime)',
              },
              {
                id: 'st172',
                name: 'useMutation (mutationFn, onSuccess, onError)',
              },
              { id: 'st173', name: 'Query Invalidation & Refetching' },
              { id: 'st174', name: 'Optimistic Updates (onMutate, rollback)' },
              {
                id: 'st175',
                name: 'Infinite Queries (useInfiniteQuery, getNextPageParam)',
              },
              { id: 'st176', name: 'Prefetching & Placeholder Data' },
              { id: 'st177', name: 'Dependent Queries & Parallel Queries' },
              { id: 'st178', name: 'Devtools & Debugging' },
            ],
          },
          {
            id: 't19',
            name: 'WebSockets & Real-Time',
            description:
              'WebSocket connections, Socket.io, Server-Sent Events, real-time data synchronization patterns.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'MDN WebSocket API',
                url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
                type: 'documentation',
              },
              { title: 'Real-Time Patterns', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st179',
                name: 'WebSocket API (connect, send, onmessage, close)',
              },
              {
                id: 'st180',
                name: 'Socket.io (rooms, namespaces, middleware)',
              },
              { id: 'st181', name: 'Server-Sent Events (EventSource, retry)' },
              { id: 'st182', name: 'Real-Time Sync Patterns (CRDT, OT)' },
              { id: 'st183', name: 'Reconnection & Heartbeat Strategies' },
              { id: 'st184', name: 'Supabase Realtime (channels, presence)' },
            ],
          },
          {
            id: 't20',
            name: 'GraphQL Client-Side',
            description:
              'Apollo Client, urql, code generation, fragments, cache normalization, and subscription handling.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Apollo Client Docs',
                url: 'https://www.apollographql.com/docs/react/',
                type: 'documentation',
              },
              {
                title: 'GraphQL Code Generator',
                url: 'https://the-guild.dev/graphql/codegen',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st185',
                name: 'Apollo Client (useQuery, useMutation, cache)',
              },
              { id: 'st186', name: 'Cache Normalization & InMemoryCache' },
              { id: 'st187', name: 'Fragments (reusable query pieces)' },
              {
                id: 'st188',
                name: 'Code Generation (typed hooks, schema introspection)',
              },
              {
                id: 'st189',
                name: 'Subscriptions (useSubscription, WebSocket link)',
              },
              { id: 'st190', name: 'urql (exchanges, document caching)' },
              { id: 'st191', name: 'Error Handling & Loading States' },
            ],
          },
          {
            id: 't21',
            name: 'Authentication in SPAs',
            description:
              'Token-based auth, OAuth flows, JWT handling, refresh tokens, protected routes, and auth state management.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'SPA Auth Best Practices', type: 'article' },
              { title: 'OAuth for SPAs', type: 'video' },
              { title: 'JWT Security Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st192',
                name: 'JWT Structure (header, payload, signature)',
              },
              {
                id: 'st193',
                name: 'OAuth 2.0 Flows (Authorization Code + PKCE)',
              },
              { id: 'st194', name: 'Refresh Token Rotation' },
              { id: 'st195', name: 'Protected Routes & Auth Guards' },
              {
                id: 'st196',
                name: 'Social Login (Google, GitHub, OAuth providers)',
              },
              {
                id: 'st197',
                name: 'Token Storage (httpOnly cookies vs localStorage)',
              },
              { id: 'st198', name: 'Auth State Management (context, hooks)' },
            ],
          },
        ],
      },
      {
        id: 's4',
        name: 'Advanced Frontend',
        description: 'Performance, tooling, and production-grade practices.',
        topics: [
          {
            id: 't13',
            name: 'Performance Optimization',
            description:
              'Code splitting, lazy loading, memoization, virtual scrolling, bundle analysis, Core Web Vitals.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Web.dev Performance Guide',
                url: 'https://web.dev/performance',
                type: 'documentation',
              },
              { title: 'React Performance Patterns', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st199',
                name: 'Code Splitting (React.lazy, dynamic import)',
              },
              { id: 'st200', name: 'Lazy Loading Images & Components' },
              { id: 'st201', name: 'React.memo, useMemo, useCallback' },
              {
                id: 'st202',
                name: 'Virtual Scrolling (react-window, react-virtuoso)',
              },
              {
                id: 'st203',
                name: 'Bundle Analysis (vite-bundle-analyzer, source-map-explorer)',
              },
              { id: 'st204', name: 'Core Web Vitals (LCP, FID, CLS)' },
              {
                id: 'st205',
                name: 'Image Optimization (WebP, AVIF, responsive images)',
              },
              {
                id: 'st206',
                name: 'Preloading & Prefetching (link rel, modulepreload)',
              },
              {
                id: 'st207',
                name: 'Web Workers (offloading heavy computation)',
              },
              { id: 'st208', name: 'Memory Leak Detection & Prevention' },
            ],
          },
          {
            id: 't14',
            name: 'Build Tools & Bundlers',
            description:
              'Vite, Webpack, ESBuild, Turbopack — bundling strategies, HMR, tree shaking.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Vite Documentation',
                url: 'https://vitejs.dev',
                type: 'documentation',
              },
              { title: 'Build Tools Comparison', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st209',
                name: 'Vite (config, plugins, env variables, SSR)',
              },
              {
                id: 'st210',
                name: 'Tree Shaking (side effects, dead code elimination)',
              },
              { id: 'st211', name: 'Hot Module Replacement (HMR)' },
              { id: 'st212', name: 'Bundle Analysis & Optimization' },
              {
                id: 'st213',
                name: 'Webpack (loaders, plugins, chunk splitting)',
              },
              { id: 'st214', name: 'ESBuild & SWC (fast transpilation)' },
              { id: 'st215', name: 'Source Maps (production debugging)' },
              { id: 'st216', name: 'Environment Variables & Build Modes' },
            ],
          },
          {
            id: 't15',
            name: 'PWA & Service Workers',
            description:
              'Progressive web apps, offline support, service worker lifecycle, caching strategies.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'PWA Guide',
                url: 'https://web.dev/progressive-web-apps/',
                type: 'documentation',
              },
              { title: 'Service Worker Cookbook', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st217',
                name: 'Service Worker Lifecycle (install, activate, fetch)',
              },
              {
                id: 'st218',
                name: 'Caching Strategies (Cache First, Network First, Stale-While-Revalidate)',
              },
              { id: 'st219', name: 'Offline Support & Fallback Pages' },
              {
                id: 'st220',
                name: 'Web App Manifest (icons, theme color, display)',
              },
              {
                id: 'st221',
                name: 'Push Notifications (Notification API, Push API)',
              },
              { id: 'st222', name: 'Background Sync & Periodic Sync' },
              {
                id: 'st223',
                name: 'Workbox (precaching, runtime caching, strategies)',
              },
            ],
          },
          {
            id: 't16',
            name: 'Accessibility (a11y)',
            description:
              'WCAG guidelines, ARIA roles, keyboard navigation, screen reader testing, focus management.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'WAI-ARIA Practices',
                url: 'https://www.w3.org/WAI/ARIA/apg/',
                type: 'documentation',
              },
              {
                title: 'A11y Project',
                url: 'https://www.a11yproject.com',
                type: 'article',
              },
            ],
            subtopics: [
              { id: 'st224', name: 'WCAG 2.1 Guidelines (A, AA, AAA levels)' },
              { id: 'st225', name: 'ARIA Roles, States & Properties' },
              {
                id: 'st226',
                name: 'Keyboard Navigation (tab order, focus traps, roving tabindex)',
              },
              {
                id: 'st227',
                name: 'Screen Reader Testing (VoiceOver, NVDA, JAWS)',
              },
              {
                id: 'st228',
                name: 'Focus Management (focus visible, skip links)',
              },
              { id: 'st229', name: 'Color Contrast & Visual Accessibility' },
              {
                id: 'st230',
                name: 'Accessible Forms (labels, errors, live regions)',
              },
              {
                id: 'st231',
                name: 'Automated Testing (axe-core, Lighthouse a11y)',
              },
            ],
          },
          {
            id: 't16b',
            name: 'Internationalization (i18n)',
            description:
              'Multi-language support, locale formatting, RTL layouts, translation workflows, and i18next/react-intl.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'i18next Docs',
                url: 'https://www.i18next.com',
                type: 'documentation',
              },
              { title: 'React i18n Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st232',
                name: 'i18next Setup (init, namespaces, backends)',
              },
              {
                id: 'st233',
                name: 'react-i18next (useTranslation, Trans component)',
              },
              {
                id: 'st234',
                name: 'Locale Formatting (dates, numbers, currencies with Intl)',
              },
              {
                id: 'st235',
                name: 'RTL Layout Support (dir attribute, logical properties)',
              },
              { id: 'st236', name: 'Pluralization & Interpolation' },
              {
                id: 'st237',
                name: 'Translation Workflows (extraction, key management)',
              },
              { id: 'st238', name: 'Dynamic Language Switching' },
            ],
          },
          {
            id: 't16c',
            name: 'Security in Frontend',
            description:
              'XSS prevention, CSP headers, CSRF protection, secure storage, dependency auditing, and input sanitization.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'OWASP Frontend Security',
                url: 'https://owasp.org/www-project-web-security-testing-guide/',
                type: 'documentation',
              },
              { title: 'Frontend Security Checklist', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st239',
                name: 'XSS Prevention (sanitization, dangerouslySetInnerHTML)',
              },
              { id: 'st240', name: 'Content Security Policy (CSP) Headers' },
              {
                id: 'st241',
                name: 'CSRF Protection (tokens, SameSite cookies)',
              },
              {
                id: 'st242',
                name: 'Secure Storage (httpOnly cookies, encryption)',
              },
              {
                id: 'st243',
                name: 'Dependency Auditing (npm audit, Snyk, Socket)',
              },
              {
                id: 'st244',
                name: 'Input Sanitization (DOMPurify, allowlists)',
              },
              { id: 'st245', name: 'Subresource Integrity (SRI)' },
              { id: 'st246', name: 'CORS Configuration & Security' },
            ],
          },
          {
            id: 't16d',
            name: 'Micro-Frontends & Module Federation',
            description:
              'Architecture patterns for large-scale apps, Webpack Module Federation, independent deployments, and shared dependencies.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Micro-Frontends Guide',
                url: 'https://micro-frontends.org',
                type: 'article',
              },
              { title: 'Module Federation Docs', type: 'documentation' },
            ],
            subtopics: [
              {
                id: 'st247',
                name: 'Module Federation (remotes, shared modules, versioning)',
              },
              { id: 'st248', name: 'Independent Deployments & CI/CD' },
              { id: 'st249', name: 'Shared Dependencies & Version Management' },
              {
                id: 'st250',
                name: 'Cross-App Communication (events, shared state)',
              },
              { id: 'st251', name: 'Routing Between Micro-Frontends' },
              { id: 'st252', name: 'Design System Consistency Across Apps' },
            ],
          },
          {
            id: 't16e',
            name: 'CI/CD & DevOps for Frontend',
            description:
              'Continuous integration, deployment pipelines, preview deployments, feature flags, and monitoring.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'GitHub Actions Docs',
                url: 'https://docs.github.com/en/actions',
                type: 'documentation',
              },
              { title: 'Frontend CI/CD Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st253',
                name: 'GitHub Actions (workflows, matrix builds)',
              },
              { id: 'st254', name: 'Preview Deployments (Vercel, Netlify)' },
              { id: 'st255', name: 'Feature Flags (LaunchDarkly, Unleash)' },
              { id: 'st256', name: 'Error Monitoring (Sentry, LogRocket)' },
              {
                id: 'st257',
                name: 'Performance Monitoring (Lighthouse CI, SpeedCurve)',
              },
              {
                id: 'st258',
                name: 'Linting & Formatting (ESLint, Prettier, pre-commit hooks)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Backend Development',
    slug: 'backend',
    description:
      'Build scalable server-side applications with databases, APIs, authentication, and deployment strategies.',
    icon: 'Server',
    color: 'amber',
    isPublished: true,
    sections: [
      {
        id: 's1',
        name: 'Server Fundamentals',
        description: 'Core concepts for building robust backend services.',
        topics: [
          {
            id: 't1',
            name: 'HTTP Protocol Deep Dive',
            description:
              'HTTP/1.1, HTTP/2, HTTP/3, methods, headers, status codes, content negotiation, CORS.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'MDN HTTP Guide',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
                type: 'documentation',
              },
              { title: 'HTTP Protocol Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st1',
                name: 'HTTP Methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)',
              },
              {
                id: 'st2',
                name: 'Status Codes (1xx-5xx families & proper usage)',
              },
              {
                id: 'st3',
                name: 'Request/Response Headers (Content-Type, Accept, Authorization)',
              },
              {
                id: 'st4',
                name: 'CORS (preflight, allowed origins, credentials)',
              },
              {
                id: 'st4b',
                name: 'HTTP/2 (multiplexing, server push, header compression)',
              },
              { id: 'st4c', name: 'HTTP/3 & QUIC protocol fundamentals' },
              {
                id: 'st4d',
                name: 'Content Negotiation (Accept, Accept-Language)',
              },
              {
                id: 'st4e',
                name: 'Keep-Alive, Connection Pooling, Pipelining',
              },
              {
                id: 'st4f',
                name: 'Cookies (SameSite, Secure, HttpOnly attributes)',
              },
              {
                id: 'st4g',
                name: 'Cache-Control, ETag, Last-Modified headers',
              },
            ],
          },
          {
            id: 't2',
            name: 'RESTful API Design',
            description:
              'Resource modeling, URL conventions, versioning, HATEOAS, pagination, filtering.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              { title: 'RESTful API Best Practices', type: 'article' },
              { title: 'API Design Guide', type: 'documentation' },
            ],
            subtopics: [
              {
                id: 'st5',
                name: 'Resource Naming Conventions (plural nouns, nesting)',
              },
              {
                id: 'st6',
                name: 'API Versioning (URL, header, query param strategies)',
              },
              {
                id: 'st7',
                name: 'Pagination (cursor-based vs offset, page tokens)',
              },
              {
                id: 'st8',
                name: 'Error Handling (RFC 7807 Problem Details format)',
              },
              {
                id: 'st8b',
                name: 'Filtering, Sorting & Field Selection (sparse fieldsets)',
              },
              { id: 'st8c', name: 'HATEOAS & Hypermedia links' },
              { id: 'st8d', name: 'Idempotency keys for safe retries' },
              { id: 'st8e', name: 'Bulk operations & batch endpoints' },
              { id: 'st8f', name: 'Rate limiting headers (X-RateLimit-*)' },
            ],
          },
          {
            id: 't3',
            name: 'Node.js & Express',
            description:
              'Event loop, middleware, routing, error handling, streaming, cluster mode.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              {
                title: 'Node.js Official Docs',
                url: 'https://nodejs.org/docs',
                type: 'documentation',
              },
              {
                title: 'Express.js Guide',
                url: 'https://expressjs.com',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st9',
                name: 'Event Loop (phases, microtasks vs macrotasks)',
              },
              {
                id: 'st10',
                name: 'Middleware (application, router, error-handling, third-party)',
              },
              {
                id: 'st11',
                name: 'Centralized Error Handling (async wrappers, error classes)',
              },
              {
                id: 'st12',
                name: 'Streaming (Readable, Writable, Transform, pipe)',
              },
              {
                id: 'st12b',
                name: 'Cluster Mode & Worker Threads for CPU-bound tasks',
              },
              {
                id: 'st12c',
                name: 'File System operations (fs/promises, path handling)',
              },
              {
                id: 'st12d',
                name: 'Environment Variables & Configuration (dotenv, config)',
              },
              {
                id: 'st12e',
                name: 'Process Management (PM2, graceful shutdown)',
              },
              { id: 'st12f', name: 'Buffers, Encoding & Binary Data handling' },
              {
                id: 'st12g',
                name: 'Node.js native fetch, AbortController & Timers',
              },
              {
                id: 'st12h',
                name: 'Alternative frameworks (Fastify, Hono, NestJS overview)',
              },
            ],
          },
          {
            id: 't4',
            name: 'Authentication & Authorization',
            description:
              'JWT, OAuth2, session management, RBAC, API keys, password hashing, MFA.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Auth0 Documentation',
                url: 'https://auth0.com/docs',
                type: 'documentation',
              },
              { title: 'JWT Explained', type: 'video' },
              { title: 'OAuth2 Flow Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st13',
                name: 'JWT Tokens (access, refresh, claims, expiration)',
              },
              {
                id: 'st14',
                name: 'OAuth2 Flows (Authorization Code, PKCE, Client Credentials)',
              },
              {
                id: 'st15',
                name: 'Session Management (cookies, session stores, Redis sessions)',
              },
              {
                id: 'st16',
                name: 'RBAC (roles, permissions, guards, policy-based)',
              },
              {
                id: 'st17',
                name: 'Password Hashing (bcrypt, argon2, salt rounds)',
              },
              {
                id: 'st17b',
                name: 'Multi-Factor Authentication (TOTP, SMS, WebAuthn)',
              },
              {
                id: 'st17c',
                name: 'API Key Management (generation, rotation, scoping)',
              },
              { id: 'st17d', name: 'Single Sign-On (SSO) & SAML basics' },
              { id: 'st17e', name: 'Token Refresh Strategies & Revocation' },
              {
                id: 'st17f',
                name: 'Passport.js strategies & custom auth middleware',
              },
            ],
          },
          {
            id: 't5',
            name: 'GraphQL',
            description:
              'Schema design, resolvers, mutations, subscriptions, DataLoader, federation.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'GraphQL Official Docs',
                url: 'https://graphql.org',
                type: 'documentation',
              },
              { title: 'Apollo Server Tutorial', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st18',
                name: 'Schema Design (types, inputs, enums, interfaces, unions)',
              },
              {
                id: 'st19',
                name: 'Resolvers (field-level, parent chaining, context)',
              },
              {
                id: 'st20',
                name: 'Subscriptions (WebSocket transport, PubSub)',
              },
              {
                id: 'st21',
                name: 'DataLoader (N+1 problem, batching, caching)',
              },
              {
                id: 'st21x',
                name: 'Mutations (input validation, optimistic responses)',
              },
              {
                id: 'st21y',
                name: 'Pagination (Relay cursor connections, offset)',
              },
              {
                id: 'st21z',
                name: 'Error Handling (union error types, extensions)',
              },
              {
                id: 'st21aa',
                name: 'Schema Federation & Stitching (Apollo Federation)',
              },
              {
                id: 'st21ab',
                name: 'Query Complexity Analysis & Depth Limiting',
              },
              {
                id: 'st21ac',
                name: 'Code Generation (graphql-codegen, typed resolvers)',
              },
            ],
          },
          {
            id: 't5b',
            name: 'Input Validation & Sanitization',
            description:
              'Request validation with Zod/Joi, input sanitization, SQL injection prevention, parameterized queries.',
            difficulty: 'beginner',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'Zod Validation Library',
                url: 'https://zod.dev',
                type: 'documentation',
              },
              { title: 'OWASP Input Validation', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st21b',
                name: 'Schema Validation (Zod, Joi, Yup comparison)',
              },
              {
                id: 'st21c',
                name: 'HTML/XSS Sanitization (DOMPurify, sanitize-html)',
              },
              {
                id: 'st21d',
                name: 'SQL Injection Prevention (parameterized queries)',
              },
              {
                id: 'st21ad',
                name: 'File Upload Validation (MIME type, size, extension)',
              },
              {
                id: 'st21ae',
                name: 'Request Body Size Limits & Content-Type enforcement',
              },
              {
                id: 'st21af',
                name: 'Custom Validators & Transformation Pipelines',
              },
              {
                id: 'st21ag',
                name: 'Path Traversal & Command Injection Prevention',
              },
            ],
          },
          {
            id: 't5c',
            name: 'Error Handling & Logging',
            description:
              'Structured error responses, error codes, centralized error handling middleware, logging best practices.',
            difficulty: 'beginner',
            estimatedMinutes: 60,
            resources: [
              { title: 'Error Handling Patterns', type: 'article' },
              { title: 'Winston Logger Guide', type: 'documentation' },
            ],
            subtopics: [
              {
                id: 'st21e',
                name: 'Error Middleware (Express, NestJS exception filters)',
              },
              { id: 'st21f', name: 'Custom Error Classes & Error Codes' },
              {
                id: 'st21g',
                name: 'Structured Logging (JSON, log levels, context)',
              },
              {
                id: 'st21ah',
                name: 'Winston, Pino & Bunyan logger comparison',
              },
              { id: 'st21ai', name: 'Correlation IDs & Request Tracing' },
              {
                id: 'st21aj',
                name: 'Unhandled Rejection & Uncaught Exception handlers',
              },
              { id: 'st21ak', name: 'Log Aggregation (ELK, Loki, CloudWatch)' },
            ],
          },
        ],
      },
      {
        id: 's2',
        name: 'Databases',
        description: 'Master relational and non-relational database systems.',
        topics: [
          {
            id: 't6',
            name: 'SQL & PostgreSQL',
            description:
              'Advanced SQL, joins, indexing, query optimization, stored procedures, triggers, migrations.',
            difficulty: 'intermediate',
            estimatedMinutes: 180,
            resources: [
              {
                title: 'PostgreSQL Tutorial',
                url: 'https://www.postgresql.org/docs/',
                type: 'documentation',
              },
              { title: 'SQL Performance Explained', type: 'book' },
            ],
            subtopics: [
              {
                id: 'st22',
                name: 'Advanced Joins (INNER, LEFT, RIGHT, FULL, CROSS, self-joins)',
              },
              {
                id: 'st23',
                name: 'Indexing (B-tree, Hash, GIN, GiST, partial, composite)',
              },
              {
                id: 'st24',
                name: 'Query Optimization (EXPLAIN ANALYZE, query plans)',
              },
              {
                id: 'st25',
                name: 'Migrations (up/down, versioning, zero-downtime)',
              },
              { id: 'st26', name: 'Stored Procedures & Functions (PL/pgSQL)' },
              {
                id: 'st26b',
                name: 'Window Functions (ROW_NUMBER, RANK, LEAD, LAG)',
              },
              { id: 'st26c', name: 'CTEs & Recursive Queries' },
              { id: 'st26d', name: 'Triggers & Event-based automation' },
              {
                id: 'st26e',
                name: 'Views, Materialized Views & Refresh strategies',
              },
              { id: 'st26f', name: 'JSON/JSONB columns & querying' },
              {
                id: 'st26g',
                name: 'Full-Text Search (tsvector, tsquery, ranking)',
              },
              {
                id: 'st26h',
                name: 'Partitioning (range, list, hash partitions)',
              },
            ],
          },
          {
            id: 't7',
            name: 'NoSQL Databases',
            description:
              'MongoDB, Redis, DynamoDB — document stores, key-value stores, use cases and trade-offs.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'MongoDB University',
                url: 'https://university.mongodb.com',
                type: 'course',
              },
              { title: 'NoSQL Comparison Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st27',
                name: 'MongoDB (documents, collections, aggregation pipeline)',
              },
              {
                id: 'st28',
                name: 'Redis (data types, pub/sub, Lua scripting, persistence)',
              },
              {
                id: 'st29',
                name: 'DynamoDB (partition keys, sort keys, GSI, LSI)',
              },
              {
                id: 'st30',
                name: 'When to Use NoSQL vs SQL (CAP theorem trade-offs)',
              },
              {
                id: 'st30b',
                name: 'MongoDB Indexing (compound, text, TTL, geospatial)',
              },
              { id: 'st30c', name: 'Redis Streams & TimeSeries use cases' },
              { id: 'st30d', name: 'Cassandra & Wide-Column stores overview' },
              {
                id: 'st30e',
                name: 'Graph Databases (Neo4j, Cypher query basics)',
              },
              {
                id: 'st30f',
                name: 'Data Modeling in Document Stores (embedding vs referencing)',
              },
            ],
          },
          {
            id: 't8',
            name: 'ORMs & Query Builders',
            description:
              'Prisma, Drizzle, TypeORM, Sequelize — type-safe database access and schema management.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Prisma Docs',
                url: 'https://www.prisma.io/docs',
                type: 'documentation',
              },
              { title: 'ORM Comparison Article', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st31',
                name: 'Prisma (schema, client, migrations, relations)',
              },
              {
                id: 'st32',
                name: 'Drizzle ORM (schema definition, queries, joins)',
              },
              {
                id: 'st33',
                name: 'Schema Management (introspection, push vs migrate)',
              },
              {
                id: 'st33b',
                name: 'TypeORM (entities, repositories, decorators)',
              },
              {
                id: 'st33c',
                name: 'Query Builders (Knex.js, raw queries, composability)',
              },
              {
                id: 'st33d',
                name: 'Seeding & Fixtures for development/testing',
              },
              { id: 'st33e', name: 'N+1 Query Problem & Eager/Lazy Loading' },
              { id: 'st33f', name: 'Connection Pooling & Pool Configuration' },
            ],
          },
          {
            id: 't9',
            name: 'Database Design Patterns',
            description:
              'Normalization, denormalization, sharding, replication, connection pooling, migrations.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Database Design Guide', type: 'article' },
              { title: 'Scaling Databases', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st34',
                name: 'Normalization (1NF through 5NF, when to denormalize)',
              },
              {
                id: 'st35',
                name: 'Sharding (horizontal, vertical, shard key selection)',
              },
              {
                id: 'st36',
                name: 'Replication (primary-replica, multi-master, read replicas)',
              },
              {
                id: 'st37',
                name: 'Connection Pooling (PgBouncer, pool sizing)',
              },
              {
                id: 'st37aa',
                name: 'Multi-tenancy patterns (schema, row, database isolation)',
              },
              {
                id: 'st37ab',
                name: 'Soft Deletes vs Hard Deletes & Archival strategies',
              },
              {
                id: 'st37ac',
                name: 'Audit Logging & Change Data Capture (CDC)',
              },
              { id: 'st37ad', name: 'Time-Series Data storage patterns' },
            ],
          },
          {
            id: 't9b',
            name: 'Database Transactions & Concurrency',
            description:
              'ACID properties, isolation levels, optimistic vs pessimistic locking, deadlock detection and prevention.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Transaction Isolation Deep Dive', type: 'article' },
              { title: 'Concurrency Control Patterns', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st37b',
                name: 'ACID Properties (Atomicity, Consistency, Isolation, Durability)',
              },
              {
                id: 'st37c',
                name: 'Isolation Levels (Read Uncommitted → Serializable)',
              },
              {
                id: 'st37d',
                name: 'Optimistic Locking (version columns, CAS)',
              },
              {
                id: 'st37e',
                name: 'Pessimistic Locking (SELECT FOR UPDATE, advisory locks)',
              },
              {
                id: 'st37ae',
                name: 'Deadlock Detection, Prevention & Resolution',
              },
              {
                id: 'st37af',
                name: 'Distributed Transactions (2PC, Saga pattern)',
              },
              {
                id: 'st37ag',
                name: 'MVCC (Multi-Version Concurrency Control)',
              },
              { id: 'st37ah', name: 'Write-Ahead Logging (WAL) & Recovery' },
            ],
          },
        ],
      },
      {
        id: 's3',
        name: 'API Architecture & Patterns',
        description: 'Advanced API patterns and architectural approaches.',
        topics: [
          {
            id: 't9c',
            name: 'Microservices Architecture',
            description:
              'Service decomposition, inter-service communication, API gateway, service discovery, circuit breakers.',
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              { title: 'Microservices Patterns Book', type: 'book' },
              { title: 'Building Microservices', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st37f',
                name: 'Service Decomposition (bounded contexts, DDD)',
              },
              {
                id: 'st37g',
                name: 'API Gateway (Kong, AWS API Gateway, routing)',
              },
              {
                id: 'st37h',
                name: 'Service Discovery (Consul, Eureka, DNS-based)',
              },
              {
                id: 'st37i',
                name: 'Circuit Breakers (Hystrix, resilience4j patterns)',
              },
              {
                id: 'st37ai',
                name: 'Inter-Service Communication (sync REST, async messaging)',
              },
              {
                id: 'st37aj',
                name: 'Service Mesh (Istio, Linkerd, sidecar proxy)',
              },
              {
                id: 'st37ak',
                name: 'Distributed Tracing across services (Jaeger, Zipkin)',
              },
              {
                id: 'st37al',
                name: 'Saga Pattern (choreography vs orchestration)',
              },
              {
                id: 'st37am',
                name: 'Strangler Fig Pattern for monolith migration',
              },
              { id: 'st37an', name: 'Backend for Frontend (BFF) pattern' },
            ],
          },
          {
            id: 't9d',
            name: 'WebSockets & Real-Time APIs',
            description:
              'Bidirectional communication, Socket.io, Server-Sent Events, pub/sub patterns, presence systems.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'WebSocket Protocol Guide', type: 'article' },
              {
                title: 'Socket.io Documentation',
                url: 'https://socket.io/docs',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st37j',
                name: 'WebSocket Protocol (handshake, frames, close codes)',
              },
              {
                id: 'st37k',
                name: 'Socket.io (rooms, namespaces, acknowledgments)',
              },
              {
                id: 'st37l',
                name: 'Server-Sent Events (EventSource, retry, last-event-id)',
              },
              {
                id: 'st37m',
                name: 'Pub/Sub Patterns (Redis pub/sub, fan-out)',
              },
              {
                id: 'st37ao',
                name: 'Presence Systems (online/offline, heartbeat)',
              },
              {
                id: 'st37ap',
                name: 'Scaling WebSockets (sticky sessions, Redis adapter)',
              },
              { id: 'st37aq', name: 'Long Polling as a fallback strategy' },
              {
                id: 'st37ar',
                name: 'Real-time Notifications & Live Feeds architecture',
              },
            ],
          },
          {
            id: 't9e',
            name: 'gRPC & Protocol Buffers',
            description:
              'High-performance RPC, protobuf schema design, streaming RPCs, service reflection, load balancing.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'gRPC Official Docs',
                url: 'https://grpc.io/docs',
                type: 'documentation',
              },
              { title: 'Protocol Buffers Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st37n',
                name: 'Protobuf Schemas (messages, enums, oneof, maps)',
              },
              {
                id: 'st37o',
                name: 'Streaming RPCs (server, client, bidirectional)',
              },
              {
                id: 'st37p',
                name: 'Service Reflection & gRPC health checking',
              },
              { id: 'st37as', name: 'gRPC-Web for browser clients' },
              {
                id: 'st37at',
                name: 'Load Balancing (client-side, proxy, look-aside)',
              },
              { id: 'st37au', name: 'Interceptors & Middleware in gRPC' },
              {
                id: 'st37av',
                name: 'Schema Evolution & Backward Compatibility',
              },
            ],
          },
          {
            id: 't9f',
            name: 'API Versioning & Documentation',
            description:
              'Versioning strategies, OpenAPI/Swagger, API documentation tools, backward compatibility, deprecation.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'OpenAPI Specification',
                url: 'https://swagger.io/specification/',
                type: 'documentation',
              },
              { title: 'API Versioning Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st37q',
                name: 'OpenAPI/Swagger (spec writing, Swagger UI, Redoc)',
              },
              {
                id: 'st37r',
                name: 'Versioning Strategies (URL, header, content negotiation)',
              },
              {
                id: 'st37s',
                name: 'Deprecation Policies (sunset headers, migration guides)',
              },
              {
                id: 'st37aw',
                name: 'API Mocking (Prism, MSW for development)',
              },
              {
                id: 'st37ax',
                name: 'SDK Generation (openapi-generator, client libraries)',
              },
              {
                id: 'st37ay',
                name: 'API Changelog & Consumer-Driven Contract Testing',
              },
            ],
          },
        ],
      },
      {
        id: 's4',
        name: 'Security & Reliability',
        description: 'Protect, harden, and make backend services resilient.',
        topics: [
          {
            id: 't9g',
            name: 'Backend Security',
            description:
              'OWASP Top 10, helmet.js, rate limiting, CSRF/XSS prevention, security headers, dependency auditing.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'OWASP Top 10',
                url: 'https://owasp.org/www-project-top-ten/',
                type: 'documentation',
              },
              { title: 'Node.js Security Checklist', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st37t',
                name: 'OWASP Top 10 (injection, broken auth, XSS, SSRF)',
              },
              {
                id: 'st37u',
                name: 'Security Headers (CSP, HSTS, X-Frame-Options)',
              },
              {
                id: 'st37v',
                name: 'Rate Limiting (token bucket, sliding window, IP-based)',
              },
              {
                id: 'st37w',
                name: 'Dependency Auditing (npm audit, Snyk, Dependabot)',
              },
              {
                id: 'st37az',
                name: 'CSRF Prevention (tokens, SameSite cookies)',
              },
              { id: 'st37ba', name: 'Helmet.js & Express security middleware' },
              {
                id: 'st37bb',
                name: 'Brute Force Protection (account lockout, captcha)',
              },
              {
                id: 'st37bc',
                name: 'Server-Side Request Forgery (SSRF) prevention',
              },
              {
                id: 'st37bd',
                name: 'Content Security Policy (CSP) configuration',
              },
            ],
          },
          {
            id: 't9h',
            name: 'Testing Backend Services',
            description:
              'Unit testing, integration testing, contract testing, load testing, test containers, mocking strategies.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Testing Node.js Apps', type: 'article' },
              { title: 'Jest & Supertest Guide', type: 'course' },
              {
                title: 'Load Testing with k6',
                url: 'https://k6.io/docs/',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st37x',
                name: 'Unit Testing (Jest, Vitest, test doubles, stubs)',
              },
              {
                id: 'st37y',
                name: 'Integration Testing (Supertest, database test fixtures)',
              },
              {
                id: 'st37z',
                name: 'Contract Testing (Pact, consumer-driven contracts)',
              },
              {
                id: 'st38a',
                name: 'Load Testing (k6, Artillery, stress testing patterns)',
              },
              {
                id: 'st38ab',
                name: 'Test Containers (Docker-based test databases)',
              },
              {
                id: 'st38ac',
                name: 'Mocking Strategies (dependency injection, test fakes)',
              },
              {
                id: 'st38ad',
                name: 'API Testing (Postman collections, Newman CI)',
              },
              {
                id: 'st38ae',
                name: 'Code Coverage (Istanbul/nyc, branch coverage goals)',
              },
              {
                id: 'st38af',
                name: 'Chaos Engineering (fault injection, resilience testing)',
              },
            ],
          },
          {
            id: 't9i',
            name: 'Encryption & Data Protection',
            description:
              'Encryption at rest and in transit, TLS certificates, secrets management, GDPR compliance, data masking.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Encryption Best Practices', type: 'article' },
              { title: 'TLS Certificate Management', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st38b',
                name: 'Encryption at Rest (AES-256, column-level encryption)',
              },
              {
                id: 'st38c',
                name: "TLS/SSL (certificate chains, Let's Encrypt, mTLS)",
              },
              {
                id: 'st38d',
                name: 'Secrets Management (Vault, AWS Secrets Manager, .env)',
              },
              {
                id: 'st38e',
                name: 'GDPR Compliance (data minimization, right to erasure)',
              },
              { id: 'st38ag', name: 'Data Masking & Anonymization techniques' },
              {
                id: 'st38ah',
                name: 'Key Rotation & Certificate Renewal automation',
              },
              {
                id: 'st38ai',
                name: 'Hashing vs Encryption (when to use which)',
              },
              { id: 'st38aj', name: 'PII Detection & Classification' },
            ],
          },
        ],
      },
      {
        id: 's5',
        name: 'Infrastructure & DevOps',
        description: 'Deploy, monitor, and scale backend services.',
        topics: [
          {
            id: 't10',
            name: 'Docker & Containers',
            description:
              'Containerization, Dockerfile, docker-compose, multi-stage builds, container orchestration.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Docker Official Docs',
                url: 'https://docs.docker.com',
                type: 'documentation',
              },
              { title: 'Docker in Practice', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st38',
                name: 'Dockerfile (layers, caching, .dockerignore)',
              },
              {
                id: 'st39',
                name: 'Docker Compose (services, networks, volumes, depends_on)',
              },
              {
                id: 'st40',
                name: 'Multi-stage Builds (reducing image size, security)',
              },
              {
                id: 'st40x',
                name: 'Container Networking (bridge, host, overlay)',
              },
              { id: 'st40y', name: 'Volume Management (named, bind, tmpfs)' },
              {
                id: 'st40z',
                name: 'Image Security Scanning (Trivy, Snyk Container)',
              },
              {
                id: 'st40aa',
                name: 'Container Registries (Docker Hub, ECR, GCR)',
              },
              { id: 'st40ab', name: 'Health Checks & Restart Policies' },
              { id: 'st40ac', name: 'Docker Debugging (exec, logs, inspect)' },
            ],
          },
          {
            id: 't10b',
            name: 'Kubernetes & Orchestration',
            description:
              'Pods, deployments, services, ingress, Helm charts, horizontal pod autoscaling, namespaces.',
            difficulty: 'advanced',
            estimatedMinutes: 180,
            resources: [
              {
                title: 'Kubernetes Docs',
                url: 'https://kubernetes.io/docs/',
                type: 'documentation',
              },
              { title: 'Kubernetes the Hard Way', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st40b',
                name: 'Pods & Deployments (replicas, rollouts, rollbacks)',
              },
              {
                id: 'st40c',
                name: 'Services & Ingress (ClusterIP, NodePort, LoadBalancer)',
              },
              {
                id: 'st40d',
                name: 'Helm Charts (templates, values, chart repositories)',
              },
              {
                id: 'st40e',
                name: 'Horizontal Pod Autoscaling (CPU, memory, custom metrics)',
              },
              { id: 'st40ad', name: 'ConfigMaps & Secrets management' },
              { id: 'st40ae', name: 'Namespaces, RBAC & Resource Quotas' },
              { id: 'st40af', name: 'Persistent Volumes & Storage Classes' },
              { id: 'st40ag', name: 'Jobs, CronJobs & DaemonSets' },
              { id: 'st40ah', name: 'Liveness, Readiness & Startup Probes' },
              {
                id: 'st40ai',
                name: 'kubectl debugging (describe, logs, port-forward)',
              },
            ],
          },
          {
            id: 't11',
            name: 'CI/CD Pipelines',
            description:
              'GitHub Actions, Jenkins, automated testing, deployment workflows, rollback strategies.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'GitHub Actions Docs',
                url: 'https://docs.github.com/en/actions',
                type: 'documentation',
              },
              { title: 'CI/CD Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st41',
                name: 'GitHub Actions (workflows, jobs, secrets, matrix builds)',
              },
              {
                id: 'st42',
                name: 'Automated Testing in CI (parallelization, caching)',
              },
              {
                id: 'st43',
                name: 'Deployment Strategies (blue-green, canary, rolling)',
              },
              {
                id: 'st43b',
                name: 'Rollback Strategies & Automated Rollback triggers',
              },
              {
                id: 'st43c',
                name: 'GitOps (ArgoCD, Flux, declarative deployments)',
              },
              { id: 'st43d', name: 'Branch Protection & Code Review gates' },
              {
                id: 'st43e',
                name: 'Artifact Management & Container Image tagging',
              },
              { id: 'st43f', name: 'Feature Flags & Progressive Delivery' },
            ],
          },
          {
            id: 't12',
            name: 'Message Queues & Event-Driven',
            description:
              'RabbitMQ, Kafka, SQS — async communication, event sourcing, CQRS patterns.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Kafka Fundamentals', type: 'course' },
              { title: 'Event-Driven Architecture', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st44',
                name: 'RabbitMQ (exchanges, queues, routing keys, DLQ)',
              },
              {
                id: 'st45',
                name: 'Apache Kafka (topics, partitions, consumer groups, offsets)',
              },
              {
                id: 'st46',
                name: 'Event Sourcing (event store, projections, snapshots)',
              },
              {
                id: 'st47',
                name: 'CQRS (command/query separation, read models)',
              },
              { id: 'st47b', name: 'AWS SQS/SNS (standard vs FIFO, fan-out)' },
              { id: 'st47c', name: 'Dead Letter Queues & Retry strategies' },
              {
                id: 'st47d',
                name: 'Idempotent Consumers & Exactly-Once Processing',
              },
              { id: 'st47e', name: 'Event Schema Evolution & Schema Registry' },
              {
                id: 'st47f',
                name: 'Outbox Pattern for reliable event publishing',
              },
            ],
          },
          {
            id: 't13',
            name: 'Caching & Performance',
            description:
              'Redis caching, CDN, HTTP cache headers, cache invalidation, performance monitoring.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Redis Documentation',
                url: 'https://redis.io/docs',
                type: 'documentation',
              },
              { title: 'Caching Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st48',
                name: 'Redis Caching (TTL, eviction policies, cache-aside)',
              },
              {
                id: 'st49',
                name: 'CDN (edge caching, cache purging, origin shield)',
              },
              {
                id: 'st50',
                name: 'Cache Invalidation (write-through, write-behind, TTL)',
              },
              {
                id: 'st50b',
                name: 'HTTP Caching (Cache-Control, ETag, conditional requests)',
              },
              {
                id: 'st50c',
                name: 'Application-Level Caching (in-memory, LRU, memoization)',
              },
              {
                id: 'st50d',
                name: 'Cache Stampede Prevention (locking, early expiration)',
              },
              {
                id: 'st50e',
                name: 'Database Query Caching & Materialized Views',
              },
              {
                id: 'st50f',
                name: 'Response Compression (gzip, Brotli, zstd)',
              },
            ],
          },
          {
            id: 't14',
            name: 'Monitoring & Observability',
            description:
              'Logging, metrics, tracing, alerting, Prometheus, Grafana, ELK stack.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Observability Guide', type: 'article' },
              { title: 'Prometheus + Grafana Tutorial', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st51',
                name: 'Structured Logging (JSON, log levels, correlation IDs)',
              },
              {
                id: 'st52',
                name: 'Metrics (Prometheus, counters, gauges, histograms)',
              },
              {
                id: 'st53',
                name: 'Distributed Tracing (OpenTelemetry, Jaeger, spans)',
              },
              {
                id: 'st53x',
                name: 'Grafana Dashboards (panels, variables, alerting)',
              },
              {
                id: 'st53y',
                name: 'ELK Stack (Elasticsearch, Logstash, Kibana)',
              },
              {
                id: 'st53z',
                name: 'Alerting Rules (PagerDuty, OpsGenie, escalation)',
              },
              { id: 'st53aa', name: 'SLIs, SLOs & Error Budgets' },
              { id: 'st53ab', name: 'APM Tools (Datadog, New Relic, Sentry)' },
            ],
          },
          {
            id: 't14b',
            name: 'Cloud Platforms & Serverless',
            description:
              'AWS/GCP/Azure fundamentals, Lambda/Cloud Functions, S3, IAM, infrastructure as code with Terraform.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              {
                title: 'AWS Documentation',
                url: 'https://docs.aws.amazon.com',
                type: 'documentation',
              },
              {
                title: 'Terraform Getting Started',
                url: 'https://developer.hashicorp.com/terraform',
                type: 'documentation',
              },
              { title: 'Serverless Framework Guide', type: 'course' },
            ],
            subtopics: [
              {
                id: 'st53b',
                name: 'AWS Fundamentals (EC2, VPC, RDS, S3, SQS)',
              },
              {
                id: 'st53c',
                name: 'Serverless Functions (Lambda, Cloud Functions, cold starts)',
              },
              {
                id: 'st53d',
                name: 'Infrastructure as Code (Terraform, Pulumi, CloudFormation)',
              },
              {
                id: 'st53e',
                name: 'IAM & Permissions (policies, roles, least privilege)',
              },
              {
                id: 'st53ac',
                name: 'GCP & Azure overview (equivalent services comparison)',
              },
              {
                id: 'st53ad',
                name: 'Edge Computing (Cloudflare Workers, Lambda@Edge)',
              },
              {
                id: 'st53ae',
                name: 'Managed Services (RDS, ElastiCache, managed Kafka)',
              },
              {
                id: 'st53af',
                name: 'Cost Optimization (reserved instances, spot, right-sizing)',
              },
              {
                id: 'st53ag',
                name: 'Multi-Region Deployment & Disaster Recovery',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'System Design',
    slug: 'system-design',
    description:
      'Learn to design large-scale distributed systems — from fundamentals to real-world architecture case studies.',
    icon: 'Network',
    color: 'rose',
    isPublished: true,
    sections: [
      {
        id: 's1',
        name: 'Fundamentals',
        description: 'Core distributed systems concepts and trade-offs.',
        topics: [
          {
            id: 't1',
            name: 'Scalability Patterns',
            description:
              'Horizontal vs vertical scaling, load balancing algorithms, auto-scaling, capacity planning.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'System Design Primer',
                url: 'https://github.com/donnemartin/system-design-primer',
                type: 'article',
              },
              { title: 'Scalability for Dummies', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st1',
                name: 'Horizontal Scaling (stateless services, shared-nothing)',
              },
              { id: 'st2', name: 'Vertical Scaling (CPU, RAM, SSD limits)' },
              {
                id: 'st3',
                name: 'Load Balancing (round-robin, least connections, weighted)',
              },
              {
                id: 'st4',
                name: 'Auto-scaling (metric-based, predictive, scheduled)',
              },
              { id: 'st4b', name: 'Capacity Planning & Forecasting' },
              { id: 'st4c', name: 'Elasticity vs Scalability' },
              {
                id: 'st4d',
                name: 'Database Scaling (read replicas, connection pooling)',
              },
              { id: 'st4e', name: 'Scaling Bottleneck Identification' },
            ],
          },
          {
            id: 't2',
            name: 'CAP Theorem & Consistency Models',
            description:
              'CAP trade-offs, eventual consistency, strong consistency, linearizability, causal consistency.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'CAP Theorem Explained', type: 'article' },
              { title: 'Consistency Models Comparison', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st5',
                name: 'CAP Theorem (proof & practical implications)',
              },
              {
                id: 'st6',
                name: 'Eventual Consistency (convergence, anti-entropy)',
              },
              {
                id: 'st7',
                name: 'Strong Consistency (linearizability guarantees)',
              },
              {
                id: 'st7b',
                name: 'Causal Consistency (happens-before, causal ordering)',
              },
              { id: 'st7c', name: 'Read-your-writes Consistency' },
              { id: 'st7d', name: 'Session Consistency & Monotonic Reads' },
              {
                id: 'st7e',
                name: 'PACELC Theorem (latency vs consistency extension)',
              },
              { id: 'st7f', name: 'Tunable Consistency (quorum reads/writes)' },
            ],
          },
          {
            id: 't3',
            name: 'Database Partitioning',
            description:
              'Sharding strategies, consistent hashing, replication, leader-follower, multi-leader patterns.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Sharding Patterns', type: 'article' },
              { title: 'Consistent Hashing Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st8',
                name: 'Hash Partitioning (hash function selection, hotspots)',
              },
              {
                id: 'st9',
                name: 'Range Partitioning (key range splits, rebalancing)',
              },
              {
                id: 'st10',
                name: 'Consistent Hashing (virtual nodes, ring topology)',
              },
              { id: 'st11', name: 'Leader-Follower Replication' },
              {
                id: 'st11b',
                name: 'Multi-Leader Replication (conflict resolution)',
              },
              {
                id: 'st11c',
                name: 'Leaderless Replication (Dynamo-style quorums)',
              },
              { id: 'st11d', name: 'Cross-Shard Queries & Joins' },
              { id: 'st11e', name: 'Shard Rebalancing Strategies' },
              {
                id: 'st11f',
                name: 'Directory-Based vs Hash-Based Partitioning',
              },
            ],
          },
          {
            id: 't4',
            name: 'Networking Fundamentals',
            description:
              'TCP/UDP, DNS resolution, CDN, HTTP/2, WebSockets, gRPC, connection pooling.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              { title: 'Networking for System Design', type: 'article' },
              { title: 'gRPC vs REST', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st12',
                name: 'TCP vs UDP (handshake, reliability, use cases)',
              },
              {
                id: 'st13',
                name: 'DNS (resolution, TTL, DNS load balancing, GeoDNS)',
              },
              {
                id: 'st14',
                name: 'WebSockets (full-duplex, heartbeats, reconnection)',
              },
              { id: 'st15', name: 'gRPC (protobuf, streaming, bidirectional)' },
              {
                id: 'st15x',
                name: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (multiplexing, QUIC)',
              },
              {
                id: 'st15y',
                name: 'CDN (edge caching, cache invalidation, pull vs push)',
              },
              { id: 'st15z', name: 'Connection Pooling & Keep-Alive' },
              { id: 'st15aa', name: 'TLS/SSL Termination & mTLS' },
            ],
          },
          {
            id: 't4b',
            name: 'Latency & Throughput',
            description:
              "P99 latency, throughput measurement, Amdahl's law, latency numbers every programmer should know.",
            difficulty: 'beginner',
            estimatedMinutes: 60,
            resources: [
              {
                title: 'Latency Numbers Every Programmer Should Know',
                type: 'article',
              },
              { title: 'Performance Metrics Guide', type: 'video' },
            ],
            subtopics: [
              { id: 'st15b', name: 'P50/P95/P99 Latency Percentiles' },
              { id: 'st15c', name: 'Throughput (RPS, TPS, bandwidth)' },
              { id: 'st15d', name: "Amdahl's Law & Universal Scalability Law" },
              {
                id: 'st15e',
                name: 'Bottleneck Analysis (CPU, I/O, network, memory)',
              },
              {
                id: 'st15e2',
                name: 'Latency Numbers (L1 cache to cross-continent)',
              },
              { id: 'st15e3', name: 'Tail Latency Amplification' },
              {
                id: 'st15e4',
                name: "Little's Law (concurrency = throughput × latency)",
              },
            ],
          },
          {
            id: 't4c',
            name: 'Back-of-the-Envelope Estimation',
            description:
              'Capacity estimation, QPS calculations, storage estimates, bandwidth planning, cost modeling.',
            difficulty: 'beginner',
            estimatedMinutes: 60,
            resources: [
              { title: 'Estimation Techniques', type: 'article' },
              { title: 'Capacity Planning Examples', type: 'video' },
            ],
            subtopics: [
              { id: 'st15f', name: 'QPS & DAU Estimation' },
              {
                id: 'st15g',
                name: 'Storage Calculations (per-record × growth)',
              },
              { id: 'st15h', name: 'Bandwidth Planning (peak vs average)' },
              {
                id: 'st15h2',
                name: 'Memory Estimation (cache hit ratios, working set)',
              },
              {
                id: 'st15h3',
                name: 'Cost Modeling (compute, storage, egress pricing)',
              },
              {
                id: 'st15h4',
                name: 'Powers of Two (KB, MB, GB, TB quick math)',
              },
              { id: 'st15h5', name: 'Read-to-Write Ratios & Traffic Patterns' },
            ],
          },
        ],
      },
      {
        id: 's2',
        name: 'Core Components',
        description: 'Building blocks used in every large-scale system.',
        topics: [
          {
            id: 't5',
            name: 'API Gateway & Rate Limiting',
            description:
              'Reverse proxy, request routing, throttling, circuit breaker, API management.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'API Gateway Design Patterns', type: 'article' },
              { title: 'Rate Limiting Algorithms', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st16',
                name: 'Reverse Proxy (routing, SSL termination, compression)',
              },
              { id: 'st17', name: 'Token Bucket Algorithm' },
              { id: 'st17b', name: 'Sliding Window Log & Counter' },
              { id: 'st17c', name: 'Fixed Window Counter' },
              { id: 'st17d', name: 'Leaky Bucket Algorithm' },
              {
                id: 'st18',
                name: 'Circuit Breaker (open/half-open/closed states)',
              },
              {
                id: 'st19',
                name: 'API Versioning (URL, header, content negotiation)',
              },
              {
                id: 'st19b',
                name: 'Request Authentication & Authorization at Gateway',
              },
              {
                id: 'st19c',
                name: 'API Composition & Backend-for-Frontend (BFF)',
              },
              {
                id: 'st19d',
                name: 'Distributed Rate Limiting (Redis-based, sliding window)',
              },
            ],
          },
          {
            id: 't6',
            name: 'Caching Architectures',
            description:
              'Write-through, write-back, write-around, cache eviction, distributed caching, CDN.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Caching Strategies Deep Dive', type: 'article' },
              { title: 'Redis Architecture', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st20',
                name: 'Write-Through, Write-Back, Write-Around Policies',
              },
              { id: 'st20b', name: 'Cache-Aside (Lazy Loading) Pattern' },
              { id: 'st21', name: 'Eviction Strategies (LRU, LFU, TTL, FIFO)' },
              {
                id: 'st22',
                name: 'Distributed Cache (Redis Cluster, Memcached)',
              },
              {
                id: 'st23',
                name: 'CDN Caching (edge, origin shield, cache keys)',
              },
              {
                id: 'st23b',
                name: 'Cache Invalidation Strategies (event-driven, TTL)',
              },
              {
                id: 'st23c',
                name: 'Cache Stampede / Thundering Herd Prevention',
              },
              {
                id: 'st23d',
                name: 'Multi-Level Caching (L1 local, L2 distributed)',
              },
              { id: 'st23e', name: 'Cache Warming & Preloading' },
              { id: 'st23f', name: 'Cache Consistency in Distributed Systems' },
            ],
          },
          {
            id: 't7',
            name: 'Message Queues & Streaming',
            description:
              'Async communication, event sourcing, CQRS, exactly-once delivery, ordering guarantees.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Event-Driven Architecture Guide', type: 'article' },
              { title: 'Kafka vs RabbitMQ', type: 'video' },
            ],
            subtopics: [
              { id: 'st24', name: 'Message Queues (point-to-point, pub/sub)' },
              {
                id: 'st24b',
                name: 'Kafka (partitions, consumer groups, offsets)',
              },
              {
                id: 'st24c',
                name: 'RabbitMQ (exchanges, bindings, acknowledgments)',
              },
              {
                id: 'st25',
                name: 'Event Sourcing (event store, replay, snapshots)',
              },
              {
                id: 'st26',
                name: 'CQRS (command/query separation, read models)',
              },
              {
                id: 'st27',
                name: 'Stream Processing (Flink, Spark Streaming, windowing)',
              },
              {
                id: 'st27b',
                name: 'Delivery Guarantees (at-most-once, at-least-once, exactly-once)',
              },
              { id: 'st27c', name: 'Dead Letter Queues & Retry Policies' },
              { id: 'st27d', name: 'Message Ordering & Partitioning Keys' },
              { id: 'st27e', name: 'Backpressure Handling' },
              {
                id: 'st27f',
                name: 'Schema Evolution (Avro, Protobuf, schema registry)',
              },
            ],
          },
          {
            id: 't8',
            name: 'Search & Indexing',
            description:
              'Elasticsearch, inverted indexes, full-text search, relevance scoring, search infrastructure.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Elasticsearch Guide',
                url: 'https://www.elastic.co/guide',
                type: 'documentation',
              },
              { title: 'Search System Design', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st28',
                name: 'Inverted Index (tokenization, posting lists)',
              },
              {
                id: 'st29',
                name: 'Full-text Search (analyzers, stemming, stop words)',
              },
              { id: 'st30', name: 'Relevance Scoring (TF-IDF, BM25)' },
              {
                id: 'st30b',
                name: 'Search Ranking (learning to rank, click models)',
              },
              {
                id: 'st30c',
                name: 'Typeahead / Autocomplete (trie, prefix matching)',
              },
              { id: 'st30d', name: 'Faceted Search & Aggregations' },
              {
                id: 'st30e',
                name: 'Geospatial Search (geohash, R-tree, quadtree)',
              },
              {
                id: 'st30f',
                name: 'Vector Search & Semantic Similarity (ANN, HNSW)',
              },
              { id: 'st30g', name: 'Index Sharding & Replication' },
            ],
          },
          {
            id: 't9',
            name: 'Storage Systems',
            description:
              'Object storage, block storage, file systems, blob storage, data lakes, cold vs hot storage.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Storage System Comparison', type: 'article' },
              { title: 'S3 Architecture', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st31',
                name: 'Object Storage (S3, immutability, metadata)',
              },
              { id: 'st32', name: 'Block Storage (EBS, SAN, IOPS)' },
              { id: 'st32b', name: 'File Systems (NFS, HDFS, distributed FS)' },
              {
                id: 'st33',
                name: 'Data Lakes (schema-on-read, Parquet, Delta Lake)',
              },
              { id: 'st33x', name: 'Hot / Warm / Cold Storage Tiers' },
              {
                id: 'st33y',
                name: 'LSM Trees vs B-Trees (write vs read optimization)',
              },
              { id: 'st33z', name: 'Write-Ahead Log (WAL) & Journaling' },
              {
                id: 'st33a2',
                name: 'Compaction Strategies (leveled, size-tiered)',
              },
              { id: 'st33a3', name: 'Column-Oriented vs Row-Oriented Storage' },
            ],
          },
          {
            id: 't9b',
            name: 'Load Balancers',
            description:
              'L4 vs L7 load balancing, algorithms (round-robin, least connections, IP hash), health checks, sticky sessions.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Load Balancing Algorithms', type: 'article' },
              {
                title: 'NGINX Load Balancing',
                url: 'https://docs.nginx.com/nginx/admin-guide/load-balancer/',
                type: 'documentation',
              },
            ],
            subtopics: [
              {
                id: 'st33b',
                name: 'L4 (transport) vs L7 (application) Load Balancing',
              },
              {
                id: 'st33c',
                name: 'Algorithms (round-robin, weighted, least connections)',
              },
              {
                id: 'st33d',
                name: 'Health Checks (active, passive, custom probes)',
              },
              { id: 'st33e', name: 'Sticky Sessions (cookie-based, IP hash)' },
              {
                id: 'st33e2',
                name: 'Global Server Load Balancing (GSLB, anycast)',
              },
              {
                id: 'st33e3',
                name: 'Service Discovery Integration (Consul, Eureka)',
              },
              { id: 'st33e4', name: 'Connection Draining & Graceful Shutdown' },
              { id: 'st33e5', name: 'Hardware vs Software Load Balancers' },
            ],
          },
          {
            id: 't9c',
            name: 'Databases & Data Models',
            description:
              'SQL vs NoSQL, time-series, graph databases, choosing the right database for the use case.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Database Internals', type: 'book' },
              { title: 'SQL vs NoSQL Comparison', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st33f',
                name: 'Relational Databases (ACID, normalization, joins)',
              },
              {
                id: 'st33g',
                name: 'Document Stores (MongoDB, schema flexibility)',
              },
              {
                id: 'st33h',
                name: 'Key-Value Stores (Redis, DynamoDB, access patterns)',
              },
              {
                id: 'st33i',
                name: 'Wide-Column Stores (Cassandra, HBase, time-series)',
              },
              {
                id: 'st33j',
                name: 'Graph Databases (Neo4j, traversal queries)',
              },
              {
                id: 'st33k',
                name: 'Time-Series Databases (InfluxDB, TimescaleDB)',
              },
              {
                id: 'st33l',
                name: 'NewSQL (CockroachDB, Spanner, distributed ACID)',
              },
              {
                id: 'st33m',
                name: 'Polyglot Persistence (choosing DB per service)',
              },
            ],
          },
        ],
      },
      {
        id: 's3',
        name: 'Design Patterns',
        description: 'Common distributed system design patterns.',
        topics: [
          {
            id: 't10',
            name: 'Microservices Architecture',
            description:
              'Service decomposition, inter-service communication, service mesh, sidecar pattern.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Microservices Patterns', type: 'book' },
              { title: 'Service Mesh Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st34',
                name: 'Service Decomposition (bounded contexts, DDD)',
              },
              {
                id: 'st35',
                name: 'Service Mesh (Istio, Linkerd, data plane/control plane)',
              },
              { id: 'st36', name: 'Sidecar Pattern (proxy, logging, config)' },
              {
                id: 'st36b',
                name: 'Inter-Service Communication (sync REST, async events)',
              },
              { id: 'st36c', name: 'API Gateway vs Service Mesh' },
              {
                id: 'st36d',
                name: 'Strangler Fig Pattern (monolith to microservices)',
              },
              {
                id: 'st36e',
                name: 'Database per Service (data ownership, boundaries)',
              },
              { id: 'st36f', name: 'Shared Libraries vs Shared Services' },
              { id: 'st36g', name: 'Service Registry & Discovery' },
            ],
          },
          {
            id: 't11',
            name: 'Distributed Consensus',
            description:
              'Raft, Paxos, leader election, distributed locks, coordination services (ZooKeeper).',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Raft Consensus Explained', type: 'article' },
              { title: 'Distributed Locks Deep Dive', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st37',
                name: 'Raft (leader election, log replication, safety)',
              },
              { id: 'st37b', name: 'Paxos (proposers, acceptors, learners)' },
              {
                id: 'st38',
                name: 'Leader Election (bully algorithm, ring algorithm)',
              },
              {
                id: 'st39',
                name: 'Distributed Locks (Redlock, fencing tokens)',
              },
              {
                id: 'st39x',
                name: 'ZooKeeper (znodes, watches, ephemeral nodes)',
              },
              { id: 'st39x2', name: 'etcd (key-value, watch, lease)' },
              { id: 'st39x3', name: 'Split-Brain Problem & Prevention' },
              { id: 'st39x4', name: 'Quorum-Based Voting' },
            ],
          },
          {
            id: 't11b',
            name: 'Data Replication & Consistency',
            description:
              'Single-leader, multi-leader, leaderless replication, conflict resolution, vector clocks, CRDTs.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              {
                title: 'Designing Data-Intensive Applications Ch.5',
                type: 'book',
              },
              { title: 'CRDTs Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st39b',
                name: 'Single-Leader Replication (sync, async, semi-sync)',
              },
              {
                id: 'st39c',
                name: 'Conflict Resolution (last-write-wins, merge functions)',
              },
              { id: 'st39d', name: 'Vector Clocks & Lamport Timestamps' },
              { id: 'st39e', name: 'CRDTs (G-Counter, LWW-Register, OR-Set)' },
              {
                id: 'st39e2',
                name: 'Multi-Leader Replication (topology, conflict detection)',
              },
              {
                id: 'st39e3',
                name: 'Leaderless Replication (read repair, anti-entropy)',
              },
              {
                id: 'st39e4',
                name: 'Gossip Protocol (rumor spreading, convergence)',
              },
              { id: 'st39e5', name: 'Merkle Trees for Anti-Entropy' },
            ],
          },
          {
            id: 't11c',
            name: 'Distributed Transactions',
            description:
              'Two-phase commit, Saga pattern, compensating transactions, eventual consistency patterns, idempotency.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Saga Pattern Guide', type: 'article' },
              { title: 'Two-Phase Commit Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st39f',
                name: 'Two-Phase Commit (2PC) (coordinator, blocking)',
              },
              { id: 'st39f2', name: 'Three-Phase Commit (3PC) (non-blocking)' },
              {
                id: 'st39g',
                name: 'Saga Pattern (choreography vs orchestration)',
              },
              {
                id: 'st39h',
                name: 'Compensating Transactions (rollback logic)',
              },
              { id: 'st39i', name: 'Idempotency Keys & Deduplication' },
              {
                id: 'st39i2',
                name: 'Outbox Pattern (reliable event publishing)',
              },
              { id: 'st39i3', name: 'Change Data Capture (CDC, Debezium)' },
              { id: 'st39i4', name: 'Transactional Outbox vs Dual Writes' },
            ],
          },
          {
            id: 't11d',
            name: 'Fault Tolerance & Resilience',
            description:
              'Failover strategies, redundancy, chaos engineering, graceful degradation, bulkhead pattern.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Chaos Engineering Principles', type: 'article' },
              { title: 'Netflix Resilience Patterns', type: 'video' },
            ],
            subtopics: [
              { id: 'st39j', name: 'Failover (active-passive, active-active)' },
              {
                id: 'st39k',
                name: 'Chaos Engineering (fault injection, GameDay)',
              },
              {
                id: 'st39l',
                name: 'Graceful Degradation (feature flags, fallbacks)',
              },
              {
                id: 'st39m',
                name: 'Bulkhead Pattern (isolation, thread pools)',
              },
              {
                id: 'st39m2',
                name: 'Retry Strategies (exponential backoff, jitter)',
              },
              { id: 'st39m3', name: 'Timeout Budgets & Deadline Propagation' },
              { id: 'st39m4', name: 'Redundancy (N+1, N+2, geographic)' },
              {
                id: 'st39m5',
                name: 'Disaster Recovery (RPO, RTO, backup strategies)',
              },
              { id: 'st39m6', name: 'Health Checking & Self-Healing Systems' },
            ],
          },
        ],
      },
      {
        id: 's5',
        name: 'Observability & Operations',
        description:
          'Monitor, debug, and operate distributed systems at scale.',
        topics: [
          {
            id: 't11e',
            name: 'Monitoring & Alerting',
            description:
              'Prometheus, Grafana, metrics collection, SLIs/SLOs/SLAs, alerting strategies, dashboards.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'Google SRE Book — Monitoring',
                url: 'https://sre.google/sre-book/monitoring-distributed-systems/',
                type: 'documentation',
              },
              { title: 'Prometheus Best Practices', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st39n',
                name: 'SLIs/SLOs/SLAs (definition, error budgets)',
              },
              { id: 'st39o', name: 'Metrics Collection (RED, USE methods)' },
              {
                id: 'st39p',
                name: 'Alerting Strategies (severity, routing, on-call)',
              },
              {
                id: 'st39p2',
                name: 'Prometheus (PromQL, exporters, scraping)',
              },
              { id: 'st39p3', name: 'Grafana (dashboards, panels, variables)' },
              {
                id: 'st39p4',
                name: 'Golden Signals (latency, traffic, errors, saturation)',
              },
              { id: 'st39p5', name: 'Anomaly Detection & Adaptive Thresholds' },
              { id: 'st39p6', name: 'On-Call Best Practices & Runbooks' },
            ],
          },
          {
            id: 't11f',
            name: 'Distributed Tracing & Logging',
            description:
              'OpenTelemetry, Jaeger, structured logging, correlation IDs, log aggregation, ELK stack.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              {
                title: 'OpenTelemetry Docs',
                url: 'https://opentelemetry.io/docs/',
                type: 'documentation',
              },
              { title: 'Distributed Tracing Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st39q',
                name: 'OpenTelemetry (traces, metrics, logs unified)',
              },
              { id: 'st39r', name: 'Correlation IDs & Context Propagation' },
              {
                id: 'st39s',
                name: 'Log Aggregation (ELK stack, Loki, Fluentd)',
              },
              {
                id: 'st39s2',
                name: 'Structured Logging (JSON, key-value pairs)',
              },
              {
                id: 'st39s3',
                name: 'Distributed Tracing (spans, traces, sampling)',
              },
              { id: 'st39s4', name: 'Jaeger & Zipkin (trace visualization)' },
              { id: 'st39s5', name: 'Log Levels & Retention Policies' },
              {
                id: 'st39s6',
                name: 'Debugging Production Issues (trace-to-log correlation)',
              },
            ],
          },
          {
            id: 't11g',
            name: 'Deployment Strategies',
            description:
              'Blue-green deployments, canary releases, rolling updates, feature flags, A/B testing infrastructure.',
            difficulty: 'intermediate',
            estimatedMinutes: 90,
            resources: [
              { title: 'Deployment Strategies Compared', type: 'article' },
              { title: 'Feature Flags Best Practices', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st39t',
                name: 'Blue-Green Deployments (traffic switching)',
              },
              {
                id: 'st39u',
                name: 'Canary Releases (percentage rollout, metrics)',
              },
              {
                id: 'st39v',
                name: 'Feature Flags (LaunchDarkly, gradual rollout)',
              },
              {
                id: 'st39w',
                name: 'A/B Testing Infrastructure (experiment framework)',
              },
              {
                id: 'st39w2',
                name: 'Rolling Updates (zero-downtime, rollback)',
              },
              { id: 'st39w3', name: 'Shadow Traffic / Dark Launching' },
              {
                id: 'st39w4',
                name: 'Database Migration Strategies (expand/contract)',
              },
              { id: 'st39w5', name: 'GitOps & Infrastructure as Code' },
            ],
          },
          {
            id: 't11h',
            name: 'Incident Management & Postmortems',
            description:
              'Incident response, blameless postmortems, root cause analysis, toil reduction.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'Google SRE Book — Postmortems', type: 'documentation' },
              { title: 'Incident Management Guide', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st39w6',
                name: 'Incident Response Process (detect, triage, mitigate)',
              },
              {
                id: 'st39w7',
                name: 'Blameless Postmortems (timeline, action items)',
              },
              {
                id: 'st39w8',
                name: 'Root Cause Analysis (5 Whys, fishbone diagram)',
              },
              { id: 'st39w9', name: 'Toil Reduction & Automation' },
              { id: 'st39wa', name: 'Error Budgets & Release Velocity' },
              { id: 'st39wb', name: 'Incident Severity Levels & Escalation' },
            ],
          },
        ],
      },
      {
        id: 's4',
        name: 'Case Studies',
        description: 'Real-world system design interview problems.',
        topics: [
          {
            id: 't12',
            name: 'Design URL Shortener',
            description:
              'Hashing, base62 encoding, analytics, redirect handling, custom aliases, TTL.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'URL Shortener Walkthrough', type: 'video' },
              { title: 'TinyURL Design Document', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st40',
                name: 'Hash Function Selection (MD5, SHA-256, collision handling)',
              },
              {
                id: 'st41',
                name: 'Base62 Encoding (ID generation, counter vs random)',
              },
              {
                id: 'st42',
                name: 'Analytics (click tracking, referrer, geo, time-series)',
              },
              { id: 'st42b', name: 'Custom Aliases & Vanity URLs' },
              { id: 'st42c', name: 'TTL & Expiration (cleanup, soft delete)' },
              { id: 'st42d', name: '301 vs 302 Redirect Trade-offs' },
              {
                id: 'st42e',
                name: 'Read-Heavy Optimization (caching, bloom filters)',
              },
            ],
          },
          {
            id: 't13',
            name: 'Design Real-time Chat',
            description:
              'WebSockets, presence system, message storage, read receipts, group chats, E2E encryption.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Real-time Chat Architecture', type: 'article' },
              { title: 'WhatsApp System Design', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st43',
                name: 'WebSocket Protocol (connection management, scaling)',
              },
              {
                id: 'st44',
                name: 'Presence System (online/offline, heartbeats)',
              },
              {
                id: 'st45',
                name: 'Message Storage (per-user vs per-chat, partitioning)',
              },
              {
                id: 'st46',
                name: 'E2E Encryption (Signal Protocol, key exchange)',
              },
              {
                id: 'st46b',
                name: 'Read Receipts & Delivery Status (double-tick)',
              },
              {
                id: 'st46c',
                name: 'Group Chat (fan-out, membership, admin controls)',
              },
              {
                id: 'st46d',
                name: 'Media Sharing (upload, thumbnail, compression)',
              },
              { id: 'st46e', name: 'Push Notifications for Offline Users' },
              { id: 'st46f', name: 'Message Ordering & Synchronization' },
            ],
          },
          {
            id: 't14',
            name: 'Design News Feed',
            description:
              'Fan-out on write vs read, ranking algorithms, pagination, content deduplication.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'News Feed System Design', type: 'article' },
              { title: 'Facebook Feed Architecture', type: 'video' },
            ],
            subtopics: [
              { id: 'st47', name: 'Fan-out on Write vs Fan-out on Read' },
              {
                id: 'st47b',
                name: 'Hybrid Fan-out (celebrities vs regular users)',
              },
              {
                id: 'st48',
                name: 'Ranking Algorithms (EdgeRank, ML-based scoring)',
              },
              { id: 'st49', name: 'Cursor-Based vs Offset Pagination' },
              { id: 'st49b', name: 'Content Deduplication & Filtering' },
              { id: 'st49c', name: 'Feed Caching & Invalidation' },
              {
                id: 'st49d',
                name: 'Real-time Updates (long polling, SSE, WebSocket)',
              },
            ],
          },
          {
            id: 't15',
            name: 'Design Rate Limiter',
            description:
              'Token bucket, sliding window, fixed window, distributed rate limiting across services.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'Rate Limiter Design', type: 'article' },
              { title: 'Rate Limiting Algorithms Compared', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st50',
                name: 'Token Bucket (refill rate, burst capacity)',
              },
              {
                id: 'st51',
                name: 'Sliding Window Log (precise, memory trade-off)',
              },
              {
                id: 'st51b',
                name: 'Sliding Window Counter (approximate, efficient)',
              },
              {
                id: 'st51c',
                name: 'Fixed Window (simple, boundary burst issue)',
              },
              {
                id: 'st52',
                name: 'Distributed Limiting (Redis INCR, Lua scripts)',
              },
              { id: 'st52b', name: 'Rate Limiting by User, IP, API Key' },
              { id: 'st52c', name: 'HTTP 429 & Retry-After Header' },
            ],
          },
          {
            id: 't16',
            name: 'Design Notification System',
            description:
              'Push notifications, email, SMS, in-app notifications, prioritization, batching.',
            difficulty: 'intermediate',
            estimatedMinutes: 60,
            resources: [
              { title: 'Notification System Design', type: 'article' },
              { title: 'Push Notification Architecture', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st53',
                name: 'Push Notifications (APNs, FCM, delivery guarantees)',
              },
              {
                id: 'st54',
                name: 'Email/SMS (third-party providers, templates, throttling)',
              },
              {
                id: 'st55',
                name: 'Prioritization (urgency levels, do-not-disturb)',
              },
              {
                id: 'st55x',
                name: 'In-App Notifications (WebSocket, polling)',
              },
              {
                id: 'st55x2',
                name: 'Batching & Digest (aggregation, frequency capping)',
              },
              { id: 'st55x3', name: 'User Preferences & Opt-out Management' },
              { id: 'st55x4', name: 'Delivery Tracking & Analytics' },
            ],
          },
          {
            id: 't16b',
            name: 'Design Video Streaming Platform',
            description:
              'Video encoding, adaptive bitrate, CDN distribution, upload pipeline, thumbnail generation.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'YouTube Architecture', type: 'article' },
              { title: 'Video Streaming Deep Dive', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st55b',
                name: 'Video Encoding (H.264, VP9, AV1, transcoding pipeline)',
              },
              { id: 'st55c', name: 'Adaptive Bitrate Streaming (HLS, DASH)' },
              {
                id: 'st55d',
                name: 'CDN Distribution (edge caching, origin pull)',
              },
              {
                id: 'st55e',
                name: 'Upload Pipeline (chunked upload, resumable)',
              },
              {
                id: 'st55e2',
                name: 'Thumbnail Generation (keyframe extraction)',
              },
              { id: 'st55e3', name: 'Video Metadata & Search' },
              { id: 'st55e4', name: 'Content Recommendation Engine' },
              {
                id: 'st55e5',
                name: 'Live Streaming (WebRTC, low-latency HLS)',
              },
              { id: 'st55e6', name: 'DRM & Content Protection' },
            ],
          },
          {
            id: 't16c',
            name: 'Design Ride-Sharing Service',
            description:
              'Geospatial indexing, matching algorithms, surge pricing, real-time tracking, ETA computation.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Uber System Design', type: 'article' },
              { title: 'Geospatial Indexing Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st55f',
                name: 'Geospatial Indexing (S2 cells, geohash, quadtree)',
              },
              {
                id: 'st55g',
                name: 'Matching Algorithms (proximity, ETA, driver rating)',
              },
              { id: 'st55h', name: 'Surge Pricing (supply-demand modeling)' },
              {
                id: 'st55i',
                name: 'Real-Time Tracking (location updates, map rendering)',
              },
              {
                id: 'st55i2',
                name: 'ETA Computation (graph algorithms, ML predictions)',
              },
              {
                id: 'st55i3',
                name: 'Trip State Machine (requested → matched → in-progress → complete)',
              },
              { id: 'st55i4', name: 'Payment Processing & Split Fare' },
              { id: 'st55i5', name: 'Driver/Rider Rating System' },
            ],
          },
          {
            id: 't16d',
            name: 'Design Distributed File Storage',
            description:
              'Chunk-based storage, metadata service, consistency, replication factor, garbage collection.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Google File System Paper', type: 'article' },
              { title: 'HDFS Architecture', type: 'video' },
            ],
            subtopics: [
              { id: 'st55j', name: 'Chunking (fixed-size vs content-defined)' },
              {
                id: 'st55k',
                name: 'Metadata Service (namespace, directory tree)',
              },
              {
                id: 'st55l',
                name: 'Replication (replication factor, rack awareness)',
              },
              {
                id: 'st55m',
                name: 'Consistency (write pipeline, lease management)',
              },
              { id: 'st55m2', name: 'Garbage Collection & Orphan Cleanup' },
              {
                id: 'st55m3',
                name: 'Deduplication (content-addressable, hash-based)',
              },
              { id: 'st55m4', name: 'Access Control & Permissions' },
              {
                id: 'st55m5',
                name: 'Erasure Coding vs Replication (storage efficiency)',
              },
            ],
          },
          {
            id: 't16e',
            name: 'Design E-Commerce Platform',
            description:
              'Product catalog, inventory management, checkout flow, payment processing, order fulfillment.',
            difficulty: 'advanced',
            estimatedMinutes: 90,
            resources: [
              { title: 'Amazon Architecture', type: 'article' },
              { title: 'E-Commerce System Design', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st55n',
                name: 'Product Catalog (search, filtering, categories)',
              },
              {
                id: 'st55o',
                name: 'Inventory Management (stock reservation, distributed locks)',
              },
              {
                id: 'st55p',
                name: 'Shopping Cart (session, persistence, merge)',
              },
              {
                id: 'st55q',
                name: 'Checkout & Payment (idempotent charges, PCI compliance)',
              },
              {
                id: 'st55r',
                name: 'Order Fulfillment (state machine, warehouse routing)',
              },
              { id: 'st55s', name: 'Flash Sale / High-Traffic Handling' },
              {
                id: 'st55t',
                name: 'Recommendation Engine (collaborative filtering)',
              },
            ],
          },
          {
            id: 't16f',
            name: 'Design Web Crawler',
            description:
              'URL frontier, politeness, deduplication, distributed crawling, content extraction.',
            difficulty: 'advanced',
            estimatedMinutes: 60,
            resources: [
              { title: 'Web Crawler Design', type: 'article' },
              { title: 'Distributed Crawling', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st55u',
                name: 'URL Frontier (priority queue, politeness)',
              },
              {
                id: 'st55v',
                name: 'URL Deduplication (bloom filter, URL normalization)',
              },
              { id: 'st55w', name: 'robots.txt & Crawl Rate Limiting' },
              {
                id: 'st55xx',
                name: 'Content Extraction & Parsing (DOM, headless browser)',
              },
              {
                id: 'st55yy',
                name: 'Distributed Crawling (partitioning by domain)',
              },
              {
                id: 'st55zz',
                name: 'Trap Detection (infinite loops, spider traps)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Core CS Subjects',
    slug: 'core-subjects',
    description:
      'Strengthen your computer science fundamentals — OS, DBMS, networking, and OOP concepts.',
    icon: 'GraduationCap',
    color: 'cyan',
    isPublished: true,
    sections: [
      {
        id: 's1',
        name: 'Operating Systems',
        description:
          'Understand how modern operating systems manage hardware and software resources.',
        topics: [
          {
            id: 't1',
            name: 'Process Management',
            description:
              'Processes vs threads, scheduling algorithms, context switching, IPC mechanisms.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: 'OS Concepts by Silberschatz', type: 'book' },
              { title: 'Process Scheduling Explained', type: 'video' },
            ],
            subtopics: [
              { id: 'st1', name: 'Process vs Thread (kernel vs user threads)' },
              {
                id: 'st2',
                name: 'Scheduling Algorithms (FCFS, SJF, SRTF, Round Robin)',
              },
              {
                id: 'st3',
                name: 'Context Switching (cost, register save/restore)',
              },
              {
                id: 'st4',
                name: 'Process States (new, ready, running, waiting, terminated)',
              },
              {
                id: 'cs-st1',
                name: 'Priority Scheduling & Starvation (aging)',
              },
              { id: 'cs-st2', name: 'Multilevel Feedback Queue Scheduling' },
              {
                id: 'cs-st3',
                name: 'Process Creation (fork, exec, copy-on-write)',
              },
              {
                id: 'cs-st4',
                name: 'Inter-Process Communication (pipes, message queues, shared memory)',
              },
              { id: 'cs-st5', name: 'Signals & Signal Handling' },
              { id: 'cs-st6', name: 'Zombie & Orphan Processes' },
              {
                id: 'cs-st7',
                name: 'Thread Pools & Thread-per-Request Models',
              },
              {
                id: 'cs-st8',
                name: 'Green Threads & Coroutines vs OS Threads',
              },
            ],
          },
          {
            id: 't2',
            name: 'Memory Management',
            description:
              'Paging, segmentation, virtual memory, page replacement, memory allocation strategies.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: 'Memory Management Primer', type: 'article' },
              { title: 'Virtual Memory Deep Dive', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st5',
                name: 'Paging (page tables, multi-level page tables)',
              },
              { id: 'st6', name: 'Segmentation (segment table, protection)' },
              {
                id: 'st7',
                name: 'Virtual Memory (demand paging, page faults)',
              },
              {
                id: 'st8',
                name: 'Page Replacement (LRU, FIFO, Optimal, Clock)',
              },
              {
                id: 'cs-st9',
                name: 'TLB (Translation Lookaside Buffer) & cache hierarchy',
              },
              {
                id: 'cs-st10',
                name: 'Memory Allocation (first fit, best fit, worst fit, buddy system)',
              },
              { id: 'cs-st11', name: 'Internal vs External Fragmentation' },
              { id: 'cs-st12', name: 'Thrashing (causes, working set model)' },
              { id: 'cs-st13', name: 'Swapping & Swap Space Management' },
              { id: 'cs-st14', name: 'Memory-Mapped Files (mmap)' },
              { id: 'cs-st15', name: 'Copy-on-Write & Shared Memory Pages' },
              { id: 'cs-st16', name: 'Kernel vs User Space Memory' },
            ],
          },
          {
            id: 't3',
            name: 'Concurrency & Synchronization',
            description:
              'Locks, semaphores, monitors, deadlocks, race conditions, classic problems.',
            difficulty: 'advanced',
            estimatedMinutes: 180,
            resources: [
              { title: 'Concurrency Patterns', type: 'article' },
              { title: 'Deadlock Prevention Strategies', type: 'video' },
            ],
            subtopics: [
              { id: 'st9', name: 'Mutex & Semaphore (binary vs counting)' },
              {
                id: 'st10',
                name: 'Deadlock Detection (resource allocation graph)',
              },
              { id: 'st11', name: 'Producer-Consumer Problem' },
              { id: 'st12', name: 'Readers-Writers Problem' },
              { id: 'cs-st17', name: 'Dining Philosophers Problem' },
              {
                id: 'cs-st18',
                name: 'Deadlock Prevention (hold-and-wait, circular wait)',
              },
              {
                id: 'cs-st19',
                name: "Deadlock Avoidance (Banker's Algorithm)",
              },
              { id: 'cs-st20', name: 'Monitors & Condition Variables' },
              { id: 'cs-st21', name: 'Spinlocks vs Blocking Locks' },
              { id: 'cs-st22', name: 'Lock-Free & Wait-Free Data Structures' },
              {
                id: 'cs-st23',
                name: 'Race Conditions & Critical Section Problem',
              },
              {
                id: 'cs-st24',
                name: "Peterson's Algorithm & Hardware Support (CAS, test-and-set)",
              },
              {
                id: 'cs-st25',
                name: 'Priority Inversion & Priority Inheritance',
              },
              { id: 'cs-st26', name: 'Read-Copy-Update (RCU) Mechanism' },
            ],
          },
          {
            id: 't4',
            name: 'File Systems & I/O',
            description:
              'File system types, inode structures, disk scheduling, RAID levels, I/O subsystems.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'File Systems Explained', type: 'article' },
              { title: 'RAID Levels Comparison', type: 'video' },
            ],
            subtopics: [
              { id: 'st13', name: 'Inode Structure & File Metadata' },
              {
                id: 'st14',
                name: 'Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK)',
              },
              { id: 'st15', name: 'RAID Levels (0, 1, 5, 6, 10)' },
              {
                id: 'cs-st27',
                name: 'File Allocation Methods (contiguous, linked, indexed)',
              },
              {
                id: 'cs-st28',
                name: 'Directory Structures (single-level, two-level, tree, DAG)',
              },
              { id: 'cs-st29', name: 'Journaling File Systems (ext4, NTFS)' },
              { id: 'cs-st30', name: 'Log-Structured File Systems' },
              { id: 'cs-st31', name: 'Virtual File System (VFS) Layer' },
              { id: 'cs-st32', name: 'Buffered vs Direct I/O' },
              { id: 'cs-st33', name: 'DMA (Direct Memory Access)' },
              { id: 'cs-st34', name: 'SSD vs HDD (wear leveling, TRIM, FTL)' },
            ],
          },
          {
            id: 'cs-t1',
            name: 'System Calls & Kernel Architecture',
            description:
              'System call interface, kernel types, interrupt handling, boot process.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Linux System Calls', type: 'article' },
              { title: 'Kernel Architecture Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'cs-st35',
                name: 'System Call Interface (trap, mode switch)',
              },
              { id: 'cs-st36', name: 'Monolithic vs Microkernel vs Hybrid' },
              {
                id: 'cs-st37',
                name: 'Interrupt Handling (hardware vs software interrupts)',
              },
              { id: 'cs-st38', name: 'Interrupt Vector Table & ISRs' },
              {
                id: 'cs-st39',
                name: 'Boot Process (BIOS/UEFI, bootloader, kernel init)',
              },
              { id: 'cs-st40', name: 'User Mode vs Kernel Mode Transitions' },
              { id: 'cs-st41', name: 'Loadable Kernel Modules' },
              {
                id: 'cs-st42',
                name: 'Containerization Primitives (namespaces, cgroups)',
              },
            ],
          },
        ],
      },
      {
        id: 's2',
        name: 'Database Management Systems',
        description: 'Theory and practice of database systems.',
        topics: [
          {
            id: 't5',
            name: 'Relational Model & Normalization',
            description:
              '1NF through BCNF, functional dependencies, decomposition, denormalization trade-offs.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: 'Database Normalization Guide', type: 'article' },
              { title: 'Normal Forms Explained', type: 'video' },
            ],
            subtopics: [
              { id: 'st16', name: '1NF to BCNF (identification & conversion)' },
              {
                id: 'st17',
                name: 'Functional Dependencies (closure, canonical cover)',
              },
              { id: 'st18', name: 'Lossless Decomposition (Chase algorithm)' },
              { id: 'st19', name: 'Denormalization (when & why)' },
              {
                id: 'cs-st43',
                name: '4NF & 5NF (multi-valued & join dependencies)',
              },
              { id: 'cs-st44', name: 'ER Model to Relational Schema Mapping' },
              {
                id: 'cs-st45',
                name: 'Relational Algebra (σ, π, ⋈, ÷, set operations)',
              },
              { id: 'cs-st46', name: 'Relational Calculus (tuple vs domain)' },
              {
                id: 'cs-st47',
                name: 'Keys (super, candidate, primary, foreign, composite)',
              },
              { id: 'cs-st48', name: 'Referential Integrity & Cascade Rules' },
            ],
          },
          {
            id: 't6',
            name: 'Transactions & Concurrency Control',
            description:
              'ACID properties, isolation levels, concurrency control protocols, logging, recovery.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: 'ACID Properties Explained', type: 'article' },
              { title: 'Transaction Isolation Levels', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st20',
                name: 'ACID Properties (atomicity, consistency, isolation, durability)',
              },
              {
                id: 'st21',
                name: 'Isolation Levels (Read Uncommitted → Serializable)',
              },
              {
                id: 'st22',
                name: 'Concurrency Control (2PL, strict 2PL, timestamp ordering)',
              },
              { id: 'st23', name: 'WAL Logging (write-ahead log, redo/undo)' },
              {
                id: 'cs-st49',
                name: 'Dirty Read, Non-Repeatable Read, Phantom Read',
              },
              {
                id: 'cs-st50',
                name: 'MVCC (Multi-Version Concurrency Control)',
              },
              {
                id: 'cs-st51',
                name: 'Deadlock in Databases (detection, timeout, wait-die/wound-wait)',
              },
              { id: 'cs-st52', name: 'Two-Phase Commit Protocol (2PC)' },
              { id: 'cs-st53', name: 'ARIES Recovery Algorithm' },
              {
                id: 'cs-st54',
                name: 'Serializability (conflict & view serializability)',
              },
              {
                id: 'cs-st55',
                name: 'Precedence Graphs for Conflict Detection',
              },
              {
                id: 'cs-st56',
                name: 'Optimistic vs Pessimistic Concurrency Control',
              },
            ],
          },
          {
            id: 't7',
            name: 'Indexing & Query Optimization',
            description:
              'B-trees, B+ trees, hash indexes, query plans, cost-based optimization.',
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              { title: 'Database Indexing Deep Dive', type: 'article' },
              { title: 'Query Optimization Techniques', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st24',
                name: 'B-trees (insertion, deletion, search complexity)',
              },
              {
                id: 'st25',
                name: 'Hash Indexes (static & extendible hashing)',
              },
              { id: 'st26', name: 'Query Plans (logical vs physical plan)' },
              {
                id: 'st27',
                name: 'EXPLAIN Analysis (cost estimation, sequential vs index scan)',
              },
              {
                id: 'cs-st57',
                name: 'B+ Trees (leaf-level linked list, range queries)',
              },
              { id: 'cs-st58', name: 'Clustered vs Non-Clustered Indexes' },
              { id: 'cs-st59', name: 'Composite & Covering Indexes' },
              {
                id: 'cs-st60',
                name: 'Bitmap Indexes (low-cardinality columns)',
              },
              {
                id: 'cs-st61',
                name: 'Query Optimization (join ordering, predicate pushdown)',
              },
              {
                id: 'cs-st62',
                name: 'Join Algorithms (nested loop, sort-merge, hash join)',
              },
              { id: 'cs-st63', name: 'Materialized Views & Query Caching' },
              { id: 'cs-st64', name: 'Index Selection Problem & Auto-Tuning' },
            ],
          },
          {
            id: 't8',
            name: 'SQL Advanced Concepts',
            description:
              'Window functions, CTEs, recursive queries, stored procedures, triggers, views.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Advanced SQL Tutorial', type: 'article' },
              { title: 'Window Functions Masterclass', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st28',
                name: 'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)',
              },
              { id: 'st29', name: 'CTEs (Common Table Expressions)' },
              {
                id: 'st30',
                name: 'Recursive Queries (hierarchical data traversal)',
              },
              {
                id: 'st31',
                name: 'Triggers (BEFORE/AFTER, row-level vs statement-level)',
              },
              { id: 'cs-st65', name: 'Stored Procedures & Functions' },
              {
                id: 'cs-st66',
                name: 'Views (updatable views, WITH CHECK OPTION)',
              },
              { id: 'cs-st67', name: 'Cursors & Iterative Processing' },
              { id: 'cs-st68', name: 'PIVOT / UNPIVOT & Crosstab Queries' },
              { id: 'cs-st69', name: 'JSON/XML Operations in SQL' },
              {
                id: 'cs-st70',
                name: 'Partitioning (range, list, hash partitions)',
              },
            ],
          },
          {
            id: 'cs-t2',
            name: 'NoSQL & Distributed Databases',
            description:
              'CAP theorem, NoSQL categories, distributed storage, and consistency models.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'NoSQL Distilled', type: 'book' },
              { title: 'CAP Theorem Explained', type: 'video' },
            ],
            subtopics: [
              { id: 'cs-st71', name: 'CAP Theorem & PACELC' },
              { id: 'cs-st72', name: 'Key-Value Stores (Redis, DynamoDB)' },
              {
                id: 'cs-st73',
                name: 'Document Stores (MongoDB data modeling)',
              },
              {
                id: 'cs-st74',
                name: 'Column-Family Stores (Cassandra, HBase)',
              },
              {
                id: 'cs-st75',
                name: 'Graph Databases (Neo4j, property graphs)',
              },
              {
                id: 'cs-st76',
                name: 'Eventual Consistency & Conflict Resolution (CRDTs, vector clocks)',
              },
              {
                id: 'cs-st77',
                name: 'Sharding Strategies (range, hash, directory-based)',
              },
              {
                id: 'cs-st78',
                name: 'Replication (leader-follower, multi-leader, leaderless)',
              },
              { id: 'cs-st79', name: 'Consensus Protocols (Paxos, Raft)' },
            ],
          },
        ],
      },
      {
        id: 's3',
        name: 'Computer Networks',
        description: 'How data travels across networks.',
        topics: [
          {
            id: 't9',
            name: 'OSI & TCP/IP Models',
            description:
              'Seven OSI layers, TCP/IP stack, protocol encapsulation, packet flow.',
            difficulty: 'beginner',
            estimatedMinutes: 120,
            resources: [
              { title: 'Networking Fundamentals', type: 'course' },
              { title: 'OSI Model Explained', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st32',
                name: 'OSI Layers (Physical → Application, responsibilities)',
              },
              {
                id: 'st33',
                name: 'TCP/IP Stack (4-layer model vs OSI mapping)',
              },
              {
                id: 'st34',
                name: 'Encapsulation & Decapsulation (headers, PDUs)',
              },
              {
                id: 'cs-st80',
                name: 'Physical Layer (encoding, modulation, media types)',
              },
              {
                id: 'cs-st81',
                name: 'Data Link Layer (framing, MAC addressing, error detection)',
              },
              { id: 'cs-st82', name: 'Ethernet & IEEE 802.3 Standards' },
              { id: 'cs-st83', name: 'ARP (Address Resolution Protocol)' },
              { id: 'cs-st84', name: 'Switching vs Routing (L2 vs L3)' },
              { id: 'cs-st85', name: 'VLANs & Trunking' },
            ],
          },
          {
            id: 't10',
            name: 'Network Layer & Routing',
            description:
              'IP addressing, subnetting, routing protocols, NAT, ICMP.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'IP Subnetting Guide', type: 'article' },
              { title: 'Routing Protocols Overview', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st35',
                name: 'IPv4 Addressing & Subnetting (CIDR notation)',
              },
              { id: 'st36', name: 'IPv6 Addressing & Transition Mechanisms' },
              {
                id: 'cs-st86',
                name: 'Routing Algorithms (Dijkstra, Bellman-Ford)',
              },
              { id: 'cs-st87', name: 'Distance Vector vs Link State Routing' },
              {
                id: 'cs-st88',
                name: 'BGP (Border Gateway Protocol, AS, path selection)',
              },
              {
                id: 'cs-st89',
                name: 'OSPF (Open Shortest Path First, areas, LSAs)',
              },
              {
                id: 'cs-st90',
                name: 'NAT (Network Address Translation, PAT, port forwarding)',
              },
              {
                id: 'cs-st91',
                name: 'ICMP (ping, traceroute, error messages)',
              },
              {
                id: 'cs-st92',
                name: 'DHCP (dynamic IP assignment, lease process)',
              },
              { id: 'cs-st93', name: 'IP Fragmentation & MTU Discovery' },
            ],
          },
          {
            id: 'cs-t3',
            name: 'Transport Layer Protocols',
            description:
              'TCP vs UDP, three-way handshake, flow control, congestion control, reliable delivery.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'TCP Deep Dive', type: 'article' },
              { title: 'UDP vs TCP Comparison', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st37',
                name: 'TCP Three-Way Handshake & Connection Teardown',
              },
              {
                id: 'st38',
                name: 'UDP (connectionless, use cases: DNS, gaming, streaming)',
              },
              {
                id: 'cs-st94',
                name: 'TCP Flow Control (sliding window protocol)',
              },
              {
                id: 'cs-st95',
                name: 'TCP Congestion Control (slow start, AIMD, fast retransmit)',
              },
              {
                id: 'cs-st96',
                name: 'TCP vs UDP Trade-offs (reliability vs latency)',
              },
              {
                id: 'cs-st97',
                name: 'QUIC Protocol (HTTP/3, 0-RTT, multiplexing)',
              },
              {
                id: 'cs-st98',
                name: 'Port Numbers (well-known, registered, dynamic)',
              },
              {
                id: 'cs-st99',
                name: 'Socket Programming (client-server model)',
              },
              { id: 'cs-st100', name: 'Multiplexing & Demultiplexing' },
              {
                id: 'cs-st101',
                name: 'Reliable Data Transfer (stop-and-wait, Go-Back-N, selective repeat)',
              },
            ],
          },
          {
            id: 't11',
            name: 'Application Layer Protocols',
            description:
              'DNS, HTTP/HTTPS, TLS, email protocols, WebSocket, and more.',
            difficulty: 'intermediate',
            estimatedMinutes: 150,
            resources: [
              { title: 'How HTTPS Works', type: 'article' },
              { title: 'DNS Resolution Explained', type: 'video' },
              { title: 'TLS Handshake Deep Dive', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st39',
                name: 'DNS Resolution (recursive, iterative, caching, TTL)',
              },
              {
                id: 'st40',
                name: 'TLS/SSL (handshake, certificates, certificate chain)',
              },
              {
                id: 'st41',
                name: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (multiplexing, server push)',
              },
              {
                id: 'st42',
                name: 'WebSocket (full-duplex, upgrade handshake)',
              },
              { id: 'cs-st102', name: 'HTTPS & Certificate Authorities (PKI)' },
              {
                id: 'cs-st103',
                name: 'DNS Record Types (A, AAAA, CNAME, MX, TXT, NS, SOA)',
              },
              { id: 'cs-st104', name: 'Email Protocols (SMTP, IMAP, POP3)' },
              { id: 'cs-st105', name: 'FTP & SFTP (active vs passive mode)' },
              {
                id: 'cs-st106',
                name: 'REST vs gRPC vs GraphQL (protocol comparison)',
              },
              {
                id: 'cs-st107',
                name: 'CDN & Edge Caching (content delivery networks)',
              },
              { id: 'cs-st108', name: 'Cookies, Sessions & Token-Based Auth' },
            ],
          },
          {
            id: 't12',
            name: 'Network Security',
            description:
              'Firewalls, VPN, encryption, DDoS protection, intrusion detection.',
            difficulty: 'advanced',
            estimatedMinutes: 120,
            resources: [
              { title: 'Network Security Guide', type: 'article' },
              { title: 'Firewall Architecture', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st43',
                name: 'Firewalls (packet filter, stateful, application-level)',
              },
              {
                id: 'st44',
                name: 'VPN (IPSec, WireGuard, tunneling protocols)',
              },
              {
                id: 'st45',
                name: 'DDoS Protection (rate limiting, scrubbing centers)',
              },
              {
                id: 'cs-st109',
                name: 'Symmetric vs Asymmetric Encryption (AES, RSA, ECC)',
              },
              {
                id: 'cs-st110',
                name: 'Digital Signatures & Hashing (SHA-256, HMAC)',
              },
              {
                id: 'cs-st111',
                name: 'IDS/IPS (intrusion detection/prevention systems)',
              },
              {
                id: 'cs-st112',
                name: 'Network Segmentation & Zero Trust Architecture',
              },
              {
                id: 'cs-st113',
                name: 'MITM Attacks & Prevention (certificate pinning)',
              },
              { id: 'cs-st114', name: 'DNS Security (DNSSEC, DNS-over-HTTPS)' },
              { id: 'cs-st115', name: 'Wi-Fi Security (WPA2/WPA3, 802.1X)' },
            ],
          },
        ],
      },
      {
        id: 's4',
        name: 'Object-Oriented Programming',
        description:
          'OOP principles and design patterns for clean, maintainable code.',
        topics: [
          {
            id: 't13',
            name: 'OOP Principles',
            description:
              'Encapsulation, inheritance, polymorphism, abstraction — with practical depth.',
            difficulty: 'beginner',
            estimatedMinutes: 120,
            resources: [
              { title: 'OOP Concepts Explained', type: 'article' },
              { title: 'OOP in Practice', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st46',
                name: 'Encapsulation (access modifiers, getters/setters)',
              },
              {
                id: 'st47',
                name: 'Inheritance (single, multi-level, hierarchical, diamond problem)',
              },
              {
                id: 'st48',
                name: 'Polymorphism (compile-time vs runtime, method overloading vs overriding)',
              },
              {
                id: 'st49',
                name: 'Abstraction (abstract classes vs interfaces)',
              },
              {
                id: 'cs-st116',
                name: 'Composition vs Inheritance (favor composition)',
              },
              {
                id: 'cs-st117',
                name: 'Association, Aggregation, Composition Relationships',
              },
              {
                id: 'cs-st118',
                name: 'Static vs Dynamic Binding (early vs late binding)',
              },
              { id: 'cs-st119', name: 'Virtual Functions & vtable' },
              {
                id: 'cs-st120',
                name: 'Object Lifecycle (construction, destruction, GC)',
              },
              {
                id: 'cs-st121',
                name: 'Generics/Templates & Type Parameterization',
              },
              { id: 'cs-st122', name: 'Mixins & Traits' },
            ],
          },
          {
            id: 't14',
            name: 'SOLID Principles',
            description:
              'Five principles for maintainable, extensible object-oriented design.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'SOLID Principles Guide', type: 'article' },
              { title: 'SOLID with Examples', type: 'video' },
            ],
            subtopics: [
              {
                id: 'st50',
                name: 'SRP (Single Responsibility — one reason to change)',
              },
              {
                id: 'st51',
                name: 'OCP (Open/Closed — extend without modifying)',
              },
              {
                id: 'st52',
                name: 'LSP (Liskov Substitution — subtypes must be substitutable)',
              },
              {
                id: 'st53',
                name: 'ISP (Interface Segregation — no fat interfaces)',
              },
              {
                id: 'st54',
                name: 'DIP (Dependency Inversion — depend on abstractions)',
              },
              {
                id: 'cs-st123',
                name: 'SOLID Violations & Code Smell Examples',
              },
              {
                id: 'cs-st124',
                name: 'Dependency Injection (constructor, setter, interface injection)',
              },
              {
                id: 'cs-st125',
                name: 'IoC Containers & Service Locator Pattern',
              },
              {
                id: 'cs-st126',
                name: 'Law of Demeter (principle of least knowledge)',
              },
              {
                id: 'cs-st127',
                name: 'GRASP Patterns (Information Expert, Creator, Controller)',
              },
            ],
          },
          {
            id: 't15',
            name: 'Design Patterns',
            description:
              'Creational, structural, behavioral patterns — GoF catalog with practical usage.',
            difficulty: 'advanced',
            estimatedMinutes: 180,
            resources: [
              { title: 'Design Patterns — GoF', type: 'book' },
              {
                title: 'Refactoring Guru',
                url: 'https://refactoring.guru/design-patterns',
                type: 'article',
              },
            ],
            subtopics: [
              {
                id: 'st55',
                name: 'Creational: Singleton (thread-safe, lazy, enum)',
              },
              {
                id: 'st56',
                name: 'Creational: Factory Method & Abstract Factory',
              },
              { id: 'st57', name: 'Creational: Builder & Prototype Patterns' },
              { id: 'st58', name: 'Structural: Adapter & Bridge' },
              { id: 'cs-st128', name: 'Structural: Decorator, Facade, Proxy' },
              { id: 'cs-st129', name: 'Structural: Composite & Flyweight' },
              { id: 'cs-st130', name: 'Behavioral: Observer & Pub/Sub' },
              { id: 'cs-st131', name: 'Behavioral: Strategy & State' },
              {
                id: 'cs-st132',
                name: 'Behavioral: Command & Chain of Responsibility',
              },
              {
                id: 'cs-st133',
                name: 'Behavioral: Iterator, Mediator, Memento',
              },
              { id: 'cs-st134', name: 'Behavioral: Template Method & Visitor' },
              {
                id: 'cs-st135',
                name: 'Pattern Selection (when to use which pattern)',
              },
              {
                id: 'cs-st136',
                name: 'Anti-Patterns (God Object, Spaghetti Code, Golden Hammer)',
              },
            ],
          },
          {
            id: 't16',
            name: 'Clean Code & Refactoring',
            description:
              'Code smells, refactoring techniques, naming, function design, principles.',
            difficulty: 'intermediate',
            estimatedMinutes: 120,
            resources: [
              { title: 'Clean Code by Robert Martin', type: 'book' },
              { title: 'Refactoring Techniques', type: 'article' },
            ],
            subtopics: [
              {
                id: 'st59',
                name: 'Code Smells (long method, large class, feature envy)',
              },
              {
                id: 'st60',
                name: 'Refactoring Techniques (extract method, move field, inline)',
              },
              {
                id: 'st61',
                name: 'Naming Conventions (intention-revealing, searchable names)',
              },
              {
                id: 'cs-st137',
                name: 'Function Design (small functions, single level of abstraction)',
              },
              { id: 'cs-st138', name: 'DRY, KISS, YAGNI Principles' },
              {
                id: 'cs-st139',
                name: 'Comments (when to write, self-documenting code)',
              },
              {
                id: 'cs-st140',
                name: 'Error Handling (exceptions vs error codes, fail-fast)',
              },
              {
                id: 'cs-st141',
                name: 'Code Reviews (best practices, checklist)',
              },
              {
                id: 'cs-st142',
                name: 'Technical Debt (identification, prioritization, repayment)',
              },
              {
                id: 'cs-st143',
                name: 'Coupling & Cohesion (low coupling, high cohesion)',
              },
            ],
          },
          {
            id: 'cs-t4',
            name: 'UML & Software Modeling',
            description:
              'UML diagram types, use case modeling, sequence diagrams, and class diagrams.',
            difficulty: 'beginner',
            estimatedMinutes: 90,
            resources: [
              { title: 'UML Distilled', type: 'book' },
              { title: 'UML Diagrams Tutorial', type: 'video' },
            ],
            subtopics: [
              {
                id: 'cs-st144',
                name: 'Class Diagrams (associations, multiplicities)',
              },
              {
                id: 'cs-st145',
                name: 'Sequence Diagrams (lifelines, messages, activation bars)',
              },
              {
                id: 'cs-st146',
                name: 'Use Case Diagrams (actors, relationships)',
              },
              {
                id: 'cs-st147',
                name: 'Activity Diagrams (swimlanes, decision nodes)',
              },
              { id: 'cs-st148', name: 'State Machine Diagrams' },
              { id: 'cs-st149', name: 'Component & Deployment Diagrams' },
              {
                id: 'cs-st150',
                name: 'Domain-Driven Design Basics (entities, value objects, aggregates)',
              },
            ],
          },
        ],
      },
      {
        id: 's5',
        name: 'Theory of Computation & Compiler Design',
        description:
          'Formal languages, automata theory, and compiler construction fundamentals.',
        topics: [
          {
            id: 'cs-t5',
            name: 'Automata & Formal Languages',
            description:
              'DFA, NFA, regular expressions, context-free grammars, Turing machines.',
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              { title: 'Introduction to Automata Theory', type: 'book' },
              { title: 'Automata Theory Lectures', type: 'course' },
            ],
            subtopics: [
              {
                id: 'cs-st151',
                name: 'DFA & NFA (construction, equivalence, minimization)',
              },
              {
                id: 'cs-st152',
                name: 'Regular Expressions (regex ↔ DFA conversion)',
              },
              { id: 'cs-st153', name: 'Pumping Lemma for Regular Languages' },
              {
                id: 'cs-st154',
                name: 'Context-Free Grammars (derivation, parse trees)',
              },
              {
                id: 'cs-st155',
                name: 'Pushdown Automata (PDA ↔ CFG equivalence)',
              },
              {
                id: 'cs-st156',
                name: 'Pumping Lemma for Context-Free Languages',
              },
              { id: 'cs-st157', name: 'Chomsky Normal Form & CYK Algorithm' },
              {
                id: 'cs-st158',
                name: 'Turing Machines (deterministic, non-deterministic)',
              },
              { id: 'cs-st159', name: 'Decidability & Halting Problem' },
              { id: 'cs-st160', name: 'P vs NP, NP-Complete, NP-Hard' },
              {
                id: 'cs-st161',
                name: 'Reductions (mapping reductions, proving undecidability)',
              },
            ],
          },
          {
            id: 'cs-t6',
            name: 'Compiler Design Fundamentals',
            description:
              'Lexical analysis, parsing, semantic analysis, code generation, and optimization.',
            difficulty: 'advanced',
            estimatedMinutes: 150,
            resources: [
              {
                title: 'Compilers: Principles, Techniques & Tools',
                type: 'book',
              },
              { title: 'Compiler Design Crash Course', type: 'video' },
            ],
            subtopics: [
              {
                id: 'cs-st162',
                name: 'Lexical Analysis (tokenization, finite automata for scanning)',
              },
              {
                id: 'cs-st163',
                name: 'Parsing (top-down: LL(1), recursive descent)',
              },
              {
                id: 'cs-st164',
                name: 'Parsing (bottom-up: LR(0), SLR, LALR, CLR)',
              },
              {
                id: 'cs-st165',
                name: 'Syntax-Directed Translation (attributes, SDT schemes)',
              },
              {
                id: 'cs-st166',
                name: 'Intermediate Code Generation (three-address code, SSA)',
              },
              {
                id: 'cs-st167',
                name: 'Code Optimization (constant folding, dead code elimination, loop optimization)',
              },
              { id: 'cs-st168', name: 'Register Allocation (graph coloring)' },
              { id: 'cs-st169', name: 'Symbol Tables & Scope Management' },
              {
                id: 'cs-st170',
                name: 'Runtime Environments (activation records, stack frames)',
              },
              {
                id: 'cs-st171',
                name: 'Garbage Collection (mark-sweep, generational, reference counting)',
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getRoadmapStats(roadmap: Roadmap) {
  const totalTopics = roadmap.sections.reduce(
    (acc, s) => acc + s.topics.length,
    0,
  );
  const completedTopics = roadmap.sections.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.isCompleted).length,
    0,
  );
  const totalMinutes = roadmap.sections.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.estimatedMinutes, 0),
    0,
  );
  return {
    totalTopics,
    completedTopics,
    totalSections: roadmap.sections.length,
    totalMinutes,
  };
}
