"use client";
import { LogoStar } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { MapPin ,Users,Stars,Calendar,Ticket} from "lucide-react";
export default function EventsPage({events})
{
        const baseId = useId();
        const stars = Array.from({length: 25});
        return(
            <div className="events mb-15 flex flex-col items-center md:items-start md:mx-20 ">
                <div className="heroSection border-b-2 border-b-white/20 relative  w-full z-0 flex items-center justify-center overflow-hidden bg-black">
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
                    <div className="Logo_and_text z-40 mb-10 flex flex-col items-center justify-center gap-20 mt-35">
                           <div className="heading flex flex-col items-center">
                                <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Our Events</h1>
                                <h2 className="font-mono text-lg md:text-xl text-white/40 text-center mt-5">Book, Attend & Shine!</h2>
                           </div>
                    </div>
                    

                </div>
                <div className="event-boxes grid md:grid-cols-4 mt-10 grid-cols-1 ">
                        {events.map((item,index)=>(<Link key={item.title} href = {`/events/${item.id}`} className="event-box rounded-4xl w-85 pb-10 border flex flex-col gap-4 border-white overflow-hidden items-center">
                           <div className="banner relative w-full h-63 border-b border-b-white/30 "> 
                                <Image 
                                    src={item.image_url}
                                    alt={item.title} 
                                    width={400} 
                                    height={225}
                                    className="w-full h-full object-cover" 
                                />
                                <div className="status animate-pulse  absolute top-5 right-5 hover:scale-110 transition-all duration-300 cursor-pointer  bg-green-400 rounded-2xl p-2 text-sm ">
                                    <h2 className="font-mono">{item.status}</h2>
                                </div>
                            </div>
                            <h1 className="font-black font-sans text-center uppercase text-white text-xl md:text-2xl">NextStep</h1>
                            <div className="content gap-4 ml-10 mt-2 mb-3 w-full flex flex-col">
                                <div className="location  flex gap-4"><MapPin size={20}/>
                                 <p className="font-sans font-light text-sm">{item.location}</p></div>
                                  <div className="date  flex gap-4"><Calendar size={20}/>
                                 <p className="font-sans font-light text-sm">{new Date(item.event_date).toLocaleDateString()}</p></div>
                                  <div className="price  flex gap-4"><Ticket size={20}/>
                                 <p className="font-sans font-light text-sm uppercase">{item.price === 0 ? "Tickets for free!" :item.price}</p> <span className="font-sans font-light text-sm uppercase"> EGP</span></div>
                            </div>
                            <div><div   className="mx-10  font-sans animate-pop bg-white text-black p-2 text-sm font-black rounded-3xl">Read more</div></div>
                        </Link>
                        ))}
                    </div>
               
            </div>
        );
    }