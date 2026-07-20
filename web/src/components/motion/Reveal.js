import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, delay = 0, y = 16, className = "", as = "div", once = true }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}
