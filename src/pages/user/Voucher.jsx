import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function Voucher() {
    const [vouchers, setVouchers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exchangingId, setExchangingId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [voucherRes, userRes] = await Promise.all([
                API.get("/api/vouchers"),
                API.get("/api/user"),
            ]);
            setVouchers(voucherRes.data.data || []);
            setUser(userRes.data.data || null);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data voucher",
                    
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const load =
            async () => {
                await fetchData();
            };
        load();
    }, [fetchData]);

    const handleExchange = async (voucher) => {
        try {
            const result = await Swal.fire({
                title: "Tukar Voucher?",
                html: `
                    <div style="text-align:left">
                        <p>Voucher: <b>${voucher.name}</b></p>
                        <p>Dibutuhkan: <b>${voucher.points_required} poin</b></p>
                    </div>
                `,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Tukar",
                cancelButtonText: "Batal",
            });
            if (!result.isConfirmed) return;

            setExchangingId(voucher.id);
            await API.post("/api/vouchers/exchange", { voucher_id: voucher.id });

            Swal.fire({ 
                icon: "success", 
                title: "Berhasil", 
                text: "Voucher berhasil ditukar", 
                timer: 1500, 
                showConfirmButton: false 
            });
            fetchData();
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.response?.data?.errors?.points?.[0] || err.response?.data?.message || "Gagal menukar voucher",
            });
        } finally {
            setExchangingId(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F3EF]">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Loyalty Voucher</h1>
                        <p className="text-gray-500 mt-2">Tukarkan poin loyalty Anda dengan voucher menarik</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#2F5231] to-[#1e3a20] text-white rounded-3xl px-6 py-5 shadow-xl min-w-[240px]">
                        <p className="text-sm text-white/70">Loyalty Points</p>
                        <h2 className="text-4xl font-bold mt-2">{user?.loyalty_points || 0}</h2>
                        <p className="text-xs text-white/60 mt-2">Kumpulkan lebih banyak poin dari transaksi</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vouchers.map((voucher) => {
                        const enoughPoints = (user?.loyalty_points || 0) >= voucher.points_required;
                        return (
                            <div key={voucher.id} className="relative bg-white rounded-3xl overflow-hidden shadow-lg border">
                                {/* TOP */}
                                <div className="bg-gradient-to-r from-[#2F5231] to-[#1e3a20] text-white p-6 relative">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                                    <p className="text-xs uppercase tracking-widest text-white/70">Voucher</p>
                                    <h2 className="text-2xl font-bold mt-2">{voucher.code}</h2>
                                    <p className="mt-3 text-sm text-white/80">{voucher.name}</p>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(voucher.discount_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Minimal Transaction</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(voucher.min_transaction_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Required Points</span>
                                            <span className="font-bold text-[#2F5231]">{voucher.points_required} pts</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleExchange(voucher)}
                                        disabled={!enoughPoints || exchangingId === voucher.id}
                                        className={`w-full mt-6 py-3 rounded-2xl font-semibold transition-all ${enoughPoints ? "bg-[#2F5231] text-white hover:bg-[#1e3a20]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                                    >
                                        {exchangingId === voucher.id ? "Menukar..." : enoughPoints ? "Tukar Voucher" : "Poin Tidak Cukup"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {vouchers.length === 0 && (
                        <div className="col-span-full bg-white rounded-3xl p-10 text-center shadow">
                            <p className="text-gray-500 text-lg font-medium">Voucher tidak tersedia</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Voucher;