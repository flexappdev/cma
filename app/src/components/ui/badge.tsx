import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:   "border-transparent bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:     "border-zinc-600 text-zinc-400",
        blue:        "border-transparent bg-blue-900/60 text-blue-300",
        purple:      "border-transparent bg-purple-900/60 text-purple-300",
        teal:        "border-transparent bg-teal-900/60 text-teal-300",
        pink:        "border-transparent bg-pink-900/60 text-pink-300",
        rose:        "border-transparent bg-rose-900/60 text-rose-300",
        orange:      "border-transparent bg-orange-900/60 text-orange-300",
        yellow:      "border-transparent bg-yellow-900/60 text-yellow-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
