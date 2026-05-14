// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import API from "../services/api";
// // import imagePlaceholder from "../assets/mdi--image-outline.svg";
// // import MenuCard from "../components/ui/MenuCard.jsx";

// // function ProductDetail() {
// //     const navigate = useNavigate();
// //     const { id } = useParams();
// //     const [imageError, setImageError] = useState(false);
// //     const [item, setItem] = useState(null);
// //     const [recommended, setRecommended] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [qty, setQty] = useState(1);
// //     const baseImageUrl = "http://localhost:8000/storage/";

// //     useEffect(() => {
// //         const load = async () => {
// //             try {
// //                 const [detailRes, menuRes] = await Promise.all([
// //                     API.get(`/api/menu-items/${id}`),
// //                     API.get("/api/menu-items"),
// //                 ]);

// //                 const detail = detailRes.data.data;

// //                 setItem(detail);

// //                 // rekomendasi sementara ambil menu selain item ini
// //                 const recommendations = menuRes.data.data
// //                     .filter((menu) => menu.id !== detail.id)
// //                     .slice(0, 5);

// //                 setRecommended(recommendations);

// //             } catch (err) {
// //                 console.error(err);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         load();
// //     }, [id]);

// //     const handleImageError = () => {
// //         setImageError(true);
// //     };

// //     const increaseQty = () => {
// //         setQty((prev) => prev + 1);
// //     };

// //     const decreaseQty = () => {
// //         if (qty <= 1) return;

// //         setQty((prev) => prev - 1);
// //     };

// //     if (loading) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 Loading...
// //             </div>
// //         );
// //     }

// //     if (!item) {
// //         return (
// //             <div className="p-8 text-center text-gray-500">
// //                 Menu tidak ditemukan
// //             </div>
// //         );
// //     }

// //     const handleAddToCart = () => {
// //         const existingCart =
// //             JSON.parse(localStorage.getItem("cart")) || [];

// //         const existingItemIndex = existingCart.findIndex(
// //             (cartItem) => cartItem.id === item.id
// //         );

// //         // kalau item sudah ada di cart
// //         if (existingItemIndex !== -1) {

// //             existingCart[existingItemIndex].qty += qty;

// //         } else {

// //             // item baru
// //             existingCart.push({
// //                 id: item.id,
// //                 menu_item_id: item.id,
// //                 name: item.name,
// //                 image_url: item.image_url,
// //                 base_price: item.base_price,
// //                 qty: qty,
// //             });

// //         }

// //         localStorage.setItem(
// //             "cart",
// //             JSON.stringify(existingCart)
// //         );

// //         alert("Berhasil ditambahkan ke keranjang");
// //     };

// //     return (
// //         <>
// //             <div className="h-[340px] md:h-[520px] overflow-hidden">
// //                 {!imageError ? (
// //                     <img
// //                         src={`${baseImageUrl}${item.image_url}`}
// //                         alt={item.name}
// //                         className="w-full h-full object-cover"
// //                         onError={handleImageError}
// //                     />
// //                 ) : (
// //                     <img 
// //                         src={imagePlaceholder} 
// //                         alt="Placeholder" 
// //                         className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 object-cover" 
// //                     />
// //                 )}
// //             </div>

// //             {/* CONTENT */}
// //             {/* <div className="bg-red-500 rounded-t-[48px] -mt-12 relative z-20 px-8 py-8 space-y-8"> */}
// //             <div className="px-4 py-6 md:px-8 md:py-8 space-y-6">

// //                 {/* TITLE */}
// //                 <div className="space-y-4">

// //                     <h2 className="text-3xl md:text-5xl font-semibold text-[#1E1E1E] leading-tight">
// //                         {item.name}
// //                     </h2>

// //                     <p className="text-xl md:text-3xl font-medium text-[#2F5231]">
// //                         Rp{Number(item.base_price).toLocaleString("id-ID")}
// //                     </p>

// //                     <p className="text-base md:text-2xl text-gray-500 leading-relaxed">
// //                         {item.description}
// //                     </p>

// //                 </div>

// //                 {/* QTY */}
// //                 <div className="flex items-center gap-4">

// //                     {/* <button
// //                         onClick={decreaseQty}
// //                         className="w-16 h-16 rounded-2xl bg-[#2F5231] text-white text-4xl flex items-center justify-center"
// //                     >
// //                         -
// //                     </button> */}

// //                     <button
// //                         onClick={decreaseQty}
// //                         className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-4xl rounded-2xl bg-[#2F5231] text-white flex items-center justify-center"
// //                     >
// //                         -
// //                     </button>

// //                     <span className="text-xl md:text-3xl font-medium w-10 text-center">
// //                         {qty}
// //                     </span>

// //                     {/* <button
// //                         onClick={increaseQty}
// //                         className="w-16 h-16 rounded-2xl bg-[#2F5231] text-white text-4xl flex items-center justify-center"
// //                     >
// //                         +
// //                     </button> */}

// //                     <button
// //                         onClick={increaseQty}
// //                         className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-4xl rounded-2xl bg-[#2F5231] text-white flex items-center justify-center"
// //                     >
// //                         +
// //                     </button>

// //                 </div>

// //                 {/* BUTTON */}
// //                 {/* <button
// //                     onClick={handleAddToCart}
// //                     className="w-full bg-[#2F5231] text-white py-6 rounded-3xl text-3xl font-medium"
// //                 >
// //                     Tambah ke Keranjang
// //                 </button> */}

// //                 <button
// //                     onClick={handleAddToCart}
// //                     className="w-full bg-[#2F5231] text-white py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-3xl font-medium"
// //                 >
// //                     Tambah ke Keranjang
// //                 </button>

// //                 {/* RECOMMENDATION */}
// //                 <section className="space-y-6 pt-6">

// //                     <div>
// //                         <h3 className="text-2xl md:text-5xl font-bold text-black">
// //                             Sering Dipesan Bersama
// //                         </h3>

// //                         <p className="mt-3 text-sm md:text-2xl text-gray-500">
// //                             Rekomendasi berdasarkan menu yang sedang dilihat
// //                         </p>
// //                     </div>

// //                     <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">

// //                         {recommended.map((menu) => (
// //                             <div
// //                                 key={menu.id}
// //                             >
// //                                 <MenuCard
// //                                     item={menu}
// //                                     onClick={(item) =>
// //                                         navigate(`/menu/${item.id}`)
// //                                     }
// //                                 />
// //                             </div>
// //                         ))}

// //                     </div>

// //                 </section>

// //             </div>
// //         </>
// //     );
// // }

// // export default ProductDetail;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../services/api";
// import imagePlaceholder from "../assets/mdi--image-outline.svg";
// import MenuCard from "../components/ui/MenuCard.jsx";

// function ProductDetail() {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [imageError, setImageError] = useState(false);
//     const [item, setItem] = useState(null);
//     const [recommended, setRecommended] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [qty, setQty] = useState(1);
//     const baseImageUrl = "http://localhost:8000/storage/";

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const [detailRes, menuRes] = await Promise.all([
//                     API.get(`/api/menu-items/${id}`),
//                     API.get("/api/menu-items"),
//                 ]);

//                 const detail = detailRes.data.data;

//                 setItem(detail);

//                 // rekomendasi sementara ambil menu selain item ini
//                 const recommendations = menuRes.data.data
//                     .filter((menu) => menu.id !== detail.id)
//                     .slice(0, 5);

//                 setRecommended(recommendations);

//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         load();
//     }, [id]);

//     const handleImageError = () => {
//         setImageError(true);
//     };

//     const increaseQty = () => {
//         setQty((prev) => prev + 1);
//     };

//     const decreaseQty = () => {
//         if (qty <= 1) return;

//         setQty((prev) => prev - 1);
//     };

//     if (loading) {
//         return (
//             <div className="p-8 text-center text-gray-500">
//                 Loading...
//             </div>
//         );
//     }

//     if (!item) {
//         return (
//             <div className="p-8 text-center text-gray-500">
//                 Menu tidak ditemukan
//             </div>
//         );
//     }

//     const handleAddToCart = () => {
//         const existingCart =
//             JSON.parse(localStorage.getItem("cart")) || [];

//         const existingItemIndex = existingCart.findIndex(
//             (cartItem) => cartItem.id === item.id
//         );

//         // kalau item sudah ada di cart
//         if (existingItemIndex !== -1) {

//             existingCart[existingItemIndex].qty += qty;

//         } else {

//             // item baru
//             existingCart.push({
//                 id: item.id,
//                 menu_item_id: item.id,
//                 name: item.name,
//                 image_url: item.image_url,
//                 base_price: item.base_price,
//                 qty: qty,
//             });

//         }

//         localStorage.setItem(
//             "cart",
//             JSON.stringify(existingCart)
//         );

//         alert("Berhasil ditambahkan ke keranjang");
//     };

//     return (
//         <>
//             <div className="px-4 py-6 md:px-8 md:py-10">
//                 <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-10 lg:gap-16 items-start">

//                     {/* IMAGE */}
//                     <div className="overflow-hidden rounded-xl">
//                         {!imageError ? (
//                             <img
//                                 src={`${baseImageUrl}${item.image_url}`}
//                                 alt={item.name}
//                                 className="
//                                     w-full
//                                     h-[320px]
//                                     md:h-[520px]
//                                     object-cover
//                                 "
//                                 onError={handleImageError}
//                             />
//                         ) : (
//                             <img
//                                 src={imagePlaceholder}
//                                 alt="Placeholder"
//                                 className="
//                                     w-full
//                                     h-[320px]
//                                     md:h-[520px]
//                                     bg-gradient-to-br
//                                     from-gray-200
//                                     to-gray-300
//                                     object-cover
//                                 "
//                             />
//                         )}

//                     </div>

//                     {/* CONTENT */}
//                     <div className="pt-6 md:pt-0 space-y-6">

//                         {/* TITLE */}
//                         <div className="space-y-4">

//                             <h2 className="text-3xl md:text-5xl font-semibold text-[#1E1E1E] leading-tight">
//                                 {item.name}
//                             </h2>

//                             <p className="text-xl md:text-3xl font-medium text-[#2F5231]">
//                                 Rp{Number(item.base_price).toLocaleString("id-ID")}
//                             </p>

//                             <p className="text-base md:text-xl text-gray-500 leading-relaxed">
//                                 {item.description}
//                             </p>

//                         </div>

//                         {/* QTY */}
//                         <div className="flex items-center gap-4">

//                             <button
//                                 onClick={decreaseQty}
//                                 className="
//                                     w-12 h-12 md:w-14 md:h-14
//                                     text-2xl
//                                     rounded-2xl
//                                     bg-[#2F5231]
//                                     text-white
//                                     flex items-center justify-center
//                                 "
//                             >
//                                 -
//                             </button>

//                             <span className="text-xl md:text-2xl font-medium w-10 text-center">
//                                 {qty}
//                             </span>

//                             <button
//                                 onClick={increaseQty}
//                                 className="
//                                     w-12 h-12 md:w-14 md:h-14
//                                     text-2xl
//                                     rounded-2xl
//                                     bg-[#2F5231]
//                                     text-white
//                                     flex items-center justify-center
//                                 "
//                             >
//                                 +
//                             </button>
//                         </div>

//                         {/* BUTTON */}
//                         <button
//                             onClick={handleAddToCart}
//                             className="
//                                 w-full
//                                 bg-[#2F5231]
//                                 text-white
//                                 py-4 md:py-5
//                                 rounded-2xl
//                                 text-lg md:text-xl
//                                 font-medium
//                             "
//                         >
//                             Tambah ke Keranjang
//                         </button>
//                     </div>
//                 </div>

//             </div>

//             {/* RECOMMENDATION */}
//             <div className="px-4 py-6 md:px-8 md:py-8 space-y-6">
//                 <section className="space-y-6 pt-6">
//                     <div>
//                         <h3 className="text-2xl md:text-5xl font-bold text-black">
//                             Sering Dipesan Bersama
//                         </h3>

//                         <p className="mt-3 text-sm md:text-2xl text-gray-500">
//                             Rekomendasi berdasarkan menu yang sedang dilihat
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">

//                         {recommended.map((menu) => (
//                             <div
//                                 key={menu.id}
//                             >
//                                 <MenuCard
//                                     item={menu}
//                                     onClick={(item) =>
//                                         navigate(`/menu/${item.id}`)
//                                     }
//                                 />
//                             </div>
//                         ))}

//                     </div>

//                 </section>

//             </div>
                

//         </>
//     );
// }

// export default ProductDetail;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import imagePlaceholder from "../assets/mdi--image-outline.svg";
import MenuCard from "../components/ui/MenuCard.jsx";

function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageError, setImageError] = useState(false);
    const [item, setItem] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const baseImageUrl = "http://localhost:8000/storage/";

    useEffect(() => {
        const load = async () => {
            try {
                const [detailRes, menuRes] = await Promise.all([
                    API.get(`/api/menu-items/${id}`),
                    API.get("/api/menu-items"),
                ]);

                const detail = detailRes.data.data;
                setItem(detail);

                const recommendations = menuRes.data.data
                    .filter((menu) => menu.id !== detail.id)
                    .slice(0, 5);

                setRecommended(recommendations);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleImageError = () => {
        setImageError(true);
    };

    const increaseQty = () => {
        setQty((prev) => prev + 1);
    };

    const decreaseQty = () => {
        if (qty <= 1) return;
        setQty((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = existingCart.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].qty += qty;
        } else {
            existingCart.push({
                id: item.id,
                menu_item_id: item.id,
                name: item.name,
                image_url: item.image_url,
                base_price: item.base_price,
                qty: qty,
            });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-gray-500 text-lg">Menu tidak ditemukan</p>
                    <button
                        onClick={() => navigate("/menu")}
                        className="mt-4 px-6 py-2 bg-[#2F5231] text-white rounded-lg hover:bg-[#1e3a20] transition-colors"
                    >
                        Lihat Menu Lain
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toast Alert */}
            {showAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
                    <div className="bg-[#2F5231] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <span>✓</span>
                        <span>Berhasil ditambahkan ke keranjang!</span>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <div className="px-4 py-8 md:px-8 md:py-12">
                    <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-start">

                        {/* IMAGE SECTION */}
                        <div className="relative group">
                            <div className="overflow-hidden rounded-2xl shadow-xl bg-gray-100">
                                {!imageError ? (
                                    <img
                                        src={`${baseImageUrl}${item.image_url}`}
                                        alt={item.name}
                                        className="
                                            w-full
                                            h-[320px]
                                            md:h-[520px]
                                            object-cover
                                            transition-transform
                                            duration-500
                                            group-hover:scale-105
                                        "
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <img
                                        src={imagePlaceholder}
                                        alt="Placeholder"
                                        className="
                                            w-full
                                            h-[320px]
                                            md:h-[520px]
                                            bg-gradient-to-br
                                            from-gray-200
                                            to-gray-300
                                            object-contain
                                            p-8
                                        "
                                    />
                                )}
                            </div>
                            {/* Badge */}
                            {/* <div className="absolute top-4 left-4 bg-[#2F5231] text-white px-3 py-1 rounded-full text-sm font-medium">
                                Populer
                            </div> */}
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="pt-8 md:pt-0 space-y-8">

                            {/* TITLE & DESCRIPTION */}
                            <div className="space-y-4">
                                <div>
                                    {/* <span className="text-sm text-[#2F5231] font-medium uppercase tracking-wide">
                                        Menu Spesial
                                    </span> */}
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                                        {item.name}
                                    </h1>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-bold text-[#2F5231]">
                                        Rp{Number(item.base_price).toLocaleString("id-ID")}
                                    </span>
                                    <span className="text-gray-400 line-through text-lg">
                                        Rp{Number(item.base_price * 1.2).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                        {item.description || "Nikmati kelezatan menu spesial ini yang dibuat dengan bahan-bahan terbaik dan resep istimewa dari chef kami."}
                                    </p>
                                </div>
                            </div>

                            {/* QUANTITY SELECTOR */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-700">Jumlah Pesanan</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={decreaseQty}
                                        disabled={qty <= 1}
                                        className="
                                            w-12 h-12 md:w-14 md:h-14
                                            text-2xl
                                            rounded-xl
                                            bg-gray-100
                                            text-gray-700
                                            flex items-center justify-center
                                            hover:bg-gray-200
                                            transition-all
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            font-bold
                                        "
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl md:text-3xl font-semibold text-gray-900 w-12 text-center">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={increaseQty}
                                        className="
                                            w-12 h-12 md:w-14 md:h-14
                                            text-2xl
                                            rounded-xl
                                            bg-[#2F5231]
                                            text-white
                                            flex items-center justify-center
                                            hover:bg-[#1e3a20]
                                            transition-all
                                            transform hover:scale-105
                                            font-bold
                                        "
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* PRICE SUMMARY */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Harga ({qty} item)</span>
                                    <span>Rp{(Number(item.base_price) * qty).toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span className="text-[#2F5231] text-xl">
                                        Rp{(Number(item.base_price) * qty).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

                            {/* ADD TO CART BUTTON */}
                            <button
                                onClick={handleAddToCart}
                                className="
                                    w-full
                                    bg-[#2F5231]
                                    text-white
                                    py-4
                                    rounded-xl
                                    text-lg
                                    font-semibold
                                    hover:bg-[#1e3a20]
                                    transition-all
                                    transform hover:scale-[1.02]
                                    active:scale-[0.98]
                                    shadow-lg
                                    hover:shadow-xl
                                "
                            >
                                🛒 Tambah ke Keranjang
                            </button>

                            {/* Additional Info */}
                            {/* <div className="flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Bahan segar</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Proses higienis</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>✓</span>
                                    <span>Ready stock</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* RECOMMENDATION SECTION */}
                <div className="bg-gray-50 mt-8">
                    <div className="px-4 py-12 md:px-8 max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Sering Dipesan Bersama
                            </h3>
                            <p className="text-gray-500 text-lg">
                                Rekomendasi berdasarkan menu yang sedang dilihat
                            </p>
                            <div className="w-24 h-1 bg-[#2F5231] mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                            {recommended.map((menu, index) => (
                                <div
                                    key={menu.id}
                                    className="transform transition-all duration-300 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <MenuCard
                                        item={menu}
                                        onClick={(item) =>
                                            navigate(`/menu/${item.id}`)
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        {recommended.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                Belum ada rekomendasi
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -100%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default ProductDetail;