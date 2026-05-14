import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import MenuCard from "../components/ui/MenuCard.jsx";

function Home() {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState(null);

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [popularMenu, setPopularMenu] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    API.get("/api/menu-items"),
                    API.get("/api/categories"),
                ]);

                const menus = menuRes.data.data;
                const cats = catRes.data.data;

                setMenuItems(menus);
                setCategories(cats);

                // default active category
                if (cats.length > 0) {
                    setActiveCategory(cats[0].name);
                }

                // ambil menu pertama sebagai populer sementara
                if (menus.length > 0) {
                    setPopularMenu(menus[0]);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredItems = menuItems.filter(
        (item) => item.category?.name === activeCategory
    );

    return (
        <div>
            {/* HERO */}
            <section className="bg-[#2F5231] px-8 py-16 text-white">
                <h1 className="text-2xl font-bold leading-tight">
                    Temukan Kopi Favoritmu
                </h1>

                <p className="mt-6 text-sm text-white/90 leading-relaxed">
                    Nikmati rekomendasi menu yang sesuai dengan seleramu
                </p>
            </section>

            <main className="px-4 py-6 space-y-10 md:px-8">

                {/* LOADING */}
                {loading && (
                    <div className="text-center text-gray-500">
                        Loading...
                    </div>
                )}

                {!loading && (
                    <>
                        {/* POPULAR */}
                        <section className="space-y-5">

                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#222]">
                                    Pilihan Populer
                                </h2>

                                <p className="mt-2 text-md md:text-xl text-gray-500">
                                    Berdasarkan pesanan pengguna lain
                                </p>
                            </div>

                            {popularMenu && (
                                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                    <MenuCard
                                        item={popularMenu}
                                        onClick={(item) =>
                                            navigate(`/productdetail/${item.id}`)
                                        }
                                    />
                                </div>
                            )}

                        </section>

                        {/* CATEGORY */}
                        {/* <section className="flex gap-4 overflow-x-auto pb-2">

                            {categories.map((category) => {
                                const active =
                                    activeCategory === category.name;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveCategory(category.name)
                                        }
                                        className={`px-6 py-4 rounded-2xl border-2 whitespace-nowrap text-2xl font-semibold transition ${
                                            active
                                                ? "bg-[#2F5231] text-white border-[#2F5231]"
                                                : "border-[#2F5231] text-[#2F5231]"
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}

                        </section> */}

                        <section className="overflow-x-auto scrollbar-hide">

                            <div className="flex gap-3 w-max">

                                {categories.map((category) => {
                                    const active =
                                        activeCategory === category.name;

                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() =>
                                                setActiveCategory(category.name)
                                            }
                                            className={`
                                                px-5 py-2.5 rounded-2xl
                                                whitespace-nowrap
                                                text-sm font-medium
                                                transition-all duration-200
                                                border-2
                                                ${
                                                    active
                                                        ? "bg-[#2F5231] text-white border-[#2F5231]"
                                                        : "bg-white text-[#2F5231] border-[#D9D1C7]"
                                                }
                                            `}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}

                            </div>

                        </section>

                        {/* MENU */}
                        <section className="space-y-6">

                            <h2 className="text-2xl md:text-3xl font-bold text-[#222]">
                                Menu Pilihan
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {/* <div className="flex flex-wrap gap-4"> */}

                                {filteredItems.map((item) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        onClick={(item) =>
                                            navigate(`/productdetail/${item.id}`)
                                        }
                                    />
                                ))}

                            </div>

                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default Home;