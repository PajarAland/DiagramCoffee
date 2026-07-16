import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../context/useBranch";
import API from "../../services/api.js";
import MenuCard from "../../components/ui/MenuCard.jsx";
import BannerCarousel from "../../components/ui/BannerCarousel.jsx";

function Home() {
    const navigate = useNavigate();
    const { selectedBranch } = useBranch();
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState({ popularity: [], ibcf: [], hybrid: [] });

    useEffect(() => {
    const loadRecommendations = async (branchId) => {
        try {
            const { data } = await API.get(
                `/api/recommendations?branch_id=${branchId}&limit=6`
            );

            const reco = data.data || {};

            setRecommendations({
                popularity: reco.popularity || [],
                ibcf: reco.ibcf || [],
                hybrid: reco.hybrid || [],
            });
        } catch (err) {
            console.error("Recommendation error:", err);

            setRecommendations({
                popularity: [],
                ibcf: [],
                hybrid: [],
            });
        }
    };

    const load = async () => {
        try {
            if (!selectedBranch) {
                setLoading(false);
                return;
            }

            // Only wait for the data needed to render the page
            const [menuRes, catRes] = await Promise.all([
                API.get(`/api/branches/${selectedBranch}/menus`),
                API.get("/api/categories"),
            ]);

            const menus = menuRes.data.data;
            const cats = catRes.data.data;

            setMenuItems(menus);
            setCategories(cats);

            if (cats.length > 0) {
                setActiveCategory(cats[0].name);
            }

            // Home page is ready
            setLoading(false);

            // Load recommendations in the background
            loadRecommendations(selectedBranch);

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    load();
}, [selectedBranch]);

    const filteredItems = menuItems.filter((item) => item.category === activeCategory);

    return (
        <div className="min-h-screen">
            <section className="px-4 pt-4 md:px-8 max-w-4xl mx-auto">
                <BannerCarousel />
            </section>

            <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-[#2F5231] border-t-transparent"></div>
                            <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                        </div>
                    </div>
                )}

                {!loading && (
                    <>
                        {recommendations.popularity.length > 0 && (
                            <section className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Popular Right Now</h2>
                                    <p className="text-sm text-gray-500 mt-1">Menu paling populer di cabang ini</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recommendations.popularity.map((item) => (
                                        <MenuCard
                                            key={item.id}
                                            item={item}
                                            onClick={(item) => navigate(`/productdetail/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recommendations.ibcf.length > 0 && (
                            <section className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
                                    <p className="text-sm text-gray-500 mt-1">Rekomendasi personal berdasarkan aktivitasmu</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recommendations.ibcf.map((item) => (
                                        <MenuCard
                                            key={item.id}
                                            item={item}
                                            onClick={(item) => navigate(`/productdetail/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recommendations.hybrid.length > 0 && (
                            <section className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Yours and others fav's</h2>
                                    <p className="text-sm text-gray-500 mt-1">Favoritmu dan yang paling hits</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recommendations.hybrid.map((item) => (
                                        <MenuCard
                                            key={item.id}
                                            item={item}
                                            onClick={(item) => navigate(`/productdetail/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                    Kategori Menu
                                </h2>
                                <button
                                    onClick={() => navigate(`/menu?category=${activeCategory}`)}
                                    className="text-sm font-medium text-[#2F5231] hover:text-[#1f3a21] transition-colors"
                                >
                                    Lihat Selengkapnya →
                                </button>
                            </div>

                            <div className="overflow-x-auto scrollbar-hide pb-2">
                                <div className="flex gap-2 min-w-max">
                                    {categories.map((category) => {
                                        const active = activeCategory === category.name;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setActiveCategory(category.name)}
                                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
                                                    active 
                                                        ? "bg-[#2F5231] text-white shadow-md" 
                                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{activeCategory}</h2>
                                {filteredItems.length === 0 && <span className="text-xs text-gray-400">Tidak ada menu</span>}
                            </div>

                            {filteredItems.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {filteredItems.slice(0, 5).map((item) => (
                                        <MenuCard
                                            key={item.id}
                                            item={item}
                                            onClick={(item) => navigate(`/productdetail/${item.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl">
                                    <p className="text-gray-400 text-sm">
                                        Tidak ada menu di kategori {activeCategory}
                                    </p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default Home;