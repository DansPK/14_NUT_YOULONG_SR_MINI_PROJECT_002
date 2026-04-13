"use server";


import {getBestSellingProductService} from "../service/product.service";

export async function getBestSellingProductAction(){
    try {
        const res = await getBestSellingProductService();
        return res?.payload ?? [];

    }catch (error) {
        console.log("Error fetching best sellers:", error);
        return [];
    }
}