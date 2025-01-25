/*
  jsrepo 1.28.4
  Installed from https://reactbits.dev/default/
  1-25-2025
*/

import { useRef, useEffect } from "react";

const ClickSpark = ({
  children,
  sparkColor = "rgba(255, 255, 255, 0.8)",
  sparkSize = 1.5,
  sparkRadius = 25,
  sparkCount = 20,
  duration = 600,
  easing = "ease-out",
  extraScale = 1.2,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const sparksRef = useRef([]);      // Stores spark data
  const startTimeRef = useRef(null); // Tracks initial timestamp for animation

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Enable better quality rendering
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowBlur = 2;
    ctx.shadowColor = sparkColor;

    const parseColor = (color) => {
      const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/);
      if (match) {
        const [_, r, g, b] = match;
        return { r, g, b };
      }
      return { r: 255, g: 255, b: 255 }; // fallback to white
    };

    let animationId;

    /**
     * Easing helper.
     */
    const easeFunc = (t) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default: // "ease-out"
          return t * (2 - t);
      }
    };

    const draw = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp; // store initial time
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          // Spark finished its animation
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        // Enhanced spark animation
        const fadeInOut = Math.sin(progress * Math.PI);
        const opacity = fadeInOut * 0.8;
        const scale = 1 + Math.sin(progress * Math.PI) * 0.2;

        // Dynamic distance calculation
        const distance = eased * sparkRadius * (1 + Math.random() * 0.1) * extraScale;
        const lineLength = sparkSize * (1 - eased * 0.8) * scale;

        // Add subtle spiral effect
        const spiralAngle = spark.angle + (progress * Math.PI * 0.5);
        const wiggle = Math.sin(progress * Math.PI * 4) * 0.5;

        // Calculate positions with enhanced curves
        const x1 = spark.x + distance * Math.cos(spiralAngle + wiggle);
        const y1 = spark.y + distance * Math.sin(spiralAngle + wiggle);
        const x2 = x1 + lineLength * Math.cos(spiralAngle);
        const y2 = y1 + lineLength * Math.sin(spiralAngle);

        // Create sparkle effect
        const { r, g, b } = parseColor(sparkColor);
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        // Draw the spark with enhanced styling
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = sparkSize * scale * (1 - eased * 0.5);
        ctx.lineCap = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Add a glowing dot at the start of each spark
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(x1, y1, sparkSize * 0.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  const handleContainerClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = e.clientX;
    const y = e.clientY;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount + (Math.random() * 0.5 - 0.25),
      startTime: now,
      initialVelocity: 0.5 + Math.random() * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    }));

    sparksRef.current.push(...newSparks);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ position: 'relative', width: '100%', minHeight: '100vh' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
