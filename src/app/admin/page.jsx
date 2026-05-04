"use client";
import { LogoStar } from "@/components/icons";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import {
    Save, Edit2, XCircle, Trash2, Users, Calendar, Clock,
    CheckCircle, Check, RotateCcw, Search, Download, X,
    ChevronLeft, TrendingUp, FileSpreadsheet, Eye
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function Admin() {
    const { getToken } = useAuth();
    const [activeTab, setActiveTab] = useState("users");
    const [data, setData] = useState({ users: [], events: [], bookings: [] });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [search, setSearch] = useState("");
    const [userLookup, setUserLookup] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const totalUsers = data.users.length;
    const totalEvents = data.events.length;
    const confirmedBookings = data.bookings.filter(b => b.status === "confirmed").length;
    const pendingBookings = data.bookings.filter(b => b.status === "pending").length;
    const totalRevenue = data.bookings
        .filter(b => b.status === "confirmed")
        .reduce((sum, b) => sum + (b.events?.price || 0), 0);

    const stats = [
        { id: "users", title: "Total Users", value: totalUsers, icon: Users, color: "border-blue-500", accent: "text-blue-400" },
        { id: "events", title: "Total Events", value: totalEvents, icon: Calendar, color: "border-purple-500", accent: "text-purple-400" },
        { id: "confirmed", title: "Confirmed", value: confirmedBookings, icon: CheckCircle, color: "border-green-500", accent: "text-green-400" },
        { id: "pending", title: "Pending", value: pendingBookings, icon: Clock, color: "border-amber-500", accent: "text-amber-400" },
        { id: "revenue", title: "Revenue (EGP)", value: totalRevenue.toLocaleString(), icon: TrendingUp, color: "border-pink-500", accent: "text-pink-400" },
    ];

    useEffect(() => {
        async function fetchAll() {
            const token = await getToken({ template: 'supabase' });
            const supabase = getSupabaseAuthClient(token);
            const [uRes, eRes, bRes] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('events').select('*').order('event_date', { ascending: false }),
                supabase.from('bookings').select('*, events(title, price)').order('booked_at', { ascending: false })
            ]);
            const users = uRes.data || [];
            const rawBookings = bRes.data || [];
            const mergedBookings = rawBookings.map(booking => ({
                ...booking,
                profiles: users.find(u => u.id === booking.profile_id) || null
            }));
            setData({ users, events: eRes.data || [], bookings: mergedBookings });
            setLoading(false);
        }
        fetchAll();
    }, [getToken]);

    const startEdit = (item) => { setEditingId(item.id); setEditForm(item); };

    const handleQuickStatusUpdate = async (bookingId, newStatus) => {
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
        if (!error) {
            setData(prev => ({
                ...prev,
                bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
            }));
            showNotification(`Booking ${newStatus === 'confirmed' ? 'approved' : 'reset to pending'}`);
        }
    };

    const handleSave = async (table) => {
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        const { profiles, events, ...updateData } = editForm;
        const { error } = await supabase.from(table).update(updateData).eq('id', editingId);
        if (!error) {
            const stateKey = activeTab === 'users' ? 'users' : activeTab === 'events' ? 'events' : 'bookings';
            setData(prev => ({
                ...prev,
                [stateKey]: prev[stateKey].map(item => item.id === editingId ? { ...item, ...editForm } : item)
            }));
            setEditingId(null);
            showNotification("Saved successfully");
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseAuthClient(token);
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (!error) {
            setData(prev => ({ ...prev, bookings: prev.bookings.filter(b => b.id !== id) }));
            showNotification("Booking deleted", "error");
        }
    };

    const exportToExcel = (tabKey) => {
        let rows = [];
        let sheetName = tabKey;

        if (tabKey === "users") {
            rows = data.users.map(u => ({
                "Full Name": u.full_name,
                "Email": u.email,
                "Phone (WhatsApp)": u.whatsapp_number,
                "Address": u.address,
                "Role": u.role,
                "Onboarded": u.onboarding_complete ? "Yes" : "No",
                "Created At": new Date(u.created_at).toLocaleString(),
            }));
        } else if (tabKey === "events") {
            rows = data.events.map(e => ({
                "Title": e.title,
                "Date": new Date(e.event_date).toLocaleString(),
                "Price (EGP)": e.price,
                "Location": e.location,
                "Location Link": e.location_link,
                "Status": e.status,
            }));
        } else if (tabKey === "confirmed" || tabKey === "pending") {
            rows = data.bookings.filter(b => b.status === tabKey).map(b => ({
                "Transaction #": b.transaction_number,
                "Date": new Date(b.booked_at).toLocaleString(),
                "Transaction Type": b.transaction_type,
                "Transfer From": b.transfer_from,
                "User Name": b.profiles?.full_name || "N/A",
                "User Phone": b.profiles?.whatsapp_number || "N/A",
                "Event": b.events?.title || "N/A",
                "Price (EGP)": b.events?.price || 0,
                "Status": b.status,
            }));
        } else if (tabKey === "revenue") {
            rows = data.bookings.filter(b => b.status === "confirmed").map(b => ({
                "Transaction #": b.transaction_number,
                "Date": new Date(b.booked_at).toLocaleString(),
                "User Name": b.profiles?.full_name || "N/A",
                "Event": b.events?.title || "N/A",
                "Amount (EGP)": b.events?.price || 0,
            }));
        }

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${sheetName}_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
        showNotification(`Exported ${rows.length} rows to Excel`);
    };

    const exportAllToExcel = () => {
        const wb = XLSX.utils.book_new();

        const usersRows = data.users.map(u => ({
            "Full Name": u.full_name, "Email": u.email,
            "Phone": u.whatsapp_number, "Address": u.address,
            "Role": u.role, "Created At": new Date(u.created_at).toLocaleString(),
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersRows), "Users");

        const eventsRows = data.events.map(e => ({
            "Title": e.title, "Date": new Date(e.event_date).toLocaleString(),
            "Price (EGP)": e.price, "Location": e.location, "Status": e.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eventsRows), "Events");

        const bookingsRows = data.bookings.map(b => ({
            "Transaction #": b.transaction_number, "Date": new Date(b.booked_at).toLocaleString(),
            "User": b.profiles?.full_name || "N/A", "Event": b.events?.title || "N/A",
            "Price (EGP)": b.events?.price || 0, "Status": b.status,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bookingsRows), "Bookings");

        XLSX.writeFile(wb, `admin_full_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
        showNotification("Full export downloaded");
    };

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return data.users;
        const q = search.toLowerCase();
        return data.users.filter(u =>
            u.full_name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.whatsapp_number?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
        );
    }, [search, data.users]);

    const filteredEvents = useMemo(() => {
        if (!search.trim()) return data.events;
        const q = search.toLowerCase();
        return data.events.filter(e =>
            e.title?.toLowerCase().includes(q) ||
            e.location?.toLowerCase().includes(q) ||
            e.status?.toLowerCase().includes(q)
        );
    }, [search, data.events]);

    const filteredBookings = useMemo(() => {
        if (!search.trim()) return data.bookings;
        const q = search.toLowerCase();
        return data.bookings.filter(b =>
            b.transaction_number?.toLowerCase().includes(q) ||
            b.profiles?.full_name?.toLowerCase().includes(q) ||
            b.profiles?.whatsapp_number?.toLowerCase().includes(q) ||
            b.events?.title?.toLowerCase().includes(q) ||
            b.transfer_from?.toLowerCase().includes(q)
        );
    }, [search, data.bookings]);

    const userLookupTickets = useMemo(() => {
        if (!userLookup) return [];
        return data.bookings.filter(b => b.profile_id === userLookup.id);
    }, [userLookup, data.bookings]);

    const renderSearchBar = (placeholder) => (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/3">
            <Search size={21} className="text-white/30 shrink-0" />
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent w-full text-sm font-mono outline-none placeholder:text-white/20 text-white"
            />
            {search && (
                <button onClick={() => setSearch("")} className="text-white/30 hover:text-white transition-colors">
                    <X size={21} />
                </button>
            )}
        </div>
    );

    const renderUsersTable = () => (
        <>
            {renderSearchBar("Search by name, email, phone, role...")}
            <table className="w-full text-left">
                <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                    <tr>
                        <th className="p-5">Name</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Phone</th>
                        <th className="p-5">Role</th>
                        <th className="p-5 text-right">Lookup</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 group transition-colors">
                            <td className="p-5 font-bold text-white">{user.full_name}</td>
                            <td className="p-5 text-sm text-white/40">{user.email}</td>
                            <td className="p-5 text-sm text-white/40">{user.whatsapp_number}</td>
                            <td className="p-5">
                                <span className="text-[10px] font-black border border-white/20 px-2 py-1 rounded uppercase">{user.role}</span>
                            </td>
                            <td className="p-5 text-right">
                                <button
                                    onClick={() => setUserLookup(user)}
                                    className="flex items-center gap-2 ml-auto px-3 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-[10px] font-black uppercase text-white/50 hover:text-white transition-all"
                                >
                                    <Eye size={21} /> View Tickets
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr><td colSpan={5} className="p-10 text-center text-white/20 font-mono text-sm">No users found</td></tr>
                    )}
                </tbody>
            </table>
        </>
    );

    const renderEventsTable = () => (
        <>
            {renderSearchBar("Search by title, location, status...")}
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
                    {filteredEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-white/5 group">
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                                    : <span className="font-bold text-white text-sm">{event.title}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input type="datetime-local" className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.event_date?.slice(0, 16) || ""} onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })} />
                                    : <span className="text-sm text-white/40">{new Date(event.event_date).toLocaleDateString()}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input type="number" className="bg-white/10 border border-white/20 rounded px-2 py-1 w-20 text-xs" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                                    : <span className="text-sm font-mono text-green-400">EGP {event.price}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.location || ""} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                                    : <span className="text-xs text-white/40">{event.location}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.location_link || ""} onChange={(e) => setEditForm({ ...editForm, location_link: e.target.value })} />
                                    : <span className="text-xs text-white/40 max-w-25 truncate block">{event.location_link}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.image_url || ""} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} />
                                    : <span className="text-xs text-white/40 max-w-25 truncate block">{event.image_url}</span>}
                            </td>
                            <td className="p-5">
                                {editingId === event.id
                                    ? <input className="bg-white/10 border border-white/20 rounded px-2 py-1 w-full text-xs" value={editForm.status || ""} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} />
                                    : <span className="text-[10px] uppercase border border-white/20 px-2 py-1 rounded font-black">{event.status}</span>}
                            </td>
                            <td className="p-5 text-right">
                                {editingId === event.id ? (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleSave('events')} className="p-2 bg-white text-black rounded-lg"><Save size={21} /></button>
                                        <button onClick={() => setEditingId(null)} className="p-2 border border-white/20 rounded-lg"><XCircle size={21} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => startEdit(event)} className="p-2 transition-all hover:bg-white/10 rounded-lg"><Edit2 size={21} /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredEvents.length === 0 && (
                        <tr><td colSpan={8} className="p-10 text-center text-white/20 font-mono text-sm">No events found</td></tr>
                    )}
                </tbody>
            </table>
        </>
    );

    const renderBookingsTable = (statusFilter) => {
        const rows = filteredBookings.filter(b => b.status === statusFilter);
        return (
            <>
                {renderSearchBar("Search by transaction #, name, phone, event...")}
                <table className="w-full text-left">
                    <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="p-5">Transaction #</th>
                            <th className="p-5">Details</th>
                            <th className="p-5">User</th>
                            <th className="p-5">Event</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rows.map((booking) => (
                            <tr key={booking.id} className="hover:bg-white/5 group">
                                <td className="p-5">
                                    <p className="font-mono text-white text-sm">{booking.transaction_number}</p>
                                    <p className="text-[12px] text-white mt-1 uppercase font-mono">{new Date(booking.booked_at).toLocaleString()}</p>
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
                                                <RotateCcw size={21} /> Reset
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteBooking(booking.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                            <Trash2 size={21} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={5} className="p-10 text-center text-white/20 font-mono text-sm">No bookings found</td></tr>
                        )}
                    </tbody>
                </table>
            </>
        );
    };

    const renderRevenueTab = () => {
        const confirmed = filteredBookings.filter(b => b.status === "confirmed");
        const total = confirmed.reduce((sum, b) => sum + (b.events?.price || 0), 0);
        return (
            <>
                {renderSearchBar("Search confirmed bookings...")}
                <div className="p-5 border-b border-white/5 flex items-center gap-4">
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl px-5 py-3">
                        <p className="text-[10px] uppercase tracking-widest text-pink-400 font-black">Total Confirmed Revenue</p>
                        <p className="text-2xl font-black font-mono text-white mt-1">{total.toLocaleString()} EGP</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Transactions</p>
                        <p className="text-2xl font-black font-mono text-white mt-1">{confirmed.length}</p>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="p-5">Transaction #</th>
                            <th className="p-5">Date</th>
                            <th className="p-5">User</th>
                            <th className="p-5">Event</th>
                            <th className="p-5">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {confirmed.map((b) => (
                            <tr key={b.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-5 font-mono text-sm text-white">{b.transaction_number}</td>
                                <td className="p-5 text-xs text-white/40">{new Date(b.booked_at).toLocaleString()}</td>
                                <td className="p-5">
                                    <p className="text-sm font-bold text-white">{b.profiles?.full_name || "N/A"}</p>
                                    <p className="text-xs text-white/40">{b.profiles?.whatsapp_number}</p>
                                </td>
                                <td className="p-5 text-sm text-white font-mono">{b.events?.title || "N/A"}</td>
                                <td className="p-5 text-sm font-black text-green-400 font-mono">{(b.events?.price || 0).toLocaleString()} EGP</td>
                            </tr>
                        ))}
                        {confirmed.length === 0 && (
                            <tr><td colSpan={5} className="p-10 text-center text-white/20 font-mono text-sm">No revenue data</td></tr>
                        )}
                    </tbody>
                </table>
            </>
        );
    };

    const renderUserLookup = () => (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d0d0d] border border-white/15 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setUserLookup(null)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                        >
                            <ChevronLeft size={21} />
                        </button>
                        <div>
                            <h2 className="font-black text-lg">{userLookup?.full_name}</h2>
                            <p className="text-xs text-white/40 font-mono">{userLookup?.email} · {userLookup?.whatsapp_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black border border-white/20 px-2 py-1 rounded uppercase">{userLookup?.role}</span>
                        <button
                            onClick={() => setUserLookup(null)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                        >
                            <X size={21} />
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-white/5 flex gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Total Tickets</p>
                        <p className="text-xl font-black">{userLookupTickets.length}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-green-400">Confirmed</p>
                        <p className="text-xl font-black">{userLookupTickets.filter(t => t.status === 'confirmed').length}</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-amber-400">Pending</p>
                        <p className="text-xl font-black">{userLookupTickets.filter(t => t.status === 'pending').length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Address</p>
                        <p className="text-xs font-mono text-white mt-1 max-w-40 truncate">{userLookup?.address || "N/A"}</p>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {userLookupTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-white/20">
                            <p className="font-mono text-sm">No tickets found for this user</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/5 sticky top-0 bg-[#0d0d0d]">
                                <tr>
                                    <th className="p-5">Transaction #</th>
                                    <th className="p-5">Event</th>
                                    <th className="p-5">Price</th>
                                    <th className="p-5">Date</th>
                                    <th className="p-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {userLookupTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-5 font-mono text-sm text-white">{ticket.transaction_number}</td>
                                        <td className="p-5 text-sm text-white">{ticket.events?.title || "N/A"}</td>
                                        <td className="p-5 text-sm font-mono text-green-400">{ticket.events?.price === 0 ? "FREE" : `${ticket.events?.price} EGP`}</td>
                                        <td className="p-5 text-xs text-white/40">{new Date(ticket.booked_at).toLocaleString()}</td>
                                        <td className="p-5">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase ${ticket.status === 'confirmed' ? 'border-green-500/30 text-green-400' : 'border-amber-500/30 text-amber-400'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );

    const stars = Array.from({ length: 50 });

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
            LOADING STARS_SYSTEM...
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col gap-2 font-sans mt-10">
            {notification && (
                <div className={`fixed top-6 right-6 z-100 px-5 py-3 rounded-2xl border font-mono text-sm transition-all shadow-xl ${notification.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
                    {notification.msg}
                </div>
            )}

            {userLookup && renderUserLookup()}

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
                <div className="Logo_and_text z-40 mb-10 flex flex-col items-center justify-center gap-20 mt-35">
                    <div className="heading flex flex-col items-center">
                        <h1 className="font-black font-sans md:text-6xl text-4xl hover:cursor-pointer hover:text-white/40 transition-all duration-300">Admin Dashboard</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-items-center md:items-start px-10">
                {stats.map((btn) => {
                    const { icon: IconC } = btn;
                    return (
                        <button
                            key={btn.id}
                            onClick={() => { setActiveTab(btn.id); setSearch(""); }}
                            className={`p-6 w-full rounded-2xl border-2 transition-all flex flex-col gap-2 items-start text-left bg-white/5 hover:bg-white/10 ${activeTab === btn.id ? btn.color : 'border-white/10'}`}
                        >
                            <IconC size={25} className={activeTab === btn.id ? btn.accent : 'text-white/40'} />
                            <span className="text-xs uppercase font-bold tracking-widest text-white/40">{btn.title}</span>
                            <span className="text-3xl font-black">{btn.value}</span>
                        </button>
                    );
                })}
            </div>

            <div className="px-10 mt-10 mb-20">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold uppercase tracking-widest italic">{activeTab}</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => exportToExcel(activeTab)}
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase transition-all text-white/60 hover:text-white"
                            >
                                <Download size={21} /> Export Tab
                            </button>
                            <button
                                onClick={exportAllToExcel}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-[10px] font-black uppercase transition-all"
                            >
                                <FileSpreadsheet size={21} /> Export All
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {activeTab === 'users' && renderUsersTable()}
                        {activeTab === 'events' && renderEventsTable()}
                        {activeTab === 'confirmed' && renderBookingsTable('confirmed')}
                        {activeTab === 'pending' && renderBookingsTable('pending')}
                        {activeTab === 'revenue' && renderRevenueTab()}
                    </div>
                </div>
            </div>
        </div>
    );
}