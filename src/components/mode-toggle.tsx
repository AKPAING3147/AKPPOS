"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Static button for SSR/Initial Client Render (prevents hydration mismatch)
    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="h-10 w-10 border-2 border-border rounded-none shadow-[4px_4px_0px_0px_rgb(var(--shadow)/1)] transition-all">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 border-2 border-border rounded-none shadow-[4px_4px_0px_0px_rgb(var(--shadow)/1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(var(--shadow)/1)] transition-all">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-4 border-border rounded-none shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] bg-background min-w-[140px]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer font-black uppercase hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-none text-foreground py-3 text-sm transition-all duration-0">
                    LIGHT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer font-black uppercase hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-none text-foreground py-3 text-sm transition-all duration-0">
                    DARK
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer font-black uppercase hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-none text-foreground py-3 text-sm transition-all duration-0">
                    SYSTEM
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
