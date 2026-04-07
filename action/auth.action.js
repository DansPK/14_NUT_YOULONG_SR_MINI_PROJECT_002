"use server";

import {singIn} from "../auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";

export async function loginAction(data) {

    const {email, password} = data;
    try {
        const response = await singIn("credentials", {
            email,
            password,
            redirectTo: "/products" ,
        });

        if (response?.error) {
            throw new Error("Error");
        }

        }catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
    }
    }

