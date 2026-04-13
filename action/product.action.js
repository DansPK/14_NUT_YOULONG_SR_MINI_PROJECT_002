"use server";

import {getBestSellingProductService, getProductsService} from "../service/product.service";

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