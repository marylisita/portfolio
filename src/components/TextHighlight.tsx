"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TextHighlightProps {
  children: ReactNode;
  variant?: "marker" | "ios";
  color?: string; // Only used for marker
  delay?: number;
}

export default function TextHighlight({ 
  children, 
  variant = "marker", 
  color = "#D4FFC8", // Default to light green marker
  delay = 0 
}: TextHighlightProps) {
  
  if (variant === "ios") {
    return (
      <span style={{ position: "relative", display: "inline-block", padding: "0 2px" }}>
        {/* iOS Selection Background */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "-2px",
            left: 0,
            bottom: "-2px",
            right: 0,
            background: "rgba(64, 156, 255, 0.4)", // Translucent iOS blue
            originX: 0,
            zIndex: 0,
          }}
        />
        
        {/* Left Handle */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.3, delay: delay + 1.0 }}
          style={{
            position: "absolute",
            left: "0px",
            top: "-2px",
            bottom: "-2px",
            width: "2px",
            background: "#409CFF",
            zIndex: 1
          }}
        >
          <span style={{
            position: "absolute",
            top: "-6px",
            left: "-4px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#409CFF",
          }} />
        </motion.span>
        
        {/* Right Handle */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.3, delay: delay + 1.2 }}
          style={{
            position: "absolute",
            right: "0px",
            top: "-2px",
            bottom: "-2px",
            width: "2px",
            background: "#409CFF",
            zIndex: 1
          }}
        >
          <span style={{
            position: "absolute",
            top: "-6px",
            left: "-4px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#409CFF",
          }} />
        </motion.span>

        <span style={{ position: "relative", zIndex: 1 }}>
          {children}
        </span>
      </span>
    );
  }

  // Traditional Marker style
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 4px" }}>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: "15%",
          left: 0,
          bottom: "10%",
          right: 0,
          background: color,
          originX: 0,
          zIndex: 0,
          borderRadius: "3px",
          transform: "rotate(-1deg)"
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>
        {children}
      </span>
    </span>
  );
}
