
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Play, Download, Eye, Code2 } from "lucide-react"


const languageTemplates = {
  javascript: `// JavaScript Solution
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test case
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,

  python: `# Python Solution
def two_sum(nums, target):
    """
    Find two numbers that add up to target
    Time: O(n), Space: O(n)
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []

# Test case
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,

  java: `// Java Solution
import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        throw new IllegalArgumentException("No solution found");
    }
}`,

  cpp: `// C++ Solution
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};`,
}

const programmingLanguages = [
  { value: "javascript", label: "JavaScript", color: "bg-yellow-500" },
  { value: "python", label: "Python", color: "bg-blue-500" },
  { value: "java", label: "Java", color: "bg-red-500" },
  { value: "cpp", label: "C++", color: "bg-purple-500" },
  { value: "c", label: "C", color: "bg-gray-500" },
  { value: "csharp", label: "C#", color: "bg-green-500" },
  { value: "go", label: "Go", color: "bg-cyan-500" },
  { value: "rust", label: "Rust", color: "bg-orange-500" },
  { value: "typescript", label: "TypeScript", color: "bg-blue-600" },
  { value: "php", label: "PHP", color: "bg-indigo-500" },
  { value: "ruby", label: "Ruby", color: "bg-red-600" },
  { value: "swift", label: "Swift", color: "bg-orange-600" },
  { value: "kotlin", label: "Kotlin", color: "bg-purple-600" },
  { value: "sql", label: "SQL", color: "bg-teal-500" },
]

export function CodeEditor({ value, onChange, language, onLanguageChange }) {
  const [activeTab, setActiveTab] = useState("editor")

  const handleLanguageChange = (newLanguage) => {
    onLanguageChange(newLanguage)

    // If editor is empty or user confirms, insert template
    if (!value.trim() && languageTemplates[newLanguage]) {
        onChange(languageTemplates[newLanguage]);
      }
      
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
  }

  const downloadCode = () => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      go: "go",
      rust: "rs",
      typescript: "ts",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
      sql: "sql",
    }

    const extension = extensions[language as keyof typeof extensions] || "txt"
    const blob = new Blob([value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `solution.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCode = (code) => {
    if (!code) return ""

    // Simple syntax highlighting for preview
    return code
      .replace(/(\/\/.*$|#.*$)/gm, '<span class="text-green-600">$1</span>')
      .replace(
        /(function|def|class|public|private|protected|const|let|var|if|else|for|while|return|import|from|try|catch)/g,
        '<span class="text-blue-600 font-semibold">$1</span>',
      )
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-500">$1</span>')
      .replace(/(\d+)/g, '<span class="text-orange-500">$1</span>')
      .replace(/\n/g, "<br>")
  }

  const selectedLanguageInfo = programmingLanguages.find((lang) => lang.value === language)

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${selectedLanguageInfo?.color || "bg-gray-500"}`} />
              {selectedLanguageInfo?.label || language}
            </Badge>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="editor" className="space-y-3">
          {/* Language Selector and Actions */}
          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${lang.color}`} />
                      {lang.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button variant="ghost" size="sm" className="h-8">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Write your ${selectedLanguageInfo?.label || language} code here...`}
              rows={16}
              className="font-mono text-sm resize-none bg-slate-950 text-slate-100 border-slate-800"
              style={{
                tabSize: 2,
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            />

            {/* Line numbers overlay */}
            <div className="absolute left-2 top-2 text-slate-500 text-sm font-mono pointer-events-none select-none">
              {value.split("\n").map((_, index) => (
                <div key={index} style={{ lineHeight: "1.5", height: "21px" }}>
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Lines: {value.split("\n").length}</span>
            <span>Characters: {value.length}</span>
            <span>Language: {selectedLanguageInfo?.label || language}</span>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-3">
          <div className="min-h-[400px] p-4 border rounded-md bg-slate-950 text-slate-100 overflow-x-auto">
            {value ? (
              <pre className="font-mono text-sm">
                <code dangerouslySetInnerHTML={{ __html: formatCode(value) }} />
              </pre>
            ) : (
              <p className="text-slate-400 italic">No code to preview. Switch to Editor tab to write code.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Templates */}
      {!value.trim() && (
        <div className="p-3 border rounded-md bg-muted/50">
          <p className="text-sm font-medium mb-2">Quick Start Templates:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(languageTemplates).map((lang) => (
              <Button
                key={lang}
                variant="outline"
                size="sm"
                onClick={() => {
                  onLanguageChange(lang)
                  onChange(languageTemplates[lang as keyof typeof languageTemplates])
                }}
              >
                {programmingLanguages.find((l) => l.value === lang)?.label || lang}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
