
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bold, Italic, Code, Link, List, Quote } from "lucide-react"


export function CommentEditor({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  submitText = "Comment",
  isSubmitting = false,
  showCancel = false,
  compact = false,
}) {
    const textareaRef = useRef(null);


  const insertText = (before, after = "", placeholder = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 10)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          {!compact && (
            <div className="flex gap-1 p-1 border rounded-md bg-muted/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => insertText("**", "**", "bold")}
                title="Bold"
              >
                <Bold className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => insertText("*", "*", "italic")}
                title="Italic"
              >
                <Italic className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => insertText("`", "`", "code")}
                title="Code"
              >
                <Code className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => insertText("> ", "", "quote")}
                title="Quote"
              >
                <Quote className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => insertText("* ", "", "list item")}
                title="List"
              >
                <List className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  const url = prompt("Enter URL:")
                  if (url) insertText("[", `](${url})`, "link text")
                }}
                title="Link"
              >
                <Link className="w-3 h-3" />
              </Button>
            </div>
          )}

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={compact ? 3 : 4}
            className="resize-none text-sm"
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {compact ? "Ctrl+Enter to submit" : "Markdown supported • Ctrl+Enter to submit"}
            </p>
            <div className="flex gap-2">
              {showCancel && (
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button size="sm" onClick={onSubmit} disabled={!value.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : submitText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
