'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        barcode: '',
        categoryId: '',
        image: '',
    });

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            })
            .catch(console.error);
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.secure_url }));
                setAlert({ type: 'success', message: 'Image uploaded successfully!' });
            } else {
                setAlert({ type: 'error', message: 'Failed to upload image' });
                setImagePreview('');
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Upload error' });
            setImagePreview('');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate category
            if (!formData.categoryId) {
                setAlert({ type: 'error', message: 'Please select a category' });
                setLoading(false);
                return;
            }

            // Validate numbers
            const price = parseFloat(formData.price);
            const stock = parseInt(formData.stock);

            if (isNaN(price) || price < 0) {
                setAlert({ type: 'error', message: 'Please enter a valid price' });
                setLoading(false);
                return;
            }

            if (isNaN(stock) || stock < 0) {
                setAlert({ type: 'error', message: 'Please enter a valid stock quantity' });
                setLoading(false);
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                price: price,
                stock: stock,
                barcode: formData.barcode,
                image: formData.image || null, // Handle empty string
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setAlert({ type: 'success', message: 'Product created successfully!' });
                setTimeout(() => router.push('/admin/products'), 1500);
            } else {
                setAlert({ type: 'error', message: data.error || 'Failed to create product' });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setAlert({ type: 'error', message: 'Network error occurred' });
        } finally {
            setLoading(false);
        }
    };

    // Auto-hide alerts
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="space-y-6 max-w-2xl">
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
                    Add New Product
                </h1>
                <p className="text-muted-foreground mt-1">
                    Create a new product in your inventory
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {imagePreview && (
                            <div className="relative w-48 h-48 rounded-lg border-2 border-border overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="Product preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="image" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors w-fit">
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Product Image</span>
                                        </>
                                    )}
                                </div>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </Label>
                            <p className="text-xs text-muted-foreground mt-2">
                                Upload a clear image of your product
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g., Coca Cola 500ml"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional product description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="barcode">Barcode (Optional)</Label>
                                <Input
                                    id="barcode"
                                    value={formData.barcode || ''}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                    placeholder="123456789"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        disabled={loading || uploading}
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
