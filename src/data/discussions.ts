export type DiscussionCategory = 'solution' | 'question' | 'discussion' | 'tip';

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  replies: Comment[];
  isAccepted?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  commentCount: number;
  tags: string[];
  category: DiscussionCategory;
  comments: Comment[];
  viewCount: number;
}

export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Optimal O(n) Solution using HashMap',
    content:
      "Here's an efficient approach using a HashMap to solve Two Sum in linear time. Key insight: store complements as you iterate.\n\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n```\n\nThis runs in O(n) time and O(n) space. Much better than brute force!",
    author: 'codeMaster',
    createdAt: '2h ago',
    upvotes: 45,
    downvotes: 2,
    userVote: 0,
    commentCount: 4,
    tags: ['Python', 'HashMap', 'Optimized'],
    category: 'solution',
    viewCount: 312,
    comments: [
      {
        id: 'c1',
        authorName: 'algoFan',
        content:
          'Clean solution! You could also use `enumerate` with a default dict for slightly cleaner code.',
        createdAt: '1h ago',
        upvotes: 12,
        downvotes: 0,
        userVote: 0,
        replies: [
          {
            id: 'c1r1',
            authorName: 'codeMaster',
            content:
              'Good point! Though defaultdict adds an import overhead. For competitive coding, the dict approach is more common.',
            createdAt: '45m ago',
            upvotes: 5,
            downvotes: 0,
            userVote: 0,
            replies: [],
          },
        ],
      },
      {
        id: 'c2',
        authorName: 'newbieDev',
        content:
          'Can you explain why we check for the complement instead of the number itself?',
        createdAt: '30m ago',
        upvotes: 3,
        downvotes: 0,
        userVote: 0,
        replies: [
          {
            id: 'c2r1',
            authorName: 'codeMaster',
            content:
              "We're looking for two numbers that sum to target. If current number is `num`, we need `target - num` (the complement). If that complement was already seen, we found our pair!",
            createdAt: '20m ago',
            upvotes: 8,
            downvotes: 0,
            userVote: 1,
            isAccepted: true,
            replies: [],
          },
        ],
      },
      {
        id: 'c3',
        authorName: 'perfAnalyst',
        content:
          "Great solution. Worth noting this handles the case where the same element can't be used twice, since we check before inserting.",
        createdAt: '15m ago',
        upvotes: 6,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
      {
        id: 'c4',
        authorName: 'javaGuru',
        content:
          "Here's the equivalent Java version if anyone needs it:\n```java\npublic int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[] {};\n}\n```",
        createdAt: '10m ago',
        upvotes: 9,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    title: 'Java Solution with Detailed Explanation',
    content:
      "Step-by-step Java implementation with time and space complexity analysis. Beginner-friendly breakdown of the Two Sum problem.\n\nThe key idea is to trade space for time by using a HashMap to store values we've already seen.",
    author: 'javaGuru',
    createdAt: '5h ago',
    upvotes: 32,
    downvotes: 1,
    userVote: 1,
    commentCount: 2,
    tags: ['Java', 'HashMap', 'Beginner-Friendly'],
    category: 'solution',
    viewCount: 198,
    comments: [
      {
        id: 'c5',
        authorName: 'codeMaster',
        content: 'Nice walkthrough! This is really helpful for beginners.',
        createdAt: '4h ago',
        upvotes: 5,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
      {
        id: 'c6',
        authorName: 'newbieDev',
        content: 'Thank you! This finally made it click for me.',
        createdAt: '3h ago',
        upvotes: 2,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: '3',
    title: 'Brute Force vs Optimized — Performance Comparison',
    content:
      'Performance benchmarks comparing O(n²) brute force against O(n) HashMap approach on different input sizes.\n\n| Input Size | Brute Force | HashMap |\n|-----------|-------------|----------|\n| 100       | 0.1ms       | 0.05ms   |\n| 10,000    | 45ms        | 0.8ms    |\n| 1,000,000 | 4500ms      | 12ms     |\n\nAs you can see, the difference becomes dramatic at scale.',
    author: 'perfAnalyst',
    createdAt: '1d ago',
    upvotes: 28,
    downvotes: 0,
    userVote: 0,
    commentCount: 3,
    tags: ['Performance', 'Analysis', 'Benchmarks'],
    category: 'discussion',
    viewCount: 445,
    comments: [
      {
        id: 'c7',
        authorName: 'codeMaster',
        content:
          'Great benchmarks! Would love to see memory usage comparison too.',
        createdAt: '20h ago',
        upvotes: 7,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
      {
        id: 'c8',
        authorName: 'javaGuru',
        content:
          'The HashMap approach uses O(n) extra space. For most practical purposes, this trade-off is worth it.',
        createdAt: '18h ago',
        upvotes: 4,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
      {
        id: 'c9',
        authorName: 'edgeCasePro',
        content:
          'What about cache locality? The brute force might be faster for very small inputs due to better cache performance.',
        createdAt: '12h ago',
        upvotes: 10,
        downvotes: 1,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: '4',
    title: 'Can someone explain the two-pointer approach?',
    content:
      "I've seen mentions of a two-pointer technique for this problem. How does it work with sorted arrays? Is it better than the HashMap approach in any scenario?",
    author: 'newbieDev',
    createdAt: '2d ago',
    upvotes: 15,
    downvotes: 0,
    userVote: 0,
    commentCount: 2,
    tags: ['Two Pointers', 'Question', 'Sorting'],
    category: 'question',
    viewCount: 267,
    comments: [
      {
        id: 'c10',
        authorName: 'codeMaster',
        content:
          "Two pointers work on **sorted** arrays. You place one pointer at the start and one at the end:\n\n1. If sum < target → move left pointer right\n2. If sum > target → move right pointer left\n3. If sum == target → found it!\n\nTime: O(n log n) for sorting + O(n) scan = O(n log n). Space: O(1) if you sort in-place.\n\nIt's better when you need O(1) space and the array can be modified.",
        createdAt: '1d ago',
        upvotes: 18,
        downvotes: 0,
        userVote: 0,
        isAccepted: true,
        replies: [],
      },
      {
        id: 'c11',
        authorName: 'perfAnalyst',
        content:
          'Note: the original Two Sum problem asks for indices, so sorting would lose the original positions unless you track them separately.',
        createdAt: '1d ago',
        upvotes: 12,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: '5',
    title: 'Edge cases to watch out for',
    content:
      'A comprehensive list of edge cases for Two Sum that many people miss:\n\n- **Duplicate values**: `[3, 3]` with target `6`\n- **Negative numbers**: `[-1, -2, -3]` with target `-5`\n- **Zero**: `[0, 4, 0]` with target `0`\n- **Single pair**: Array with exactly 2 elements\n- **Large inputs**: 10^5+ elements (check for TLE)\n\nAlways test these before submitting!',
    author: 'edgeCasePro',
    createdAt: '3d ago',
    upvotes: 22,
    downvotes: 1,
    userVote: 0,
    commentCount: 1,
    tags: ['Edge Cases', 'Tips', 'Testing'],
    category: 'tip',
    viewCount: 189,
    comments: [
      {
        id: 'c12',
        authorName: 'newbieDev',
        content:
          'The duplicate values case caught me! My first solution failed because I was overwriting the index in the map.',
        createdAt: '2d ago',
        upvotes: 4,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: '6',
    title: 'Why does my recursive solution cause stack overflow?',
    content:
      "I tried solving this recursively but I'm getting a stack overflow for large inputs. Is recursion a viable approach here, or should I stick to iterative solutions?",
    author: 'recursiveThinker',
    createdAt: '4d ago',
    upvotes: 8,
    downvotes: 3,
    userVote: 0,
    commentCount: 1,
    tags: ['Recursion', 'Question', 'Debug'],
    category: 'question',
    viewCount: 134,
    comments: [
      {
        id: 'c13',
        authorName: 'codeMaster',
        content:
          "Recursion is not the right approach here. Each recursive call adds to the stack, and with large inputs you'll hit the limit. Stick with iterative HashMap — it's both simpler and more efficient.",
        createdAt: '3d ago',
        upvotes: 11,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
];

export const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case 'solution':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'question':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'discussion':
      return 'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]';
    case 'tip':
      return 'bg-[hsl(var(--cyan)/0.1)] text-[hsl(var(--cyan))] border-[hsl(var(--cyan)/0.2)]';
    default:
      return 'bg-surface-3 text-muted-foreground';
  }
};

export const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'solution':
      return '💡';
    case 'question':
      return '❓';
    case 'discussion':
      return '💬';
    case 'tip':
      return '✨';
    default:
      return '📝';
  }
};
