
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, Code2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "./RichTextEditor"
import { CodeEditor } from "./CodeEditor"



export function EditorTabs({
  textValue,
  onTextChange,
  codeValue,
  onCodeChange,
  codeLanguage,
  onLanguageChange,
}) {
  const [activeTab, setActiveTab] = useState("text")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Text Explanation
        </TabsTrigger>
        <TabsTrigger value="code" className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          Code Solution
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="space-y-3 pt-4">
        <Label className="text-sm text-muted-foreground">Explanation</Label>
        <RichTextEditor
          value={textValue}
          onChange={onTextChange}
          placeholder="Explain your approach, complexity analysis, or provide context for your code..."
        />
      </TabsContent>

      <TabsContent value="code" className="space-y-3 pt-4">
        <Label className="text-sm text-muted-foreground">Code</Label>
        <CodeEditor
          value={codeValue}
          onChange={onCodeChange}
          language={codeLanguage}
          onLanguageChange={onLanguageChange}
        />
      </TabsContent>
    </Tabs>
  )
}
