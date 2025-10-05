import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-modern hover:shadow-glow hover:bg-primary/90 hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-white shadow-modern hover:shadow-glow hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:scale-105 active:scale-95",
        outline:
          "border-2 border-border bg-background shadow-modern hover:shadow-glow hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:scale-105 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-modern hover:shadow-glow hover:bg-secondary/80 hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
        gradient:
          "gradient-primary text-white shadow-modern hover:shadow-glow hover:scale-105 active:scale-95",
        gradientSecondary:
          "gradient-secondary text-white shadow-modern hover:shadow-glow hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4 text-base",
        xl: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button}
