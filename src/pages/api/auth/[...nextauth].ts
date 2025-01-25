import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        throw new Error("Missing credentials");
                    }

                    const res = await fetch("/api/login", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok || !data.success) {
                        throw new Error(data.message || "Authentication failed");
                    }

                    if (data.user) {
                        return {
                            id: data.user._id,
                            name: data.user.username,
                            email: data.user.email || data.user.username + "@example.com"
                        };
                    }

                    throw new Error("No user data returned");
                } catch (error: any) {
                    console.error("Auth error details:", error);
                    throw error;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        async encode({ secret, token }) {
            const encodedToken = Buffer.from(JSON.stringify(token)).toString('base64');
            return encodedToken;
        },
        async decode({ secret, token }) {
            if (!token) return null;
            const decodedToken = Buffer.from(token, 'base64').toString();
            return JSON.parse(decodedToken);
        }
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
