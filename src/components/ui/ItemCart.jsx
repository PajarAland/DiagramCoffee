// import API from "../../services/api.js";

// function ItemCart({ item, onIncrease, onDecrease, onRemove }) {
//     const baseImageUrl = "http://localhost:8000/storage/";

//     if (!item) return null;

//     return (
//         <div className="bg-white rounded-3xl p-4 flex gap-4 border">

//             {/* IMAGE */}
//             <img
//                 src={`${baseImageUrl}${item.image_url}`}
//                 alt={item.name}
//                 className="w-32 h-32 rounded-2xl object-cover"
//             />

//             {/* CONTENT */}
//             <div className="flex-1 flex flex-col justify-between">

//                 <div>
//                     <h3 className="text-2xl font-semibold text-[#1E1E1E]">
//                         {item.name}
//                     </h3>

//                     <p className="text-xl text-[#2F5231] font-medium mt-1">
//                         Rp{Number(item.price).toLocaleString("id-ID")}
//                     </p>
//                 </div>

//                 {/* ACTION */}
//                 <div className="flex items-center justify-between mt-4">

//                     {/* QTY */}
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => onDecrease(item.id)}
//                             className="w-10 h-10 rounded-xl bg-[#2F5231] text-white text-xl"
//                         >
//                             -
//                         </button>

//                         <span className="text-xl font-medium w-6 text-center">
//                             {item.qty}
//                         </span>

//                         <button
//                             onClick={() => onIncrease(item.id)}
//                             className="w-10 h-10 rounded-xl bg-[#2F5231] text-white text-xl"
//                         >
//                             +
//                         </button>
//                     </div>

//                     {/* RIGHT ACTION */}
//                     <div className="flex items-center gap-4">

//                         {/* REMOVE */}
//                         <button
//                             onClick={() => onRemove(item.id)}
//                             className="text-red-500 text-lg font-medium"
//                         >
//                             Hapus
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ItemCart;

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ItemCart({ onClose }) {

//     const navigate = useNavigate();

//     const baseImageUrl = "http://localhost:8000/storage/";

//     const [cartItems, setCartItems] = useState([]);

//     // LOAD CART
//     useEffect(() => {

//         const cart =
//             JSON.parse(localStorage.getItem("cart")) || [];

//         setCartItems(cart);

//     }, []);

//     // INCREASE
//     const handleIncrease = (id) => {

//         const updated = cartItems.map((item) =>
//             item.id === id
//                 ? { ...item, qty: item.qty + 1 }
//                 : item
//         );

//         setCartItems(updated);

//         localStorage.setItem(
//             "cart",
//             JSON.stringify(updated)
//         );
//     };

//     // DECREASE
//     const handleDecrease = (id) => {

//         const updated = cartItems.map((item) =>
//             item.id === id
//                 ? {
//                     ...item,
//                     qty:
//                         item.qty > 1
//                             ? item.qty - 1
//                             : 1
//                 }
//                 : item
//         );

//         setCartItems(updated);

//         localStorage.setItem(
//             "cart",
//             JSON.stringify(updated)
//         );
//     };

//     // REMOVE
//     const handleRemove = (id) => {

//         const updated =
//             cartItems.filter((item) => item.id !== id);

//         setCartItems(updated);

//         localStorage.setItem(
//             "cart",
//             JSON.stringify(updated)
//         );
//     };

//     // TOTAL
//     const totalPrice = useMemo(() => {

//         return cartItems.reduce(
//             (acc, item) =>
//                 acc + (Number(item.price) * item.qty),
//             0
//         );

//     }, [cartItems]);

//     return (
//         // <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
//         <div className="fixed inset-0 bg-black/30 z-50 flex items-end md:items-center justify-center">

//             {/* <div className="bg-[#F6F4F1] w-full max-w-2xl rounded-3xl p-6 space-y-5 max-h-[80vh] overflow-y-auto"> */}
//             <div className="
//     bg-[#F6F4F1]
//     w-full
//     md:max-w-2xl
//     rounded-t-[32px] md:rounded-3xl
//     p-4 md:p-6
//     space-y-5
//     max-h-[85vh]
//     overflow-y-auto
// ">

//                 {/* HEADER */}
//                 <div className="flex items-center justify-between">

//                     {/* <h2 className="text-3xl font-bold"> */}
//                     <h2 className="text-xl md:text-3xl font-bold">
//                         Keranjang
//                     </h2>

//                     <button
//                         onClick={onClose}
//                         className="text-2xl"
//                     >
//                         ✕
//                     </button>

//                 </div>

//                 {/* EMPTY */}
//                 {cartItems.length === 0 && (
//                     <div className="text-center py-10 text-gray-500">
//                         Keranjang kosong
//                     </div>
//                 )}

//                 {/* ITEMS */}
//                 <div className="space-y-4">

//                     {cartItems.map((item) => (
//                         // <div
//                         //     key={item.id}
//                         //     className="bg-white rounded-3xl p-4 flex gap-4 border"
//                         // >
//                         <div
//                             key={item.id}
//                             className="
//                                 bg-white
//                                 rounded-2xl
//                                 p-3 md:p-4
//                                 flex gap-3
//                                 border
//                             "
//                         >

//                             {/* IMAGE */}
//                             {/* <img
//                                 src={`${baseImageUrl}${item.image_url}`}
//                                 alt={item.name}
//                                 className="w-32 h-32 rounded-2xl object-cover"
//                             /> */}

//                             <img
//                                 src={`${baseImageUrl}${item.image_url}`}
//                                 alt={item.name}
//                                 className="
//                                     w-20 h-20
//                                     md:w-32 md:h-32
//                                     rounded-xl md:rounded-2xl
//                                     object-cover
//                                 "
//                             />

//                             {/* CONTENT */}
//                             <div className="flex-1 flex flex-col justify-between">

//                                 <div>
//                                     <h3 className="text-base md:text-2xl font-semibold text-[#1E1E1E]">
//                                         {item.name}
//                                     </h3>

//                                     <p className="text-sm md:text-xl text-[#2F5231] font-medium mt-1">
//                                         Rp{Number(item.price).toLocaleString("id-ID")}
//                                     </p>
//                                 </div>

//                                 {/* ACTION */}
//                                 <div className="flex items-center justify-between mt-3">

//                                     {/* QTY */}
//                                     <div className="flex items-center gap-3">

//                                         <button
//                                             onClick={() => handleDecrease(item.id)}
//                                             className="w-10 h-10 rounded-xl bg-[#2F5231] text-white text-xl"
//                                         >
//                                             -
//                                         </button>

//                                         <span className="text-xl font-medium w-6 text-center">
//                                             {item.qty}
//                                         </span>

//                                         <button
//                                             onClick={() => handleIncrease(item.id)}
//                                             className="w-10 h-10 rounded-xl bg-[#2F5231] text-white text-xl"
//                                         >
//                                             +
//                                         </button>

//                                     </div>

//                                     {/* REMOVE */}
//                                     <button
//                                         onClick={() => handleRemove(item.id)}
//                                         className="text-red-500 text-lg font-medium"
//                                     >
//                                         Hapus
//                                     </button>

//                                 </div>

//                             </div>

//                         </div>
//                     ))}

//                 </div>

//                 {/* FOOTER */}
//                 {cartItems.length > 0 && (
//                     <div className="pt-4 border-t space-y-4">

//                         <div className="flex justify-between text-xl font-semibold">

//                             <span>Total</span>

//                             <span>
//                                 Rp{totalPrice.toLocaleString("id-ID")}
//                             </span>

//                         </div>

//                         <button
//                             onClick={() => {
//                                 onClose();
//                                 navigate("/checkout");
//                             }}
//                             className="w-full bg-[#2F5231] text-white py-4 rounded-2xl text-xl font-medium"
//                         >
//                             Checkout
//                         </button>

//                     </div>
//                 )}

//             </div>

//         </div>
//     );
// }

// export default ItemCart;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function ItemCart({ onClose }) {

    const navigate = useNavigate();

    const baseImageUrl = "http://localhost:8000/storage/";

    const [cartItems, setCartItems] = useState([]);
    const [removingId, setRemovingId] = useState(null);

    // LOAD CART
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
    }, []);

    // UPDATE LOCALSTORAGE
    const updateLocalStorage = (items) => {
        localStorage.setItem("cart", JSON.stringify(items));
    };

    // INCREASE
    const handleIncrease = (id) => {
        const updated = cartItems.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
        setCartItems(updated);
        updateLocalStorage(updated);
    };

    // DECREASE
    const handleDecrease = (id) => {
        const updated = cartItems.map((item) =>
            item.id === id
                ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
                : item
        );
        setCartItems(updated);
        updateLocalStorage(updated);
    };

    // REMOVE WITH ANIMATION
    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            const updated = cartItems.filter((item) => item.id !== id);
            setCartItems(updated);
            updateLocalStorage(updated);
            setRemovingId(null);
        }, 200);
    };

    // TOTAL PRICE
    const totalPrice = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => acc + (Number(item.price) * item.qty),
            0
        );
    }, [cartItems]);

    // ITEM COUNT
    const itemCount = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.qty, 0);
    }, [cartItems]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="
                    absolute inset-0 
                    bg-black/50 
                    backdrop-blur-sm
                    transition-opacity
                    duration-300
                "
                onClick={onClose}
            />

            <div 
                className="
                    relative
                    bg-gradient-to-b
                    from-[#F6F4F1]
                    to-[#f0ece8]
                    w-full
                    md:max-w-2xl
                    rounded-t-[32px] 
                    md:rounded-3xl
                    p-4 
                    md:p-6
                    space-y-5
                    max-h-[90vh]
                    overflow-y-auto
                    shadow-2xl
                    animate-slide-up
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <span className="text-2xl md:text-3xl">🛒</span>
                            {cartItems.length > 0 && (
                                <span className="
                                    absolute -top-2 -right-2
                                    bg-red-500 text-white
                                    text-xs rounded-full
                                    w-5 h-5 flex items-center justify-center
                                    font-bold
                                ">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Keranjang Belanja
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            text-2xl
                            text-gray-400
                            hover:text-gray-600
                            transition-colors
                            w-10 h-10
                            flex items-center justify-center
                            rounded-full
                            hover:bg-gray-200
                        "
                    >
                        ✕
                    </button>
                </div>

                {/* EMPTY STATE */}
                {cartItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Keranjang Kosong
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Yuk, tambahkan menu favoritmu!
                        </p>
                        <button
                            onClick={onClose}
                            className="
                                px-6 py-2 
                                bg-[#2F5231] 
                                text-white 
                                rounded-lg
                                hover:bg-[#1e3a20]
                                transition-colors
                            "
                        >
                            Lihat Menu
                        </button>
                    </div>
                )}

                {/* ITEMS LIST */}
                <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                    {cartItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`
                                bg-white
                                rounded-2xl
                                p-3
                                md:p-4
                                flex
                                gap-3
                                md:gap-4
                                border
                                border-gray-100
                                shadow-sm
                                hover:shadow-md
                                transition-all
                                duration-300
                                ${removingId === item.id ? 'animate-fade-out' : 'animate-fade-in'}
                            `}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* IMAGE */}
                            <div className="relative">
                                <img
                                    src={`${baseImageUrl}${item.image_url}`}
                                    alt={item.name}
                                    className="
                                        w-20 h-20
                                        md:w-28 md:h-28
                                        rounded-xl
                                        object-cover
                                        bg-gray-100
                                    "
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/112x112?text=No+Image";
                                    }}
                                />
                                {/* Quantity badge on image for mobile */}
                                <div className="
                                    absolute -top-2 -right-2
                                    md:hidden
                                    bg-[#2F5231]
                                    text-white
                                    text-xs
                                    rounded-full
                                    w-6 h-6
                                    flex items-center justify-center
                                    font-bold
                                ">
                                    {item.qty}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-base md:text-xl font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="
                                                text-gray-400
                                                hover:text-red-500
                                                transition-colors
                                                text-lg
                                                ml-2
                                                hidden md:block
                                            "
                                            title="Hapus item"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <p className="text-sm md:text-lg text-[#2F5231] font-bold mt-1">
                                        Rp{Number(item.price).toLocaleString("id-ID")}
                                    </p>
                                    
                                    {/* Mobile subtotal */}
                                    <p className="text-xs text-gray-400 md:hidden mt-1">
                                        Subtotal: Rp{(Number(item.price) * item.qty).toLocaleString("id-ID")}
                                    </p>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center justify-between mt-3">
                                    {/* QUANTITY CONTROLLER */}
                                    <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-xl p-1">
                                        <button
                                            onClick={() => handleDecrease(item.id)}
                                            className="
                                                w-8 h-8 md:w-10 md:h-10
                                                rounded-lg
                                                bg-[#2F5231]
                                                text-white
                                                text-lg md:text-xl
                                                font-bold
                                                hover:bg-[#1e3a20]
                                                transition-colors
                                                flex items-center justify-center
                                            "
                                        >
                                            -
                                        </button>

                                        <span className="
                                            text-base md:text-xl 
                                            font-semibold 
                                            text-gray-800 
                                            w-6 text-center
                                        ">
                                            {item.qty}
                                        </span>

                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="
                                                w-8 h-8 md:w-10 md:h-10
                                                rounded-lg
                                                bg-[#2F5231]
                                                text-white
                                                text-lg md:text-xl
                                                font-bold
                                                hover:bg-[#1e3a20]
                                                transition-colors
                                                flex items-center justify-center
                                            "
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Desktop price */}
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm text-gray-400">Subtotal</p>
                                        <p className="text-lg font-bold text-[#2F5231]">
                                            Rp{(Number(item.price) * item.qty).toLocaleString("id-ID")}
                                        </p>
                                    </div>

                                    {/* Mobile remove button */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="
                                            md:hidden
                                            text-red-500 
                                            text-sm 
                                            font-medium
                                            px-3 py-1
                                            rounded-lg
                                            bg-red-50
                                            hover:bg-red-100
                                            transition-colors
                                        "
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER - CHECKOUT */}
                {cartItems.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 space-y-4 animate-fade-in-up">
                        {/* Summary Cards */}
                        <div className="bg-white rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Total Items</span>
                                <span className="font-semibold">{itemCount} item(s)</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold">
                                    Rp{totalPrice.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (10%)</span>
                                <span className="font-semibold">
                                    Rp{Math.floor(totalPrice * 0.1).toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold">
                                    <span className="text-gray-800">Total</span>
                                    <span className="text-[#2F5231] text-2xl">
                                        Rp{Math.floor(totalPrice * 1.1).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const updated = [];
                                    setCartItems(updated);
                                    updateLocalStorage(updated);
                                }}
                                className="
                                    flex-1
                                    bg-gray-200
                                    text-gray-700
                                    py-3
                                    rounded-xl
                                    text-base
                                    font-medium
                                    hover:bg-gray-300
                                    transition-colors
                                "
                            >
                                Kosongkan
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate("/checkout");
                                }}
                                className="
                                    flex-[2]
                                    bg-[#2F5231]
                                    text-white
                                    py-3
                                    rounded-xl
                                    text-base
                                    md:text-lg
                                    font-semibold
                                    hover:bg-[#1e3a20]
                                    transition-all
                                    transform hover:scale-[1.02]
                                    active:scale-[0.98]
                                    shadow-lg
                                    hover:shadow-xl
                                    flex items-center justify-center gap-2
                                "
                            >
                                <span>✓</span>
                                Checkout
                                <span>→</span>
                            </button>
                        </div>

                        {/* Continue Shopping Link */}
                        <div className="text-center">
                            <button
                                onClick={onClose}
                                className="
                                    text-gray-400
                                    hover:text-[#2F5231]
                                    text-sm
                                    transition-colors
                                "
                            >
                                ← Lanjutkan Belanja
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                .animate-fade-out {
                    animation: fadeOut 0.2s ease-out forwards;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out;
                }
                
                /* Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2F5231;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #1e3a20;
                }
            `}</style>
        </div>
    );
}

export default ItemCart;