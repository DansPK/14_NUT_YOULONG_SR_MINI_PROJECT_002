import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(function middleware(req) {
    const session = req.auth;
    console.log("session in middleware:", session);
    if (!session || session.user?.error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/products",
        "/products/:path*",
        "/orders",
        "/manage-products",
        "/cart",
    ],
};