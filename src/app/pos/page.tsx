'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Search, Plus, Minus, Trash2, ShoppingCart, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Invoice from '@/components/Invoice';
import { ModeToggle } from '@/components/mode-toggle';

interface Product {
    id: string;
    name: string;
    price: string;
    stock: number;
    image: string | null;
    categoryId: string;
    barcode: string | null;
}

interface Category {
    id: string;
    name: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const [pRes, cRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);
                const pData = await pRes.json();
                const cData = await cRes.json();

                // Validate responses are arrays
                if (Array.isArray(pData)) {
                    setProducts(pData);
                } else {
                    console.error('Products fetch error:', pData.error);
                    setProducts([]);
                    setAlert({ type: 'error', message: pData.error || 'Failed to load products' });
                }

                if (Array.isArray(cData)) {
                    setCategories(cData);
                } else {
                    console.error('Categories fetch error:', cData.error);
                    setCategories([]);
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
                setAlert({ type: 'error', message: 'Failed to load products' });
                setProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.barcode && p.barcode.includes(search));
            return matchCategory && matchSearch;
        });
    }, [products, selectedCategory, search]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    setAlert({ type: 'error', message: `Only ${product.stock} items available in stock` });
                    return prev;
                }
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    if (newQty <= 0) return null;
                    if (newQty > item.product.stock) {
                        setAlert({ type: 'error', message: `Only ${item.product.stock} items available` });
                        return item;
                    }
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean) as CartItem[];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const subTotal = cart.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
    const tax = subTotal * 0.1;
    const total = subTotal + tax;

    const handleCheckoutClick = () => {
        if (cart.length === 0) {
            setAlert({ type: 'error', message: 'Cart is empty' });
            return;
        }
        setShowConfirmDialog(true);
    };

    const handleCheckoutConfirm = async () => {
        setShowConfirmDialog(false);
        setCheckoutLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(i => ({
                        productId: i.product.id,
                        quantity: i.quantity,
                        price: parseFloat(i.product.price),
                        name: i.product.name
                    })),
                    paymentMethod: 'CASH',
                    totalAmount: total,
                    subTotal,
                    tax,
                    discount: 0,
                }),
            });

            if (res.ok) {
                const order = await res.json();

                // Prepare invoice data
                setOrderData({
                    orderId: order.id,
                    items: cart.map(i => ({
                        name: i.product.name,
                        quantity: i.quantity,
                        price: parseFloat(i.product.price)
                    })),
                    subTotal,
                    tax,
                    discount: 0,
                    total,
                    paymentMethod: 'CASH',
                    date: new Date(),
                });

                // Clear cart
                setCart([]);

                // Show success alert
                setAlert({ type: 'success', message: 'Order completed successfully!' });

                // Refresh products to update stock
                const pRes = await fetch('/api/products');
                const pData = await pRes.json();
                setProducts(pData);

                // Show invoice
                setTimeout(() => setShowInvoice(true), 500);
            } else {
                const err = await res.json();
                setAlert({ type: 'error', message: err.error || 'Order failed' });
            }
        } catch (e) {
            setAlert({ type: 'error', message: 'Order failed. Please try again.' });
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    // Auto-hide alerts after 5 seconds
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="flex h-screen overflow-hidden bg-background font-mono text-foreground">
            {/* Alert */}
            {alert && (
                <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top">
                    <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="shadow-lg">
                        {alert.type === 'success' ? (
                            <CheckCircle className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Left Side: Products */}
            <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">
                            AKPPOS TERMINAL
                        </h1>
                        <p className="text-sm text-muted-foreground">Sales & Checkout System</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search product..."
                                className="w-64 pl-9"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <ModeToggle />
                        <Button variant="outline" size="icon" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Badge
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('all')}
                        className="cursor-pointer px-4 py-2"
                    >
                        All
                    </Badge>
                    {categories.map(c => (
                        <Badge
                            key={c.id}
                            variant={selectedCategory === c.id ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(c.id)}
                            className="cursor-pointer px-4 py-2"
                        >
                            {c.name}
                        </Badge>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
                    {filteredProducts.map(product => (
                        <Card
                            key={product.id}
                            className="cursor-pointer hover:shadow-lg hover:border-primary transition-all active:scale-95 flex flex-col justify-between overflow-hidden group"
                            onClick={() => addToCart(product)}
                        >
                            <div className="h-32 bg-secondary border-b-2 border-border w-full flex items-center justify-center relative overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                                ) : (
                                    <ShoppingCart className="w-12 h-12 text-slate-400" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-primary font-bold">{formatCurrency(product.price)}</span>
                                    <Badge variant={product.stock <= 10 ? 'destructive' : 'secondary'} className="text-xs">
                                        {product.stock} left
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Side: Cart */}
            <div className="w-96 bg-card border-l-2 border-border flex flex-col shadow-[-4px_0px_0px_0px_rgba(var(--shadow),1)]">
                <div className="p-4 border-b-2 border-border bg-primary text-primary-foreground">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> Current Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                            <p>Cart is empty</p>
                            <p className="text-xs mt-2">Click products to add</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <Card key={item.product.id} className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                                        <p className="text-xs text-primary font-bold">{formatCurrency(item.product.price)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.product.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }}>
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-sm w-8 text-center font-semibold">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }}>
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <span className="font-bold text-sm">{formatCurrency(parseFloat(item.product.price) * item.quantity)}</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="p-4 bg-muted space-y-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span className="font-semibold">{formatCurrency(subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Tax (10%)</span>
                        <span className="font-semibold">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                    </div>

                    <Button
                        className="w-full h-12 text-lg font-bold"
                        onClick={handleCheckoutClick}
                        disabled={cart.length === 0 || checkoutLoading}
                    >
                        {checkoutLoading ? 'Processing...' : 'Complete Order'}
                    </Button>
                </div>
            </div>

            {/* Checkout Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to complete this order for {formatCurrency(total)}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCheckoutConfirm}>
                            Confirm & Print Receipt
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Invoice Dialog */}
            <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Receipt</DialogTitle>
                    </DialogHeader>
                    {orderData && <Invoice orderData={orderData} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
