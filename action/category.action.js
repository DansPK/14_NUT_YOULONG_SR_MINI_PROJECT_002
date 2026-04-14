"use server";


import {getCategoryService} from "../service/category.service";

export async function getCategoryAction(){
    try {
        const res = await getCategoryService();
        return res?.payload ?? [];

    }catch (error) {
        console.log("Error fetching best sellers:", error);
        return [];
    }
}