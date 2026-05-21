import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/mdi--delete.svg";
import cartIcon from "../../assets/mdi--cart.svg";

function ItemCart({ onClose }) {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
    const [removingId, setRemovingId] = useState(null);

    const updateLocalStorage = (items) => {
        localStorage.setItem("cart", JSON.stringify(items));
    };

    const handleIncrease = (id) => {
        const updated = cartItems.map((item) => {
            if (item.id !== id) return item;
            if (item.stock != null && item.qty >= item.stock) return item;
            return { ...item, qty: item.qty + 1 };
        });
        setCartItems(updated);
        updateLocalStorage(updated);
    };

    const handleDecrease = (id) => {
        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 } : item
        );
        setCartItems(updated);
        updateLocalStorage(updated);
    };

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            const updated = cartItems.filter((item) => item.id !== id);
            setCartItems(updated);
            updateLocalStorage(updated);
            setRemovingId(null);
        }, 200);
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (Number(item.final_price || item.base_price) * item.qty), 0);
    }, [cartItems]);

    const itemCount = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.qty, 0);
    }, [cartItems]);

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div
                className="relative bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <img src={cartIcon} alt="Cart" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            Keranjang ({itemCount})
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Content - Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cartItems.length === 0 ? (

                        // Empty State
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">🛍️</div>
                            <p className="text-gray-500 text-sm">Keranjang kosong</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-[#2F5231] text-white text-sm rounded-lg hover:bg-[#1e3a20] transition-colors"
                            >
                                Lihat Menu
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 ${removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}
                            >
                                {/* Item Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-800 text-sm truncate">{item.name}</h3>
                                    <p className="text-[11px] text-gray-400">Stok: {item.stock ?? "-"}</p>
                                    <p className="text-[#2F5231] font-semibold text-sm mt-0.5">
                                        Rp{Number(item.final_price || item.base_price).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mx-3">
                                    <button
                                        onClick={() => handleDecrease(item.id)}
                                        className="w-7 h-7 rounded bg-[#2F5231] text-white text-sm font-bold hover:bg-[#1e3a20] transition-colors flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-semibold text-gray-700 w-5 text-center">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => handleIncrease(item.id)}
                                        disabled={item.stock != null && item.qty >= item.stock}
                                        className="w-7 h-7 rounded bg-[#2F5231] text-white text-sm font-bold hover:bg-[#1e3a20] transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 hover:text-red-700 text-lg w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 transition-colors group"
                                        title="Hapus"
                                    >
                                        <img
                                            src={deleteIcon}
                                            alt="delete"
                                            className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer - Checkout Section */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-base pt-1">
                                <span className="font-semibold text-gray-800">Total</span>
                                <span className="font-bold text-[#2F5231] text-lg">
                                    Rp{totalPrice.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const updated = [];
                                    setCartItems(updated);
                                    updateLocalStorage(updated);
                                }}
                                className="flex-1 bg-gray-100 text-gray-600 text-sm py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Kosongkan
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate("/checkout");
                                }}
                                className="flex-[2] bg-[#2F5231] text-white text-sm py-2 rounded-lg font-semibold hover:bg-[#1e3a20] transition-colors"
                            >
                                Checkout →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemCart;