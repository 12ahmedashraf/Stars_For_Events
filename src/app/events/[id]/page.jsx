import Book from "@/components/BookingButton";
import { LogoStar } from "@/components/icons";
import Timer from "@/components/Timer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { MapPin,Ticket ,Stars} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default async function EventRegistration({params})
{
    const {id} = await params;
    const {data:event,error} = await supabaseAdmin.from('events').select('*').eq('id',id).maybeSingle();
    if(error || ! event)
        return <h1 className="text-2xl">Event not found!</h1>

    return (<div className=" md:mr-15  mt-15 mb-10 md:ml-10 flex flex-col gap-5">
        <Timer eDate={event.event_date}/>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-5 md:justify-between ">
                <div className="banner relative w-full md:w-3xl h-150 overflow-hidden md:rounded-3xl">
                    <Image src={event.image_url} fill  alt="Event banner" className="object-cover"/>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 md:left-0 p-6 text-white flex flex-col gap-1">
                        <h2 className="font-black text-2xl md:text-3xl leading-tight ">{event.title}</h2>
                        <p className="text-white/60 font-mono">{new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
        }).format(new Date(event.event_date))}</p>
                    </div>
                </div>
                    <div className="info bg-white/10 backdrop-blur-md border  duration-300 border-white p-5 rounded-2xl shadow-xl flex flex-col gap-5 overflow-y-auto max-h-160">
                        <div className="headinggg flex md:flex-row flex-col gap-3 md:justify-between md:items-center">
                            <h1 className="font-black text-2xl">{event.title}</h1>
                            <div className="border border-white rounded-3xl p-2">
                                <p className="text-white/50 text-xs font-mono">{new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
        }).format(new Date(event.event_date))}</p>
                            </div>
                        </div>
                        <div className="description    max-w-xl  whitespace-pre-line">
                            <p className="font-sans text-white/70">{event.description}</p>
                        </div>
                        <Link href={event.location_link} className="flex  rounded-2xl items-center border w-fit p-2 border-white/40 gap-3 hover:border-white transition-all duration-300 hover:scale-105 ease-in-out">
                            <MapPin size={25} className="text-white/40"/>
                            <p className="text-white font-sans font-black text-center mr-2 text-sm ">{event.location}</p>
                        </Link>
                        <div className="tickett flex gap-10 items-center bg-white/5 backdrop-blur-md rounded-2xl p-3">
                            <div className="ticket-icon">
                                <Ticket size={60}/>
                            </div>                            
                            <div className="info flex flex-col gap-3">
                            <div className="pricee">
                                <h2 className="font-light font-mono text-lg md:text-xl whitespace-nowrap">Price: <span className=" font-black">{event.price}</span> <span className=" font-black"> EGP</span></h2>
                            </div>
                            <div className="checklist flex gap-5">
                                    <div className="column flex flex-col gap-4">
                                            <div className="flex gap-2 items-center">
                                                <Stars size={25}/>
                                                <p className="text-xs font-mono text-center font-black">Talks</p>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <Stars size={25}/>
                                                <p className="text-xs font-mono text-center font-black">Internships</p>
                                            </div>
                                    </div> 
                                    <div className="column flex flex-col gap-4">
                                        <div className="flex gap-2 items-center">
                                                    <Stars size={25}/>
                                                    <p className="text-xs font-mono text-center font-black">Connections</p>
                                                </div>
                                        <div className="flex gap-2 items-center">
                                            <Stars size={25}/>
                                            <p className="text-xs font-mono text-center font-black">CV reviews</p>
                                        </div>
                                    </div>
                                    
                                    <div className="column flex flex-col gap-4">
                                    
                                     <div className="flex gap-2 items-center">
                                        <Stars size={25}/>
                                        <p className="text-xs font-mono text-center font-black">Vouchers</p>
                                    </div>
                                     <div className="flex gap-2 items-center">
                                        <Stars size={25}/>
                                        <p className="text-xs font-mono text-center font-black">Activities</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <Book eventId={event.id} eventTitle={event.title}/>
                    </div>
                
        </div></div>
    )
}