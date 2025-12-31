'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, Menu, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { t } = useLanguage();

    const navItems = [
        { name: t('dashboard'), href: '/admin', icon: LayoutDashboard },
        { name: t('products'), href: '/admin/products', icon: ShoppingBag },
        { name: t('orders'), href: '/admin/orders', icon: ShoppingCart },
        { name: t('users'), href: '/admin/users', icon: Users },
        { name: t('settings'), href: '/admin/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-background font-mono text-foreground">
            {/* Sidebar */}
            <aside className={cn(
                "bg-background border-r-2 border-border flex flex-col transition-all duration-0 z-10",
                sidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="p-6 border-b-2 border-border">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-border bg-primary text-primary-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)]">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black tracking-tighter uppercase">
                                        AKPPOS
                                    </h1>
                                    <p className="text-xs text-muted-foreground font-bold uppercase">Admin Panel</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-accent border-2 border-transparent hover:border-border transition-all duration-0"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-0 border-2",
                                    isActive
                                        ? "bg-primary text-primary-foreground border-border shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)]"
                                        : "text-foreground border-transparent hover:border-border hover:bg-accent hover:shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:-translate-y-1",
                                    !sidebarOpen && "justify-center px-2"
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t-2 border-border space-y-2">
                    <div className="flex gap-2 justify-between items-center">
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>
                    <Button
                        variant="ghost"
                        className={cn("w-full gap-3 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-600", !sidebarOpen && "justify-center")}
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {sidebarOpen && t('logout')}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-muted relative selection:bg-primary selection:text-primary-foreground">
                {/* Dotted Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Top Bar */}
                <header className="h-20 border-b-2 border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 relative z-20">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <div className="flex items-center gap-2 md:hidden">
                                <ShoppingCart className="w-6 h-6 text-primary" />
                                <span className="font-black uppercase tracking-tighter">AKPPOS</span>
                            </div>
                        )}
                        <h2 className="text-xl font-black uppercase tracking-tight hidden md:block">
                            {pathname.split('/').pop() || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-black uppercase tracking-tight">System Operator</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Terminal_01 // Active</span>
                        </div>
                        <div className="w-10 h-10 border-2 border-border bg-card flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)]">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
