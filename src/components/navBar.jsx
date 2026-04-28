"use client";
import Image from "next/image"
import { Menu , Calendar,Info,ImageIcon,MessageSquare , XCircle,User} from "lucide-react";
import { LogoStar } from "@/components/icons";
import { useState , useEffect} from "react";
import Link from "next/link";
import { SignInButton,SignUpButton,Show,UserButton } from "@clerk/nextjs";
export default function NavBar()
{
    const [isMenuOpen,setMenuOpen] = useState(false);
    const [scrolled,setScrolled] = useState(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    
    useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setScrolled]);
    const [ContactOpen,setContactOpen] = useState(0);
    const navLinks = [
    { name: "Home", href: "/", icon: <Calendar size={16} /> },
    { name: "About Us", href: "/about", icon: <ImageIcon size={16} /> },
    { name: "Events", href: "/events", icon: <Info size={16} /> },
    { name: "Contact Us", href: "/contact", icon: <MessageSquare size={16} /> },
  ];
  const MobilenavLinks = [
    { name: "Home", href: "/", icon: <Calendar size={16} /> },
    { name: "About Us", href: "/about", icon: <ImageIcon size={16} /> },
    { name: "Events", href: "/events", icon: <Info size={16} /> },
    { name: "Book Now!", href: "/events/08a7fcf7-e7d8-4c41-ac5a-faa899e55b88", icon: <MessageSquare size={16} /> },
  ];
  useEffect(() => {
  const handleClickOutside = () => {
    setContactOpen(false);
  };

  if (ContactOpen) {
    window.addEventListener("click", handleClickOutside);
  }

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, [ContactOpen]);
    return(
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300  ${
            scrolled && !isMenuOpen ? "py-1  bg-black/80 backdrop-blur-md border-b border-white/10" : "py-1 bg-transparent"
          }`}>
                  <div className="flex justify-between m-3 items-center">
                    <div className="flex-1  flex justify-start NavBarLogo  cursor-pointer">
                      <div className="group">
                        <Image src="/text-logo.png" 
                        height={100} 
                        width={70} alt="" 
                        priority 
                        className="w-auto h-12 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
                        />
                        </div>
                    </div>
                    <div className="Desktop hidden md:flex flex-2 justify-between items-center">
                      <div className="links flex gap-12 items-center justify-center">
                      {
                        navLinks.map((link) => {
                          if(link.name==="Contact Us")
                          {
                            return (
                              <div
                              key={link.name}
                              className="relative py-2"
                              onClick={()=>setContactOpen(ContactOpen+1)}
                              >
                                <button className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white hover:cursor-pointer transition-all hover:scale-110 ease-out duration-300"
                                onClick={(e)=>{e.stopPropagation();
                                  setContactOpen(!ContactOpen);
                                }}
                                >
                                {link.name}
                              </button>
                               <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-xl py-2 transition-all duration-300 ${ContactOpen%2===1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                                <div className="flex flex-col gap-1 px-1"
                                   onClick={(e)=>{e.stopPropagation();
                                }}
                                >
                                  <Link href="https://www.instagram.com/stars_for_events?igsh=MWxwOHJrdXh1Z3MxeA==" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors">Instagram</Link>
                                  <Link href="tel:+201229962915" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors">CALL</Link>
                                  <Link href="mailto:Starsvc23@gmail.com" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors">Email</Link>
                                </div>
                              </div>
                              </div>
                            )
                          }
                          return (<Link
                          key={link.name}
                          href={link.href}
                          className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all hover:scale-110 ease-out relative group duration-300">
                          {link.name}
                          </Link>)
                          
})
                      }
                      </div>
                      <div className="userActions flex justify-end flex-1 items-center gap-6">
                          <Show when="signed-out">
                          <SignInButton mode="modal">
                          <button  className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all hover:scale-110 ease-out duration-300">
                            SignIn</button></SignInButton>
                            <SignUpButton mode="modal">
                          <button className="font-mono text-sm uppercase tracking-[0.2em] bg-white text-black rounded-2xl p-2 hover:text-white hover:bg-white/60 transition-colors duration-300">SignUp</button>
                          </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                          <div className="mr-5 gap-5 flex">
                          <div className="bg-white/10 backdrop-blur-md border hover:scale-110 hover:cursor-pointer transition-all duration-300 border-white/20 p-1.5 rounded-2xl shadow-xl flex items-center">
                            <Link href="/user" className="md:text-xs font-light text-white/40 font-mono ">Profile</Link></div>
                            <UserButton  appearance={{ elements: { userButtonAvatarBox: "!w-9.5 !h-9.5 border border-white/20 hover:border-white/50 transition-all" } }} />
                          </div>
                        </Show>
                      </div>
                    </div>
                    <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none z-50">
                      {isMenuOpen ? <XCircle/> :<Menu/>}
                    </button>
                  </div>
            </nav>
            <div className={`fullScreenOverlay fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 ${isMenuOpen ? "opacity-100 translate-y-0 bg-black" : "opacity-0 -translate-y-full pointer-events-none"}`}>
                  <div className="flex flex-col items-center gap-8">
                    {MobilenavLinks.map((link) => (
                      <Link
                      key={link.name}
                      href={link.href}
                      className="font-sans text-2xl font-black uppercase tracking-tighter hover:italic transition-all duration-300"
                      onClick={toggleMenu}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <hr className="w-20 border-white/20 my-4" />
                    <div className="flex flex-col items-center gap-6">
                      <Show when="signed-out">
                        <SignInButton mode="modal">
                    <button  onClick={toggleMenu} className="font-mono text-sm uppercase tracking-widest text-white/50">
                      Existing Account
                    </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                    <button  onClick={toggleMenu} className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-full font-sans font-black uppercase tracking-widest  transition-all">
                      Join Stars <User size={20} />
                    </button>
                    </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                          <div className="mr-5 gap-10 flex flex-col items-center jusify-center">
                            <Link onClick={toggleMenu} href="/user" className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-full font-sans font-black uppercase tracking-widest  transition-all">Profile</Link>
                            <UserButton  appearance={{ elements: {userButtonTrigger: "!w-15 !h-15",userButtonAvatarImage: "!w-15 !h-15", userButtonAvatarBox: "!w-15 !h-15 border border-white/20 hover:border-white/50 transition-all" } }} />
                          </div>
                    </Show>
                  </div>
                  </div>
              </div>
        </>
    );
}