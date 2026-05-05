"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LiquidImage from "./LiquidImage";

export default function IntroShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Connect to scroll for floating badge parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const floatUp = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const floatDown = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const floatRight = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  return (
    <section ref={containerRef} style={{ padding: "140px 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
        
        {/* Main Central Image */}
        <div style={{ width: "100%", maxWidth: "600px", height: "700px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <LiquidImage 
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2000&auto=format&fit=crop" 
            alt="Creative Process" 
          />
        </div>

        {/* Floating Badges */}
        <motion.div 
          style={{ 
            position: "absolute", 
            top: "15%", 
            left: "-5%", 
            y: floatUp,
            rotate: -8,
            zIndex: 3
          }}
        >
          <div style={{ background: "#FDEAE5", padding: "12px 24px", borderRadius: "99px", fontFamily: "var(--font-head)", fontSize: "1.4rem", color: "var(--fg)", border: "1px solid var(--fg)", boxShadow: "4px 4px 0 var(--fg)" }}>
            ✦ Art Direction
          </div>
        </motion.div>

        <motion.div 
          style={{ 
            position: "absolute", 
            top: "40%", 
            right: "-10%", 
            y: floatDown,
            rotate: 5,
            zIndex: 3
          }}
        >
          <div style={{ background: "#E6F5EC", padding: "12px 24px", borderRadius: "99px", fontFamily: "var(--font-head)", fontSize: "1.4rem", color: "var(--fg)", border: "1px solid var(--fg)", boxShadow: "4px 4px 0 var(--fg)" }}>
            ❖ Design Systems
          </div>
        </motion.div>

        <motion.div 
          style={{ 
            position: "absolute", 
            bottom: "10%", 
            left: "5%", 
            x: floatRight,
            rotate: -3,
            zIndex: 3
          }}
        >
          <div style={{ background: "#FBE6F3", padding: "12px 24px", borderRadius: "99px", fontFamily: "var(--font-head)", fontSize: "1.4rem", color: "var(--fg)", border: "1px solid var(--fg)", boxShadow: "4px 4px 0 var(--fg)" }}>
            ✧ Web Development
          </div>
        </motion.div>

      </div>
    </section>
  );
}
