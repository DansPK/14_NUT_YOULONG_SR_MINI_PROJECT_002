export async function loginService(req) {
    const user ={
        email: req.email,
        password: req.password
    };
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error("Invalid credentials");
        }
        return await response.json();
    }catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}


export async function registerService(req) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });
        if (!response.ok) {
            console.log("Response status:", response.status);
        }
        return await response.json();
    }catch (error) {
        console.error("Error during login:", error);
        throw error;
    }

}