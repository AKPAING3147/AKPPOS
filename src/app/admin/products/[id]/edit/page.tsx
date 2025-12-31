'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, AlertCircle, Loader2, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';
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

interface Category {
    id: string;
    name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        isActive: true,
    });

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await fetch('/api/categories');
                const catData = await catRes.json();
                setCategories(catData);

                // Fetch product
                const prodRes = await fetch(`/api/products/${id}`);
                if (!prodRes.ok) throw new Error('Product not found');
                const prodData = await prodRes.json();

                setFormData({
                    name: prodData.name,
                    description: prodData.description || '',
                    price: prodData.price.toString(),
                    stock: prodData.stock.toString(),
                    barcode: prodData.barcode || '',
                    categoryId: prodData.categoryId,
                    image: prodData.image || '',
                    isActive: prodData.isActive,
                });

                if (prodData.image) {
                    setImagePreview(prodData.image);
                }
            } catch (error) {
                console.error(error);
                setAlert({ type: 'error', message: 'Failed to load product data' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
                setImagePreview(formData.image); // Revert
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Upload error' });
            setImagePreview(formData.image);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Validate numbers
            const price = parseFloat(formData.price);
            const stock = parseInt(formData.stock);

            if (isNaN(price) || price < 0) {
                setAlert({ type: 'error', message: 'Invalid price' });
                setSaving(false);
                return;
            }

            if (isNaN(stock) || stock < 0) {
                setAlert({ type: 'error', message: 'Invalid stock' });
                setSaving(false);
                return;
            }

            const payload = {
                ...formData,
                price,
                stock,
            };

            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setAlert({ type: 'success', message: 'Product updated successfully!' });
                setTimeout(() => router.push('/admin/products'), 1000);
            } else {
                const data = await res.json();
                setAlert({ type: 'error', message: data.error || 'Update failed' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Network error' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/admin/products');
            } else {
                setAlert({ type: 'error', message: 'Failed to delete' });
            }
        } catch (e) {
            setAlert({ type: 'error', message: 'Delete error' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl font-mono">
            {/* Alert */}
            {alert && (
                <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="border-2 border-border bg-card">
                    {alert.type === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className="font-bold uppercase">{alert.message}</AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-border pb-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">
                        Edit Product
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase mt-1">
                        Update inventory details
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2 border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(var(--destructive),0.2)] hover:shadow-none transition-all">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-4 border-border rounded-none bg-card font-mono">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="font-bold uppercase text-muted-foreground">
                                This action cannot be undone. This will permanently delete the product
                                <span className="text-foreground mx-1">"{formData.name}"</span>
                                and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="border-2 border-border rounded-none uppercase font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-none uppercase font-black"
                            >
                                Delete Product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Image */}
                <Card>
                    <CardHeader className="bg-muted border-b-2 border-border">
                        <CardTitle className="uppercase">Product Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {imagePreview && (
                            <div className="relative w-48 h-48 border-2 border-border bg-muted overflow-hidden">
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
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-accent border-2 border-border transition-colors w-fit">
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="font-bold uppercase">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span className="font-bold uppercase">Change Image</span>
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
                        </div>
                    </CardContent>
                </Card>

                {/* Product Details */}
                <Card>
                    <CardHeader className="bg-muted border-b-2 border-border">
                        <CardTitle className="uppercase">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="uppercase font-bold text-xs">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="uppercase"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="uppercase font-bold text-xs">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="uppercase font-bold text-xs">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock" className="uppercase font-bold text-xs">Stock *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="uppercase font-bold text-xs">Category *</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-none border-2 border-border bg-background px-3 py-2 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                            <Label htmlFor="barcode" className="uppercase font-bold text-xs">Barcode</Label>
                            <Input
                                id="barcode"
                                value={formData.barcode}
                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 border-2 border-border rounded-none"
                            />
                            <Label htmlFor="isActive" className="uppercase font-bold text-xs">Active (Visible in POS)</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-border">
                    <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="text-lg uppercase font-black"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 w-4 h-4" />
                                Update Product
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={saving}
                        className="uppercase font-bold border-2 border-border"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
