import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import API from "../../services/api";

function OrderStatus() {
    const navigate = useNavigate();
    const { orderNumber } = useParams();
    const [searchParams] = useSearchParams();
    const redirectStatus = searchParams.get("status");
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await API.get(`/api/orders/status/${orderNumber}`);
                setOrder(res.data.data);
                console.log(res.data.data);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message || "Gagal mengambil status pesanan"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber]);

    

    const getStatusConfig = () => {
        if (!order) return {};

        switch (order.status) {
            case "pending":
                return {
                    emoji: "⏳",
                    title: "Menunggu Pembayaran",
                    description: "Selesaikan pembayaran untuk memproses pesanan Anda",
                    color: "text-yellow-700",
                    bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
                    border: "border-yellow-200",
                    iconBg: "bg-yellow-100",
                    step: 1,
                };
            case "confirmed":
                return {
                    emoji: "✅",
                    title: "Pembayaran Dikonfirmasi",
                    description: "Pesanan Anda telah kami terima dan akan segera diproses",
                    color: "text-blue-700",
                    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
                    border: "border-blue-200",
                    iconBg: "bg-blue-100",
                    step: 2,
                };
            case "preparing":
                return {
                    emoji: "☕",
                    title: "Sedang Disiapkan",
                    description: "Barista kami sedang menyiapkan pesanan spesial untuk Anda",
                    color: "text-indigo-700",
                    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
                    border: "border-indigo-200",
                    iconBg: "bg-indigo-100",
                    step: 3,
                };
            case "ready":
                return {
                    emoji: "🛎️",
                    title: "Pesanan Siap Diambil",
                    description: "Pesanan Anda sudah siap, silakan ambil di kasir",
                    color: "text-green-700",
                    bg: "bg-gradient-to-br from-green-50 to-green-100",
                    border: "border-green-200",
                    iconBg: "bg-green-100",
                    step: 4,
                };
            case "completed":
                return {
                    emoji: "🎉",
                    title: "Pesanan Selesai",
                    description: "Terima kasih! Selamat menikmati pesanan Anda",
                    color: "text-gray-700",
                    bg: "bg-gradient-to-br from-gray-50 to-gray-100",
                    border: "border-gray-200",
                    iconBg: "bg-gray-100",
                    step: 5,
                };
            case "cancelled":
                return {
                    emoji: "❌",
                    title: "Pesanan Dibatalkan",
                    description: "Pesanan Anda telah dibatalkan",
                    color: "text-red-700",
                    bg: "bg-gradient-to-br from-red-50 to-red-100",
                    border: "border-red-200",
                    iconBg: "bg-red-100",
                    step: 0,
                };
            default:
                return {
                    emoji: "📄",
                    title: "Status Pesanan",
                    description: "",
                    color: "text-gray-700",
                    bg: "bg-gradient-to-br from-gray-50 to-gray-100",
                    border: "border-gray-200",
                    iconBg: "bg-gray-100",
                    step: 0,
                };
        }
    };

    const statusConfig = getStatusConfig();

    const getProgressSteps = () => {
        const steps = [
            { label: "Menunggu", icon: "⏳", status: "pending" },
            { label: "Dikonfirmasi", icon: "✅", status: "confirmed" },
            { label: "Disiapkan", icon: "☕", status: "preparing" },
            { label: "Siap", icon: "🛎️", status: "ready" },
            { label: "Selesai", icon: "🎉", status: "completed" },
        ];

        const currentStep = statusConfig.step;
        
        return steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;
            
            return {
                ...step,
                isCompleted,
                isCurrent,
                isPending,
                stepNumber,
            };
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                    </div>
                    <p className="mt-6 text-sm font-medium text-gray-600 animate-pulse">
                        Memuat status pesanan...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
                    <div className="text-7xl mb-4 animate-bounce">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Terjadi Kesalahan
                    </h1>
                    <div className="h-1 w-20 bg-red-500 mx-auto my-4 rounded-full"></div>
                    <p className="text-sm text-gray-600 mt-3">{error}</p>
                    <button
                        onClick={() => navigate("/home")}
                        className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-[#2F5231] to-[#1e3a20] text-white text-sm font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
                    >
                        Kembali ke Home
                    </button>
                </div>
            </div>
        );
    }

    const progressSteps = getProgressSteps();

    return (
        <div className="min-h-screen bg-[#F7F3EF] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* STATUS CARD */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    {/* HEADER */}
                    <div className={`${statusConfig.bg} p-8 text-center relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                        
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${statusConfig.iconBg} shadow-lg mb-4 transform transition-all duration-300 hover:scale-110`}>
                            <div className="text-5xl">{statusConfig.emoji}</div>
                        </div>
                        
                        <h1 className={`text-4xl font-bold ${statusConfig.color} mb-2`}>
                            {statusConfig.title}
                        </h1>
                        
                        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                            {statusConfig.description}
                        </p>

                        {redirectStatus === "success" && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-xs font-semibold shadow-md animate-pulse">
                                <span>✓</span>
                                Pembayaran berhasil diverifikasi
                            </div>
                        )}
                    </div>

                    {/* PROGRESS BAR for active orders */}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                        <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                            <div className="relative">
                                <div className="flex justify-between mb-2">
                                    {progressSteps.map((step, idx) => (
                                        <div key={idx} className="text-center flex-1">
                                            <div className="relative">
                                                <div className={`
                                                    w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg
                                                    transition-all duration-300 transform hover:scale-110
                                                    ${step.isCompleted ? 'bg-green-500 text-white shadow-lg' : 
                                                      step.isCurrent ? 'bg-[#2F5231] text-white shadow-lg ring-4 ring-[#2F5231] ring-opacity-30' : 
                                                      'bg-gray-200 text-gray-400'}
                                                `}>
                                                    {step.isCompleted ? '✓' : step.icon}
                                                </div>
                                                <p className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">
                                                    {step.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10 hidden sm:block">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-[#2F5231] transition-all duration-500"
                                        style={{ width: `${((statusConfig.step - 1) / 4) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-8">
                        {/* ORDER INFO */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Nomor Pesanan
                                </p>
                                <p className="mt-2 text-lg font-mono font-bold text-gray-800">
                                    #{order.order_number}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Metode Pembayaran
                                </p>
                                <p className="mt-2 text-sm font-bold uppercase text-gray-800">
                                    {order.payment_method}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Payment Status
                                </p>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {order.payment_status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#2F5231] to-[#1e3a20] rounded-2xl p-5 shadow-lg">
                                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                    Total Pembayaran
                                </p>
                                <p className="mt-2 text-2xl font-bold text-white">
                                    Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Detail Pesanan
                                </h2>
                                <span className="text-xs text-gray-500">
                                    {order.items?.length} item
                                </span>
                            </div>

                            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                {order.items?.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center justify-between px-6 py-4 ${
                                            idx !== order.items.length - 1 ? 'border-b border-gray-100' : ''
                                        } hover:bg-gray-50 transition-colors duration-150`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2F5231] to-[#1e3a20] text-white flex items-center justify-center text-xs font-bold">
                                                    x{item.quantity}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {item.menu_item_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        @Rp {Number(item.unit_price || 0).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-[#2F5231]">
                                            Rp {Number(item.subtotal || 0).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NOTES */}
                        {order.notes && (
                            <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="text-xl">📝</div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                                            Catatan
                                        </p>
                                        <p className="text-sm text-gray-700 italic">
                                            "{order.notes}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACTION BUTTON */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/home")}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2F5231] to-[#1e3a20] text-white text-sm font-semibold shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                            >
                                Kembali ke Home
                            </button>
                            
                            {order.status === "ready" && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 rounded-xl border-2 border-[#2F5231] text-[#2F5231] text-sm font-semibold hover:bg-[#2F5231] hover:text-white transition-all duration-200"
                                >
                                    🔄 Refresh
                                </button>
                            )}
                        </div>

                        {/* TIMESTAMP */}
                        <div className="
                            mt-6
                            pt-4
                            border-t
                            border-gray-100
                            flex
                            items-center
                            justify-between
                            gap-3
                            flex-wrap
                        ">

                            <div>
                                <p className="
                                    text-xs
                                    text-gray-400
                                ">
                                    Dibuat pada
                                </p>

                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mt-1
                                ">
                                    {new Date(
                                        order.created_at
                                    ).toLocaleString(
                                        "id-ID",
                                        {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        }
                                    )}
                                </p>
                            </div>

                            <div className="text-right">

                                <p className="
                                    text-xs
                                    text-gray-400
                                ">
                                    Cabang
                                </p>

                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mt-1
                                ">
                                    {order.branch?.name || "-"}
                                </p>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderStatus;