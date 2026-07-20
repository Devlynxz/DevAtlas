import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Button from "../ui/Button";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.4 });

  const shape1X = useTransform(springX, (v) => v * 0.5);
  const shape1Y = useTransform(springY, (v) => v * 0.5);
  const shape2X = useTransform(springX, (v) => v * -0.35);
  const shape2Y = useTransform(springY, (v) => v * -0.35);
  const shape3X = useTransform(springX, (v) => v * 0.25);
  const shape3Y = useTransform(springY, (v) => v * 0.25);
  const shape4X = useTransform(springX, (v) => v * -0.2);
  const shape4Y = useTransform(springY, (v) => v * 0.2);

  const spotlightBackground = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(600px circle at calc(50% + ${x}px) calc(50% + ${y}px), rgba(255,255,255,0.15), transparent 60%)`
  );

  const handleMouseMove = (event) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 dark:from-slate-950 dark:via-primary-950 dark:to-slate-950"
    >
      {!shouldReduceMotion && (
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlightBackground }} />
      )}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={shouldReduceMotion ? undefined : { x: shape1X, y: shape1Y }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { x: shape2X, y: shape2Y }}
          className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { x: shape3X, y: shape3Y }}
          className="absolute right-1/4 top-10 h-24 w-24 rotate-12 rounded-3xl border border-white/10"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { x: shape4X, y: shape4Y }}
          className="absolute left-1/3 bottom-10 h-16 w-16 rotate-45 rounded-2xl border border-white/10"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-36">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
        >
          <Compass className="h-4 w-4" /> The Developer Knowledge Hub
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
        >
          DevAtlas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 font-heading text-xl font-semibold text-white/90 sm:text-2xl"
        >
          Explore. Build. Share Knowledge.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 max-w-xl text-base text-white/80"
        >
          Modern articles for developers, engineers, and technology enthusiasts.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button as={Link} to="/articles" variant="secondary" size="lg">
            Start Reading <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            as={Link}
            to="/categories"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Explore Categories
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
