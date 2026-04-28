import EventsPage from "@/components/EventsPage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function Events()
{
        const {data:events,error} = await supabaseAdmin.from('events').select('*').order('created_at', { ascending: false });
        return(
           <EventsPage events={events}/>
        );
    }