"use server";

import {
    getBestSellingProductService,
    getProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
} from "../service/product.service";

export async function getProductByIdAction(productId) {
    try {
        const res = await getProductByIdService(productId);
        return res?.payload ?? null;
    } catch (error) {
        console.log("Error fetching product:", error);
        return null;
    }
}

export async function getProductsAction() {
    try {
        const res = await getProductsService();
        return res?.payload ?? [];
    } catch (error) {
        console.log("Error fetching products:", error);
        return [];
    }
}

export async function getBestSellingProductAction(){
    try {
        const res = await getBestSellingProductService();
        return res?.payload ?? [];

    }catch (error) {
        console.log("Error fetching best sellers:", error);
        return [];
    }
}

export async function createProductAction(data) {
    try {
        const res = await createProductService(data);
        return res?.payload ?? null;
    } catch (error) {
        console.log("Error creating product:", error);
        return null;
    }
}

export async function updateProductAction(productId, data) {
    try {
        const res = await updateProductService(productId, data);
        return res?.payload ?? null;
    } catch (error) {
        console.log("Error updating product:", error);
        return null;
    }
}

export async function deleteProductAction(productId) {
    try {
        await deleteProductService(productId);
        return true;
    } catch (error) {
        console.log("Error deleting product:", error);
        return null;
    }
}
