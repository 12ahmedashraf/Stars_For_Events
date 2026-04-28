"use client";
import { useActionState, useEffect, useId, useState } from "react";
import { LogoStar } from "@/components/icons";
import { useUser, UserAvatar } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ProfileUpdates from "@/app/user/Profile";
import { User, MapPin, Phone, Ticket } from "lucide-react";
import Link from "next/link";

export default function UserPage({ user, profile, tickets }) {
    const baseId = useId();
    const stars = Array.from({ length: 25 });
    const router = useRouter();
    const [result, formAction, Pending] = useActionState(ProfileUpdates, { success: false, error: null });

    useEffect(() => {
        if (result.success) {
            router.refresh();
            router.push('/events');
        }
    }, [result.success, router]);

    const isOnboarded = user?.publicMetadata?.Onboarded === true;

    return (
        <div className="flex flex-col items-center">
            <div className="heroSection border-b-2 border-b-white/20 relative w-full z-0 flex items-center justify-center overflow-hidden bg-black">
                <div className="Stars absolute inset-0 z-0 pointer-events-none">
                    {stars.map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        const topp = (row * 20) + ((i * 13) % 15);
                        const leftt = (col * 20) + ((i * 17) % 15);
                        const duration = 3 + (i % 4);
                        const delay = i % 5;

                        return (
                            <div
                                key={`${baseId}-${i}`}
                                className="absolute animate-star"
                                style={{
                                    top: `${topp}%`,
                                    left: `${leftt}%`,
                                    "--duration": `${duration}s`,
                                    "--drift-duration": `${8 + (i % 3)}s`,
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                <div className="transition-all duration-300 ease-out">
                                    <LogoStar
                                        className="text-white/60"
                                        style={{
                                            width: `${10 + (i % 15)}px`,
                                            height: `${10 + (i % 15)}px`,
                                            filter: i % 3 === 0 ? "blur(1px)" : "none"
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="Logo_and_text z-40 mb-8 flex flex-col items-center justify-center gap-20 mt-25">
                    <div className="heading flex flex-col items-center">
                        {isOnboarded
                            ? <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Your Profile</h1>
                            : <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Create Your Profile</h1>
                        }
                        <h2 className="font-mono text-lg md:text-xl text-white/40 text-center mt-5">Manage your profile & tickets here {user?.username}</h2>
                    </div>
                </div>
            </div>

            <div className="profile-form mb-5 mt-10 w-sm md:w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="header flex gap-5 p-5 w-full items-center border-b-2 border-b-white/10">
                    <UserAvatar
                        appearance={{
                            elements: {
                                avatarBox: "!w-16 !h-16 border border-white/20",
                                avatarImage: "!w-16 !h-16"
                            }
                        }}
                    />
                    <div className="flex flex-col gap-1">
                        <h1 className="font-sans text-lg md:text-xl">{user?.username}</h1>
                        <p className="font-mono text-sm text-white/40">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </div>
                <div className="formm p-5 w-full">
                    <form key={profile.full_name} action={formAction} className="flex flex-col gap-10 items-center">
                        <div className="content flex flex-col w-full gap-5">
                            <div className="fullName flex flex-col gap-3">
                                <label htmlFor="FullName" className="font-mono text-white/40 text-sm">Full Name</label>
                                <div className="input-border focus-within:border-white flex items-center border border-white/20 rounded-2xl w-full">
                                    <User size={23} className="ml-3 my-1 text-white/20" />
                                    <input
                                        id="FullName"
                                        name="full_name"
                                        required
                                        defaultValue={profile.full_name}
                                        type="text"
                                        placeholder="Write your Full Name here"
                                        className="hover:border-0 w-full mr-5 py-1 px-4 focus:ring-0 outline-none rounded-2xl placeholder:font-sans font-sans"
                                    />
                                </div>
                            </div>
                            <div className="Address flex flex-col gap-3">
                                <label htmlFor="address" className="font-mono text-white/40 text-sm">Address</label>
                                <div className="input-border focus-within:border-white flex items-center border border-white/20 rounded-2xl w-full">
                                    <MapPin size={23} className="ml-3 my-1 text-white/20" />
                                    <input
                                        id="address"
                                        name="address"
                                        required
                                        defaultValue={profile.address}
                                        type="text"
                                        placeholder="Street, city, governerate"
                                        className="hover:border-0 w-full mr-5 py-1 px-4 focus:ring-0 outline-none rounded-2xl placeholder:font-sans font-sans"
                                    />
                                </div>
                            </div>
                            <div className="WhatsappNumber flex flex-col gap-3">
                                <label htmlFor="WhatsappNumber" className="font-mono text-white/40 text-sm">Phone (Whatsapp)</label>
                                <div className="input-border focus-within:border-white flex items-center border border-white/20 rounded-2xl w-full">
                                    <Phone size={23} className="ml-3 my-1 text-white/20" />
                                    <input
                                        id="WhatsappNumber"
                                        name="whatsapp_number"
                                        required
                                        defaultValue={profile.whatsapp_number}
                                        type="text"
                                        placeholder="e.g 01XXXXXXXXX"
                                        className="hover:border-0 w-full mr-5 py-1 px-4 focus:ring-0 outline-none rounded-2xl placeholder:font-sans font-sans"
                                    />
                                </div>
                            </div>
                        </div>
                        {result.error && <p className="font-sans text-xs text-red-500">{result.error}</p>}
                        <button
                            type="submit"
                            disabled={Pending}
                            className="disabled:opacity-50 font-mono border w-fit border-white/20 text-white p-3 hover:scale-105 transition-all duration-300 cursor-pointer rounded-2xl"
                        >
                            {Pending ? "Loading..." : isOnboarded ? "Update Your Profile" : "Create your Profile"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="tickets-section mb-5 mt-10">
                <div className="header flex justify-center items-center md:justify-start gap-5 mb-5">
                    <Ticket size={30} />
                    <h1 className="text-lg md:text-xl font-sans font-black">Your Tickets</h1>
                </div>
                <div className="tickets w-sm md:w-3xl bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl flex flex-col items-center">
                    {tickets && tickets.length > 0
                        ? <div className="tickets-available flex flex-col gap-2 p-2">
                            {tickets.map((item, index) => (
                                <div className="ticket flex gap-5 md:gap-10" key={item.id}>
                                    <Ticket size={15} />
                                    <p className="text-white/20 font-mono">{item.events?.title}</p>
                                    <p className="text-white/20 font-mono">{item.events?.price === 0 ? 'FREE' : item.events?.price}</p>
                                    <p className="text-white/20 font-mono">{new Date(item.booked_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                        : <div className="no-tickets flex flex-col gap-8 items-center">
                            <div className="info flex flex-col items-center gap-2">
                                <Ticket size={120} />
                                <p className="text-white/40">You haven&apos;t booked any tickets yet</p>
                            </div>
                            <Link className="p-3 border border-white font-sans font-black rounded-2xl text-sm" href="/events">Check Our events now!</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}