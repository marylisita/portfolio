"use client";
import { motion, useScroll, useTransform } from "framer-motion";

const GRIDS = [
  // 1. Monstera Leaf
  [
    "00001110000",
    "00011111000",
    "00110111100",
    "01111101110",
    "01111111110",
    "00111011100",
    "00011111000",
    "00001110000",
    "00000100000",
    "00000100000",
    "00000100000",
  ],
  // 2. Sprout
  [
    "00000000000",
    "00001010000",
    "00011011000",
    "00111011100",
    "00011011000",
    "00001110000",
    "00000100000",
    "00000100000",
    "00000100000",
    "00000100000",
    "00000000000",
  ],
  // 3. Lotus
  [
    "00000100000",
    "00001110000",
    "00101110100",
    "01111111110",
    "11111111111",
    "01111111110",
    "00111111100",
    "00001110000",
    "00000100000",
    "00000000000",
    "00000000000",
  ],
  // 4. Vine
  [
    "00001100000",
    "00011000000",
    "00011100000",
    "00001111000",
    "00000111000",
    "00011110000",
    "00111000000",
    "00011000000",
    "00001100000",
    "00000110000",
    "00000011000",
  ]
];

function OrganicPixelShape({ gridIndex = 0, size = 60 }: { gridIndex?: number, size?: number }) {
  const grid = GRIDS[gridIndex % GRIDS.length];

  return (
    <div style={{ width: size, height: size, pointerEvents: "auto" }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 11 11" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }} // Allow scaled pixels to break out
      >
        {grid.map((row, y) => 
          row.split("").map((pixel, x) => 
            pixel === "1" ? (
              <motion.rect 
                key={`${x}-${y}`} 
                x={x} 
                y={y} 
                width="1" 
                height="1" 
                rx="0.2" // slightly rounded for organic feel
                initial={{ fill: "rgba(123, 182, 255, 0.3)", scale: 1 }} // Translucent blue
                whileHover={{ 
                  fill: "#be96ff", // Lilac
                  scale: 1.8, // Pop out 
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                animate={{ fill: "rgba(123, 182, 255, 0.3)", scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }} // Smooth falloff like a liquid wave
                style={{ originX: "50%", originY: "50%", cursor: "crosshair" }}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

export default function PixelMotifs() {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 2000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y3 = useTransform(scrollY, [0, 2000], [0, 200]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <motion.div style={{ position: "absolute", top: "15%", left: "10%", y: y1 }}>
        <OrganicPixelShape gridIndex={0} size={100} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "35%", right: "12%", y: y2 }}>
        <OrganicPixelShape gridIndex={1} size={80} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "60%", left: "5%", y: y3 }}>
        <OrganicPixelShape gridIndex={2} size={140} />
      </motion.div>
      
      <motion.div style={{ position: "absolute", top: "130vh", right: "8%", y: y1 }}>
        <OrganicPixelShape gridIndex={3} size={110} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "190vh", left: "10%", y: y2 }}>
        <OrganicPixelShape gridIndex={0} size={90} />
      </motion.div>
      
      <motion.div style={{ position: "absolute", top: "280vh", right: "15%", y: y3 }}>
        <OrganicPixelShape gridIndex={2} size={120} />
      </motion.div>
      <motion.div style={{ position: "absolute", top: "340vh", left: "2%", y: y1 }}>
        <OrganicPixelShape gridIndex={1} size={100} />
      </motion.div>
    </div>
  );
}
