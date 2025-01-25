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

                    const baseUrl = process.env.NEXTAUTH_URL || 'https://custom-puzzle-six.vercel.app'
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000);

                    try {
                        const res = await fetch(`${baseUrl}/api/login`, {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body: JSON.stringify({
                                username: credentials.username,
                                password: credentials.password,
                            }),
                            signal: controller.signal,
                            credentials: 'include'
                        });

                        clearTimeout(timeoutId);

                        if (!res.ok) {
                            const error = await res.json();
                            throw new Error(error.message || "Authentication failed");
                        }

                        const data = await res.json();

                        if (!data.user || !data.user.id) {
                            throw new Error("Invalid user data received");
                        }

                        return {
                            id: data.user.id,
                            name: credentials.username,
                            email: data.user.email || `${credentials.username}@example.com`
                        };
                    } catch (fetchError: any) {
                        console.error("Fetch error:", fetchError);
                        if (fetchError.name === 'AbortError') {
                            throw new Error("Request timed out");
                        }
                        throw new Error(fetchError.message || "Network error");
                    }
                } catch (error: any) {
                    console.error("Auth error details:", error);
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
            try {
                if (session.user) {
                    session.user.id = token.id as string;
                }
                return session;
            } catch (error) {
                console.error("Session callback error:", error);
                return session;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
