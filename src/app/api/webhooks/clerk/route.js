// src/app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import {  supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClerkClient } from '@clerk/nextjs/server'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    const { error:dberr } = await supabaseAdmin.from('profiles').insert([
      { 
        id: id, 
        email: email, 
        full_name: fullName,
        onboarding_complete: false,
        role: 'user'
      }
    ]);

    if (dberr) {
      console.error('Supabase Insertion Error:', dberr);
      return new Response('Error saving user to database', { status: 500 })
    }
    try {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          Onboarded: false,
          role: 'user'
        }
      });
    } catch (metadataError) {
      console.error('Clerk Metadata Error:', metadataError);
    }
  }

  return new Response('', { status: 200 })
}