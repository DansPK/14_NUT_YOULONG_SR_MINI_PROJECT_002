"use client";

import { useCart, selectTotalPrice, selectTotalQuantity } from "@/store/cartStore";
import { createOrderAction } from "../../../../action/order.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "https://placehold.co/80x80/f3f4f6/9ca3af?text=?";

function isValidUrl(str) {
    if (!str || typeof str !== "string") return false;
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export default function CartPage() {
    const items      = useCart((s) => s.items);
    const addItem    = useCart((s) => s.addItem);
    const removeItem = useCart((s) => s.removeItem);
    const deleteItem = useCart((s) => s.deleteItem);
    const clearCart  = useCart((s) => s.clearCart);
    const totalPrice = useCart(selectTotalPrice);
    const totalQty   = useCart(selectTotalQuantity);
    const router     = useRouter();

    async function handleCheckout() {
        if (items.length === 0) return;

        // Map cart items to API { productId, orderQty }
        const orderDetailRequests = items.map((i) => ({
            productId: i.productId,
            orderQty: i.quantity,
        }));

        const toastId = toast.loading("Placing your order...");
        const result  = await createOrderAction(orderDetailRequests);

        if (result.success) {
            clearCart();
            toast.success("Order placed successfully!", { id: toastId });
            router.push("/orders");
        } else {
            toast.error("Failed to place order. Please try again.", { id: toastId });
        }
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-3 px-4 py-20 text-center">
                <p className="text-5xl">🛒</p>
                <p className="text-2xl font-semibold text-gray-900">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add some products from the shop to get started.</p>
                <Link href="/products" className="mt-4 rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-lime-300">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10">
            <h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-500">
                {totalQty} item{totalQty !== 1 ? "s" : ""}
            </p>

            {/* Cart items */}
            <div className="mt-8 flex flex-col gap-3">
                {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        {/* Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                            <Image
                                src={isValidUrl(item.imageUrl) ? item.imageUrl : FALLBACK_IMAGE}
                                alt={item.name ?? item.productName ?? "product"}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </div>

                        {/* Name + price */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900">
                                {item.name ?? item.productName ?? "Product"}
                            </p>
                            <p className="mt-0.5 text-sm text-gray-500">${item.price} each</p>
                            {(item.selectedColor || item.selectedSize) && (
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
                                </p>
                            )}
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                            <button onClick={() => removeItem(item.productId)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-gray-400">
                                −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                            <button onClick={() => addItem(item)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-gray-400">
                                +
                            </button>
                        </div>

                        {/* Line total */}
                        <p className="w-20 text-right text-sm font-semibold tabular-nums text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Remove */}
                        <button onClick={() => deleteItem(item.productId)}
                            className="ml-1 text-gray-300 transition hover:text-red-400"
                            aria-label="Remove item">
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Order summary */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalQty} items)</span>
                    <span className="font-semibold text-gray-900 tabular-nums">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span className="tabular-nums">${totalPrice.toFixed(2)}</span>
                </div>

                <button onClick={handleCheckout}
                    className="mt-5 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]">
                    Place Order
                </button>

                <button onClick={clearCart}
                    className="mt-3 w-full text-center text-xs text-gray-400 transition hover:text-red-400">
                    Clear cart
                </button>
            </div>
        </div>
    );
}

