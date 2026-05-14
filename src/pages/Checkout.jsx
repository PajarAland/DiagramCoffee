import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Checkout() {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [notes, setNotes] = useState("");

    const baseImageUrl = "http://localhost:8000/storage/";

    useEffect(() => {
        const storedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCartItems(storedCart);
    }, []);

    const total = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            return acc + Number(item.price) * item.qty;
        }, 0);
    }, [cartItems]);

    const handleCheckout = async () => {
        try {
            if (cartItems.length === 0) {
                alert("Cart kosong");
                return;
            }

            setLoading(true);

            const payload = {
                branch_id: cartItems[0]?.branch_id || 1,
                payment_method: "xendit",
                guest_name: customerName || "Guest Customer",
                notes,

                items: cartItems.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.qty,
                })),
            };

            console.log(payload);

            const response = await API.post(
                "/api/orders",
                payload
            );

            const invoiceUrl =
                response.data.data.xendit_invoice_url;

            if (!invoiceUrl) {
                alert("Invoice URL tidak ditemukan");
                return;
            }

            // CLEAR CART
            localStorage.removeItem("cart");

            // REDIRECT TO XENDIT
            window.location.href = invoiceUrl;

        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Checkout gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F4ED] p-8">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-5xl font-bold text-[#2F5231]">
                            Checkout
                        </h1>

                        <p className="text-gray-500 mt-2 text-lg">
                            Review pesanan kamu sebelum pembayaran
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 h-12 rounded-2xl border border-[#2F5231] text-[#2F5231] font-semibold"
                    >
                        Kembali
                    </button>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* CUSTOMER */}
                        <div className="bg-white rounded-3xl p-6 border">

                            <h2 className="text-2xl font-bold mb-5">
                                Customer Info
                            </h2>

                            <div className="flex flex-col gap-4">

                                <input
                                    type="text"
                                    placeholder="Nama Customer"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(
                                            e.target.value
                                        )
                                    }
                                    className="h-14 px-5 rounded-2xl border outline-none"
                                />

                                <textarea
                                    placeholder="Catatan pesanan"
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(
                                            e.target.value
                                        )
                                    }
                                    className="min-h-[120px] p-5 rounded-2xl border outline-none resize-none"
                                />

                            </div>

                        </div>

                        {/* ITEMS */}
                        <div className="bg-white rounded-3xl p-6 border">

                            <h2 className="text-2xl font-bold mb-5">
                                Order Items
                            </h2>

                            <div className="flex flex-col gap-5">

                                {cartItems.map((item) => {

                                    const subtotal =
                                        Number(item.price) *
                                        item.qty;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 border rounded-2xl p-4"
                                        >

                                            <img
                                                src={`${baseImageUrl}${item.image_url}`}
                                                alt={item.name}
                                                className="w-28 h-28 rounded-2xl object-cover"
                                            />

                                            <div className="flex-1 flex flex-col justify-between">

                                                <div>
                                                    <h3 className="text-2xl font-semibold">
                                                        {item.name}
                                                    </h3>

                                                    <p className="text-[#2F5231] text-lg mt-1">
                                                        Rp
                                                        {Number(
                                                            item.price
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">

                                                    <span className="text-gray-500">
                                                        Qty: {item.qty}
                                                    </span>

                                                    <span className="font-semibold text-xl">
                                                        Rp
                                                        {subtotal.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div>

                        <div className="bg-white rounded-3xl p-6 border sticky top-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Payment Summary
                            </h2>

                            <div className="flex flex-col gap-4">

                                <div className="flex justify-between text-lg">
                                    <span>Total Item</span>

                                    <span>
                                        {cartItems.length}
                                    </span>
                                </div>

                                <div className="flex justify-between text-2xl font-bold border-t pt-5">

                                    <span>Total</span>

                                    <span className="text-[#2F5231]">
                                        Rp
                                        {total.toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>

                                </div>

                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="mt-8">

                                <h3 className="font-semibold mb-3 text-lg">
                                    Payment Method
                                </h3>

                                <div className="border rounded-2xl p-4 bg-[#F7F4ED]">
                                    Xendit (QRIS / E-Wallet / VA)
                                </div>

                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={handleCheckout}
                                disabled={
                                    loading ||
                                    cartItems.length === 0
                                }
                                className="w-full h-14 rounded-2xl bg-[#2F5231] text-white text-xl font-semibold mt-8 disabled:opacity-50"
                            >
                                {loading
                                    ? "Processing..."
                                    : "Bayar Sekarang"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;