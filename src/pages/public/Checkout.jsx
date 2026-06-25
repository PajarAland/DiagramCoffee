import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useBranch } from "../../context/useBranch";
import API from "../../services/api";

function Checkout() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { selectedBranch } = useBranch();

    const [cartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState(user?.name || "");
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("xendit");
    const [orderType, setOrderType] = useState("dine_in");
    const [tableNumber, setTableNumber] = useState("");
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [voucherId, setVoucherId] = useState(null);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchVouchers = async () => {
            try {
                const res = await API.get("/api/vouchers/my-vouchers");
                const filteredVouchers = (res.data.data || []).filter((voucher) =>
                    !voucher.is_used && new Date(voucher.expired_at) > new Date()
                );
                setVouchers(filteredVouchers);
            } catch (err) {
                console.error(err);
            }
        };
        fetchVouchers();
    }, [user]);

    useEffect(() => {
        const fetchPreview = async () => {          
            try {
                if (!cartItems.length) return;
                if (!selectedBranch) return;
                setPreviewLoading(true);

                const payload = {
                    branch_id: Number(selectedBranch),
                    voucher_id: voucherId,
                    items: cartItems.map((item) => ({
                        menu_item_id: item.id,
                        quantity: item.qty,
                    })),
                };
                const res = await API.post("/api/orders/preview", payload);
                setPreviewData(res.data.data);
            } catch (err) {
                console.error("Preview Error:", err);
            } finally {
                setPreviewLoading(false);
            }
        };
        fetchPreview();
    }, [cartItems, voucherId, selectedBranch]);

    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + Number(item.final_price || item.base_price) * item.qty, 0);
    }, [cartItems]);

    const discountAmount = Number(previewData?.voucher?.voucher_discount || 0);
    const branchDiscount = Math.max(0, Number(previewData?.discount_total || 0) - discountAmount);
    const grandTotal = Number(previewData?.total_amount || total);
    const selectedBranchId = Number(selectedBranch);

    const handleCheckout = async () => {
        try {
            if (cartItems.length === 0) {
                alert("Cart kosong");
                return;
            }
            if (!selectedBranchId) {
                alert("Silakan pilih cabang terlebih dahulu");
                return;
            }
            if ( orderType === "dine_in" && !tableNumber) {
                    alert("Nomor meja wajib diisi");
                    return;
            }
            setLoading(true);
            const payload = {
                branch_id: selectedBranchId,
                order_type: orderType,
                table_number: orderType === "dine_in" ? tableNumber : null,
                voucher_id: voucherId,
                payment_method: paymentMethod,
                guest_name: customerName || user?.name || "Guest Customer",
                notes,
                items: cartItems.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.qty,
                })),
            };
            const response = await API.post("/api/orders", payload);
            const invoiceUrl = response.data.data.xendit_invoice_url;

            if (!invoiceUrl) {
                alert("Invoice URL tidak ditemukan");
                return;
            }
            localStorage.removeItem("cart");
            window.location.href = invoiceUrl;
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Checkout gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#2F5231]">
                            Checkout
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Review pesanan sebelum pembayaran
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg border border-[#2F5231] text-[#2F5231] text-sm font-medium hover:bg-[#2F5231] hover:text-white transition-colors"
                    >
                        Kembali
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">
                                Informasi Customer
                            </h2>
                            <div className="space-y-3">
                                <input
                                    disabled={!!user}
                                    type="text"
                                    placeholder="Nama"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-lg border border-gray-200 outline-none focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231] text-sm"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOrderType("dine_in")}
                                        className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                                            orderType === "dine_in" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-200"
                                        }`}
                                    >
                                        Dine In
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setOrderType("take_away")}
                                        className={`h-11 rounded-lg border text-sm font-medium transition-all ${
                                            orderType === "take_away" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-200"
                                        }`}
                                    >
                                        Take Away
                                    </button>
                                </div>

                                {orderType === "dine_in" && (
                                    <input
                                        type="text"
                                        placeholder="Nomor Meja"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg border border-gray-200 outline-none focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231] text-sm"
                                    />
                                )}

                                <textarea
                                    placeholder="Catatan pesanan (opsional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full min-h-[80px] p-4 rounded-lg border border-gray-200 outline-none focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231] text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">
                                Pesanan ({cartItems.length} item)
                            </h2>
                            
                            {cartItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm">Keranjang kosong</p>
                                    <button
                                        onClick={() => navigate('/menu')}
                                        className="mt-3 text-[#2F5231] text-sm font-medium hover:underline"
                                    >
                                        Lihat Menu
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems.map((item) => {
                                        const subtotal = Number(item.final_price || item.base_price) * item.qty;
                                        return (
                                            <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                                                        <span className="text-xs text-gray-400">x{item.qty}</span>
                                                    </div>
                                                    <p className="text-xs text-[#2F5231] font-medium mt-0.5">
                                                        Rp{Number(item.final_price || item.base_price).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-800">Rp{subtotal.toLocaleString("id-ID")}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl p-5 shadow-sm sticky top-6">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">
                                Ringkasan Pembayaran
                            </h2>

                            <div className="space-y-3">
                                {previewLoading ? (
                                    <div className="text-sm text-gray-400">
                                        Menghitung total...
                                    </div>
                                ) : (
                                    <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-800">
                                            Rp{Number(previewData?.subtotal || total).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    {previewData?.fees?.map((fee) => (
                                        <div key={fee.key} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {fee.label}
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                Rp{Number(fee.amount).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    ))}
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Diskon Voucher</span>
                                            <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
                                        </div>
                                    )}

                                    {branchDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Promo Cabang</span>
                                            <span>
                                                -Rp{branchDiscount.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200">
                                        <span className="text-gray-800">Total</span>
                                        <span className="text-[#2F5231] text-xl">
                                            Rp{grandTotal.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    </>
                                )}
                            </div>

                            {user && vouchers.length > 0 && (
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setShowVoucherModal(true)}
                                        className="w-full flex items-center justify-between rounded-xl border border-[#ECE6DC] p-4 hover:border-[#2F5231] transition-all"
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-[#2F5231]">Voucher</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {selectedVoucher ? selectedVoucher.voucher?.name : `${vouchers.length} voucher tersedia`}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Metode Pembayaran
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="xendit"
                                            checked={paymentMethod === "xendit"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-[#2F5231]"
                                            aria-label="Metode pembayaran Xendit"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">Xendit</p>
                                            <p className="text-xs text-gray-400">QRIS / E-Wallet</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || cartItems.length === 0}
                                className="w-full mt-6 py-3 rounded-lg bg-[#2F5231] text-white text-sm font-semibold hover:bg-[#1e3a20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Memproses..." : `Bayar Rp${grandTotal.toLocaleString("id-ID")}`}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                Dengan melanjutkan, Anda menyetujui syarat & ketentuan
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showVoucherModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center">
                    <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-5 max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-[#2F5231]">Pilih Voucher</h2>
                                <p className="text-sm text-gray-400 mt-1">Gunakan voucher untuk diskon</p>
                            </div>
                            <button onClick={() => setShowVoucherModal(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 transition-all" aria-label="Tutup">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {vouchers.map((item) => {
                                const voucher = item?.voucher || {};
                                const minTransaction = Number(voucher?.min_transaction_amount || 0);
                                const disabled = false;
                                const selected = voucherId === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {
                                            setVoucherId(item.id);
                                            setSelectedVoucher(item);
                                            setShowVoucherModal(false);
                                        }}
                                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                                            selected ? "border-[#2F5231] bg-[#F8F5F0]" : "border-[#ECE6DC] bg-white"
                                        } ${
                                            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[#2F5231]"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-[#2F5231] text-sm">{voucher.name}</p>
                                                    {selected && <span className="text-[10px] px-2 py-1 rounded-full bg-[#2F5231] text-white">Dipilih</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">Min transaksi Rp{minTransaction.toLocaleString("id-ID")}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Berlaku sampai {new Date(item.expired_at).toLocaleDateString("id-ID")}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-lg font-bold text-[#2F5231]">-Rp{Number(voucher.discount_amount).toLocaleString("id-ID")}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedVoucher && (
                            <button
                                type="button"
                                onClick={() => {
                                    setVoucherId(null);
                                    setSelectedVoucher(null);
                                    setShowVoucherModal(false);
                                }}
                                className="mt-4 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
                            >
                                Hapus Voucher
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;