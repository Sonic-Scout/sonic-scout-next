"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getUserId } from "@/lib/userIdApi";

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  const router = useRouter();
  const title = "Sonic Scout";
  const subtitle = "Your AI-powered DeFi assistant";
  const words = title.split(" ");
  const UUID = getUserId();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div 
          className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/15 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text 
                      bg-gradient-to-r from-primary to-primary/80 
                      dark:from-primary dark:to-primary/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-xl md:text-2xl mb-8 text-slate-600 dark:text-slate-300 font-medium"
          >
            {subtitle.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.03 }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8"
          >
              <Button
                variant="ghost"
                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                  bg-white/95 hover:bg-white/100 dark:bg-black/90 dark:hover:bg-black/100 
                  text-primary hover:text-primary dark:text-primary dark:hover:text-primary transition-all duration-300 
                  group-hover:-translate-y-0.5 border border-transparent
                  hover:shadow-md dark:hover:shadow-primary/20 cursor-pointer"
                onClick={() => router.push(`/chat/${UUID}`)}
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Chat with Scout
                </span>
                <span
                  className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                    transition-all duration-300"
                >
                  →
                </span>
              </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="mt-12 bg-background/30 dark:bg-background/30 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-border shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card border border-border">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </motion.div>
                <h3 className="font-bold text-foreground">AI-Powered DeFi Insights</h3>
                <p className="text-sm text-muted-foreground text-center">Get real-time analysis on tokenomics, social sentiment, and market trends.</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card border border-border">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                </motion.div>
                <h3 className="font-bold text-foreground">Unlock the Future of DeFi</h3>
                <p className="text-sm text-muted-foreground text-center">Connect with Twitter and instantly get a non-custodial wallet</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-card dark:bg-card border border-border">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary"
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bring-to-front"><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"/><path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"/></svg>
                </motion.div>
                <h3 className="font-bold text-foreground">Simplifies Your DeFi Journey</h3>
                <p className="text-sm text-muted-foreground text-center">Advanced AI tools to analyze, invest, and grow your portfolio with confidence.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
