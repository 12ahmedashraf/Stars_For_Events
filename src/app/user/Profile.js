"use server";
import { supabase } from "@/lib/supabase";
import { clerkClient,auth } from "@clerk/nextjs/server";
export default async function ProfileUpdates(ps,formm)
{
    const {userId} =  await auth();
    if(!userId) return {success:false,error:"Unauthorized"};
    const fullname = formm.get("full_name");
    const whatsapp = formm.get("whatsapp_number");
    const address = formm.get("address");

    const {error:supabaseError} = await supabase.from('profiles')
    .upsert({
        onboarding_complete:true,
        full_name:fullname,
        whatsapp_number:whatsapp,
        address:address
    }).eq('id',userId);
    if(supabaseError) return {success:false,error:supabaseError.message};
    const client = await clerkClient();
    await client.users.updateUser(userId,{
        publicMetadata:{
            Onboarded:true
        },
    });
    return {success: true,error:null};
}