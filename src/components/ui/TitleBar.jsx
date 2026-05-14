// import { useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/useAuth.jsx";

// import bookIcon from "../../assets/mdi--bookshelf-gold.svg";

// import ItemCart from "../ui/ItemCart.jsx";

// function TitleBar() {

//     const location = useLocation();

//     const [cartItems, setCartItems] = useState([]);
//     const [showCart, setShowCart] = useState(false);

//     const { user } = useAuth();

//     // LOAD CART
//     useEffect(() => {

//         const cart =
//             JSON.parse(localStorage.getItem("cart")) || [];

//         setCartItems(cart);

//     }, [location, showCart]);

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
//     const totalPrice = cartItems.reduce(
//         (acc, item) =>
//             acc + (item.base_price * item.qty),
//         0
//     );

//     return (
//         <>
//             <header className="bg-[#FDFBF8] px-6 py-4 flex justify-between items-center shadow-sm">

//                 {/* USER */}
//                 <div className="flex items-center gap-3">

//                     <span className="text-sm text-gray-700">
//                         {user?.name || "Customer"}
//                     </span>

//                     <div className="w-8 h-8 bg-[#2F5231] rounded-full"></div>

//                 </div>

//                 {/* CART BUTTON */}
//                 <button
//                     onClick={() => setShowCart(true)}
//                     className="w-14 h-14 rounded-2xl bg-[#2F5231] flex items-center justify-center relative"
//                 >

//                     <img
//                         src={bookIcon}
//                         alt="cart"
//                         className="w-7 h-7"
//                     />

//                     {cartItems.length > 0 && (
//                         <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-[20px] rounded-full flex items-center justify-center">
//                             {cartItems.length}
//                         </div>
//                     )}

//                 </button>

//             </header>

//             {/* MODAL */}
//             {showCart && (
//                 <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">

//                     <div className="bg-[#F6F4F1] w-full max-w-2xl rounded-3xl p-6 space-y-5 max-h-[80vh] overflow-y-auto">

//                         {/* HEADER */}
//                         <div className="flex items-center justify-between">

//                             <h2 className="text-3xl font-bold">
//                                 Keranjang
//                             </h2>

//                             <button
//                                 onClick={() => setShowCart(false)}
//                                 className="text-2xl"
//                             >
//                                 ✕
//                             </button>

//                         </div>

//                         {/* EMPTY */}
//                         {cartItems.length === 0 && (
//                             <div className="text-center py-10 text-gray-500">
//                                 Keranjang kosong
//                             </div>
//                         )}

//                         {/* ITEMS */}
//                         <div className="space-y-4">

//                             {cartItems.map((item) => (
//                                 <ItemCart
//                                     key={item.id}
//                                     item={item}
//                                     onIncrease={handleIncrease}
//                                     onDecrease={handleDecrease}
//                                     onRemove={handleRemove}
//                                 />
//                             ))}

//                         </div>

//                         {/* FOOTER */}
//                         {cartItems.length > 0 && (
//                             <div className="pt-4 border-t space-y-4">

//                                 <div className="flex justify-between text-xl font-semibold">

//                                     <span>Total</span>

//                                     <span>
//                                         Rp{totalPrice.toLocaleString("id-ID")}
//                                     </span>

//                                 </div>

//                                 <button className="w-full bg-[#2F5231] text-white py-4 rounded-2xl text-xl font-medium">
//                                     Checkout
//                                 </button>

//                             </div>
//                         )}

//                     </div>

//                 </div>
//             )}
//         </>
//     );
// }

// export default TitleBar;

import { useState } from "react";
import { useAuth } from "../../context/useAuth.jsx";
import cartIcon from "../../assets/mdi--cart.svg";
import ItemCart from "../ui/ItemCart.jsx";

function TitleBar() {

    const [showCart, setShowCart] = useState(false);

    const { user } = useAuth();

    return (
        <>
            {/* <header className="bg-[#FDFBF8] px-6 py-4 flex justify-between items-center shadow-sm"> */}
            <header className="
                sticky top-0 z-40
                bg-[#FFFFFF]/95 backdrop-blur-sm
                px-4 md:px-6 py-4
                flex justify-between items-center
                border-b border-[#E8E2D9]
            ">

                {/* USER */}
                <div className="flex items-center gap-3">

                    <span className="text-sm text-gray-700">
                        {user?.name || "Customer"}
                    </span>

                    <div className="w-8 h-8 bg-[#2F5231] rounded-full"></div>

                </div>

                {/* CART BUTTON */}
                {/* <button
                    onClick={() => setShowCart(true)}
                    className="w-14 h-14 rounded-2xl bg-[#2F5231] flex items-center justify-center relative"
                >

                    <img
                        src={cartIcon}
                        alt="cart"
                        className="w-7 h-7"
                    />

                </button> */}
                <button
                    onClick={() => setShowCart(true)}
                    className="
                        w-11 h-11 md:w-14 md:h-14
                        rounded-xl md:rounded-2xl
                        bg-[#2F5D34]
                        flex items-center justify-center
                        relative
                    "
                >

                    <img
                        src={cartIcon}
                        alt="cart"
                        className="w-6 h-6 md:w-7 md:h-7"
                    />

                </button>

            </header>

            {/* CART MODAL */}
            {showCart && (
                <ItemCart
                    onClose={() => setShowCart(false)}
                />
            )}
        </>
    );
}

export default TitleBar;