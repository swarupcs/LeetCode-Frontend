import axios from '@/config/axiosConfig';

/*
{
    "title": "Palindrome Number For Test-1",
    "description": "Given an integer n, check whether it is a palindrome number. A palindrome number is the same when read forward and backward.",
    "difficulty": "EASY",
    "tags": [
      "math",
      "string",
      "number-theory"
    ],
    "examples": {
      "PYTHON": {
        "input": "121",
        "output": "true",
        "explanation": "121 reads the same forwards and backwards."
      },
      "JAVASCRIPT": {
        "input": "123",
        "output": "false",
        "explanation": "123 is not the same backwards."
      }
    },
    "constraints": "-10^9 ≤ n ≤ 10^9",
    "testcases": [
      {
        "input": "121",
        "output": "true"
      },
      {
        "input": "123",
        "output": "false"
      },
      {
        "input": "-121",
        "output": "false"
      },
      {
        "input": "0",
        "output": "true"
      }
    ],
    "codeSnippets": {
      "PYTHON": "def is_palindrome(n):\n    # Write your code here\n    return False\n\nimport sys\nn = int(sys.stdin.read())\nprint(str(is_palindrome(n)).lower())",
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction isPalindrome(n) {\n    // Write your code here\n    return false;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = Number(input);\nconsole.log(isPalindrome(n));",
      "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static boolean isPalindrome(int n) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(isPalindrome(n));\n    }\n}"
    },
    "referenceSolutions": {
      "PYTHON": "import sys\nn = int(sys.stdin.read())\n\ndef is_palindrome(n):\n    if n < 0:\n        print(\"false\")\n        return\n    original = str(n)\n    reversed_n = original[::-1]\n    print(\"true\" if original == reversed_n else \"false\")\n\nis_palindrome(n)",
      "JAVASCRIPT": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = Number(input);\n\nfunction isPalindrome(n) {\n    if (n < 0) return false;\n    const s = n.toString();\n    return s === s.split('').reverse().join('');\n}\n\nconsole.log(isPalindrome(n));",
      "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n < 0) {\n            System.out.println(\"false\");\n            return;\n        }\n        String s = Integer.toString(n);\n        StringBuilder rev = new StringBuilder(s).reverse();\n        System.out.println(s.equals(rev.toString()));\n    }\n}"
    }
  }


*/

export const createProblemRequest = async ({
  title,
  description,
  difficulty,
  tags,
  examples,
  constraints,
  testcases,
  codeSnippets,
  referenceSolutions,
}) => {
  try {
    const response = await axios.post('/problems/create-problem', {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
