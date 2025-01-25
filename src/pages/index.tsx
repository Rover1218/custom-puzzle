// src/pages/index.tsx
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PuzzleGenerator from '../components/PuzzleGenerator';
import Navbar from '../components/Navbar';
import '../app/globals.css';
import { SparklesText } from "../components/ui/sparkles-text";
import { ScrollProgress } from "../components/ui/scroll-progress";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel"
import { ShimmerButton } from "../components/ui/shimmer-button";
import { Separator } from "../components/ui/separator"
import Link from 'next/link';

const HomePage = () => {
    const { scrollYProgress } = useScroll();

    // Parallax effects
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-900">
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <ScrollProgress />
            </div>

            {/* Animated background layers with parallax */}
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-full">
                {/* Primary gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient-x opacity-70 z-0"></div>

                {/* Secondary floating gradient */}
                <div className="absolute inset-0 bg-gradient-to-tl from-teal-400 via-indigo-500 to-purple-500 animate-gradient-y opacity-40 z-0"></div>

                {/* Overlay gradient for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 z-0"></div>
            </motion.div>

            {/* Navbar with higher z-index */}
            <div className="relative z-40">
                <Navbar />
            </div>

            <main className="container mx-auto px-4 py-8 relative z-10">
                {/* Hero Section with animations */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="text-center mb-16 animate-fadeIn relative"
                >
                    <motion.div style={{ y: textY }} className="space-y-6">
                        <motion.h1
                            variants={itemVariants}
                            className="text-7xl font-extrabold text-white mb-6 drop-shadow-lg"
                        >
                            <SparklesText text="Create Amazing Puzzles" />
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-2xl text-white/90 font-light mb-8"
                        >
                            Transform your ideas into engaging puzzles in seconds!
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex justify-center">
                                <Link href="/generate">
                                    <ShimmerButton className="px-12 py-4">
                                        <span className="text-xl font-bold">Start Creating Now</span>
                                    </ShimmerButton>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Steps and Features Section with animations */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 relative"
                >
                    {/* Steps Section */}
                    <motion.section variants={itemVariants} className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
                            Magic in Three Steps
                        </h2>
                        <div className="relative px-12">
                            <Carousel className="max-w-md mx-auto">
                                <CarouselContent>
                                    {[
                                        {
                                            step: "1",
                                            title: "Choose Your Style",
                                            description: "Select from our variety of puzzle types and customize the size"
                                        },
                                        {
                                            step: "2",
                                            title: "Add Your Content",
                                            description: "Upload images or add text to make it uniquely yours"
                                        },
                                        {
                                            step: "3",
                                            title: "Generate & Play",
                                            description: "Create your puzzle and start playing instantly"
                                        }
                                    ].map((item, index) => (
                                        <CarouselItem key={index}>
                                            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur p-8 rounded-xl shadow-lg 
                                                          border border-white/20 mx-4 h-[300px] flex flex-col justify-center">
                                                <div className="text-3xl font-bold text-white mb-4 
                                                              bg-gradient-to-r from-fuchsia-500 to-orange-400 
                                                              w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                                                    {item.step}
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                                <p className="text-white/80">{item.description}</p>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-0 bg-white/10 hover:bg-white/20 border-white/50
                                                           text-white absolute transform -translate-y-1/2
                                                           backdrop-blur-sm" />
                                <CarouselNext className="right-0 bg-white/10 hover:bg-white/20 border-white/50
                                                       text-white absolute transform -translate-y-1/2
                                                       backdrop-blur-sm" />
                            </Carousel>
                        </div>
                    </motion.section>

                    {/* Vertical Separator - Only visible on large screens */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gradient-to-b from-white/5 via-white/20 to-white/5 p-[1px] rounded-full">
                            <Separator orientation="vertical" className="h-[400px] bg-white/20" />
                        </div>
                    </div>

                    {/* Features Section */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
                            Amazing Features
                        </h2>
                        <div className="relative px-12">
                            <Carousel className="max-w-md mx-auto">
                                <CarouselContent>
                                    {[
                                        { title: "Custom Sizes", icon: "🎯", description: "Create puzzles of any dimension", gradient: "from-pink-500 to-rose-500" },
                                        { title: "Multiple Styles", icon: "🎨", description: "Choose from various puzzle styles", gradient: "from-purple-500 to-indigo-500" },
                                        { title: "Save & Share", icon: "🔗", description: "Export and share with friends", gradient: "from-blue-500 to-cyan-500" },
                                        { title: "Real-time Preview", icon: "👀", description: "See changes as you make them", gradient: "from-teal-500 to-emerald-500" },
                                    ].map((feature, index) => (
                                        <CarouselItem key={index}>
                                            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur p-8 rounded-xl border border-white/10 
                                                          mx-4 h-[300px] flex flex-col justify-center items-center
                                                          hover:bg-white/10 transition-all duration-300">
                                                <div className={`text-7xl mb-6 transform hover:scale-110 transition-transform duration-300
                                                               bg-gradient-to-br ${feature.gradient} rounded-full p-4
                                                               shadow-lg hover:shadow-xl border-2 border-white/20
                                                               flex items-center justify-center w-24 h-24
                                                               animate-float`}>
                                                    <span className="filter drop-shadow-md">{feature.icon}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                                <p className="text-white/70 text-lg">{feature.description}</p>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-0 bg-white/10 hover:bg-white/20 border-white/50
                                                           text-white absolute transform -translate-y-1/2
                                                           backdrop-blur-sm" />
                                <CarouselNext className="right-0 bg-white/10 hover:bg-white/20 border-white/50
                                                       text-white absolute transform -translate-y-1/2
                                                       backdrop-blur-sm" />
                            </Carousel>
                        </div>
                    </motion.section>
                </motion.div>

                {/* FAQ Section with animations */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="mb-16"
                >
                    <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white text-center mb-12">
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {[
                                { q: "Is it free to use?", a: "Yes, basic features are completely free!" },
                                { q: "Can I save my puzzles?", a: "Yes, you can save and access them anytime." },
                                { q: "What types of puzzles can I create?", a: "Various types including jigsaw, word search, and more." }
                            ].map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur rounded-lg">
                                    <AccordionTrigger className="px-6 text-white hover:no-underline">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 text-white/70">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </motion.section>

                {/* Call to Action with animations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-lg rounded-2xl p-12"
                    >
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-6">
                            Ready to Create Your First Puzzle?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">Join thousands of happy creators today!</p>
                        <div className="flex justify-center">
                            <Link href="/generate">
                                <ShimmerButton className="px-12 py-4">
                                    <span className="text-xl font-bold">Get Started for Free</span>
                                </ShimmerButton>
                            </Link>
                        </div>
                    </motion.div>
                </motion.section>
            </main>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 backdrop-blur-lg py-8"
            >
                <div className="container mx-auto px-4 text-center text-white/70">
                    <p>© 2024 Puzzle Generator. All rights reserved.</p>
                </div>
            </motion.footer>
        </div >
    );
};

export default HomePage;
