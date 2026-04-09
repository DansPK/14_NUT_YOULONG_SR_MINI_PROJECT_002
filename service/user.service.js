import {error} from "next/dist/build/output/log";
import {auth} from "../auth";

export async function getUserService() {
    const session = await auth();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${session?.user?.token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store"
        });
        if (!response.ok) {
            // throw new Error("User not authenticated");
        }
        return await response.json();

    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

