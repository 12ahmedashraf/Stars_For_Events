import Image from "next/image";
import { Facebook,Instagram } from "./icons";
import {Phone, Mail} from "lucide-react";
import Link from "next/link";
const contactLinks = [
 
  { 
    name: "Instagram", 
    href: "https://www.instagram.com/stars_for_events?igsh=MWxwOHJrdXh1Z3MxeA==", 
    icon: <Instagram size={20} />, 
  },
  { 
    name: "Email", 
    href: "mailto:Starsvc23@gmail.com", 
    icon: <Mail size={20} />, 
  },
  { 
    name: "Phone", 
    href: "tel:+201229962915", 
    icon: <Phone size={20} />, 
  },
];
export default function Footer(){
    return(
        <div className="border-t-2 border-t-zinc-400 p-20 flex flex-col gap-20 items-center md:items-stretch">
            <div className="flex flex-col md:flex-row md:justify-between gap-20 md:gap-0 ">
                <div className="image flex flex-col gap-10 items-center">
                    <Image src="/text-logo.png" height={150} width={150} alt=""/>
                </div>
                <div className="social flex gap-5 items-center">
                    {
                        contactLinks.map((contact)=>(
                            <Link  target="_blank" href={contact.href} key={contact.name} className="hover:scale-120 cursor-pointer w-fit transition-all duration-300 ease-out">
                                {contact.icon}
                            </Link>
                        ))
                    }
                </div>
            </div>
            <div className="endd">
                <div className="text border-b-2 p-5 border-b-zinc-600">
                    <p className="items-center font-mono tracking-wider hover:text-white hover:cursor-pointer transition-all duration-200 text-white/65 text-xs md:text-sm ">Book , Attend & Shine like a Star!</p>
                </div>
                <p className="items-center text-center p-5 font-mono tracking-wider hover:text-white hover:cursor-pointer transition-all duration-200 text-white/65 text-xs md:text-sm ">© 2026 Stars for events. All Rights Reserved.</p>
            </div>
        </div>
    );
}