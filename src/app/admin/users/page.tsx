'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Users, Shield } from 'lucide-react';
import Link from 'next/link';

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

    return (
        <div className="space-y-6 font-mono">
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
