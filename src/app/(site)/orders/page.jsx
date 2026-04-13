import { getOrdersAction } from "../../../../action/order.action";
import { auth } from "@/auth";
import Link from "next/link";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

export default async function OrdersPage() {
    const session = await auth();

    if (!session) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-3 px-4 py-20 text-center">
                <p className="text-2xl font-semibold text-gray-900">Sign in to view your orders</p>
                <Link href="/login" className="mt-4 rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-lime-300">
                    Log in
                </Link>
            </div>
        );
    }

    const orders = await getOrdersAction();

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-3 px-4 py-20 text-center">
                <p className="text-5xl">📦</p>
                <p className="text-2xl font-semibold text-gray-900">No orders yet</p>
                <p className="text-sm text-gray-500">Place your first order from the shop.</p>
                <Link href="/products" className="mt-4 rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-lime-300">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10">
            <h1 className="text-3xl font-semibold text-gray-900">Your Orders</h1>
            <p className="mt-1 text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

            <div className="mt-8 flex flex-col gap-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        {/* Order header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="text-xs text-gray-400">Order ID</p>
                                <p className="max-w-xs truncate font-mono text-sm font-semibold text-gray-700">
                                    {order.orderId}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">{formatDate(order.orderDate)}</p>
                                <p className="text-lg font-semibold tabular-nums text-gray-900">
                                    ${Number(order.totalAmount ?? 0).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Order items */}
                        {order.orderDetailsResponse?.length > 0 && (
                            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                                {order.orderDetailsResponse.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">
                                            {item.productName ?? item.productId}
                                            <span className="ml-2 text-gray-400">× {item.orderQty}</span>
                                        </span>
                                        <span className="font-medium tabular-nums text-gray-900">
                                            ${Number(item.orderTotal ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

