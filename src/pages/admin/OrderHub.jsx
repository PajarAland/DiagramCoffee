// truth
import { useEffect, useMemo, useRef, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function OrderHub() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState("active");

    const formatPrice = (price) => {
        return Number(price || 0)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [lastOrderCount, setLastOrderCount] = useState(0);
    const isFetchingRef = useRef(false);
    const userSelectedRef = useRef(false);
    const mountedRef = useRef(true);

    const fetchOrders = async (showLoading = false) => {
        try {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            if (showLoading) setLoading(true);

            const res = await API.get("/api/admin/orders");
            const fetchedOrders = [...(res.data.data || [])].reverse();

            // NOTIFICATION ORDER BARU
            if (lastOrderCount !== 0 && fetchedOrders.length > lastOrderCount) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "info",
                    title: "Pesanan baru masuk",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }

            setLastOrderCount(fetchedOrders.length);
            setOrders(fetchedOrders);

            // AUTO SELECT FIRST ORDER
            const isMobile = window.innerWidth < 1024;
            if (fetchedOrders.length > 0 && !selectedOrder && !userSelectedRef.current && !isMobile) {
                const firstQueueOrder = fetchedOrders.find((order) =>
                    ["pending", "confirmed", "preparing", "ready"].includes(order.status)
                );
                setSelectedOrder(firstQueueOrder || fetchedOrders[0]);
            } else if (selectedOrder?.id) {
                const updatedSelectedOrder = fetchedOrders.find((o) => o.id === selectedOrder?.id);
                if (updatedSelectedOrder) {
                    setSelectedOrder(updatedSelectedOrder);
                } else {
                    setSelectedOrder(null);
                    userSelectedRef.current = false;
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            isFetchingRef.current = false;
            if (mountedRef.current) setLoading(false);
        }
    };

    useEffect(() => {
        mountedRef.current = true;
        const init = async () => {
            await fetchOrders(true);
        };
        init();

        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);

        return () => {
            mountedRef.current = false;
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // SEARCH FILTER
    const filteredOrders = useMemo(() => {
        return orders.filter((order) =>
            order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            order.guest_name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [orders, search]);

    // WAITING PAYMENT
    const waitingPaymentOrders = filteredOrders.filter((order) =>
        order.payment_method === "cash" && order.payment_status === "unpaid" && order.status === "pending"
    );

    // KITCHEN QUEUE
    const kitchenQueue = filteredOrders.filter((order) =>
        ["confirmed", "preparing", "ready"].includes(order.status)
    );

    // COMPLETED
    const completedOrders = filteredOrders.filter((order) =>         
        ["completed", "cancelled"].includes(order.status)).slice(0, 10);             
        
    const handleConfirmCash = async (order) => {
        try {
            await API.post(`/api/admin/orders/${order.id}/confirm-cash`);
            Swal.fire({
                icon: "success",
                title: "Pembayaran dikonfirmasi",
                timer: 1200,
                showConfirmButton: false,
            });
            await fetchOrders();
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Gagal konfirmasi cash",
            });
        }
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        const result =
            await Swal.fire({
                title: "Batalkan pesanan?",
                text: "Pesanan akan dibatalkan permanen",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, Batalkan",
                cancelButtonText: "Tidak",                  
            });

        if (!result.isConfirmed) return;

        try {
            await API.post(`/api/orders/${selectedOrder.id}/cancel`);
            Swal.fire({
                icon: "success",       
                title: "Pesanan dibatalkan",
                timer: 1200,                 
                showConfirmButton: false,    
            });
            await fetchOrders();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Gagal cancel order", 
            });
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedOrder) return;
        try {
            await API.put(`/api/admin/orders/${selectedOrder.id}/status`, { status });
            Swal.fire({
                icon: "success",
                title: "Status updated",
                timer: 1200,
                showConfirmButton: false,
            });
            await fetchOrders();
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Gagal update status",
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "confirmed": return "bg-blue-100 text-blue-700";
            case "preparing": return "bg-indigo-100 text-indigo-700";
            case "ready": return "bg-green-100 text-green-700";
            case "completed": return "bg-gray-200 text-gray-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const renderActionButton = () => {
        if (!selectedOrder) return null;
        switch (selectedOrder.status) {
            case "pending":
                return (
                    <button
                        onClick={handleCancelOrder}
                        className="
                            px-4
                            py-2
                            rounded-lg
                            bg-red-500
                            text-white
                            text-sm
                            font-medium
                        "
                    >
                        Cancel Order
                    </button>
                );
            case "confirmed":
                return (
                    <button
                        onClick={() => handleUpdateStatus("preparing")}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                    >
                        Start Preparing
                    </button>
                );

            case "preparing":
                return (
                    <button
                        onClick={() => handleUpdateStatus("ready")}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
                    >
                        Ready
                    </button>
                );

            case "ready":
                return (
                    <button
                        onClick={() => handleUpdateStatus("completed")}
                        className="px-4 py-2 rounded-lg bg-[#2F5231] text-white text-sm font-medium"
                    >
                        Complete
                    </button>
                );
            default:
                return null;
        }
    };

    const OrderCard = ({ order }) => (
        <button
            onClick={() => {
                userSelectedRef.current = true;
                setSelectedOrder(order);
            }}
            className={`w-full text-left p-4 border-b transition-all hover:bg-gray-50 ${selectedOrder?.id === order.id ? "bg-[#2F5231]/5 border-l-4 border-l-[#2F5231]" : ""
                }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-800">{order.order_number}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{order.guest_name || "Guest"}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <p className="text-xs font-medium uppercase">{order.payment_method}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-[#2F5231]">
                        Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}
                    </p>
                </div>
            </div>
        </button>
    );

    return (
        <div className="w-full h-[calc(100dvh-32px)] md:h-[calc(100dvh-48px)] lg:h-[calc(100dvh-64px)] flex flex-col min-h-0 overflow-hidden">
            <div className="h-full grid grid-cols-1 lg:grid-cols-[420px_1fr] bg-white rounded-2xl md:rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex-grow min-h-0">
                {/* LEFT */}
                <div className={`bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden ${selectedOrder ? "hidden lg:flex" : "flex"}`}>
                    {/* HEADER */}
                    <div className="p-5 border-b">
                        <h1 className="text-2xl font-bold text-[#2F5231]">Kasir Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitoring pesanan cafe</p>

                        {/* SEARCH */}
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Cari order..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20"
                            />
                        </div>

                        {/* TABS */}
                        <div className="flex gap-2 mt-4 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`flex-grow flex-shrink-0 flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "active" ? "bg-white text-[#2F5231] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                                    }`}
                            >
                                <span>Antrean Aktif</span>
                                {(waitingPaymentOrders.length + kitchenQueue.length) > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "active" ? "bg-[#2F5231] text-white" : "bg-gray-200 text-gray-600"
                                        }`}>
                                        {waitingPaymentOrders.length + kitchenQueue.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("completed")}
                                className={`flex-grow flex-shrink-0 flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "completed" ? "bg-white text-[#2F5231] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                                    }`}
                            >
                                <span>Completed</span>
                                {completedOrders.length > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "completed" ? "bg-[#2F5231] text-white" : "bg-gray-200 text-gray-600"
                                        }`}>
                                        {completedOrders.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ORDER LIST */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {loading && (
                            <div className="p-8 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                            </div>
                        )}

                        {/* WAITING PAYMENT */}
                        <div className={activeTab === "active" ? "" : "hidden"}>
                            {waitingPaymentOrders.length > 0 && (
                                <div>
                                    <div className="px-4 py-3 bg-yellow-50 text-yellow-700 text-xs font-bold uppercase">Waiting Payment</div>
                                    {waitingPaymentOrders.map((order) => (
                                        <div key={order.id} className="relative">
                                            <OrderCard order={order} />
                                            <div className="px-4 pb-4">
                                                <button
                                                    onClick={() => handleConfirmCash(order)}
                                                    className="w-full py-2 rounded-lg bg-[#2F5231] text-white text-sm font-medium"
                                                >
                                                    Confirm Cash
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* KITCHEN QUEUE */}
                        <div className={activeTab === "active" ? "" : "hidden"}>
                            <div className="px-4 py-3 bg-blue-50 text-blue-700 text-xs font-bold uppercase">Kitchen Queue</div>
                            {kitchenQueue.length > 0 ? (
                                kitchenQueue.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                waitingPaymentOrders.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 text-sm">Tidak ada antrean aktif ☕</div>
                                )
                            )}
                        </div>

                        {/* COMPLETED */}
                        <div className={activeTab === "completed" ? "" : "hidden"}>
                            {completedOrders.length > 0 ? (
                                <div>
                                    <div className="px-4 py-3 bg-gray-100 text-gray-700 text-xs font-bold uppercase">Completed</div>
                                    {completedOrders.map((order) => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">Belum ada riwayat pesanan</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className={`overflow-y-auto h-full bg-gray-50/30 min-h-0 ${selectedOrder ? "block" : "hidden lg:block"}`}>
                    {!selectedOrder ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="text-5xl mb-4 animate-pulse">☕</div>
                                <p className="text-gray-500 text-sm font-medium">Pilih order</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Back Button for mobile */}
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(null);
                                            userSelectedRef.current = false;
                                        }}
                                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                    />
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-800">{selectedOrder.order_number}</h2>
                                        <p className="text-sm text-gray-500 mt-1">{selectedOrder.guest_name || "Guest Customer"}</p>
                                    </div>
                                </div>
                                {renderActionButton()}
                            </div>

                            {/* INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl border p-4">
                                    <p className="text-xs text-gray-400">Status</p>
                                    <p className="mt-1 text-sm font-bold">{selectedOrder.status}</p>
                                </div>
                                <div className="bg-white rounded-xl border p-4">
                                    <p className="text-xs text-gray-400">Payment Method</p>
                                    <p className="mt-1 text-sm font-bold">{selectedOrder.payment_method}</p>
                                </div>
                                <div className="bg-white rounded-xl border p-4">
                                    <p className="text-xs text-gray-400">Payment Status</p>
                                    <p className="mt-1 text-sm font-bold">{selectedOrder.payment_status}</p>
                                </div>
                                <div className="bg-white rounded-xl border p-4">
                                    <p className="text-xs text-gray-400">Total</p>
                                    <p className="mt-1 text-lg font-bold text-[#2F5231]">Rp {formatPrice(selectedOrder.total_amount)}</p>
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div className="bg-white rounded-2xl border overflow-hidden">
                                <div className="px-5 py-4 border-b font-bold text-gray-800">Detail Pesanan</div>
                                <div className="divide-y">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between px-5 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.menu_item_name}</p>
                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-bold text-[#2F5231]">Rp {formatPrice(item.subtotal)}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* NOTES */}
                                {selectedOrder.notes && (
                                    <div className="border-t px-5 py-4 bg-yellow-50">
                                        <p className="text-xs font-bold text-yellow-700 uppercase">Notes</p>
                                        <p className="text-sm text-gray-700 mt-2">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderHub;