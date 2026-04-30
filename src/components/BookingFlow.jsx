"use client";
import { LogoStar } from "@/components/icons";
import Timer from "@/components/Timer";
import { MapPin, Ticket, Stars, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { useAuth, useUser, useSession, useClerk } from "@clerk/nextjs";

export default function BookingFlow({ event }) {
    const { getToken } = useAuth();
    const session = useSession();
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { redirectToSignUp } = useClerk();
    const [checkout, setCheckout] = useState(false);
    const [method, setMethod] = useState("");
    const [txn, setTxn] = useState("");
    const [tfrom, setTfrom] = useState("");
    const checkoutAction = () => {
        if (!session.isSignedIn || !user) {
            return redirectToSignUp({ signUpFallbackRedirectUrl: window.location.href });
        }
        setCheckout(true);
    };

    const bookAction = async () => {
        if (!method || !txn.trim()||!tfrom.trim()) return;
        setLoading(true);
        try {
            const token = await getToken({ template: 'supabase' });
            if (!token) throw new Error("Failed to retrieve authentication token!");
            const supabase = getSupabaseAuthClient(token);
            const { error } = await supabase.from('bookings').upsert([{
                event_id: event.id,
                profile_id: user.id,
                transaction_type: method,
                transaction_number: txn.trim(),
                transfer_from: tfrom.trim()
            }]);
            if (error) throw error;
            alert(`Success! You are booked for ${event.title}, Wait for a confirmation from us!`);
            router.push('/');
        } catch (e) {
                alert(e.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const formatted = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(event.event_date));

    return (
        <div className="md:mr-15 mt-15 mb-10 md:ml-10 flex flex-col gap-5">
            <Timer eDate={event.event_date} />
            <div className="flex flex-col items-center md:items-start md:flex-row gap-5 md:justify-between">
                <div className="banner relative w-full md:w-3xl h-150 overflow-hidden md:rounded-3xl">
                    <Image src={event.image_url} fill alt="Event banner" className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-5 md:left-0 p-6 text-white flex flex-col gap-1">
                        <h2 className="font-black text-2xl md:text-3xl leading-tight">{event.title}</h2>
                        <p className="text-white/60 font-mono">{formatted}</p>
                    </div>
                </div>

                <div className="info bg-white/10 backdrop-blur-md border items-center duration-300 border-white p-5 rounded-2xl shadow-xl flex flex-col gap-5 overflow-y-auto max-h-160">
                    {!checkout ? (
                        <>
                            <div className="headinggg flex md:flex-row flex-col gap-3 w-full md:justify-between items-center md:items-center">
                                <h1 className="font-black text-2xl text-center md:text-left">{event.title}</h1>
                                <div className="border border-white rounded-3xl p-2 w-fit">
                                    <p className="text-white/50 text-xs font-mono">{formatted}</p>
                                </div>
                            </div>
                            <div className="description max-w-xl whitespace-pre-line">
                                <p className="font-sans text-white/70 text-center md:text-left">{event.description}</p>
                            </div>
                            <Link href={event.location_link} className="flex rounded-2xl items-center border w-fit p-2 border-white/40 gap-3 hover:border-white transition-all duration-300 hover:scale-105 ease-in-out">
                                <MapPin size={25} className="text-white/40" />
                                <p className="text-white font-sans font-black text-center mr-2 text-sm">{event.location}</p>
                            </Link>
                            <div className="tickett flex gap-10 items-center bg-white/5 backdrop-blur-md rounded-2xl p-3">
                                <div className="ticket-icon"><Ticket size={60} /></div>
                                <div className="info flex flex-col gap-3">
                                    <div className="pricee">
                                        <h2 className="font-light font-mono text-lg md:text-xl whitespace-nowrap">Price: <span className="font-black">{event.price}</span> <span className="font-black"> EGP</span></h2>
                                    </div>
                                    <div className="checklist grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                        {["Talks", "Internships", "Connections", "CV reviews", "Vouchers", "Activities"].map(item => (
                                            <div key={item} className="flex gap-2 items-center">
                                                <Stars size={21} className="shrink-0" />
                                                <p className="text-xs font-mono text-center font-black">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={checkoutAction}
                                className="border border-white rounded-3xl hover:scale-105 cursor-pointer transition-all duration-300 w-full p-2 font-black text-lg md:text-xl">
                                Checkout
                            </button>
                        </>
                    ) : (
                        <div className=" flex flex-col w-full md:w-xl gap-5">
                            <div className=" flex items-center ">
                                <button onClick={() => { setCheckout(false); setMethod(""); setTxn("");setTfrom(""); }} className="text-white cursor-pointer hover:text-white transition-colors">
                                    <ArrowLeft size={21} />
                                </button>
                                <h1 className="font-black text-2xl w-full text-center">Payment</h1>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-white/50 text-xs font-mono uppercase tracking-widest">Transfer to</p>
                                <div className="flex flex-col gap-2 bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <div className="flex justify-between items-center gap-5">
                                        <p className="text-white/50 font-mono text-sm">Instapay</p>
                                        <p className="font-black font-mono text-sm">01556812223</p>
                                    </div>
                                    <div className="flex justify-between items-center gap-5">
                                        <p className="text-white/50 font-mono text-sm">Wallet (VF Cash,Etisalat Cash, etc)</p>
                                        <p className="font-black font-mono text-sm">01556812223</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-white/50 text-xs font-mono uppercase tracking-widest">Payment method</p>
                                <select
                                    value={method}
                                    onChange={e => setMethod(e.target.value)}
                                    className="w-full bg-white/5 border border-white/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white transition-colors">
                                    <option value="" disabled className="bg-black">Select method</option>
                                    <option value="Instapay" className="bg-black">Instapay</option>
                                    <option value="Wallet" className="bg-black">Wallet</option>
                                </select>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-white/50 text-xs font-mono uppercase tracking-widest">Transaction ID</p>
                                <input
                                    type="text"
                                    value={txn}
                                    onChange={e => setTxn(e.target.value)}
                                    placeholder="The number of the successful transaction"
                                    className="w-full bg-white/5 border border-white/30 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-white transition-colors" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <p className="text-white/50 text-xs font-mono uppercase tracking-widest">The Account/number you paid with</p>
                                <input
                                    type="text"
                                    value={tfrom}
                                    onChange={e => setTfrom(e.target.value)}
                                    placeholder="The number/account you paid with"
                                    className="w-full bg-white/5 border border-white/30 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-white transition-colors" />
                            </div>
                            <div className="w-full flex justify-between items-center px-1">
                                <p className="text-white/50 font-mono text-sm">Amount due</p>
                                <p className="font-black font-mono text-lg">{event.price} EGP</p>
                            </div>
                            <button
                                onClick={bookAction}
                                disabled={loading || !method || !txn.trim() || !tfrom.trim()}
                                className={`border border-white rounded-3xl transition-all duration-300 w-full p-2 font-black text-lg md:text-xl ${loading || !method || !txn.trim() ||!tfrom.trim() ? 'cursor-not-allowed text-white/30 border-white/30' : 'hover:scale-105 cursor-pointer'}`}>
                                {loading ? "Booking..." : "Book"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}