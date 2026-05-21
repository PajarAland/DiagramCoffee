import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useBranch } from "../../context/useBranch";
import API from "../../services/api";
import MenuCard from "../../components/ui/MenuCard";

function Menu() {
    const navigate = useNavigate();
    const { selectedBranch } = useBranch();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();

    const [activeCategory, setActiveCategory]
        = useState(
            searchParams.get("category")
                || "Semua"
        );
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const branchId = selectedBranch;

                if (!branchId) {
                    setLoading(false);
                    return;
                }

                const [menuResponse, categoryResponse] =
                    await Promise.all([
                        API.get(
                            `/api/branches/${branchId}/menus`
                        ),
                        API.get("/api/categories"),
                    ]);

                setMenuItems(
                    menuResponse.data.data || []
                );

                setCategories([
                    {
                        id: "all",
                        name: "Semua",
                    },
                    ...(categoryResponse.data.data || []),
                ]);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [selectedBranch]);

    const filteredMenus = useMemo(() => {

        return menuItems.filter((item) => {

            const matchesCategory =
                activeCategory === "Semua"
                    ? true
                    : item.category === activeCategory;

            const matchesSearch =
                item.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            return matchesCategory && matchesSearch;

        });

    }, [menuItems, activeCategory, search]);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">

            {/* HEADER */}
            <section className="space-y-4">

                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#1E1E1E]">
                        Menu
                    </h1>

                    <p className="text-sm md:text-base text-gray-500 mt-1">
                        Temukan menu favoritmu
                    </p>
                </div>

                {/* SEARCH */}
                <div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Cari menu..."
                        className="
                            w-full
                            bg-white
                            border border-[#E5DED3]
                            rounded-2xl
                            px-4 py-3
                            outline-none
                            focus:border-[#2F5231]
                            transition-colors
                        "
                    />
                </div>

            </section>

            {/* CATEGORY */}
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

            {/* CONTENT */}
            <section>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="
                                    h-[220px]
                                    bg-white
                                    rounded-2xl
                                    animate-pulse
                                "
                            />
                        ))}

                    </div>
                ) : filteredMenus.length === 0 ? (
                    <div className="
                        bg-white
                        rounded-3xl
                        border border-[#ECE6DC]
                        p-10
                        text-center
                    ">
                        <p className="text-gray-400 text-sm md:text-base">
                            Menu tidak ditemukan.
                        </p>
                    </div>
                ) : (
                    <div className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-5
                        gap-4
                    ">

                        {filteredMenus.map((item) => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                onClick={(clickedItem) =>
                                    navigate(
                                        `/productdetail/${clickedItem.id}`
                                    )
                                }
                            />
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default Menu;