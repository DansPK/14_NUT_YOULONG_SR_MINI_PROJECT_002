import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(request) {
    const session = await auth();
    console.log("in the proxy :", session);
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}
export const config = {
    matcher: ["/products/:path*", "/category/:path*", "/orders/:path*", "/cart/:path*", "/manage-products"],
};
