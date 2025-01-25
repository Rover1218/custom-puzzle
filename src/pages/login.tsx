import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FormInput from "../components/ui/FormInput"; // Changed from named to default import
import AuthLayout from "../components/AuthLayout";
import { User, Lock } from 'lucide-react';
import '../app/globals.css';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn('credentials', {
                username: username,
                password: password,
                redirect: false,
            })

            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
                return
            }

            if (result?.ok) {
                router.push('/')
            } else {
                setError("Failed to login. Please try again.")
                setIsLoading(false)
            }
        } catch (err) {
            console.error("Login error:", err)
            setError("An unexpected error occurred")
            setIsLoading(false)
        }
    }

    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="512x512"
                    href="https://cdn-icons-png.flaticon.com/512/4489/4489661.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="256x256"
                    href="https://cdn-icons-png.flaticon.com/256/4489/4489661.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="128x128"
                    href="https://cdn-icons-png.flaticon.com/128/4489/4489661.png"
                />
                <link
                    rel="apple-touch-icon"
                    href="https://cdn-icons-png.flaticon.com/512/4489/4489661.png"
                />
                <title>Login - Custom Puzzle Generator</title>
            </Head>
            <AuthLayout>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-2">
                        <motion.h1
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200"
                        >
                            Welcome Back
                        </motion.h1>
                        <p className="text-gray-400">Sign in to continue to your account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <FormInput
                                type="text"
                                label="Username"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                icon={<User size={20} />}
                                required
                            />
                            <FormInput
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                icon={<Lock size={20} />}
                                required
                            />
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium shadow-xl shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all duration-200"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                                />
                            ) : (
                                "Sign in"
                            )}
                        </motion.button>
                    </form>

                    <div className="text-center">
                        <Link
                            href="/register"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Don't have an account? <span className="text-indigo-400 hover:text-indigo-300 underline">Register</span>
                        </Link>
                    </div>
                </motion.div>
            </AuthLayout>
        </>
    );
};

export default Login;
