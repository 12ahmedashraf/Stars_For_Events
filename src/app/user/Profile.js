"use server";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export default async function ProfileUpdates(ps, formm) {
    const { userId, getToken } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };
    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseAuthClient(token);
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    const fullname = formm.get("full_name");
    const whatsapp = formm.get("whatsapp_number");
    const address = formm.get("address");

    const { error: supabaseError } = await supabase
        .from('profiles')
        .update({
            id: userId,
            email: email,
            onboarding_complete: true,
            full_name: fullname,
            whatsapp_number: whatsapp,
            address: address
        }).eq('id', userId);
        const { data,error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    if (supabaseError) return { success: false, error: supabaseError.message };

    await client.users.updateUser(userId, {
        publicMetadata: {
            Onboarded: true,
            role: data?.role
        },
    });
    revalidatePath('/user','layout');
    return { success: true, error: null };
}