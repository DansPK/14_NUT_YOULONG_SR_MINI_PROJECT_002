import {auth} from "@/auth";

async function getAuthHeaders() {
    const session = await auth();
    const headers = { "Content-Type": "application/json" };
    if (session?.user?.token) {
        headers["Authorization"] = `Bearer ${session.user.token}`;
    }
    return headers;
}

export async function getProductsService() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "GET",
        headers,
        cache: "no-store",
    });
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
    return await response.json();
}

export async function getProductByIdService(productId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`, {
        method: "GET",
        headers,
        cache: "no-store",
    });
    if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
    return await response.json();
}

export async function getBestSellingProductService() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/top-selling`, {
        method: "GET",
        headers,
    });
    if (!response.ok) throw new Error(`Failed to fetch best sellers: ${response.status}`);
    return await response.json();
}

export async function createProductService(data) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create product: ${response.status}`);
    return await response.json();
}

export async function updateProductService(productId, data) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update product: ${response.status}`);
    return await response.json();
}

export async function deleteProductService(productId) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers,
    });
    if (!response.ok) throw new Error(`Failed to delete product: ${response.status}`);

    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
}