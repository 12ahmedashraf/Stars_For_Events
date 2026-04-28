import Book from "@/components/BookingButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Image from "next/image";
export default async function EventRegistration({params})
{
    const {id} = await params;
    const {data:event,error} = await supabaseAdmin.from('events').select('*').eq('id',id).maybeSingle();
    if(error || ! event)
        return <h1 className="text-2xl">Event not found!</h1>

    return (
        <div className="flex flex-col items-center md:items-start md:flex-row gap-5 md:justify-between md:mr-15 md:mt-30 mt-20 mb-10 md:ml-10 ">
                <div className="banner relative w-full md:w-3xl h-100 overflow-hidden md:rounded-3xl">
                    <Image src={event.image_url} fill  alt="Event banner" className="object-cover"/>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 md:left-0 p-6 text-white flex flex-col gap-1">
                        <h2 className="font-black text-2xl md:text-3xl leading-tight ">{event.title}</h2>
                        <p className="text-white/60 font-mono">{new Date(event.event_date).toLocaleString()}</p>
                    </div>
                </div>
                { 
                    event.price === 0?(
                    <div className="info bg-white/10 backdrop-blur-md border  duration-300 border-white/20 p-5 rounded-2xl shadow-xl flex flex-col gap-7">
                        <div className="headinggg flex md:flex-row flex-col gap-3 md:justify-between md:items-center">
                            <h1 className="font-black text-2xl">{event.title}</h1>
                            <div className="border border-white rounded-3xl p-2">
                                <p className="text-white/50 text-xs font-mono">{new Date(event.event_date).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="description  border border-white/50 rounded-3xl p-2 overflow-y-auto max-w-xl max-h-90 whitespace-pre-line">
                            <p>{event.description}</p>
                        </div>
                        <div className="pricee">
                            <h2 className="font-light font-mono text-lg md:text-xl">Price: <span className=" font-black">For Free!</span></h2>
                        </div>
                        <Book eventId={event.id} eventTitle={event.title}/>
                    </div>):<></>
                }
        </div>
    )
}