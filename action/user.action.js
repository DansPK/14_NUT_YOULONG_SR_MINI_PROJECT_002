"use server";

import {getUserService} from "../service/user.service";

export async function getUserAction(){
    try {
        const res = await getUserService();
        return res.payload;

    }catch (error) {
        console.log("Error fetching user:", error);
        throw error;
    }
}