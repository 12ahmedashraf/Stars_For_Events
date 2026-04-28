import { LogoStar } from "@/components/icons";
import { supabase } from "@/lib/supabase";
import UserPage from "@/components/ProfilePage";
export  default async function UserProfile(){
  const { userId } = await auth();
    if (!userId) return null;
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const { data: tickets } = await supabase
        .from('bookings')
        .select(`
            status,
            events (
                title,
                price
            ),
            created_at
        `)
        .eq('profile_id', userId);
        const { data: profile } = await supabase
        .from('profiles')
        .select("full_name, whatsapp_number, address")
        .eq('id', userId)
        .maybeSingle();
        const initialProfile = {
        full_name: profile?.full_name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        whatsapp_number: profile?.whatsapp_number || '',
        address: profile?.address || ''
    };
       return (
        <UserPage user={JSON.parse(JSON.stringify(user))} profile={initialProfile} tickets={tickets}/>
       )
}