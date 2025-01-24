import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import { User, Lock, Mail } from 'lucide-react';
import FormInput from "../components/ui/FormInput";
import '../app/globals.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    fullName: formData.fullName,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = "/login";
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                        Create Account
                    </motion.h1>
                    <p className="text-gray-400">Join us and start creating puzzles</p>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} className="mt-8 space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <FormInput
                            type="text"
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            icon={<User size={20} />}
                            required
                        />
                        <FormInput
                            type="email"
                            name="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            icon={<Mail size={20} />}
                            required
                        />
                        <FormInput
                            type="text"
                            name="fullName"
                            label="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            icon={<User size={20} />}
                            required
                        />
                        <FormInput
                            type="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={<Lock size={20} />}
                            required
                        />
                        <FormInput
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={<Lock size={20} />}
                            required
                        />
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 
                                 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl 
                                 font-medium shadow-xl shadow-indigo-500/20 focus:outline-none 
                                 focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 
                                 transition-all duration-200"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                            />
                        ) : (
                            "Create Account"
                        )}
                    </motion.button>
                </form>
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Already have an account? {" "}
                        <span className="text-indigo-400 hover:text-indigo-300 underline">
                            Sign in
                        </span>
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default Register;
