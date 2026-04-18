"use client";
import { LogoStar } from "./icons";
import { useId } from "react";
import Image from "next/image";

export default function Hero() {
    const baseId = useId();
    const stars = Array.from({length: 25});

    return (
        <div className="heroSection relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            <div className="Stars absolute inset-0 z-0 pointer-events-none">
                {stars.map((_, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const topp = (row * 20) + ((i * 13) % 15);
                    const leftt = (col * 20) + ((i * 17) % 15);
                    const duration = 3 + (i % 4);
                    const delay = i % 5;

                    return (
                        <div 
                            key={`${baseId}-${i}`}
                            className="absolute animate-star"
                            style={{
                                top: `${topp}%`,
                                left: `${leftt}%`,
                                "--duration": `${duration}s`,
                                "--drift-duration": `${8 + (i % 3)}s`,
                                animationDelay: `${delay}s`,
                            }}
                        >
                              <div className="transition-all duration-300 ease-out ">
                                <LogoStar
                                    className="text-white/60"
                                    style={{
                                        width: `${10 + (i % 15)}px`,
                                        height: `${10 + (i % 15)}px`,
                                        filter: i % 3 === 0 ? "blur(1px)" : "none"
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="Logo_and_text z-40 flex flex-col items-center gap-10">
                <Image src="/stars_for_events.png" loading="eager" alt="" height={300} width={350} />
                <p className="items-center font-mono tracking-wider text-white/65 text-lg md:text-2xl ">Book , Attend & Shine like a Star!</p>
            </div>

        </div>
    );
}