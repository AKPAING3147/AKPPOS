'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Users, Shield, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
    createdAt: string;
}

// ... (imports remain)

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Invalid users data', data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                setAlert({ type: 'success', message: 'User deleted successfully' });
            } else {
                const data = await res.json();
                setAlert({ type: 'error', message: data.error || 'Failed to delete user' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Something went wrong' });
        }
    };

    return (
        <div className="space-y-6 font-mono relative">
            {/* Alert Notification */}
            {alert && (
                <div className="fixed top-24 right-8 z-[60] w-full max-w-md animate-in slide-in-from-right duration-300">
                    <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
                        {alert.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        <AlertDescription className="font-black">{alert.message.toUpperCase()}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-border pb-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">
                        Users
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase mt-1">
                        Manage user accounts and roles
                    </p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="bg-muted border-b-2 border-border">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="SEARCH USERS..."
                                className="pl-9 uppercase"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1 border-2 border-border rounded-none px-3 py-1 font-bold">
                                <Users className="w-3 h-3" />
                                {filtered.length} Users
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-bold uppercase">Loading users...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="border-t-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                        <TableHead className="text-primary-foreground font-bold uppercase">Name</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Email</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Role</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Joined</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="w-8 h-8 opacity-50" />
                                                    <p className="uppercase font-bold">No users found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map(u => (
                                            <TableRow key={u.id} className="hover:bg-accent font-bold border-b-2 border-border">
                                                <TableCell className="font-bold uppercase">{u.name}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'} className="gap-1 rounded-none border-2 border-transparent">
                                                        {u.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                                        {u.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-white hover:bg-destructive rounded-none">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="border-4 border-border rounded-none bg-card font-mono">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Remove User?</AlertDialogTitle>
                                                                <AlertDialogDescription className="font-bold uppercase text-muted-foreground">
                                                                    Are you sure you want to delete <span className="text-foreground">"{u.name}"</span>?
                                                                    This user will no longer be able to access the system.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter className="gap-2 pt-4">
                                                                <AlertDialogCancel className="border-2 border-border rounded-none uppercase font-bold">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(u.id)}
                                                                    className="bg-destructive text-white rounded-none uppercase font-black hover:bg-destructive/90"
                                                                >
                                                                    Delete Account
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
