'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            if (data.user.role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/pos';
            }

        } catch (err) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background font-mono text-foreground">
            <div className="hidden lg:flex flex-col justify-center items-center bg-muted border-r-2 border-border relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.3]"
                    style={{ backgroundImage: 'linear-gradient(hsl(var(--foreground)/0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-8xl font-black uppercase tracking-tighter mb-4">AKPPOS</h1>
                    <div className="inline-block border-2 border-border p-4 bg-card shadow-[8px_8px_0px_0px_rgba(var(--shadow),1)]">
                        <p className="text-xl font-bold uppercase">System Access Terminal</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center p-8 bg-background relative">
                <div className="absolute top-6 right-6 flex gap-2">
                    <LanguageSwitcher />
                    <ModeToggle />
                </div>

                <div className="w-full max-w-md space-y-8 p-8 border-2 border-border shadow-[8px_8px_0px_0px_rgba(var(--shadow),1)] bg-card">
                    <div className="text-center border-b-2 border-border pb-6">
                        <h2 className="text-3xl font-black uppercase tracking-tight">
                            {t('login')}
                        </h2>
                        <p className="text-sm font-bold text-muted-foreground mt-2 uppercase">
                            Enter credentials
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">Email</Label>
                            <Input
                                type="email"
                                placeholder="ADMIN@EXAMPLE.COM"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="w-4 h-4" />
                                <AlertDescription className="font-black uppercase">{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-black uppercase">
                            {loading ? <Loader2 className="mr-2 animate-spin" /> : t('signIn')}
                        </Button>
                    </form>

                    <div className="text-center pt-4 border-t-2 border-border">
                        <Link href="/signup">
                            <Button variant="link" className="uppercase font-bold text-xs">
                                {t('createAccount')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-xs font-bold uppercase text-muted-foreground">
                    Made by <a href="https://github.com/AKPAING3147" className="text-foreground hover:underline">AKPaing</a>
                </div>
            </div>
        </div>
    );
}
