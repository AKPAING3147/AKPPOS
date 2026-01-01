'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useLanguage();

    // Detect mobile and auto-close sidebar
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile sidebar when route changes
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [pathname, isMobile]);

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
        <div className="flex h-screen bg-background font-mono text-foreground overflow-hidden">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "bg-background border-r-2 border-border flex flex-col transition-all duration-300 z-50",
                isMobile
                    ? cn(
                        "fixed inset-y-0 left-0 w-64",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )
                    : cn(sidebarOpen ? "w-64" : "w-20")
            )}>
                <div className="p-4 md:p-6 border-b-2 border-border">
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
                            className={cn(
                                "w-10 h-10 flex items-center justify-center border-2 border-border transition-all duration-0",
                                isMobile && sidebarOpen
                                    ? "bg-red-500 text-white hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                                    : "bg-background hover:bg-primary hover:text-primary-foreground shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] hover:shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)]"
                            )}
                        >
                            {isMobile && sidebarOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
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
                                    !sidebarOpen && !isMobile && "justify-center px-2"
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {(sidebarOpen || isMobile) && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t-2 border-border space-y-2">
                    <div className={cn(
                        "flex gap-2 items-center",
                        sidebarOpen || isMobile ? "justify-between" : "flex-col"
                    )}>
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full gap-3 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-600",
                            !sidebarOpen && !isMobile && "justify-center"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {(sidebarOpen || isMobile) && t('logout')}
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
                <header className="h-16 md:h-20 border-b-2 border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 relative z-20">
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Mobile Menu Button - Enhanced */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-0"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Mobile Logo (when sidebar closed) */}
                        {isMobile && !sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                <span className="font-black uppercase tracking-tighter text-sm">AKPPOS</span>
                            </div>
                        )}

                        {/* Page Title */}
                        <h2 className="text-base md:text-xl font-black uppercase tracking-tight hidden sm:block">
                            {pathname.split('/').pop() || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-sm font-black uppercase tracking-tight">System Operator</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Terminal_01 // Active</span>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-border bg-card flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)]">
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
