import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { CoolMode } from "../components/ui/cool-mode";
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { Separator } from "../components/ui/separator"
import { useScrollDirection } from '../hooks/useScrollDirection';

const MENU_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/generate", label: "Play", protected: true },
    { href: "/about", label: "About" },
];

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
    const { isAuthenticated, user, loading, logout } = useAuth(false);
    const scrollDirection = useScrollDirection();

    const handleLogout = () => {
        logout();
    };

    const menuItemsToDisplay = isAuthenticated ? MENU_ITEMS : MENU_ITEMS.filter(item => !item.protected);

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    <div className="grid grid-cols-3 items-center">
                        {/* Logo Section - Left */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:scale-105 transition-transform">
                                Puzzle Generator
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center justify-center">
                            <div className="flex items-center space-x-6">
                                {menuItemsToDisplay.map((item, index) => (
                                    <React.Fragment key={item.href}>
                                        <CoolMode>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link href={item.href} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all px-2">
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        </CoolMode>
                                        {index < menuItemsToDisplay.length - 1 && (
                                            <Separator orientation="vertical" className="h-6" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Auth Button and Mobile Menu Button - Right */}
                        <div className="flex items-center justify-end">
                            <div className="hidden md:block">
                                {isAuthenticated ? (
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {user?.username || user?.email}
                                        </span>
                                        <InteractiveHoverButton>
                                            <button onClick={handleLogout} type="button">
                                                Logout
                                            </button>
                                        </InteractiveHoverButton>
                                    </div>
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
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0 }}
                        className="fixed top-[76px] left-0 right-0 bottom-0 z-[90] md:hidden"
                    >
                        <div
                            className="bg-white/95 dark:bg-gray-800/95 shadow-lg backdrop-blur-sm h-full px-6 py-4 overflow-y-auto"
                            style={{ maxHeight: 'calc(100vh - 76px)' }}
                        >
                            <div className="flex flex-col space-y-4">
                                {menuItemsToDisplay.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all text-lg py-3"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Separator className="my-4" />
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="bg-indigo-600 text-white px-4 py-3 rounded-md text-center hover:bg-indigo-700 transition-colors mt-2"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-indigo-600 text-white px-4 py-3 rounded-md text-center hover:bg-indigo-700 transition-colors mt-2"
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
