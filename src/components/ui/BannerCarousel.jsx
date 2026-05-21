import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import API from "../../services/api";

function BannerCarousel() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseImageUrl = `${import.meta.env.VITE_API_URL}/storage/`;

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await API.get("/api/banners");
                setBanners(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        void fetchBanners();
    }, []);

    if (loading) {
        return <div className="w-full aspect-[3/1] rounded-lg bg-gray-200 animate-pulse" />;
    }

    if (!banners.length) {
        return null;
    }

    return (
        <div className="rounded-lg overflow-hidden shadow-2xl">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="aspect-[3/1] w-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-full">
                            <img
                                src={`${baseImageUrl}${banner.image_url}`}
                                alt={banner.title}
                                fetchPriority="high"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default BannerCarousel;