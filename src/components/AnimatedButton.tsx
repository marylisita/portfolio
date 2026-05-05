"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function AnimatedButton({ 
  children, 
  href, 
  className = "", 
  variant = "primary",
  style = {}
}: { 
  children: React.ReactNode, 
  href?: string, 
  className?: string,
  variant?: "primary" | "outline" | "light",
  style?: React.CSSProperties
}) {
  const [isHovered, setIsHovered] = useState(false);

  const defaultBg = variant === "primary" ? "var(--fg)" : variant === "light" ? "#fff" : "transparent";
  const defaultColor = variant === "primary" ? "#fff" : variant === "light" ? "#111" : "var(--fg)";
  
  const hoverBg = variant === "outline" ? "var(--fg)" : "#be96ff";

  const content = (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 48px",
        borderRadius: "999px",
        overflow: "hidden",
        border: "1px solid var(--fg)",
        cursor: "pointer",
        fontFamily: "var(--font-head)", // Use the stylish serif font!
        fontSize: "1.2rem",
        fontWeight: 500,
        textDecoration: "none",
        zIndex: 1,
        ...style
      }}
      animate={{ 
        backgroundColor: isHovered ? hoverBg : defaultBg,
        color: isHovered ? "#fff" : defaultColor
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        scale: { type: "spring", stiffness: 400, damping: 25 },
        default: { duration: 0.4, ease: "easeOut" } 
      }}
      className={`hover-trigger ${className}`}
    >
      {/* Text Wrapper */}
      <span style={{ position: "relative", zIndex: 2 }}>
        {children}
      </span>

      {/* Animated Star - Left */}
      <motion.svg
        width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
        style={{
          position: "absolute",
          left: "20px",
          top: "50%",
          marginTop: "-8px",
          zIndex: 2,
          color: "currentColor",
          pointerEvents: "none"
        }}
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={isHovered ? { opacity: 1, scale: 1, rotate: 180 } : { opacity: 0, scale: 0, rotate: -90 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </motion.svg>

      {/* Animated Star - Right */}
      <motion.svg
        width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          marginTop: "-8px",
          zIndex: 2,
          color: "currentColor",
          pointerEvents: "none"
        }}
        initial={{ opacity: 0, scale: 0, rotate: 90 }}
        animate={isHovered ? { opacity: 1, scale: 1, rotate: -180 } : { opacity: 0, scale: 0, rotate: 90 }}
        transition={{ duration: 0.5, ease: "backOut", delay: 0.05 }}
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </motion.svg>
    </motion.div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none", display: "inline-block" }}>{content}</Link>;
  }

  return content;
}
