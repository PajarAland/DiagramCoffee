import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function MyVoucher() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isExpired = (date) => {
        return new Date(date) < new Date();           
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/vouchers/my-vouchers");
            const filteredVouchers = (res.data.data || []).filter(
                (voucher) => !voucher.is_used && !isExpired(voucher.expired_at)
            );
            const sortedVouchers = filteredVouchers.sort(
                (a, b) => new Date(a.expired_at) - new Date(b.expired_at)
            );
            setVouchers(sortedVouchers);
        } catch (err) {
            console.error("Failed fetching vouchers:", err);
            setVouchers([]);
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F3EF] px-4 py-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Voucher Saya</h1>
                        <p className="text-gray-500 mt-2">Voucher loyalty kamu</p>
                    </div>
                    <button onClick={() => navigate("/voucher")} className="w-full md:w-auto bg-[#2F5231] hover:bg-[#244126] text-white px-6 py-3 rounded-2xl font-semibold transition">
                        Tukar Voucher
                    </button>
                </div>

                {/* EMPTY */}
                {!vouchers.length && (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-md">
                        <h2 className="text-2xl font-bold text-gray-700">Belum Ada Voucher</h2>
                        <p className="text-gray-500 mt-3">Tukarkan loyalty point Anda untuk mendapatkan voucher menarik ☕</p>
                    </div>
                )}

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vouchers.map((item) => {
                        const voucher = item.voucher;
                        const expired = isExpired(item.expired_at);
                        const used = item.is_used;
                        return (
                            <div key={item.id} className={`relative rounded-3xl overflow-hidden shadow-xl border ${used ? "bg-gray-200" : expired ? "bg-red-50" : "bg-white"}`}>
                                {/* TOP */}
                                <div className={`p-6 text-white ${used ? "bg-gray-500" : expired ? "bg-red-500" : "bg-gradient-to-r from-[#2F5231] to-[#1e3a20]"}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-white/70">Voucher</p>
                                            <h2 className="text-3xl font-bold mt-2">{voucher.code}</h2>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${used ? "bg-gray-300 text-gray-700" : expired ? "bg-red-200 text-red-700" : "bg-green-300 text-black"}`}>
                                            {used ? "Used" : expired ? "Expired" : "Available"}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm text-white/80">{voucher.name}</p>
                                </div>

                                {/* BODY */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(voucher.discount_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Min Transaction</span>
                                            <span className="font-semibold text-gray-800">{formatPrice(voucher.min_transaction_amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Expired At</span>
                                            <span className="font-semibold text-gray-800">{new Date(item.expired_at).toLocaleDateString("id-ID")}</span>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <div className={`mt-6 py-3 rounded-2xl text-center font-semibold text-sm ${used ? "bg-gray-300 text-gray-700" : expired ? "bg-red-100 text-red-700" : "bg-[#2F5231]/10 text-[#2F5231]"}`}>
                                        {used ? "Voucher Sudah Digunakan" : expired ? "Voucher Sudah Expired" : "Siap Digunakan"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyVoucher;