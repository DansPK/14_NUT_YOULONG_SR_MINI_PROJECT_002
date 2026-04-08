import NextAuth from "next-auth";
import { loginService } from "./service/auth.service";
import Credentials from "next-auth/providers/credentials";


export const {handlers,signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const user = await loginService(credentials);
                    console.log("User from loginService:", user);
                    return user.payload;
                }catch (error) {
                    console.error("Error in authorize function:", error);
                    return null;
            }
        },
    }),
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    session: {
        strategy: "jwt",

    },
    pages: {
        signIn: "/login",
    },
    callbacks:{
        jwt: async ({token, user}) => {
            if (user) {
                token.user = user;
            }
            console.log("This is token", token);
            return token;
        },
        session: async ({session, token}) => {
            if (token && token.user) {
                session.user = token.user;
            }
            console.log("This is session", session);
            return session;

        }
    }
});
