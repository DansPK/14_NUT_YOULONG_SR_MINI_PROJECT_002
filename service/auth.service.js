export async function loginService(req) {
    const user ={
        email: req.email,
        password: req.password
    };
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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