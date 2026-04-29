import Image from "next/image";
import { LogoStar } from "@/components/icons";
import Hero from "@/components/HeroSection";
import ImageSlider from "@/components/imageSlider";
import { Layout, Camera, Star, MapPin } from "lucide-react";
export default function Home() {
  const HomePageSlides = [
    {
      title: "Our Pablo shine",
      image: "/2.jpeg",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/1.jpeg",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/3.jpeg",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/9.jpeg",
    },
    {
      title: "Masar Igbary & Shehab concert shine",
      image: "/8.jpeg",
    },
  ];
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
      desc: "Access to Egypt’s most exclusive locations. We transform hidden gems into the center of the galaxy for one night.",
      icon: <MapPin size={30} />,
    },
  ];
  return (
          <div className="flex flex-col items-center overflow-hidden">
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
            <div className="home-gallery flex flex-col items-center mb-10">
              <h1 className=" border-t-2  border-t-zinc-500 mb-10 font-sans text-lg text-center md:text-2xl uppercase font-black ">We don&apos;t just organize events , we create life changing experiences!</h1>
            <ImageSlider slides={HomePageSlides}/>
            </div>
            <div className="our-partners flex flex-col items-center gap-10 mb-25 ">
                <h1 className="w-fit border-t-2  border-t-zinc-500 font-sans text-lg text-center md:text-2xl uppercase font-black ">Our Partners</h1>
                <div className="partners-grid grid grid-cols-3 md:grid-cols-3 items-center justify-center   mx-5 gap-5 md:gap-20 ">
                      <Image src="/partners_home/marathon.png" height={200} width={200} alt="alexandria marathon"/>
                      <Image src="/partners_home/gps.png" height={200} width={200} alt=" gps"/>
                      <Image src="/partners_home/lumo.png" height={200} width={200} alt="lumo"/>
                      <Image src="/partners_home/noujom.png" height={200} width={200} alt=" noujom"/>
                      <Image src="/partners_home/vc.png" height={200} width={200} alt=" vc"/>
                      <Image src="/partners_home/to7fa.png" height={200} width={200} alt="to7fa"/>
                </div>
            </div>
            <div className="3-steps-to-shine">
              <div className="heading flex justify-center mb-10">
              <h1 className="border-t-2 border-t-zinc-500  font-sans text-lg md:text-2xl text-center uppercase font-black w-fit">3 steps to shine!</h1>
              </div>
              <div className="steps-boxes flex flex-col gap-10 md:flex-row mb-10">
                <div className="step-box border-2 p-10 hover:cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out rounded-4xl flex items-center gap-5 border-amber-50 ">
                    <LogoStar className="" style={{
                      height:`125px`,
                      width:`125px`
                    }}/>
                    <div className="content fit-to-content">
                      <h1 className="font-sans text-2xl md:text-5xl text-center uppercase font-black ">BOOK</h1>
                    </div>
                </div>
                <div className="step-box hover:scale-110 hover:cursor-pointer transition-all duration-300 ease-in-out  border-2 p-10  rounded-4xl flex items-center gap-5 border-amber-50 ">
                    <LogoStar className="" style={{
                      height:`125px`,
                      width:`125px`
                    }}/>
                    <div className="content fit-to-content">
                      <h1 className="font-sans text-2xl md:text-5xl text-center uppercase font-black ">Attend</h1>
                    </div>
                </div>
                <div className="step-box hover:scale-110 hover:cursor-pointer transition-all duration-300 ease-in-out border-2 p-10  rounded-4xl flex items-center gap-5 border-amber-50 ">
                    <LogoStar className="" style={{
                      height:`125px`,
                      width:`125px`
                    }}/>
                    <div className="content fit-to-content">
                      <h1 className="font-sans text-2xl md:text-5xl text-center uppercase font-black ">SHine!</h1>
                    </div>
                </div>
              </div>
            </div>
          </div>  
      );
}
