export interface Problem {
  id: number;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptance: number;
  solved: boolean;
  isPublished: boolean;
  description?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  starterCode?: Record<string, string>;
}

export const problems: Problem[] = [
  {
    id: 1,
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    acceptance: 52.1,
    solved: true,
    isPublished: true,
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.',
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
    },
  },
  {
    id: 2,
    number: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math'],
    acceptance: 41.2,
    solved: true,
    isPublished: true,
    description:
      'You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.',
      },
      { input: 'l1 = [0], l2 = [0]', output: '[0]' },
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.',
    ],
    starterCode: {
      python: `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef addTwoNumbers(l1: ListNode, l2: ListNode) -> ListNode:\n    # Write your solution here\n    pass`,
      javascript: `/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Write your solution here\n        return null;\n    }\n}`,
    },
  },
  {
    id: 3,
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window'],
    acceptance: 34.5,
    solved: false,
    isPublished: true,
    description:
      'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass`,
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    },
  },
  {
    id: 4,
    number: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search'],
    acceptance: 38.7,
    solved: false,
    isPublished: true,
    description:
      'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation:
          'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10⁶ <= nums1[i], nums2[i] <= 10⁶',
    ],
    starterCode: {
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here\n    pass`,
      javascript: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}`,
    },
  },
  {
    id: 5,
    number: 5,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['String', 'DP'],
    acceptance: 33.8,
    solved: true,
    isPublished: true,
    description:
      'Given a string `s`, return the longest palindromic substring in `s`.',
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.',
    ],
    starterCode: {
      python: `def longestPalindrome(s: str) -> str:\n    # Write your solution here\n    pass`,
      javascript: `var longestPalindrome = function(s) {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        // Write your solution here\n        return "";\n    }\n}`,
    },
  },
  {
    id: 6,
    number: 9,
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['Math'],
    acceptance: 54.7,
    solved: true,
    isPublished: true,
  },
  {
    id: 7,
    number: 11,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'],
    acceptance: 55.3,
    solved: false,
    isPublished: true,
  },
  {
    id: 8,
    number: 15,
    title: '3Sum',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    acceptance: 33.5,
    solved: true,
    isPublished: true,
  },
  {
    id: 9,
    number: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    acceptance: 40.4,
    solved: true,
    isPublished: true,
  },
  {
    id: 10,
    number: 21,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    acceptance: 63.2,
    solved: false,
    isPublished: true,
  },
  {
    id: 11,
    number: 23,
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Heap'],
    acceptance: 51.5,
    solved: false,
    isPublished: false,
  },
  {
    id: 12,
    number: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Stack'],
    acceptance: 60.2,
    solved: false,
    isPublished: true,
  },
  {
    id: 13,
    number: 49,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String'],
    acceptance: 67.8,
    solved: true,
    isPublished: true,
  },
  {
    id: 14,
    number: 53,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'DP'],
    acceptance: 50.7,
    solved: true,
    isPublished: true,
  },
  {
    id: 15,
    number: 70,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['DP', 'Math'],
    acceptance: 52.6,
    solved: true,
    isPublished: true,
  },
  {
    id: 16,
    number: 76,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    tags: ['String', 'Sliding Window'],
    acceptance: 41.2,
    solved: false,
    isPublished: false,
  },
  {
    id: 17,
    number: 121,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Array', 'DP'],
    acceptance: 54.1,
    solved: true,
    isPublished: true,
  },
  {
    id: 18,
    number: 200,
    title: 'Number of Islands',
    difficulty: 'Medium',
    tags: ['DFS', 'BFS', 'Graph'],
    acceptance: 57.8,
    solved: false,
    isPublished: true,
  },
];

// Generate default starter code for problems that don't have it
export function getProblemWithDefaults(problem: Problem): Problem {
  if (problem.starterCode) return problem;
  return {
    ...problem,
    description:
      problem.description ||
      `Solve the **${problem.title}** problem.\n\nThis is problem #${problem.number} in our collection. Use the tags below as hints for the approach.`,
    examples: problem.examples || [
      { input: 'See problem statement', output: 'See expected output' },
    ],
    constraints: problem.constraints || [
      'See problem statement for constraints.',
    ],
    starterCode: {
      python: `def solution():\n    # Write your solution here\n    pass`,
      javascript: `var solution = function() {\n    // Write your solution here\n};`,
      java: `class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}`,
    },
  };
}
