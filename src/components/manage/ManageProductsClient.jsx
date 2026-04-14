"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import {
    createProductAction,
    updateProductAction,
    deleteProductAction,
} from "../../../action/product.action";

const FALLBACK = "https://placehold.co/600x600/f3f4f6/9ca3af.png?text=No+Image";

const COLOR_OPTIONS = ["green", "gray", "red", "blue", "white"];
const SIZE_OPTIONS  = ["s", "m", "l", "xl", "xxl", "xxxl"];


function Stars({ count = 0 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={12}
                    className={n <= count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                />
            ))}
            {count > 0 && <span className="ml-1 text-xs text-gray-500">{count}</span>}
        </div>
    );
}

function ProductCard({ product, categories, onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState(
        product.imageUrl?.startsWith("http") ? product.imageUrl : FALLBACK
    );

    const category = categories.find((c) => c.categoryId === product.categoryId);

    return (
        <div className="relative rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Image */}
            <div className="relative aspect-square bg-gray-50">
                <Image
                    src={imgSrc}
                    alt={product.name ?? "product"}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => setImgSrc(FALLBACK)}
                />

                {/* 3-dot menu */}
                <div className="absolute top-2 right-2">
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-gray-500 hover:text-gray-900"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-32 rounded-xl border border-gray-100 bg-white shadow-lg z-10">
                            <button
                                onClick={() => { setMenuOpen(false); onEdit(product); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                            >
                                <Pencil size={13} /> Edit
                            </button>
                            <button
                                onClick={() => { setMenuOpen(false); onDelete(product.productId); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-b-xl"
                            >
                                <Trash2 size={13} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <Stars count={product.star ?? 0} />
                <p className="mt-1 font-semibold text-gray-900 truncate">{product.name}</p>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-gray-700 font-medium">${product.price}</p>
                    {category && (
                        <span className="rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-700">
                            {category.name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}


function TogglePill({ label, selected, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition
                ${selected
                    ? "border-lime-400 bg-lime-50 text-gray-900 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
        >
            <span className={`h-2.5 w-2.5 rounded-full border-2 transition
                ${selected ? "border-lime-500 bg-lime-400" : "border-gray-300 bg-white"}`}
            />
            {label}
        </button>
    );
}


function Field({ label, name, value, onChange, type = "text", placeholder, textarea }) {
    const cls = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400";
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            {textarea
                ? <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={cls} />
                : <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={cls} />
            }
        </div>
    );
}

// ─── Create / Edit modal ───────────────────────────────────────────────────────
function ProductFormModal({ product, categories, onClose, onSave }) {
    const isEdit = !!product;

    const [form, setForm] = useState({
        name:        product?.name ?? "",
        price:       product?.price ?? "",
        categoryId:  product?.categoryId ?? "",
        imageUrl:    product?.imageUrl ?? "",
        description: product?.description ?? "",
        colors:      product?.colors ?? [],
        sizes:       product?.sizes ?? [],
    });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function toggleColor(color) {
        setForm((prev) => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter((c) => c !== color)
                : [...prev.colors, color],
        }));
    }

    function toggleSize(size) {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        await onSave({
            name:        form.name,
            description: form.description,
            imageUrl:    form.imageUrl,
            price:       Number(form.price),
            categoryId:  form.categoryId,
            colors:      form.colors,
            sizes:       form.sizes,
        });
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isEdit ? "Edit product" : "Create product"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <p className="mb-5 text-xs text-gray-400">Changes are saved to the server immediately.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Centella Toner" />
                        <Field label="Price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" />
                    </div>

                    {/* Category + Image URL */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                            >
                                <option value="">Select...</option>
                                {categories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <Field label="Image URL (optional)" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                    </div>

                    {/* Colors */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTIONS.map((c) => (
                                <TogglePill
                                    key={c}
                                    label={c}
                                    selected={form.colors.includes(c)}
                                    onToggle={() => toggleColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZE_OPTIONS.map((s) => (
                                <TogglePill
                                    key={s}
                                    label={s}
                                    selected={form.sizes.includes(s)}
                                    onToggle={() => toggleSize(s)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <Field
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description shown on the product card.."
                        textarea
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-lime-300 disabled:opacity-60 transition"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {isEdit ? "Save changes" : "Create product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────
function DeleteConfirmModal({ product, onCancel, onConfirm, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-1 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Delete product?</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-700">
                        <X size={18} />
                    </button>
                </div>
                <p className="mb-5 text-sm text-gray-500">
                    This will remove <span className="font-medium text-gray-800">{product.name}</span>.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ManageProductsClient({ initialProducts, categories }) {
    const [products, setProducts]       = useState(initialProducts);
    const [showModal, setShowModal]     = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [sort, setSort]               = useState("name-asc");

    function openCreate() {
        setEditProduct(null);
        setShowModal(true);
    }

    function openEdit(product) {
        setEditProduct(product);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditProduct(null);
    }

    async function handleDelete(productId) {
        const product = products.find((p) => p.productId === productId);
        if (product) setDeleteTarget(product);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        const productId = deleteTarget.productId;
        setDeleteLoading(true);
        const res = await deleteProductAction(productId);
        setDeleteLoading(false);
        if (res) {
            setProducts((prev) => prev.filter((p) => p.productId !== productId));
            toast.success("Product deleted.");
        } else {
            toast.error("Failed to delete product.");
        }
        setDeleteTarget(null);
    }

    async function handleSave(data) {
        if (editProduct) {
            const updated = await updateProductAction(editProduct.productId, data);
            if (updated) {
                setProducts((prev) =>
                    prev.map((p) => (p.productId === updated.productId ? updated : p))
                );
                toast.success("Product updated.");
                closeModal();
            } else {
                toast.error("Failed to update product.");
            }
        } else {
            const created = await createProductAction(data);
            if (created) {
                setProducts((prev) => [created, ...prev]);
                toast.success("Product created.");
                closeModal();
            } else {
                toast.error("Failed to create product.");
            }
        }
    }

    const sorted = [...products].filter(Boolean).sort((a, b) => {
        if (sort === "name-asc")    return a.name.localeCompare(b.name);
        if (sort === "name-desc")   return b.name.localeCompare(a.name);
        if (sort === "price-asc")   return a.price - b.price;
        if (sort === "price-desc")  return b.price - a.price;
        return 0;
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">

            {/* Page header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Create, update, and delete products.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                    </select>
                </div>
            </div>

            {/* Products panel */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Products</h2>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-lime-300 transition"
                    >
                        <Plus size={16} />
                        Create product
                    </button>
                </div>

                {sorted.length === 0 ? (
                    <p className="py-20 text-center text-gray-400">No products yet. Click &quot;Create product&quot; to add one.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sorted.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                                categories={categories}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <ProductFormModal
                    product={editProduct}
                    categories={categories}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteConfirmModal
                    product={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}

