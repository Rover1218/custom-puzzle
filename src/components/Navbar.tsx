import React, { useState } from 'react';
import { useSession, signOut } from "next-auth/react"; // Add this import
import Link from 'next/link';
import { CoolMode } from "../components/ui/cool-mode";
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { Separator } from "../components/ui/separator"
import { useScrollDirection } from '../hooks/useScrollDirection';

const NavbarWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="h-[76px]" /> {/* Spacer for fixed navbar */}
            {children}
        </>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession(); // Replace the local state with session
    const scrollDirection = useScrollDirection();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    // Update menuItems to include Profile option when logged in
    const menuItems = [
        { href: "/", label: "Home" },
        ...(session ? [
            { href: "/generate", label: "Play" },
        ] : []),
        { href: "/about", label: "About" },
    ];

    return (
        <NavbarWrapper>
            <motion.nav
                initial={{ y: -100 }}
                animate={{
                    y: scrollDirection === 'down' && !isOpen ? -100 : 0,
                    transition: {
                        duration: 0.3,
                        ease: 'easeInOut'
                    }
                }}
                className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-b-2xl backdrop-blur-sm fixed w-full top-0 left-0 right-0 z-[100] transition-transform duration-300"
            >
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:scale-105 transition-transform">
                                Puzzle Generator
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center justify-center space-x-6">
                            {menuItems.map((item, index) => (
                                <React.Fragment key={item.href}>
                                    <CoolMode>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                            <Link href={item.href} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all">
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    </CoolMode>
                                    {index < menuItems.length - 1 && (
                                        <Separator orientation="vertical" className="h-6" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Desktop Auth Button and Mobile Menu Button */}
                        <div className="flex items-center">
                            <div className="hidden md:block">
                                {session ? (
                                    <InteractiveHoverButton>
                                        <button onClick={handleLogout} type="button">
                                            Logout
                                        </button>
                                    </InteractiveHoverButton>
                                ) : (
                                    <Link href="/login">
                                        <InteractiveHoverButton>
                                            <span>Sign Up</span>
                                        </InteractiveHoverButton>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="md:hidden ml-4">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2 rounded-md"
                                    aria-label="Toggle menu"
                                >
                                    <div className="w-6 h-5 flex flex-col justify-between">
                                        <span className={`w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                        <span className={`w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? 'opacity-0' : ''}`} />
                                        <span className={`w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] md:hidden pt-[76px]"
                    >
                        <div className="bg-white/95 dark:bg-gray-800/95 shadow-lg backdrop-blur-sm min-h-screen px-6 py-4">
                            <div className="flex flex-col space-y-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all text-lg py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {session ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-center hover:bg-indigo-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-center hover:bg-indigo-700 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NavbarWrapper>
    );
};

export default Navbar;
