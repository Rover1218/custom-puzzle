import Head from 'next/head';
import { Container, Typography, Box, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import '../app/globals.css';
import SplashCursor from '../components/ui/Animations/SplashCursor/SplashCursor'
import { motion, useScroll, useTransform } from 'framer-motion';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const GradientBackground = styled(Box)({
    background: 'linear-gradient(-45deg, #0A2342, #283D70, #2E4C80, #186F65)',
    backgroundSize: '200% 200%',  // Reduced from 400%
    animation: `${gradientAnimation} 45s ease-in-out infinite`, // Slowed down
    minHeight: '100vh',
    padding: '2rem 0',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    willChange: 'background-position',
    '@media (max-width: 768px)': {
        backgroundSize: '150% 150%', // Reduced further for mobile
        animation: `${gradientAnimation} 60s ease-in-out infinite`,
    },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: `${fadeIn} 0.5s ease-out`,
    willChange: 'transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '&:hover': {
        transform: 'translateY(-2px)', // Reduced movement
    },
}));

const FeatureItem = styled(Typography)(({ theme }) => ({
    position: 'relative',
    paddingLeft: '2rem',
    marginBottom: '1rem',
    fontSize: '1.1rem',
    '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        width: '12px',
        height: '12px',
        backgroundColor: '#e73c7e',
        borderRadius: '50%',
        transform: 'translateY(-50%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    transition: 'transform 0.2s ease-out', // Simplified transition
    '&:hover': {
        transform: 'translateX(5px)', // Reduced movement
        color: '#23a6d5',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:before': {
            backgroundColor: '#23a6d5',
            transform: 'translateY(-50%) scale(1.1)', // Reduced scale
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
}));

const Section = styled(Box)({
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-20px',
        left: '0',
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    },
});

// Add motion variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function About() {
    const { scrollYProgress } = useScroll();
    // Remove opacity transform and keep only scale
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

    return (
        <div className="splash-cursor-wrapper">
            <Head>
                <title>About - Custom Puzzle Generator</title>
                <meta name="description" content="Learn about the Custom Puzzle Generator application" />
            </Head>
            <GradientBackground>
                <div className="relative z-40" style={{ position: 'sticky', top: 0 }}>
                    <Navbar />
                </div>
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                    <motion.div
                        style={{ scale }}  // Remove opacity from style
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <StyledPaper elevation={3}>
                            <Section>
                                <motion.div variants={fadeInUp}>
                                    <Typography
                                        variant="h2"
                                        component="h1"
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(45deg, #7928CA, #FF0080)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            fontWeight: 800,
                                            mb: 4,
                                            letterSpacing: '-0.5px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        About Custom Puzzle Generator
                                    </Typography>
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <Typography
                                        variant="body1"
                                        paragraph
                                        sx={{
                                            fontSize: '1.2rem',
                                            lineHeight: 2,
                                            color: '#1a1a1a',
                                            textAlign: 'center',
                                            maxWidth: '800px',
                                            margin: '0 auto',
                                            mb: 6
                                        }}
                                    >
                                        Welcome to Custom Puzzle Generator, a tool designed to help you create and solve unique puzzle challenges.
                                        This application allows you to generate custom puzzles tailored to your preferences and difficulty level.
                                    </Typography>
                                </motion.div>
                            </Section>

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 6,
                                mt: 8
                            }}>
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Section>
                                        <Typography
                                            variant="h4"
                                            gutterBottom
                                            sx={{
                                                color: '#7928CA',
                                                fontWeight: 700,
                                                mb: 4
                                            }}
                                        >
                                            Features
                                        </Typography>
                                        <Box sx={{ pl: 2 }}>
                                            <FeatureItem variant="body1">Custom puzzle generation</FeatureItem>
                                            <FeatureItem variant="body1">Multiple difficulty levels</FeatureItem>
                                            <FeatureItem variant="body1">Interactive solving interface</FeatureItem>
                                            <FeatureItem variant="body1">Save and share your puzzles</FeatureItem>
                                        </Box>
                                    </Section>
                                </motion.div>

                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <Section>
                                        <Typography
                                            variant="h4"
                                            gutterBottom
                                            sx={{
                                                color: '#FF0080',
                                                fontWeight: 700,
                                                mb: 4
                                            }}
                                        >
                                            How to Use
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: '1.1rem',
                                                lineHeight: 1.8,
                                                color: '#1a1a1a'
                                            }}
                                        >
                                            Simply navigate to the puzzle generator page, select your desired options, and click generate.
                                            You can then solve the puzzle directly in your browser or share it with friends.
                                        </Typography>
                                    </Section>
                                </motion.div>
                            </Box>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 8,
                                        color: '#666',
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '-20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '40px',
                                            height: '2px',
                                            background: 'linear-gradient(90deg, #7928CA, #FF0080)',
                                        }
                                    }}
                                >
                                    Version 1.0.0
                                </Typography>
                            </motion.div>
                        </StyledPaper>
                    </motion.div>
                </Container>
            </GradientBackground>
            <SplashCursor
                SIM_RESOLUTION={32}      // Further reduced
                DYE_RESOLUTION={256}     // Further reduced
                CAPTURE_RESOLUTION={128} // Further reduced
                DENSITY_DISSIPATION={1.2}
                VELOCITY_DISSIPATION={0.99}
                PRESSURE={0.6}
                PRESSURE_ITERATIONS={8}  // Further reduced
                CURL={15}               // Further reduced
                SPLAT_RADIUS={0.1}      // Further reduced
                SPLAT_FORCE={2000}      // Further reduced
                SHADING={false}
                COLOR_UPDATE_SPEED={4}   // Further reduced
                BACK_COLOR={{ r: 0, g: 0, b: 0 }}
                TRANSPARENT={true}
            />
        </div>
    );
}
