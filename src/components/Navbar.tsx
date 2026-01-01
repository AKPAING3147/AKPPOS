'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-4 border-border font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 sm:h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group z-50">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 sm:border-4 border-border bg-primary text-primary-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] sm:shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <span className="text-lg sm:text-2xl font-black uppercase tracking-tighter decoration-primary decoration-4 group-hover:underline">
                            AKPPOS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-8 w-1 bg-border mx-2" />

                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <ModeToggle />
                            <Link href="/login">
                                <Button variant="outline" className="border-2 border-border font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                    Join Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3 z-50">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 flex items-center justify-center border-2 border-border bg-background shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Navigation Menu */}
            <div className={cn(
                "md:hidden fixed top-16 sm:top-20 left-0 right-0 bg-background border-b-4 border-border transition-all duration-300 z-40",
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}>
                <div className="p-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-xl font-black uppercase tracking-tighter hover:text-primary border-b-2 border-border pb-3 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t-4 border-border space-y-4">
                        <div className="flex justify-between items-center pb-4">
                            <span className="font-bold uppercase text-sm">Language</span>
                            <LanguageSwitcher />
                        </div>
                        <Link href="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full border-4 border-border font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup" className="block w-full" onClick={() => setIsOpen(false)}>
                            <Button className="w-full border-4 border-border font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                Join Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
