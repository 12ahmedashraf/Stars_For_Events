"use client";
import { useState,useEffect,useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftCircle,ChevronRightCircle } from "lucide-react";
import Image from "next/image";
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "25%" : "-25%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "25%" : "-25%",
    opacity: 0,
  }),
};
export default function ImageSlider({slides})
{
    const [[slide,direction],setSlide] = useState([0,0]);
   const newSlide = useCallback((direction) => {
  setSlide((prev) => [prev[0] + direction, direction]);
}, []);
    useEffect(()=> {
        const timer = setInterval(()=>{newSlide(1);},6500);
        return () => clearInterval(timer);
    },[newSlide,slide]);
    const current = Math.abs(slide%slides.length);
    const swipeCthre = 10000;
    const swipeP = (offset,velocity) => Math.abs(offset) * velocity;
    return(
            <div className="relative aspect-video  md:h-[80vh] w-full max-w-350 mx-auto overflow-hidden bg-black rounded-4xl ">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                  key={slide}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipeP(offset.x, velocity.x);
                    if (swipe < -swipeCthre) {
                      newSlide(1);
                    } else if (swipe > swipeCthre) {
                      newSlide(-1);
                    }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    <Image 
                    src={slides[current].image} 
                    className="h-full w-full object-cover opacity-90 pointer-events-none"
                    alt={slides[current].title}
                    fill
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  </motion.div>  
                </AnimatePresence>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                <button onClick={() => newSlide(-1)}
                  className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm">
                    <ChevronLeftCircle size={20}/>
                  </button>
                  {slides.map((_,i)=>(
                    <div 
                    key={i} 
                    className={`h-1 transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2 bg-white/20"}`} 
                  />
                  ))

                  }
                    <button onClick={() => newSlide(1)}
                  className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm">
                    <ChevronRightCircle size={20}/>
                  </button>
                </div>
            </div>
    );
}