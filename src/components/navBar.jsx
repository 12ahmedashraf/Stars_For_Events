"use client";
import Image from "next/image"
import { Menu , Calendar,Info,ImageIcon,MessageSquare , XCircle,User} from "lucide-react";
import { LogoStar } from "@/components/icons";
import { useState , useEffect} from "react";
import Link from "next/link";
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
    const navLinks = [
    { name: "Home", href: "/", icon: <Calendar size={16} /> },
    { name: "About Us", href: "/about", icon: <ImageIcon size={16} /> },
    { name: "Events", href: "/Events", icon: <Info size={16} /> },
    { name: "Contact Us", href: "/contact", icon: <MessageSquare size={16} /> },
  ];
    return(
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300  :${
        scrolled ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10" : "py-6 bg-transparent"
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
                    navLinks.map((link) => (
                      <Link
                      key={link.name}
                      href={link.href}
                      className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all hover:scale-110 ease-out relative group duration-300">
                      {link.name}
                      </Link>
                    ))
                  }
                  </div>
                  <div className="userActions flex justify-end flex-1 items-center gap-6">
                      <Link href="/login" className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all hover:scale-110 ease-out duration-300">
                        SignIn</Link>
                      <Link href="/signup" className="font-mono text-sm uppercase tracking-[0.2em] bg-white text-black rounded-2xl p-2 hover:text-white hover:bg-white/60 transition-colors duration-300">SignUp</Link>
                  </div>
                </div>
                <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none z-50">
                  {isMenuOpen ? <XCircle/> :<Menu/>}
                </button>
              </div>
              <div className={`fullScreenOverlay fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
                  <div className="flex flex-col items-center gap-8">
                    {navLinks.map((link) => (
                      <a
                      key={link.name}
                      href={link.href}
                      className="font-sans text-2xl font-black uppercase tracking-tighter hover:italic transition-all duration-300"
                      onClick={toggleMenu}
                      >
                        {link.name}
                      </a>
                    ))}
                    <hr className="w-20 border-white/20 my-4" />
                    <div className="flex flex-col items-center gap-6">
                    <a href="/login" onClick={toggleMenu} className="font-mono text-sm uppercase tracking-widest text-white/50">
                      Existing Account
                    </a>
                    <a href="/signup" onClick={toggleMenu} className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-full font-sans font-black uppercase tracking-widest  transition-all">
                      Join Stars <User size={20} />
                    </a>
                  </div>
                  </div>
              </div>
        </nav>
    );
}