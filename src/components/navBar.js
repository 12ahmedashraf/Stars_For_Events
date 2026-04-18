"use client";
import Image from "next/image"
import { Menu , Calendar,Info,ImageIcon,MessageSquare} from "lucide-react";
import { LogoStar } from "@/components/icons";
import { useState , useEffect} from "react";
export default function NavBar()
{
    const {isMenuOpen,setMenuOpen} = useState(false);
    const {scrolled,setScrolled} = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
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
    { name: "Contact", href: "/contact", icon: <MessageSquare size={16} /> },
  ];
    return(
        <nav className={`fixed top-2 w-full z-50 transition-all duration-300 mx-2 :${
        scrolled ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10" : "py-6 bg-transparent"
      }`}>
            <div>
                <div className="NavBarLogo">
                    <Image src="/text-logo.png" 
                    height={100} 
                    width={70} alt="" 
                    priority className="w-auto h-12 transition-all duration-500 
      NavBarLogo-hover:brightness-125 
      NavBarLogo-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"/>
                </div>
            </div>
        </nav>
    );
}