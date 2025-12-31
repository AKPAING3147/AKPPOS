import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-2 border-border h-11 w-full bg-background px-3 py-1 text-sm outline-none transition-all placeholder:text-muted-foreground focus:shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
