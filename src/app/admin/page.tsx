'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, ShoppingCart, Package, TrendingUp, ArrowUp, ArrowDown, ShoppingBag, Download, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard/stats');
                const data = await res.json();
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-primary font-bold uppercase">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) return <div>Failed to load stats.</div>;

    const statCards = [
        {
            title: "Today's Sales",
            value: formatCurrency(stats.todaySales),
            subtitle: `${stats.todayOrderCount} orders`,
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            subtitle: "All time",
            icon: ShoppingCart,
            trend: "+8.2%",
            trendUp: true,
        },
        {
            title: "Low Stock Items",
            value: stats.lowStockCount,
            subtitle: "Needs attention",
            icon: Package,
            trend: stats.lowStockCount > 0 ? "Action needed" : "All good",
            trendUp: false,
        },
        {
            title: "Revenue",
            value: formatCurrency(stats.todaySales * 30),
            subtitle: "Monthly estimate",
            icon: TrendingUp,
            trend: "+23.1%",
            trendUp: true,
        }
    ];

    return (
        <div className="space-y-8 font-mono">
            {/* Header */}
            <div className="border-b-2 border-border pb-6">
                <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-muted-foreground font-bold uppercase">Monitor your business performance in real-time</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(var(--shadow),1)]"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-border bg-muted">
                            <CardTitle className="text-sm font-bold uppercase text-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 border-2 border-border bg-card shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)]">
                                <stat.icon className="h-4 w-4 text-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-black text-foreground mb-1">
                                {stat.value}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-muted-foreground uppercase">
                                    {stat.subtitle}
                                </p>
                                <div className={`flex items-center gap-1 text-xs font-bold border-2 border-border px-1.5 py-0.5 ${stat.trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                    {stat.trendUp ? (
                                        <ArrowUp className="w-3 h-3" />
                                    ) : (
                                        <ArrowDown className="w-3 h-3" />
                                    )}
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="text-foreground">
                    <CardHeader className="border-b-2 border-border bg-primary text-primary-foreground">
                        <CardTitle className="uppercase">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <a href="/admin/products/new" className="block p-4 border-2 border-border hover:bg-primary hover:text-primary-foreground transition-all shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                            <div className="flex items-center justify-between">
                                <span className="font-bold uppercase">Add New Product</span>
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                        </a>
                        <a href="/pos" className="block p-4 border-2 border-border hover:bg-primary hover:text-primary-foreground transition-all shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                            <div className="flex items-center justify-between">
                                <span className="font-bold uppercase">Open POS Terminal</span>
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b-2 border-border bg-muted">
                        <CardTitle className="uppercase">Low Stock Alerts</CardTitle>
                        <a href="/api/reports/low-stock" target="_blank" className="text-xs font-bold uppercase text-blue-600 hover:underline flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            Download CSV
                        </a>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {stats.lowStockProducts?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.lowStockProducts.map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 border-2 border-destructive bg-destructive/10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-card border-2 border-destructive rounded-none shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
                                                <Package className="w-4 h-4 text-destructive" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground uppercase">{product.name}</p>
                                                <p className="text-xs font-bold text-destructive uppercase">Stock: {product.stock}</p>
                                            </div>
                                        </div>
                                        <a href={`/admin/products/${product.id}/edit`} className="text-xs font-bold uppercase bg-card border-2 border-border px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                                            Restock
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                <p className="font-bold uppercase">All items well stocked</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
