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
            async authorize(credentials, req) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        throw new Error("Missing credentials");
                    }

                    // Use absolute URL for API calls
                    const baseUrl = process.env.NEXTAUTH_URL || 'https://custom-puzzle-six.vercel.app'
                    const res = await fetch(`${baseUrl}/api/login`, {
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

                    if (!res.ok) {
                        throw new Error(data.message || "Authentication failed");
                    }

                    return {
                        id: data.user?._id || 'default-id',
                        name: credentials.username,
                        email: data.user?.email || `${credentials.username}@example.com`
                    };
                } catch (error: any) {
                    console.error("Auth error:", error.message);
                    return null;
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
        maxAge: 30 * 24 * 60 * 60, // 30 days
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
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
