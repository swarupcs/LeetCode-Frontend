
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// interface InputFieldProps {
//   label: string
//   value: string
//   onChange: (value: string) => void
//   placeholder?: string
//   multiline?: boolean
//   required?: boolean
//   className?: string
// }

export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  multiline = false,
  required = false,
  className,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const showError = required && isTouched && !value

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {showError && <span className="text-xs text-red-500">This field is required</span>}
      </div>

      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("min-h-[120px]", showError && "border-red-500 focus-visible:ring-red-500")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            setIsTouched(true)
          }}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(showError && "border-red-500 focus-visible:ring-red-500")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            setIsTouched(true)
          }}
        />
      )}
    </div>
  )
}
