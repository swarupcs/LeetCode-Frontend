
import { useState } from "react"
import { Search, ArrowUpDown, Filter, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"



export default function ProblemList() {
  const [searchQuery, setSearchQuery] = useState("")

  const problems = [
    { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
    { id: 2, title: "Add Two Numbers", difficulty: "Med.", completed: true },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Med.", completed: true },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", completed: true },
    { id: 5, title: "Longest Palindromic Substring", difficulty: "Med.", completed: true },
    { id: 6, title: "Zigzag Conversion", difficulty: "Med.", completed: true },
    { id: 7, title: "Reverse Integer", difficulty: "Med.", completed: true },
    { id: 8, title: "String to Integer (atoi)", difficulty: "Med.", completed: true },
    { id: 9, title: "Palindrome Number", difficulty: "Easy", completed: false },
    { id: 10, title: "Regular Expression Matching", difficulty: "Hard", completed: false },
    { id: 11, title: "Container With Most Water", difficulty: "Med.", completed: true },
    { id: 12, title: "Integer to Roman", difficulty: "Med.", completed: true },
    { id: 13, title: "Roman to Integer", difficulty: "Easy", completed: true },
    { id: 14, title: "Longest Common Prefix", difficulty: "Easy", completed: true },
    { id: 15, title: "3Sum", difficulty: "Med.", completed: true },
    { id: 16, title: "3Sum Closest", difficulty: "Med.", completed: false },
    { id: 17, title: "Letter Combinations of a Phone Number", difficulty: "Med.", completed: true },
    { id: 18, title: "4Sum", difficulty: "Med.", completed: true },
  ]

  const filteredProblems = problems.filter(
    (problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || problem.id.toString().includes(searchQuery),
  )

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400"
      case "Med.":
        return "text-amber-400"
      case "Hard":
        return "text-red-400"
      default:
        return "text-zinc-400"
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold text-zinc-100">Problem List</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
          <Check size={18} className="text-emerald-500" />
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-800 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search questions"
            className="h-9 border-zinc-700 bg-zinc-900 pl-8 text-sm text-zinc-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800 text-zinc-400">
          <ArrowUpDown size={14} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-zinc-800 text-zinc-400">
          <Filter size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="flex items-center border-b border-zinc-800/50 px-4 py-3 hover:bg-zinc-900">
            <div className="mr-2 w-5 text-emerald-500">{problem.completed && <Check size={16} />}</div>
            <div className="flex-1">
              <span className="text-zinc-300">
                {problem.id}. {problem.title}
              </span>
            </div>
            <div className={cn("text-sm font-medium", getDifficultyColor(problem.difficulty))}>
              {problem.difficulty}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
