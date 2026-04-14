import {auth} from "@/auth";

export async function getCategoryService(){

    const session = await auth();

    const headers = { "Content-Type": "application/json" };
    if (session?.user?.token) {
        headers["Authorization"] = `Bearer ${session.user.token}`;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch best sellers: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
}