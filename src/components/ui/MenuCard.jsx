import { useState } from "react";
import imagePlaceholder from "../../assets/mdi--image-outline.svg";

function MenuCard({ item, onClick }) {
    const baseImageUrl = `${import.meta.env.VITE_API_URL}/storage/`;
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const formatPrice = (price) => {
        if (!price && price !== 0) return "Price not available";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const hasDiscount = item.final_price && Number(item.final_price) < Number(item.base_price);
    const discountType = item.discount_type;
    const discountPercentage = Number(item.discount_percentage);
    const discountAmount = Number(item.discount_amount);
    const finalPrice = Number(item.final_price || item.base_price);

    return (
        <div
            onClick={() => onClick?.(item)}
            className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] hover:border-[#2F5231]/20 transition-all duration-300 cursor-pointer w-full h-full flex flex-col"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {!imageError ? (
                    <img
                        src={`${baseImageUrl}${item.image_url}`}
                        alt={item.name || "Menu item"}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <img src={imagePlaceholder} alt="Placeholder" className="w-12 h-12 object-contain opacity-50" />
                    </div>
                )}
                
                {/* Badge - Optional */}
                {item.is_popular && (
                    <div className="absolute top-2 left-2 bg-[#2F5231] text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-md">
                        Populer
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-3 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#2F5231] transition-colors duration-200">
                    {truncateText(item.name, 35)}
                </h3>

                {/* Description - Optional */}
                {item.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[2rem]">
                        {truncateText(item.description, 40)}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-end justify-between gap-2">
                        <div>
                            {hasDiscount ? (
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <p className="text-xs text-gray-400 line-through">
                                        {formatPrice(item.base_price)}
                                    </p>

                                    {discountType === "percentage" && (
                                        <span className="text-[10px] font-semibold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
                                            -{discountPercentage}%
                                        </span>
                                    )}

                                    {discountType === "fixed" && (
                                        <span className="text-[10px] font-semibold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
                                            Hemat {formatPrice(discountAmount)}
                                        </span>
                                    )}
                                </div>
                            ) : null}

                            <p className="text-sm font-bold text-[#2F5231]">
                                {formatPrice(finalPrice)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuCard;
