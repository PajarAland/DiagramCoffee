import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function Riwayat() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await API.get("/api/orders");
                setOrders(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchStatus =
                activeFilter === "all"
                || order.status === activeFilter;

            const matchSearch =
                order.order_number
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            return (
                matchStatus &&
                matchSearch
            );

        });

    }, [orders, activeFilter, search]);

    const getStatusConfig = (status) => {
        switch (status) {
            case "pending": return { label: "Pending", className: "bg-yellow-100 text-yellow-700" };
            case "confirmed": return { label: "Confirmed", className: "bg-blue-100 text-blue-700" };
            case "preparing": return { label: "Preparing", className: "bg-indigo-100 text-indigo-700" };
            case "ready": return { label: "Ready", className: "bg-green-100 text-green-700" };
            case "completed": return { label: "Completed", className: "bg-gray-200 text-gray-700" };
            case "cancelled": return { label: "Cancelled", className: "bg-red-100 text-red-700" };
            default: return { label: status, className: "bg-gray-100 text-gray-700" };
        }
    };

    const filters = [
        { label: "Semua", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Preparing", value: "preparing" },
        { label: "Ready", value: "ready" },
        { label: "Completed", value: "completed" },
    ];

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
            <section className="mb-6">
                <h1 className="text-3xl font-bold text-[#1E1E1E]">Riwayat Pesanan</h1>
                <p className="mt-2 text-sm text-gray-500">Lihat semua pesanan kamu</p>
                <section className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari pesanan..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-2xl
                            border
                            border-[#E5DED3]
                            text-sm
                            outline-none
                            focus:border-[#2F5231]
                        "
                    />
                </section>
            </section>

            <section className="flex gap-3 overflow-x-auto scrollbar-hide mb-6">
                {filters.map((filter) => {
                    const active = activeFilter === filter.value;
                    return (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-sm font-medium transition-all border ${active ? "bg-[#2F5231] text-white border-[#2F5231]" : "bg-white text-[#2F5231] border-[#E5DED3]"}`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </section>

            <section>
                {loading ? (
                    <div className="grid gap-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="h-40 bg-white rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#ECE6DC] p-10 text-center">
                        <h2 className="text-xl font-bold text-gray-800">Belum ada pesanan</h2>
                        <p className="text-sm text-gray-500 mt-2">Pesanan kamu akan muncul di sini</p>
                        <button onClick={() => navigate("/menu")} className="mt-6 px-6 py-3 rounded-2xl bg-[#2F5231] text-white text-sm font-semibold">Pesan Sekarang</button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredOrders.map((order) => {
                            const status = getStatusConfig(order.status);
                            return (
                                <div key={order.id} className="bg-white rounded-3xl border border-[#ECE6DC] overflow-hidden">
                                    <div className="p-5 border-b border-[#F1ECE5]">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400">Order Number</p>
                                                <h2 className="mt-1 text-lg font-bold text-gray-800">{order.order_number}</h2>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(order.created_at)
                                                        .toLocaleString("id-ID", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        .replace(" pukul", ", ")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.className}`}>{status.label}</span>
                                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 uppercase">{order.payment_method}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-4 space-y-4">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{item.menu_item_name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-sm font-bold text-[#2F5231]">Rp {Number(item.subtotal || 0).toLocaleString("id-ID")}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* FOOTER */}
                                    <div className="border-t border-[#F1ECE5] px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FCFBF9]">
                                        <div>
                                            <p className="text-xs text-gray-400">Total Pembayaran</p>
                                            <p className="mt-1 text-xl font-bold text-[#2F5231]">Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}</p>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            <button onClick={() => navigate(`/orders/${order.order_number}`)} className="px-5 py-2.5 rounded-2xl border border-[#2F5231] text-[#2F5231] text-sm font-semibold">Lihat Detail</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Riwayat;