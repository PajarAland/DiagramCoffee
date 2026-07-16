import { useEffect, useMemo, useState, useCallback } from "react";
import Swal from "sweetalert2";
import arrowBackIcon from "../../assets/mdi--arrow-back.svg"
import cartIcon from "../../assets/mdi--cart-variant.svg"
import API from "../../services/api";
import { useAuth } from "../../context/useAuth";

function KasirOrder() {
    const auth = useAuth();
    const user = auth?.user;
    const branchId = user?.branch_id;
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [orderType, setOrderType] = useState("dine_in");
    const [tableNumber, setTableNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [invoiceUrl, setInvoiceUrl] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [showCartMobile, setShowCartMobile] = useState(false);

    const formatPrice = (price) => {
        return Number(price || 0)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [menuRes, categoryRes] = await Promise.all([
                API.get(`/api/branches/${branchId}/menus`),
                API.get("/api/categories"),
            ]);
            setMenus(menuRes.data.data || []);
            setCategories(categoryRes.data.data || []);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data menu",
            });
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    console.log(menus);

    useEffect(() => {
        if (!branchId) return;
        const load = async () => {
            await fetchData();
        };
        load();
    }, [branchId, fetchData]);

    const filteredMenus = useMemo(() => {
        if (selectedCategory === "all") {
            return menus;
        }
        const selectedCategoryData = categories.find((category) => category.id === Number(selectedCategory));
        
        return menus.filter((item) => item.category === selectedCategoryData?.name);
    }, [menus, categories, selectedCategory]);

    const addToCart = (menu) => {
        const existing = cart.find((item) => item.id === menu.id);
        if (existing) {
            setCart((prev) =>
                prev.map((item) =>
                    item.id === menu.id ? { ...item, qty: item.qty + 1 } : item
                )
            );
            return;
        }
        setCart((prev) => [
            ...prev,
            {
                id: menu.id,
                name: menu.name,
                price: menu.final_price || menu.base_price,
                qty: 1,
            },
        ]);
    };

    const increaseQty = (id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty - 1 } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    }, [cart]);

    const handleSubmit = async () => {
        try {
            if (cart.length === 0) {

                Swal.fire({
                    icon: "warning",
                    title: "Cart kosong",
                });
                return;
            }
            setSubmitting(true);
            const payload = {
                branch_id: branchId,
                payment_method: paymentMethod,
                order_type: orderType,
                table_number: orderType === "dine_in" ? tableNumber : null,
                guest_name: customerName || "Walk In Customer",
                notes,
                items: cart.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.qty,
                })),
            };

            const response = await API.post("/api/orders", payload);
            const order = response.data.data;
            setCreatedOrder(order);

            if (paymentMethod === "xendit" && order?.xendit_invoice_url) {
                setInvoiceUrl(order.xendit_invoice_url);
                setShowPaymentModal(true);
            } else {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: response.data.message || "Pesanan berhasil dibuat",
                    showConfirmButton: false,
                    timer: 1500,
                });

                window.location.reload();
            }

            setCart([]);
            setCustomerName("");
            setTableNumber("");
            setNotes("");
            setOrderType("dine_in");
            setPaymentMethod("cash");
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Gagal membuat pesanan",
            });
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F5F0] p-6 flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100dvh-32px)] md:h-[calc(100dvh-48px)] lg:h-[calc(100dvh-64px)] flex flex-col min-h-0 overflow-hidden">
            <div className="h-full flex bg-white rounded-2xl md:rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex-grow min-h-0">
                <div className={`flex-1 p-6 flex flex-col h-full min-h-0 overflow-hidden ${showCartMobile ? "hidden lg:flex" : "flex"}`}>
                    <h1 className="text-3xl font-bold text-[#2F5231] mb-6">Kasir Order</h1>

                    <div className="flex gap-2 mb-6 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                                selectedCategory === "all" ? "bg-[#2F5231] text-white border-[#2F5231]" : "bg-white hover:bg-[#F5F1EA]"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                                    selectedCategory === category.id ? "bg-[#2F5231] text-white border-[#2F5231]" : "bg-white hover:bg-[#F5F1EA]"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-y-auto min-h-0 grid grid-cols-2 lg:grid-cols-3 gap-4 pr-1 content-start auto-rows-max">
                        {filteredMenus.map((menu) => (
                            <div key={menu.id} className="bg-white rounded-3xl p-4 border border-[#ECE6DC] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-semibold mb-1 text-base text-gray-800 line-clamp-2 h-12">{menu.name}</h2>
                                    <p className="text-sm text-gray-500 mb-4">Rp {formatPrice(menu.final_price || menu.base_price)}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(menu)}
                                    className="w-full bg-[#2F5231] hover:bg-[#254227] text-white py-3 rounded-2xl transition-all font-medium"
                                >
                                    Tambah
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`w-full lg:w-[420px] border-l border-[#ECE6DC] bg-white p-6 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.03)] h-full overflow-hidden min-h-0 ${
                    showCartMobile ? "flex" : "hidden lg:flex"
                }`}>
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => setShowCartMobile(false)}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <img src={arrowBackIcon} alt="Back" className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold text-[#2F5231]">Cart</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4">
                        {cart.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-20">
                                <p className="font-medium">Cart masih kosong</p>
                                <p className="text-sm">Tambahkan menu terlebih dahulu</p>
                            </div>
                        )}
                        {cart.map((item) => (
                            <div key={item.id} className="border border-[#ECE6DC] rounded-2xl p-4">
                                <div className="flex justify-between mb-3">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="font-semibold">Rp {formatPrice(item.price * item.qty)}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button onClick={() => decreaseQty(item.id)} className="w-9 h-9 border rounded-xl hover:bg-gray-100">-</button>
                                    <div className="w-9 h-9 flex items-center justify-center font-semibold">{item.qty}</div>
                                    <button onClick={() => increaseQty(item.id)} className="w-9 h-9 border rounded-xl hover:bg-gray-100">+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#ECE6DC] bg-white space-y-3 shrink-0">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    placeholder="Walk In Customer"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-0.5 focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231]/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipe Pesanan</label>
                                <select
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-0.5 focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231]/20 outline-none"
                                >
                                    <option value="dine_in">Dine In</option>
                                    <option value="take_away">Take Away</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metode Bayar</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-0.5 focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231]/20 outline-none"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="xendit">QRIS / Digital</option>
                                </select>
                            </div>
                            {orderType === "dine_in" && (
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nomor Meja</label>
                                    <input
                                        type="text"
                                        placeholder="No. Meja"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-0.5 focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231]/20 outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Catatan</label>
                            <input
                                type="text"
                                placeholder="Catatan tambahan..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-0.5 focus:border-[#2F5231] focus:ring-1 focus:ring-[#2F5231]/20 outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-500">Total</span>
                                <span className="text-xl font-black text-[#2F5231]">Rp {formatPrice(total)}</span>
                            </div>
                            <button
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="w-full bg-[#2F5231] hover:bg-[#254227] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md text-center flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="inline-block h-5 w-6 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                                        Memproses...
                                    </span>
                                ) : (
                                    "Buat Pesanan"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-6 w-[500px]">
                            <h2 className="text-2xl font-bold mb-4">Pembayaran QRIS</h2>
                            <div className="space-y-3">
                                <p>Order: <span className="font-semibold">{createdOrder?.order_number}</span></p>
                                <p>Total: <span className="font-semibold">Rp {formatPrice(createdOrder?.total_amount)}</span></p>
                            </div>
                            <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 w-full bg-[#2F5231] text-white py-4 rounded-2xl flex items-center justify-center font-semibold"
                            >
                                Buka QRIS Payment
                            </a>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="mt-3 w-full border py-4 rounded-2xl"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {cart.length > 0 && !showCartMobile && (
                    <button
                        onClick={() => setShowCartMobile(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#2F5231] text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-[#254227] transition-all flex items-center gap-2 font-bold"
                    >
                        <img src={cartIcon} alt="" className="w-5 h-5" />
                        <span>Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default KasirOrder;