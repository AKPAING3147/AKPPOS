'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings as SettingsIcon, Upload, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        companyName: '',
        companyAddress: '',
        companyPhone: '',
        companyEmail: '',
        companyLogo: '',
        taxRate: 0.10,
        currency: 'USD',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, companyLogo: data.secure_url }));
                setAlert({ type: 'success', message: 'Logo uploaded successfully!' });
            } else {
                setAlert({ type: 'error', message: 'Failed to upload logo' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Upload error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setAlert({ type: 'success', message: 'Settings saved successfully!' });
            } else {
                setAlert({ type: 'error', message: 'Failed to save settings' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Save error' });
        } finally {
            setSaving(false);
        }
    };

    // Auto-hide alerts
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Alert */}
            {alert && (
                <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
                    {alert.type === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage company information and invoice settings
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Logo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Company Logo
                        </CardTitle>
                        <CardDescription>Upload your company logo for invoices</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {settings.companyLogo && (
                            <div className="relative w-32 h-32 rounded-lg border-2 border-border overflow-hidden">
                                <Image
                                    src={settings.companyLogo}
                                    alt="Company Logo"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="logo" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors w-fit">
                                    <Upload className="w-4 h-4" />
                                    <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                                </div>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Company Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>This information will appear on invoices</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={settings.companyName}
                                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyPhone">Phone Number</Label>
                                <Input
                                    id="companyPhone"
                                    value={settings.companyPhone || ''}
                                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="companyAddress">Address</Label>
                                <Input
                                    id="companyAddress"
                                    value={settings.companyAddress || ''}
                                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyEmail">Email</Label>
                                <Input
                                    id="companyEmail"
                                    type="email"
                                    value={settings.companyEmail || ''}
                                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                <Input
                                    id="taxRate"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={settings.taxRate}
                                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">Enter as decimal (e.g., 0.10 for 10%)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select
                                    id="currency"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="MMK">MMK - Myanmar Kyat</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Button
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </Button>
            </form>
        </div>
    );
}
