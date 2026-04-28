"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { useAuth, useUser ,useSession} from "@clerk/nextjs";
export default function Book({eventId,eventTitle})
{
    const { getToken, isSignedIn } = useAuth();
    const session = useSession();
    const {user} = useUser();
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const bookAction = async () => {
        if(!session || !user){
            alert("please sign in to book the event!");
            return;
        }
        setLoading(true);
        try{
            const token = await getToken({ template: 'supabase' });
            if(!token)
            {
                throw new Error("Failed to retrieve authentication token!");
            }
            const supabase = getSupabaseAuthClient(token);
            const {error} = await supabase.from('bookings').upsert([
                {
                    event_id:eventId,
                    profile_id:user.id
                }
            ]);
            if(error)
                throw error;
            alert(`Success! You are booked for ${eventTitle}`);
            router.push('/');
        }catch(e)
        {
           if (e.message?.includes("unique constraint")) {
    alert("You've already booked a spot for this event! Check your dashboard.");
} else {
    alert(e.message || "Something went wrong.");
}

        }finally{
            setLoading(false);
        }
    };
    return(
        <button 
        onClick={bookAction}
        disabled={loading}
        className={`border border-white rounded-3xl hover:scale-105 cursor-pointer transition-all duration-300 p-2 font-black text-lg md:text-xl ${loading  ? 'cursor-not-allowed text-white/30' : 'cursor-pointer'}`}>
                            Book
                        </button>
    )
}