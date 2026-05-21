import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; 
import API from "../../services/api";
import ModalForm from "../../components/ui/ModalForm";
import Swal from "sweetalert2";

function BranchStock() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);       
    const [allMenus, setAllMenus] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [branchId, setBranchId] = useState(null);
    const [searchParams] = useSearchParams();
    const selectedBranchId = searchParams.get("branch");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get("/api/user");
                const user = userRes.data.data;
                setUser(user);

                const currentBranchId = user.role === "super_admin" ? selectedBranchId : user.branch_id;
                setBranchId(currentBranchId);

                const stockRes = await API.get(`/api/admin/branches/${currentBranchId}/stock`);
                setItems(stockRes.data.data);

                if (user.role === "super_admin") {
                    const menuRes = await API.get("/api/menu-items");
                    setAllMenus(menuRes.data.data || []);
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal mengambil data",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedBranchId]);

    const filtered = items.filter((item) => item.menu_item?.name?.toLowerCase().includes(search.toLowerCase()));

    const handleUpdate = async (item) => {
        try {
            await API.put(
                `/api/admin/branches/${branchId}/menu-items/${item.menu_item_id}/stock`,
                {
                    stock: item.stock,
                    is_available: item.is_available,
                    discount_type: item.discount_type,
                    discount_percentage: item.discount_percentage,
                    discount_amount: item.discount_amount,
                }
            );

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Stock berhasil diupdate",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal update stock",
            });
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const handleAssignMenu = async () => {
        if (!selectedMenuId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih menu",
            });
            return;
        }
        try {
            await API.post(`/api/admin/branches/${branchId}/menu-items/${selectedMenuId}`);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Menu berhasil ditambahkan",
                timer: 1200,
                showConfirmButton: false,
            });

            setShowAssignModal(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err.response?.data?.message || "Gagal menambahkan menu",
            });
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            {/* HEADER */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        {user?.role === "super_admin" && (
                            <button
                                onClick={() => navigate("/superadmin/cabang")}
                                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#2F5231] hover:text-[#1e3a20] transition-colors"
                            >
                                ← Kembali ke Cabang
                            </button>
                        )}
                        <h1 className="text-2xl font-bold text-gray-800">Stock Cabang</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola stock dan availability menu cabang</p>
                    </div>

                    {user?.role === "super_admin" && (
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="bg-[#2F5231] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1e3a20] transition-all shadow-md"
                        >
                            + Tambah Menu
                        </button>
                    )}
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari menu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* HEADER */}
                <div className="hidden md:grid grid-cols-7 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231] gap-4">
                    <div>Menu</div>
                    <div>Harga</div>
                    <div>Stock</div>
                    <div>Status</div>
                    <div>Diskon</div>
                    <div>Value</div>
                    <div>Aksi</div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {/* BODY */}
                {!loading && filtered.map((item, index) => (
                    <div key={item.id} className="grid md:grid-cols-7 gap-4 px-6 py-4 border-t items-center">
                        {/* MENU */}
                        <div>
                            <p className="font-semibold text-gray-800">{item.menu_item?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.menu_item?.category?.name}</p>
                        </div>

                        {/* PRICE */}
                        <div className="text-sm text-gray-600">
                            Rp {Number(item.menu_item?.base_price).toLocaleString("id-ID")}
                        </div>

                        {/* STOCK */}
                        <div>
                            <input
                                type="number"
                                min="0"
                                value={item.stock}
                                onChange={(e) => handleChange(index, "stock", e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F5231]"
                            />
                        </div>

                        {/* STATUS */}
                        <div>
                            <select
                                value={item.is_available ? "1" : "0"}
                                onChange={(e) => handleChange(index, "is_available", e.target.value === "1")}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F5231]"
                            >
                                <option value={1}>Available</option>
                                <option value={0}>Unavailable</option>
                            </select>
                        </div>

                        {/* DISCOUNT TYPE */}
                        <div>
                            <select
                                value={item.discount_type || ""}
                                onChange={(e) => handleChange(index, "discount_type", e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F5231]"
                            >
                                <option value="">No Discount</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>

                        {/* DISCOUNT VALUE */}
                        <div>
                            <input
                                type="number"
                                min="0"
                                value={
                                    item.discount_type === "percentage"
                                        ? item.discount_percentage || ""
                                        : item.discount_amount || ""
                                }
                                onChange={(e) => {
                                    if (item.discount_type === "percentage") {
                                        handleChange(index, "discount_percentage", e.target.value);
                                    } else {
                                        handleChange(index, "discount_amount", e.target.value);
                                    }
                                }}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F5231]"
                            />
                        </div>

                        {/* ACTION */}
                        <div>
                            <button
                                onClick={() => handleUpdate(item)}
                                className="bg-[#2F5231] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e3a20] transition-all"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                ))}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-3">🍽️</div>
                        <p className="text-gray-500 text-sm">Menu tidak ditemukan</p>
                    </div>
                )}
            </div>

            <ModalForm
                isOpen={showAssignModal}
                title="Tambah Menu Cabang"
                form={{ selectedMenuId }}
                setForm={(data) => setSelectedMenuId(data.selectedMenuId)}
                onClose={() => setShowAssignModal(false)}
                onSubmit={handleAssignMenu}
                isDirty={false}
                setIsDirty={() => {}}
            >
                {(handleChange) => (
                    <select
                        name="selectedMenuId"
                        value={selectedMenuId}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20"
                    >
                        <option value="">Pilih Menu</option>
                        {allMenus.map((menu) => (
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                        ))}
                    </select>
                )}
            </ModalForm>
        </main>
    );
}

export default BranchStock;