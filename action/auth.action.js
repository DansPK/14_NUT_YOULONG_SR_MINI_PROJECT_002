"use server";

import {signIn} from "../auth";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {registerService} from "../service/auth.service";
import {redirect} from "next/navigation";

export async function loginAction(data) {

    const {email, password} = data;
    try {
        const response = await signIn("credentials", {
            email,
            password,
            redirectTo: "/?loggedIn=true" ,
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
export async function RegisterAction(data) {
    const { firstName, lastName, email, password, birthdate } = data;
    try {
        const response = await registerService({
            firstName,
            lastName,
            email,
            password,
            birthDate: birthdate,
        });

        console.log(response);

        redirect("/login");


    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, error: error.message };
    }
}

