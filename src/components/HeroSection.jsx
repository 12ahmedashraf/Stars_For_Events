"use client";
import { LogoStar } from "./icons";
import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
export default function Hero() {
    const baseId = useId();
    const stars = Array.from({length: 25});

    return (
        <div className="heroSection relative min-h-screen w-full z-0 flex items-center justify-center overflow-hidden bg-black">
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
            <div className="Logo_and_text z-40 flex flex-col items-center gap-12">
                    <Image src="/stars_for_events.png" loading="eager" alt="" height={300} width={350} className="hover:scale-110 transition-all duration-300"/>
                    <p className="items-center font-mono tracking-wider hover:text-white hover:cursor-pointer transition-all duration-200 text-white/65 text-lg md:text-2xl ">Book , Attend & Shine like a Star!</p>
                    <Link href="/events" className="flex items-center gap-3 bg-white text-zinc-600 px-5 text-sm hover:scale-110  ease-out duration-200 py-2 rounded-full font-sans font-black uppercase tracking-widest  transition-all">
                        Book now!
                    </Link>
            </div>

        </div>
    );
}