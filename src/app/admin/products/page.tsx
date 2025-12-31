'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
    category: { name: string };
    barcode: string | null;
    isActive: boolean;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Products
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage your inventory and product catalog
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/50">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                                <Package className="w-3 h-3" />
                                {filtered.length} Products
                            </Badge>
                            {filtered.filter(p => p.stock <= 10).length > 0 && (
                                <Badge variant="destructive" className="gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {filtered.filter(p => p.stock <= 10).length} Low Stock
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-muted-foreground">Loading products...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Package className="w-8 h-8 opacity-50" />
                                                    <p>No products found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map(p => (
                                            <TableRow key={p.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{p.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{p.category?.name}</Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold text-cyan-600 dark:text-cyan-400">
                                                    {formatCurrency(p.price)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={p.stock <= 10 ? 'text-red-500 font-bold' : ''}>
                                                            {p.stock}
                                                        </span>
                                                        {p.stock <= 10 && (
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={p.isActive ? 'default' : 'secondary'}>
                                                        {p.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
