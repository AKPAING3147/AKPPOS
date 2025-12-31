import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-border shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] duration-0",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-border shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] duration-0",
                outline:
                    "bg-background text-foreground border-2 border-border shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] duration-0",
                secondary:
                    "bg-secondary text-secondary-foreground border-2 border-border shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] duration-0",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2 has-[>svg]:px-4",
                sm: "h-9 px-3 gap-1.5 has-[>svg]:px-2.5 text-xs shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                lg: "h-14 px-8 has-[>svg]:px-6 text-lg shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[6px] hover:translate-y-[6px]",
                icon: "size-11 shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                "icon-sm": "size-9 shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                "icon-lg": "size-14 shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[4px] hover:translate-y-[4px]",
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
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
