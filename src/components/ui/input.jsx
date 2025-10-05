import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 flex h-11 w-full min-w-0 rounded-xl border-2 bg-transparent px-4 py-2 text-base shadow-modern transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background",
        "dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-primary dark:focus:ring-primary/30",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "hover:border-border/60 dark:hover:border-gray-500",
        className
      )}
      {...props} />
  );
}

export { Input }
