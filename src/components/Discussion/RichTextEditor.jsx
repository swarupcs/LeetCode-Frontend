"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"



const programmingLanguages = [
  "javascript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "typescript",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "bash",
  "json",
  "xml",
  "yaml",
]

export function RichTextEditor({ value, onChange, placeholder }) {
  const [activeTab, setActiveTab] = useState("write")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const textareaRef = useRef(null)

  const insertText = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange(newValue)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectedText
        ? start + before.length + selectedText.length + after.length
        : start + before.length + placeholder.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 10)
  }

  const insertCodeBlock = (language = selectedLanguage) => {
    insertText(`\n\`\`\`${language}\n`, `\n\`\`\`\n`, "// Your code here")
  }

  const insertInlineCode = () => {
    insertText("`", "`", "code")
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      insertText(`[`, `](${url})`, "link text")
    }
  }

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      insertText(`![`, `](${url})`, "alt text")
    }
  }

  const formatMarkdown = (text) => {
    // Simple markdown to HTML conversion for preview
    return text
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code>$2</code></pre>',
      )
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>')
      .replace(/^\* (.*$)/gm, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gm, "<li>$1</li>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write" className="flex items-center gap-2">
            <Heading1 className="w-4 h-4" />
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value="write" className="space-y-3">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
            {/* Text Formatting */}
            {/* <div className="flex gap-1 border-r pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("# ", "", "Heading 1")}
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("## ", "", "Heading 2")}
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("### ", "", "Heading 3")}
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </Button>
            </div> */}

            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("**", "**", "bold text")}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("*", "*", "italic text")}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("~~", "~~", "strikethrough")}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
            </div>

            {/* Lists and Quotes */}
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("* ", "", "List item")}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("1. ", "", "List item")}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertText("> ", "", "Quote")}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </Button>
            </div>

            {/* Code */}
            {/* <div className="flex gap-1 border-r pr-2 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={insertInlineCode}
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-8 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => insertCodeBlock()}
                title="Code Block"
              >
                Code Block
              </Button>
            </div> */}

            {/* Links and Images */}
            {/* <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertLink} title="Link">
                <Link className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={insertImage}
                title="Image"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div> */}
          </div>

          {/* Text Area */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your post content here... (Markdown supported)"}
            rows={12}
            className="font-mono text-sm resize-none"
          />

          {/* Quick Reference */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Quick Reference:</strong> **bold** *italic* `code` [link](url) ![image](url)
            </p>
            <p>Use the toolbar buttons above or type markdown directly</p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-3">
          <div className="min-h-[300px] p-4 border rounded-md bg-background">
            {value ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }} />
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview yet. Switch to Write tab to add content.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
