import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBranch } from "../../context/useBranch";
import API from "../../services/api.js";
import imagePlaceholder from "../../assets/mdi--image-outline.svg";
import MenuCard from "../../components/ui/MenuCard.jsx";

function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedBranch } = useBranch();
    const [imageError, setImageError] = useState(false);
    const [item, setItem] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const baseImageUrl = `${import.meta.env.VITE_API_URL}/storage/`;
    const branchId = selectedBranch;

    useEffect(() => {
        const load = async () => {
            try {
                if (!branchId) {
                    setLoading(false);
                    return;
                }

                const [detailRes, recoRes] = await Promise.all([
                    API.get(`/api/branches/${branchId}/menus/${id}`),
                    API.get(`/api/recommendations?branch_id=${branchId}&limit=5`),
                ]);

                const detail = detailRes.data.data;
                setItem(detail);

                const reco = recoRes.data.data;
                    

                const recommendations =
                    (
                        reco.hybrid?.length
                            ? reco.hybrid
                            : reco.popularity || []
                    )
                    .filter(
                        (menu) =>
                            menu.id !== detail.id
                    )
                    .slice(0, 5);

                setRecommended(
                    recommendations
                );

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, branchId]);

    const handleImageError = () => {
        setImageError(true);
    };

    const increaseQty = () => {
        if (
            item?.stock !== null &&
            qty >= item.stock
        ) {
            return;
        }
        setQty((prev) => prev + 1);
    };

    const decreaseQty = () => {
        if (qty <= 1) return;
        setQty((prev) => prev - 1);
    };

    const handleAddToCart = () => {

        const existingCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

        const existingItemIndex =
            existingCart.findIndex(
                (cartItem) =>
                    cartItem.id === item.id
            );

        const existingQty =
            existingItemIndex !== -1
                ? existingCart[
                    existingItemIndex
                ].qty
                : 0;

        const totalQty =
            existingQty + qty;

        if (
            item.stock != null &&
            totalQty > item.stock
        ) {

            alert(
                `Stok hanya tersisa ${item.stock}`
            );

            return;
        }

        if (existingItemIndex !== -1) {

            existingCart[
                existingItemIndex
            ].qty = totalQty;

        } else {

            existingCart.push({
                id: item.id,
                menu_item_id: item.id,
                name: item.name,
                image_url: item.image_url,

                base_price: basePrice,
                final_price: finalPrice,

                qty: qty,

                stock: item.stock,
            });
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(existingCart)
        );

        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 2000);
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
                    <p className="text-gray-500 text-lg">Menu tidak ditemukan di cabang ini</p>
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

    const hasDiscount = Boolean(item.is_promo_active);
    const basePrice = Number(item.base_price);
    const finalPrice = Number(item.final_price) || basePrice;
    const totalPrice = finalPrice * qty;

    return (
        <>
            {showAlert && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
                    <div className="bg-[#2F5231] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <span>Berhasil ditambahkan ke keranjang!</span>
                    </div>
                </div>
            )}
                <div className="px-4 py-8 md:px-8 md:py-12">
                    <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-start">

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
                                    <div
                                        className="
                                            w-full
                                            h-[320px]
                                            md:h-[520px]
                                            bg-gradient-to-br
                                            from-gray-100
                                            to-gray-200
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <img
                                            src={imagePlaceholder}
                                            alt="Placeholder"
                                            className="
                                                w-20
                                                h-20
                                                md:w-28
                                                md:h-28
                                                opacity-40
                                                drop-shadow-sm
                                            "
                                        />

                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 md:pt-0 space-y-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                                        {item.name}
                                    </h1>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-bold text-[#2F5231]">
                                        Rp{finalPrice.toLocaleString("id-ID")}
                                    </span>
                                    {hasDiscount ? (
                                        <span className="text-gray-400 line-through text-lg">
                                            Rp{basePrice.toLocaleString("id-ID")}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                        {item.description || "Nikmati kelezatan menu spesial ini yang dibuat dengan bahan-bahan terbaik dan resep istimewa dari chef kami."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-700">Jumlah Pesanan</p>
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
                                        disabled={
                                            item?.stock != null &&
                                            qty >= item.stock
                                        }
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
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                        "
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Harga ({qty} item)</span>
                                    <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span className="text-[#2F5231] text-xl">
                                        Rp{totalPrice.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>

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
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>

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
                                        onClick={(item) => {
                                            setLoading(true);
                                            navigate(`/productdetail/${item.id}`); 
                                        }}
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
        </>
    );
}

export default ProductDetail;