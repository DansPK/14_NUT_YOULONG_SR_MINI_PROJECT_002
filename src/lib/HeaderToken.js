import { auth } from "@/auth";

const headerToken = async () => {
    const session = await auth();
    console.log("this is session in headear :", session?.user?.token);
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
    };
};
export default headerToken;
