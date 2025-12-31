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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b-4 border-border font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 border-4 border-border bg-primary text-primary-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-tighter decoration-primary decoration-4 group-hover:underline">
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
                    <div className="md:hidden flex items-center gap-4">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 border-4 border-border bg-card shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={cn(
                "md:hidden absolute top-20 left-0 right-0 bg-background border-b-4 border-border p-6 space-y-4 transition-all overflow-hidden",
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            )}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-xl font-black uppercase tracking-tighter hover:text-primary"
                    >
                        {link.name}
                    </Link>
                ))}
                <div className="pt-4 border-t-2 border-border space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold uppercase text-sm">Language</span>
                        <LanguageSwitcher />
                    </div>
                    <Link href="/login" className="block w-full">
                        <Button variant="outline" className="w-full border-4 border-border font-black uppercase rounded-none">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup" className="block w-full">
                        <Button className="w-full border-4 border-border font-black uppercase rounded-none">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
