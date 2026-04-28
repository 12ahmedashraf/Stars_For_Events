"use server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { clerkClient, auth } from "@clerk/nextjs/server";

export default async function ProfileUpdates(ps, formm) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    const fullname = formm.get("full_name");
    const whatsapp = formm.get("whatsapp_number");
    const address = formm.get("address");

    const { error: supabaseError } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            onboarding_complete: true,
            full_name: fullname,
            whatsapp_number: whatsapp,
            address: address
        });

    if (supabaseError) return { success: false, error: supabaseError.message };

    await client.users.updateUser(userId, {
        publicMetadata: {
            Onboarded: true
        },
    });

    return { success: true, error: null };
}