"use client";
import { useId } from "react";
import { LogoStar } from "@/components/icons";
import { useUser,UserAvatar } from "@clerk/nextjs";
export default function User(){
    const baseId = useId();
    const stars = Array.from({length: 25});
    const {isLoaded, isSignedIn,user}= useUser();
    if(!isLoaded) return null;
    if(!isSignedIn) return (<div className="flex items-center justify-center"><h1>LogIn</h1></div>) 
    return (
        <div className="flex flex-col items-center">
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
                                <div className="Logo_and_text z-40 mb-8 flex flex-col items-center justify-center gap-20 mt-25">
                                       <div className="heading flex flex-col items-center">
                                            <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Your Profile</h1>
                                            <h2 className="font-mono text-lg md:text-xl text-white/40 text-center mt-5">Manage your profile & tickets here {user.firstName}!</h2>
                                       </div>
                                </div>
                                
            
                            </div>
                            <div className="profile-form mt-10 w-xl md:w-2xl bg-white/10 backdrop-blur-md border  border-white/20 p-1.5 rounded-2xl shadow-xl flex items-center ">
                                <div className="header flex gap-5 p-5 w-full items-center border-b-2 border-b-white/10 ">
                                <UserAvatar
                                    appearance={{
                                        elements:{
                                            avatarBox: "!w-13 !h-13 border border-white/20",
                                            avatarImage: "!w-13 !h-13"
                                        }
                                    }}
                                />
                                <p className="font-mono text-sm text-white/40">
                                    {user.primaryEmailAddress?.emailAddress}
                                </p>
                                </div>
                                <div className="formm">
                                    <form action="">
                                        
                                    </form>
                                </div>
                            </div>
        </div>
    )
}