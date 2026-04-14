import { auth } from "@/auth";

export async function createOrderService(orderDetailRequests) {
    const session = await auth();
    const headers = { "Content-Type": "application/json" };
    if (session?.user?.token) {
        headers["Authorization"] = `Bearer ${session.user.token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({ orderDetailRequests }),
    });
    if (!response.ok) throw new Error(`Failed to create order: ${response.status}`);
    return await response.json();
}

export async function getOrdersService() {
    const session = await auth();
    const headers = { "Content-Type": "application/json" };
    if (session?.user?.token) {
        headers["Authorization"] = `Bearer ${session.user.token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        method: "GET",
        headers,
        cache: "no-store",
    });
    if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
    return await response.json();
}

