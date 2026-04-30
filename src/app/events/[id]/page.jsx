import BookingFlow from "@/components/BookingFlow";
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

    return (
        <BookingFlow event={event} />
    )
}