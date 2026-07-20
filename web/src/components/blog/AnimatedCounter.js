import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

export default function AnimatedCounter({ target, duration = 1.4, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => `${Math.floor(value).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      count.set(target);
      return;
    }
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [isInView, target, duration, count, shouldReduceMotion]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
