"use client";
import { LogoStar } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { MapPin ,Users,Stars,Calendar} from "lucide-react";
import { color } from "framer-motion";
import ImageSlider from "@/components/imageSlider";
export default function About()
{
        const baseId = useId();
        const stars = Array.from({length: 25});
       const gallery = [
    {
      title: "Our Pablo shine",
      image: "/shehab.png",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/1.jpeg",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/2.jpeg",
    },
  ];
        return(
            <div className="about mb-15">
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
                    <div className="Logo_and_text z-40 flex flex-col items-center gap-20">
                           <div className="bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5 rounded-2xl shadow-xl">
                           <h5 className="text-sm md:text-lg font-light text-white/40 font-mono">About us</h5>
                           </div>
                           <div className="title">
                            <h1 className="font-black uppercase text-white font-sans text-4xl hover:text-white/40 hover:cursor-pointer transition-all duration-300 md:text-6xl text-center">Beyond the event, Beyond the Stars!</h1>
                           </div>
                           <div className="info grid md:grid-cols-4 grid-cols-2 gap-5">
                            <div className="info-box flex flex-col gap-2 items-center bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-3 rounded-2xl shadow-xl">
                            <MapPin size={35} className="text-white/40"/>
                           <h5 className="text-lg md:text-xl font-light text-white font-mono">10+</h5>
                           <h5 className="text-sm md:text-xl font-light uppercase  text-white/40 font-mono">Venues</h5>
                           </div>
                           <div className="info-box flex flex-col gap-2 items-center bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-3 rounded-2xl shadow-xl">
                            <Users size={35} className="text-white/40"/>
                           <h5 className="text-lg md:text-xl font-light text-white font-mono">100K+</h5>
                           <h5 className="text-sm md:text-xl font-light uppercase  text-white/40 font-mono text-center">Starred Attendees!</h5>
                           </div>
                            <div className="info-box flex flex-col gap-2 items-center bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-3 rounded-2xl shadow-xl">
                            <Stars size={35} className="text-white/40"/>
                           <h5 className="text-lg md:text-xl font-light text-white font-mono">20+</h5>
                           <h5 className="text-sm md:text-xl font-light uppercase  text-white/40 font-mono">Stars Hosted!</h5>
                           </div>
                           <div className="info-box flex flex-col gap-2 items-center bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-3 rounded-2xl shadow-xl">
                            <Calendar size={35} className="text-white/40"/>
                           <h5 className="text-lg md:text-xl font-light text-white font-mono">20+</h5>
                           <h5 className="text-sm md:text-xl font-light uppercase  text-white/40 font-mono">Events Powered!</h5>
                           </div>
                           </div>
                    </div>
        
                </div>
                <div className="md:ml-10 md:mr-10 gap-10 our-vision flex md:flex-row flex-col items-center md:items-start">
                    <div className="textContent flex flex-col gap-5 items-center md:items-start">
                         <div className=" bg-white/10 backdrop-blur-md border hover:scale-110 w-fit hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5 rounded-2xl shadow-xl">
                           <h5 className="text-sm md:text-lg font-light text-white/40 font-mono  ">Our Vision</h5>
                           </div>
                           <h1 className="font-sans font-black  text-2xl md:text-4xl text-center uppercase">Beyond the <span className="text-white/40">Stars!</span></h1>
                           <p className="text-center md:text-left font-bold font-sans text-xs md:text-lg">At <span className="text-white/40">STARS</span>, our vision is to redefine the digital infrastructure of Egypt’s social landscape. We believe that an event is more than a date on a calendar—it is a point of convergence for creativity, culture, and community. By blending minimalist design with high-performance engineering, we aim to provide a seamless gateway to the Egypt`s most significant experiences, ensuring that the journey to an event is as refined as the event itself.</p>
                    </div>
                    <Image 
                    src="/shehab.png" 
                    width={800} 
                    height={600}
                    className=" hover:scale-110 transition-all hover:cursor-pointer duration-300 w-full shadow-2xl shadow-amber-50  inset-0  max-w-100 rounded-2xl h-auto object-contain"
                    alt="shehab"
                    />
                </div>
                <div className="md:ml-10 md:mr-10 mt-15 gap-10 our-vision flex  flex-col items-center ">
                    <div className="textContent flex flex-col gap-5 items-center">
                         <div className=" bg-white/10 backdrop-blur-md border hover:scale-110 w-fit hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5 rounded-2xl shadow-xl">
                           <h5 className="text-sm md:text-lg font-light text-white/40 font-mono ">Our Mission</h5>
                           </div>
                           <h1 className="font-sans font-black  text-2xl md:text-4xl text-center uppercase">How we <span className="text-white/40">Shine?</span></h1>
                    </div>
                    <div className="boxes flex flex-col md:flex-row gap-10">
                        <div className="box border-2 w-fit max-w-xs hover:cursor-pointer p-5 hover:scale-110 rounded-2xl border-white flex flex-col items-center gap-5 bg-white hover:border-white/20 transition-all duration-500 group">
                                        <LogoStar className="" style={{
                                    width: `35px`,
                                    height: `35px`,
                                    fill: `black`,
                                }}/>
                                <div className="text flex flex-col gap-4">
                                    <h1 className="font-mono font-bold text-center uppercase md:text-lg text-black text-sm">Elevating the Standard</h1>
                                    <p className="font-mono text-xs md:text-sm text-black font-light  text-center">Setting a new benchmark for how events are organized and experienced, ensuring every gathering meets a professional, high-fidelity standard.</p>
                                </div>
                        </div>
                        <div className="box border-2 w-fit max-w-xs hover:cursor-pointer p-5 hover:scale-110 rounded-2xl border-white flex flex-col items-center gap-5 bg-white hover:border-white/20 transition-all duration-500 group">
                                        <LogoStar className="" style={{
                                    width: `35px`,
                                    height: `35px`,
                                    fill: `black`,
                                }}/>
                                <div className="text flex flex-col gap-4">
                                    <h1 className="font-mono font-bold text-center uppercase md:text-lg text-black text-sm">Seamless Integration</h1>
                                    <p className="font-mono text-xs md:text-sm text-black font-light  text-center">Developing the digital infrastructure that removes logistical friction, allowing the focus to remain on the event and the community.</p>
                                </div>
                        </div>
                        <div className="box border-2 w-fit max-w-xs hover:cursor-pointer p-5 hover:scale-110 rounded-2xl border-white flex flex-col items-center gap-5 bg-white hover:border-white/20 transition-all duration-500 group">
                                        <LogoStar className="" style={{
                                    width: `35px`,
                                    height: `35px`,
                                    fill: `black`,
                                }}/>
                                <div className="text flex flex-col gap-4">
                                    <h1 className="font-mono font-bold text-center uppercase md:text-lg text-black text-sm">Fostering Connection</h1>
                                    <p className="font-mono text-xs md:text-sm text-black font-light  text-center">Building a sustainable ecosystem where technical and creative communities can move beyond the screen and connect in person.</p>
                                </div>
                        </div>
                        <div className="box border-2 w-fit max-w-xs hover:cursor-pointer p-5 hover:scale-110 rounded-2xl border-white flex flex-col items-center gap-5 bg-white hover:border-white/20 transition-all duration-500 group">
                                        <LogoStar className="" style={{
                                    width: `35px`,
                                    height: `35px`,
                                    fill: `black`,
                                }}/>
                                <div className="text flex flex-col gap-4">
                                    <h1 className="font-mono font-bold text-center uppercase md:text-lg text-black text-sm">Empowering Visionaries</h1>
                                    <p className="font-mono text-xs md:text-sm text-black font-light  text-center">Providing the tools and support for organizers to turn complex creative and technical visions into successful real-world impact.</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="our-gallery mt-10 flex items-center flex-col">
                    <div className="textContent flex flex-col gap-5 items-center mb-10 justify-center">
                         <div className=" bg-white/10 backdrop-blur-md border hover:scale-110 w-fit hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5 rounded-2xl shadow-xl">
                           <h5 className="text-sm md:text-lg font-light text-white/40 font-mono ">Our Gallery</h5>
                           </div>
                           <h1 className="font-sans font-black text-white/40  text-2xl md:text-4xl text-center uppercase">Some of our <span className="text-white">Shines!</span></h1>
                    </div>
                    <ImageSlider slides={gallery}/>
                </div>
                <div className="cta flex justify-center my-20   ">
                 <Link href="/events" className="font-black font-sans text-2xl rounded-4xl md:text-4xl px-10 py-5  bg-white/10 backdrop-blur-md border hover:scale-110 w-fit hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5  shadow-xl">
                        Book now!
                    </Link>
                    </div>
            </div>
        );
    }