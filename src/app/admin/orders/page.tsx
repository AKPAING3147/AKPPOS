'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Receipt, Calendar, CreditCard } from 'lucide-react';

interface Order {
    id: string;
    totalAmount: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
    cashier: {
        name: string;
    } | null;
    items: Array<{
        quantity: number;
        price: string;
        product: {
            name: string;
        };
    }>;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'CASH':
                return '💵';
            case 'CARD':
                return '💳';
            case 'QR':
                return '📱';
            default:
                return '💰';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Order History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View all completed transactions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                        <Receipt className="w-3 h-3" />
                        {orders.length} Orders
                    </Badge>
                </div>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-muted-foreground">Loading orders...</p>
                            </div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Receipt className="w-12 h-12 opacity-50 mb-3" />
                            <p>No orders yet</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Cashier</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map(order => (
                                        <TableRow key={order.id} className="hover:bg-muted/50">
                                            <TableCell className="font-mono text-xs">
                                                #{order.id.substring(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(order.createdAt), 'PP')}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(new Date(order.createdAt), 'p')}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="gap-1">
                                                    <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                                                    {order.paymentMethod}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {order.cashier?.name || 'Staff'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary">
                                                {formatCurrency(order.totalAmount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="default" className="bg-green-500">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
