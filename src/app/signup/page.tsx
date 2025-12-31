'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Store, Lock, Mail, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

export default function SignupPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 3);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setFormData({ ...formData, password: newPassword });
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-300';
        if (passwordStrength === 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength === 1) return t('weak');
        if (passwordStrength === 2) return t('medium');
        return t('strong');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordMismatch'));
            setLoading(false);
            return;
        }

        if (passwordStrength < 2) {
            setError(t('passwordRequirements'));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Success - redirect to login
            window.location.href = '/login?registered=true';

        } catch (err) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background font-mono text-foreground">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-muted border-r-2 border-border relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.3]"
                    style={{ backgroundImage: 'linear-gradient(hsl(var(--foreground)/0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">JOIN AKPPOS</h1>
                    <div className="inline-block border-2 border-border p-4 bg-card shadow-[8px_8px_0px_0px_rgba(var(--shadow),1)]">
                        <p className="text-xl font-bold uppercase">Start Managing Today</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-background relative">
                {/* Language Switcher */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <LanguageSwitcher />
                    <ModeToggle />
                </div>

                <div className="w-full max-w-md space-y-8 p-8 border-2 border-border shadow-[8px_8px_0px_0px_rgba(var(--shadow),1)] bg-card">
                    <div className="text-center border-b-2 border-border pb-6">
                        <h2 className="text-3xl font-black uppercase tracking-tight">
                            {t('createAccount')}
                        </h2>
                        <p className="text-sm font-bold text-muted-foreground mt-2 uppercase">
                            Register new terminal
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">{t('name')}</Label>
                            <Input
                                type="text"
                                placeholder="OPERATOR NAME"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">{t('email')}</Label>
                            <Input
                                type="email"
                                placeholder="OPERATOR@AKPPOS.COM"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">{t('password')}</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1 h-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 transition-all border border-border ${level <= passwordStrength ? getStrengthColor() : 'bg-muted'}`}
                                            />
                                        ))}
                                    </div>
                                    {getStrengthText() && (
                                        <p className="text-xs text-muted-foreground font-bold uppercase">
                                            {t('passwordStrength')}: {getStrengthText()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs">{t('confirmPassword')}</Label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                {passwordsMatch && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                                )}
                                {passwordsDontMatch && (
                                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                )}
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-muted border-2 border-border p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                                <p className="text-xs font-bold text-muted-foreground">
                                    {t('passwordRequirements')}
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-600 font-bold text-sm uppercase">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-lg font-black uppercase"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('processing')}
                                </>
                            ) : (
                                t('createAccount')
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center pt-4 border-t-2 border-border">
                        <p className="text-sm font-bold text-muted-foreground uppercase">
                            {t('alreadyHaveAccount')}{' '}
                            <Link href="/login" className="text-foreground hover:underline decoration-2">
                                {t('signIn')}
                            </Link>
                        </p>
                    </div>

                    {/* Footer Credit */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-muted-foreground font-bold uppercase">
                            Created by <Link href="https://github.com/AKPAING3147" className="text-foreground hover:underline">AKPaing</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
