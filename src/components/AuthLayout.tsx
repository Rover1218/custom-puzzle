import { memo } from 'react';
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = memo(({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    {children}
                </div>
            </motion.div>
        </div>
    );
});

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
