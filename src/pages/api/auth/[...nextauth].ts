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

                    const baseUrl = 'https://custom-puzzle-six.vercel.app'
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                    const res = await fetch(`${baseUrl}/api/login`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    let data;
                    const text = await res.text();
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        console.error("Failed to parse JSON response:", text);
                        throw new Error("Invalid server response");
                    }

                    if (!res.ok) {
                        throw new Error(data.message || "Authentication failed");
                    }

                    if (!data.user) {
                        throw new Error("No user data received");
                    }

                    return {
                        id: data.user._id || 'default-id',
                        name: credentials.username,
                        email: data.user.email || `${credentials.username}@example.com`
                    };
                } catch (error: any) {
                    console.error("Auth error:", error.message);
                    // Convert AbortError to a more user-friendly message
                    if (error.name === 'AbortError') {
                        throw new Error("Login request timed out");
                    }
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
