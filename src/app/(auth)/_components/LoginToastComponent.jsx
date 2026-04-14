"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

let loginToastShown = false;

export default function LoginToastComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get("loggedIn") === "true" && !loginToastShown) {
            loginToastShown = true;
            toast.success("Login Successful!", {
                description: "Welcome back!",
            });
            router.replace("/", { scroll: false });
        }
    }, []);

    return null;
}
