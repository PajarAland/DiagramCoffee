// function MenuCard({ item }) {

//     const baseImageUrl = "http://localhost:8000/storage/";

//     return (
//         <div className="bg-white rounded-3xl overflow-hidden border w-full max-w-[280px]">
//             <img
//             src={`${baseImageUrl}${item.image_url}`}
//             alt={item.name}
//             className="w-full h-48 object-cover"
//         />

//             <div className="p-4">
//                 <h3 className="text-xl font-medium">
//                     {item.name}
//                 </h3>

//                 <p className="text-lg mt-2">
//                     Rp{item.base_price.toLocaleString("id-ID")}
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default MenuCard;

// function MenuCard({ item, onClick }) {

//     const baseImageUrl = "http://localhost:8000/storage/";

//     return (
//         <button
//             onClick={() => onClick?.(item)}
//             className="bg-white rounded-3xl overflow-hidden border w-full max-w-[280px] text-left hover:scale-[1.02] transition"
//         >
//             <img
//                 src={`${baseImageUrl}${item.image_url}`}
//                 alt={item.name}
//                 className="w-full h-48 object-cover"
//             />

//             <div className="p-4">
//                 <h3 className="text-xl font-medium">
//                     {item.name}
//                 </h3>

//                 <p className="text-lg mt-2">
//                     Rp{item.base_price.toLocaleString("id-ID")}
//                 </p>
//             </div>
//         </button>
//     );
// }

// export default MenuCard;

import { useState } from "react";
import imagePlaceholder from "../../assets/mdi--image-outline.svg";

function MenuCard({ item, onClick }) {
    const baseImageUrl = "http://localhost:8000/storage/";
    const [imageError, setImageError] = useState(false);
    // const [isHovered, setIsHovered] = useState(false);

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

    return (
        // <div
        //     onClick={() => onClick?.(item)}
        //     className="bg-white rounded-2xl overflow-hidden border w-full 
        //     max-w-[190px] min-h-[175px] lg:max-w-[280px] min-w-[160px] text-left 
        //     hover:scale-[1.02] transition cursor-pointer"
        // >
        <div
            onClick={() => onClick?.(item)}
            className="bg-white rounded-2xl overflow-hidden border w-full 
            min-h-[175px] text-left 
            hover:scale-[1.02] transition cursor-pointer"
        >
            <div className="relative overflow-hidden bg-gray-100">
                {!imageError ? (
                    <img
                        src={`${baseImageUrl}${item.image_url}`}
                        alt={item.name || "Menu item"}
                        className="w-full h-28 object-cover"
                        onError={handleImageError}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-28 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <img 
                            src={imagePlaceholder} 
                            alt="Placeholder" 
                            className="w-12 h-12 object-cover" 
                        />
                    </div>
                )}
            </div>

            <div className="p-2 space-y-2">
                <h3 className="pt-3 text-sm font-medium">
                    {truncateText(item.name, 35)}
                </h3>

                <div className="pt-2 pb-7 flex items-center justify-between border-t border-gray-100">
                    <p className="text-xs text-[#2F5231]">
                        {formatPrice(item.base_price)}
                    </p>
                </div>
            </div>

            
        </div>
    );
}

export default MenuCard;

// import { useState } from "react";

// function MenuCard({ item, onClick }) {
//     const baseImageUrl = "http://localhost:8000/storage/";
//     const [imageError, setImageError] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);

//     // Fallback image or placeholder when image fails to load
//     const handleImageError = () => {
//         setImageError(true);
//     };

//     // Format price with better handling
//     const formatPrice = (price) => {
//         if (!price && price !== 0) return "Price not available";
//         return new Intl.NumberFormat("id-ID", {
//             style: "currency",
//             currency: "IDR",
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(price);
//     };

//     // Truncate long names
//     const truncateText = (text, maxLength = 30) => {
//         if (!text) return "";
//         return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
//     };

//     // Get status color and text
//     const getStatusInfo = () => {
//         if (item.is_active === undefined && item.status === undefined) return null;
        
//         const isActive = item.is_active === 1 || item.is_active === true || item.status === "active";
        
//         return {
//             text: isActive ? "Active" : "Inactive",
//             bgColor: isActive ? "bg-green-100" : "bg-red-100",
//             textColor: isActive ? "text-green-800" : "text-red-800",
//         };
//     };

//     const statusInfo = getStatusInfo();

//     return (
//         <div
//             onClick={() => onClick?.(item)}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//             className={`
//                 group bg-white rounded-2xl overflow-hidden border 
//                 w-full max-w-[320px] mx-auto text-left 
//                 transition-all duration-300 cursor-pointer
//                 hover:shadow-xl hover:scale-[1.02] hover:border-[#2F5231]/20
//                 ${isHovered ? 'shadow-lg' : 'shadow-sm'}
//             `}
//         >
//             {/* Image Container with overlay effect */}
//             <div className="relative overflow-hidden bg-gray-100">
//                 {!imageError ? (
//                     <img
//                         src={`${baseImageUrl}${item.image_url}`}
//                         alt={item.name || "Menu item"}
//                         className={`
//                             w-full h-48 object-cover 
//                             transition-transform duration-500 
//                             ${isHovered ? 'scale-110' : 'scale-100'}
//                         `}
//                         onError={handleImageError}
//                         loading="lazy" // Lazy load images for better performance
//                     />
//                 ) : (
//                     <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                         <svg 
//                             className="w-12 h-12 text-gray-400" 
//                             fill="none" 
//                             stroke="currentColor" 
//                             viewBox="0 0 24 24"
//                         >
//                             <path 
//                                 strokeLinecap="round" 
//                                 strokeLinejoin="round" 
//                                 strokeWidth={2} 
//                                 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//                             />
//                         </svg>
//                     </div>
//                 )}
                
//                 {/* Status Badge (if status info exists) */}
//                 {statusInfo && (
//                     <div className={`
//                         absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium
//                         ${statusInfo.bgColor} ${statusInfo.textColor}
//                         backdrop-blur-sm bg-opacity-90
//                         transition-transform duration-200
//                         ${isHovered ? 'translate-x-0' : ''}
//                     `}>
//                         {statusInfo.text}
//                     </div>
//                 )}
//             </div>

//             {/* Content Container */}
//             <div className="p-4 space-y-2">
//                 <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
//                     {truncateText(item.name, 35)}
//                 </h3>
                
//                 {/* Category (if available) */}
//                 {item.category_name && (
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                         {item.category_name}
//                     </p>
//                 )}
                
//                 {/* Description (optional) */}
//                 {item.description && (
//                     <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
//                         {truncateText(item.description, 60)}
//                     </p>
//                 )}
                
//                 {/* Price Section */}
//                 <div className="pt-2 flex items-center justify-between border-t border-gray-100">
//                     <div>
//                         <p className="text-xs text-gray-500">Price</p>
//                         <p className="text-xl font-bold text-[#2F5231]">
//                             {formatPrice(item.base_price)}
//                         </p>
//                     </div>
                    
//                     {/* Quick action indicator */}
//                     <div className={`
//                         w-8 h-8 rounded-full bg-[#2F5231] text-white 
//                         flex items-center justify-center
//                         transition-all duration-300
//                         ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
//                     `}>
//                         <svg 
//                             className="w-4 h-4" 
//                             fill="none" 
//                             stroke="currentColor" 
//                             viewBox="0 0 24 24"
//                         >
//                             <path 
//                                 strokeLinecap="round" 
//                                 strokeLinejoin="round" 
//                                 strokeWidth={2} 
//                                 d="M9 5l7 7-7 7" 
//                             />
//                         </svg>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MenuCard;