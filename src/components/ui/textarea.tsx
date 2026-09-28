import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-xs transition-colors outline-none placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50 text-sm dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
