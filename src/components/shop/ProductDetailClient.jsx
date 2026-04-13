"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cartStore";
import { toast } from "sonner";

const FALLBACK_IMAGE = "https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image";

function isValidUrl(str) {
    if (!str || typeof str !== "string") return false;
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch { return false; }
}

function StarRow({ rating = 0 }) {
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
    return (
        <div className="flex items-center gap-0.5">
            {stars.map((filled, i) => (
                <span key={i} className={`text-xl ${filled ? "text-amber-400" : "text-gray-200"}`}>★</span>
            ))}
        </div>
    );
}

export default function ProductDetailClient({ product, catLabel = "Beauty" }) {
    const { name, description, price, imageUrl, colors = [], sizes = [], star } = product;

    const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);
    const [selectedSize, setSelectedSize]   = useState(sizes[0] ?? null);
    const [qty, setQty]                     = useState(1);

    const addItem = useCart((s) => s.addItem);

    function handleAddToCart() {
        for (let i = 0; i < qty; i++) {
            addItem({ ...product, selectedColor, selectedSize });
        }
        toast.success(`${name} added to cart!`);
    }

    const imgSrc = isValidUrl(imageUrl) ? imageUrl : FALLBACK_IMAGE;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-10">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-1.5 text-sm text-gray-400">
                <Link href="/" className="hover:text-gray-700 transition">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-gray-700 transition">Products</Link>
                <span>/</span>
                <span className="font-medium text-gray-700">{name}</span>
            </nav>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* ── Image ── */}
                <div className="relative aspect-square w-full max-w-md shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 lg:w-[420px]">
                    <Image
                        src={imgSrc}
                        alt={name ?? "product"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 420px"
                        className="object-contain p-6"
                        priority
                    />
                </div>

                {/* ── Details ── */}
                <div className="flex flex-1 flex-col gap-5">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">{name}</h1>
                        <StarRow rating={star ?? 0} />
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-semibold text-blue-600">${price?.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through">${(price * 1.14).toFixed(2)}</span>
                    </div>

                    {/* Colors */}
                    {colors.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">Choose a color</p>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                                            selectedColor === color
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                            {selectedColor && (
                                <p className="mt-1.5 text-xs text-gray-400">Selected: {selectedColor}</p>
                            )}
                        </div>
                    )}

                    {/* Sizes */}
                    {sizes.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">Choose a size</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                                            selectedSize === size
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                                        }`}
                                    >
                                        {size.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                    )}

                    {/* Qty + Add to cart */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="px-4 py-2.5 text-lg text-gray-600 hover:bg-gray-50 transition"
                            >
                                −
                            </button>
                            <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
                            <button
                                onClick={() => setQty((q) => q + 1)}
                                className="px-4 py-2.5 text-lg text-gray-600 hover:bg-gray-50 transition"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
                        >
                            🛒 Add to cart
                        </button>
                    </div>

                    {/* Returns badge */}
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        <span>↩️</span>
                        <div>
                            <p className="font-medium text-gray-800">Free 30-day returns</p>
                            <p className="text-xs text-gray-400">See return policy details in cart.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

