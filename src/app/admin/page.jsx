"use client";
import { LogoStar } from "@/components/icons";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import { Save, Edit2, XCircle, Trash2, Users, Calendar, Clock, CheckCircle ,Check,RotateCcw} from "lucide-react";
import { useEffect, useState } from "react";

export default function Admin() {
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState("users");
    const [data, setData] = useState({ users: [], events: [], bookings: [] });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const totalUsers = data.users.length;
    const totalEvents = data.events.length;
    const confirmedBookings = data.bookings.filter(b => b.status === "confirmed").length;
    const pendingBookings = data.bookings.filter(b => b.status === "pending").length;

    const stats = [
        { id: "users", title: "Total Users", value: totalUsers, icon: Users, color: "border-blue-500" },
        { id: "events", title: "Total Events", value: totalEvents, icon: Calendar, color: "border-purple-500" },
        { id: "confirmed", title: "Confirmed Tickets", value: confirmedBookings, icon: CheckCircle, color: "border-green-500" },
        { id: "pending", title: "Pending Tickets", value: pendingBookings, icon: Clock, color: "border-amber-500" },
    ];

    useEffect(() => {
        async function fetchAll() {
            const token = await getToken({ template: 'supabase' });
            const supabase = getSupabaseAuthClient(token);
           const [uRes, eRes, bRes] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('events').select('*').order('event_date', { ascending: false }),
                supabase.from('bookings').select('*, events(title)').order('booked_at', { ascending: false })
            ]);
            const users = uRes.data || [];
            const rawBookings = bRes.data || [];
            const mergedBookings = rawBookings.map(booking => ({
                ...booking,
                profiles: users.find(u => u.id === booking.profile_id) || null
            }));

            setData({ 
                users, 
                events: eRes.data || [], 
                bookings: mergedBookings 
            });
            setLoading(false);
    } fetchAll()}, [getToken]);

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm(item);
    };

    const handleQuickStatusUpdate = async (bookingId, newStatus) => {
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId);

        if (!error) {
            setData(prev => ({
                ...prev,
                bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
            }));
        }
    };

    const handleSave = async (table) => {
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        const { profiles, events, ...updateData } = editForm;
        
        const { error } = await supabase
            .from(table) 
            .update(updateData)
            .eq('id', editingId);

        if (!error) {
            const stateKey = activeTab === 'users' ? 'users' : activeTab === 'events' ? 'events' : 'bookings';
            setData(prev => ({
                ...prev,
                [stateKey]: prev[stateKey].map(item => item.id === editingId ? { ...item, ...editForm } : item)
            }));
            setEditingId(null);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        const { error } = await supabase.from('bookings').delete().eq('id', id);

        if (!error) {
            setData(prev => ({
                ...prev,
                bookings: prev.bookings.filter(b => b.id !== id)
            }));
        }
    };
    const renderUsersTable = () => (
        <table className="w-full text-left">
            <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                <tr>
                    <th className="p-5">Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Phone</th>
                    <th className="p-5">Role</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 group transition-colors">
                        <td className="p-5 font-bold text-white">{user.full_name}</td>
                        <td className="p-5 text-sm text-white/40">{user.email}</td>
                        <td className="p-5 text-sm text-white/40">{user.whatsapp_number}</td>
                        <td className="p-5">
                            <span className="text-[10px] font-black border border-white/20 px-2 py-1 rounded uppercase">{user.role}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderEventsTable = () => (
        <table className="w-full text-left">
            <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                <tr>
                    <th className="p-5">Event Title</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Price</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Location Link</th>
                    <th className="p-5">Image URL</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.events.map((event) => (
                    <tr key={event.id} className="hover:bg-white/5 group">
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.title || ""} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                            ) : <span className="font-bold text-white text-sm">{event.title}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input type="datetime-local" className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.event_date?.slice(0, 16) || ""} onChange={(e) => setEditForm({...editForm, event_date: e.target.value})} />
                            ) : <span className="text-sm text-white/40">{new Date(event.event_date).toLocaleDateString()}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input type="number" className="bg-white/10 border border-white/20 rounded px-2 py-1 w-20 text-xs" value={editForm.price || ""} onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
                            ) : <span className="text-sm font-mono text-green-400">EGP {event.price}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.location || ""} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                            ) : <span className="text-xs text-white/40">{event.location}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.location_link || ""} onChange={(e) => setEditForm({...editForm, location_link: e.target.value})} />
                            ) : <span className="text-xs text-white/40 max-w-25 truncate block">{event.location_link}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.image_url || ""} onChange={(e) => setEditForm({...editForm, image_url: e.target.value})} />
                            ) : <span className="text-xs text-white/40 max-w-25 truncate block">{event.image_url}</span>}
                        </td>
                        <td className="p-5">
                            {editingId === event.id ? (
                                <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.status || ""} onChange={(e) => setEditForm({...editForm, status: e.target.value})} />
                            ) : <span className="text-[10px] uppercase border border-white/20 px-2 py-1 rounded font-black">{event.status}</span>}
                        </td>
                        <td className="p-5 text-right">
                            {editingId === event.id ? (
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleSave('events')} className="p-2 bg-white text-black rounded-lg"><Save size={21}/></button>
                                    <button onClick={() => setEditingId(null)} className="p-2 border border-white/20 rounded-lg"><XCircle size={21}/></button>
                                </div>
                            ) : (
                                <button onClick={() => startEdit(event)} className="p-2  transition-all hover:bg-white/10 rounded-lg"><Edit2 size={21}/></button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderBookingsTable = (statusFilter) => (
        <table className="w-full text-left">
            <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                <tr>
                    <th className="p-5">Transaction #</th>
                    <th className="p-5">Details</th>
                    <th className="p-5">User</th>
                    <th className="p-5">Event</th>
                    <th className="p-5 text-right">Approval Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.bookings.filter(b => b.status === statusFilter).map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 group">
                        <td className="p-5">
                            <p className="font-mono text-white text-sm">{booking.transaction_number}</p>
                            <p className="text-[12px] text-white mt-1 uppercase font-mono ">{new Date(booking.booked_at).toLocaleString()}</p>
                        </td>
                        <td className="p-5">
                            <p className="text-[10px] text-white/60 uppercase tracking-tighter">{booking.transaction_type}</p>
                            <p className="text-xs text-white">{booking.transfer_from}</p>
                        </td>
                        <td className="p-5">
                            <p className="text-sm font-bold text-white">{booking.profiles?.full_name || "N/A"}</p>
                            <p className="text-xs text-white/40">{booking.profiles?.whatsapp_number}</p>
                        </td>
                        <td className="p-5 text-sm text-white font-mono">{booking.events?.title || "N/A"}</td>
                        <td className="p-5 text-right">
                            <div className="flex justify-end gap-2">
                                {booking.status === 'pending' ? (
                                    <button 
                                        onClick={() => handleQuickStatusUpdate(booking.id, 'confirmed')}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-full border border-green-500/20 transition-all text-[10px] font-black uppercase"
                                    >
                                        <Check size={21} /> Approve
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleQuickStatusUpdate(booking.id, 'pending')}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/20 text-white/40 hover:text-white rounded-full border border-white/10 transition-all text-[10px] font-black uppercase"
                                    >
                                        <RotateCcw size={21} /> Reset to Pending
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={21} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const stars = Array.from({ length: 50 });

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING STARS_SYSTEM...</div>;

    return (
        <div className="min-h-screen flex flex-col gap-2 font-sans mt-10">
            <div className="heroSection relative w-full z-0 flex items-center justify-center overflow-hidden bg-black border-b border-b-white/40 mb-15">
                <div className="Stars absolute inset-0 z-0 pointer-events-none">
                    {stars.map((_, i) => {
                        const row = Math.floor(i / 10);
                        const col = i % 10;
                        const topp = (row * 20) + ((i * 13) % 15);
                        const leftt = (col * 20) + ((i * 17) % 15);
                        const duration = 3 + (i % 4);
                        const delay = i % 5;
    
                        return (
                            <div 
                                key={`admin-star-grid-${i}`}
                                className="absolute animate-star"
                                style={{
                                    top: `${topp}%`,
                                    left: `${leftt}%`,
                                    "--duration": `${duration}s`,
                                    "--drift-duration": `${8 + (i % 3)}s`,
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                <div className="transition-all duration-300 ease-out ">
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
                <div className="Logo_and_text z-40 mb-10 flex flex-col items-center justify-center gap-20 mt-35">
                    <div className="heading flex flex-col items-center">
                        <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Admin Dashboard</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center md:items-start px-10">
                {stats.map((btn) => {
                    const { icon: IconC } = btn;
                    return (
                        <button 
                            key={btn.id}
                            onClick={() => setActiveTab(btn.id)}
                            className={`p-6 w-full rounded-2xl border-2 transition-all flex flex-col gap-2 items-start text-left bg-white/5 hover:bg-white/10 ${activeTab === btn.id ? btn.color : 'border-white/10'}`}
                        >
                            <IconC size={25} className={activeTab === btn.id ? 'text-white' : 'text-white/40'} />
                            <span className="text-xs uppercase font-bold tracking-widest text-white/40">{btn.title}</span>
                            <span className="text-3xl font-black">{btn.value}</span>
                        </button>
                    )
                })}
            </div>

            <div className="px-10 mt-10 mb-20">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold uppercase tracking-widest italic">{activeTab}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        {activeTab === 'users' && renderUsersTable()}
                        {activeTab === 'events' && renderEventsTable()}
                        {activeTab === 'confirmed' && renderBookingsTable('confirmed')}
                        {activeTab === 'pending' && renderBookingsTable('pending')}
                    </div>
                </div>
            </div>
        </div>
    )
}