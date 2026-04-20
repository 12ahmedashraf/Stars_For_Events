import Image from "next/image";
import { LogoStar } from "@/components/icons";
import Hero from "@/components/HeroSection";
import { Layout, Camera, Star, MapPin } from "lucide-react";
export default function Home() {
  const features = [
    {
      title: "Organization",
      desc: "Precision engineering for every event. From logistics to crowd flow, we manage the chaos so you can enjoy the night.",
      icon: <Layout size={30} />,
    },
    {
      title: "Media Coverage",
      desc: "Our professional lens captures your best angles. We ensure your moments are documented with a cinematic, high-end aesthetic.",
      icon: <Camera size={30} />,
    },
    {
      title: "Unforgettable Moments",
      desc: "We don't just host parties; we create memories. Every detail is designed to leave a lasting impact long after the music stops.",
      icon: <Star size={30} />,
    },
    {
      title: "Venue Curation",
      desc: "Access to Alexandria’s most exclusive locations. We transform hidden gems into the center of the galaxy for one night.",
      icon: <MapPin size={30} />,
    },
  ];
  return (
          <div className="flex flex-col items-center">
          <Hero/>
          <div className="what-we-offer flex flex-col items-center">
            <h1 className=" border-t-2  border-t-zinc-500 font-sans text-lg md:text-2xl uppercase font-black ">What do we offer?</h1>
            <div className="cards mx-20 my-15 cursor-pointer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-fit">
              {features.map((feature,i)=>(
                <div 
                key={i}
                className="card border-2 w-fit max-w-xs p-5 hover:scale-110 rounded-2xl border-white flex flex-col items-center gap-5 bg-linear-to-b from-white/15 to-white-0 hover:border-white/20 transition-all duration-500 group">
                    <LogoStar className="" style={{
                       width: `25px`,
                      height: `25px`,
                  }}/>
                  <div className="title">
                    <h1 className="font-sans font-bold text-center uppercase md:text-[15px] text-sm">{feature.title}</h1>
                  </div>
                  <div className="desc">
                    <p className="font-sans md:text-sm text-xs text-center">{feature.desc}</p>
                  </div>
                  <div className="icon">
                  {feature.icon}</div>
                </div>
              ))}
              
            </div>
          </div>
            <div className="home-gallery flex flex-col items-center">
              <h1 className=" border-t-2  border-t-zinc-500 font-sans text-xs text-center md:text-xl uppercase font-black ">We don&apos;t just organize events , we create life changing experiences!</h1>
            
            </div>
          </div>  
      );
}
