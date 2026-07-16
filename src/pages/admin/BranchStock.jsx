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
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [menuSearch, setMenuSearch] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [branchId, setBranchId] = useState(null);
    const [searchParams] = useSearchParams();
    const selectedBranchId = searchParams.get("branch");
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [branches, setBranches] = useState([]);
    const [sourceBranchId, setSourceBranchId] = useState("");
    const [overwrite, setOverwrite] = useState(false);

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
                    const branchRes = await API.get("/api/admin/branches");
                    setBranches(branchRes.data.data || []);
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
    const assignedIds = items.map(item => item.menu_item_id);

    const availableMenus = allMenus.filter(
        menu =>
            !assignedIds.includes(menu.id) &&
            menu.name.toLowerCase().includes(menuSearch.toLowerCase())
    );

    const availableBranches = branches.filter(
        branch => branch.id !== Number(branchId)
    );

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

    const toggleMenu = (menuId) => {
        setSelectedMenuIds(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMenuIds.length === availableMenus.length) {
            setSelectedMenuIds([]);
        } else {
            setSelectedMenuIds(availableMenus.map(menu => menu.id));
        }
    };

    const handleAssignMenu = async () => {
        if (selectedMenuIds.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Pilih minimal satu menu",
            });
            return;
        }
        try {
            const res = await API.post(`/api/admin/branches/${branchId}/menu-items`,{
                    menu_item_ids: selectedMenuIds,
                }
            );

            console.log(res.data);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: res.data.message,
                timer: 1200,
                showConfirmButton: false,
            });

            setSelectedMenuIds([]);
            setMenuSearch("");
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

    const handleCopyMenu = async () => {
        if (!sourceBranchId) {
            Swal.fire({
                icon: "warning",
                title: "Pilih cabang asal",
            });
            return;
        }

        const confirm = await Swal.fire({
        title: "Copy Menu?",
        text:
            overwrite
                ? "Menu yang sudah ada akan diperbarui."
                : "Menu yang sudah ada akan dilewati.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Copy",
    });

if (!confirm.isConfirmed) return;

        try {
            const res = await API.post(
                `/api/admin/branches/${branchId}/copy-menus`,
                {
                    source_branch_id: sourceBranchId,
                    overwrite,
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: res.data.message,
                timer: 1500,
                showConfirmButton: false,
            });

            setShowCopyModal(false);
            setSourceBranchId("");
            setOverwrite(false);

            window.location.reload();

        } catch (err) {

            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:
                    err.response?.data?.message ??
                    "Gagal menyalin menu",
            });

        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
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
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCopyModal(true)}
                                className="border border-[#2F5231] text-[#2F5231] px-5 py-3 rounded-xl font-semibold hover:bg-[#2F5231] hover:text-white transition-all"
                            >
                                Copy Menu
                            </button>

                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="bg-[#2F5231] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1e3a20] transition-all shadow-md"
                            >
                                + Tambah Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>

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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-7 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231] gap-4">
                    <div>Menu</div>
                    <div>Harga</div>
                    <div>Stock</div>
                    <div>Status</div>
                    <div>Diskon</div>
                    <div>Value</div>
                    <div>Aksi</div>
                </div>

                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {!loading && filtered.map((item, index) => (
                    <div key={item.id} className="grid md:grid-cols-7 gap-4 px-6 py-4 border-t items-center">
                        <div>
                            <p className="font-semibold text-gray-800">{item.menu_item?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.menu_item?.category?.name}</p>
                        </div>

                        <div className="text-sm text-gray-600">
                            Rp {Number(item.menu_item?.base_price).toLocaleString("id-ID")}
                        </div>

                        <div>
                            <input
                                type="number"
                                min="0"
                                value={item.stock}
                                onChange={(e) => handleChange(index, "stock", e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2F5231]"
                            />
                        </div>

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

                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 text-sm">Menu tidak ditemukan</p>
                    </div>
                )}
            </div>

            <ModalForm
                isOpen={showAssignModal}
                title="Tambah Menu Cabang"
                form={{}}
                setForm={() => {}}
                onClose={() => setShowAssignModal(false)}
                onSubmit={handleAssignMenu}
                isDirty={false}
                setIsDirty={() => {}}
            >
                {() => (
                    <>
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={menuSearch}
                            onChange={(e) => setMenuSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3"
                        />

                        {availableMenus.length > 0 && (
                            <label className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={
                                        availableMenus.length > 0 &&
                                        selectedMenuIds.length === availableMenus.length
                                    }
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 accent-[#2F5231]"
                                />

                                <span className="font-semibold text-[#2F5231]">
                                    Pilih Semua
                                </span>

                            </label>
                        )}

                        <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl">

                            {availableMenus.length === 0 ? (

                                <div className="text-center py-8 text-gray-500">
                                    Semua menu sudah ditambahkan.
                                </div>

                            ) : (

                                availableMenus.map(menu => (

                                    <label
                                        key={menu.id}
                                        className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                    >

                                        <input
                                            type="checkbox"
                                            checked={selectedMenuIds.includes(menu.id)}
                                            onChange={() => toggleMenu(menu.id)}
                                            className="w-4 h-4 accent-[#2F5231]"
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {menu.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {menu.category?.name}
                                            </p>
                                        </div>

                                    </label>

                                ))

                            )}

                        </div>

                        <p className="text-sm text-gray-500 mt-3">
                            {selectedMenuIds.length} menu dipilih
                        </p>
                    </>
                )}
            </ModalForm>

            <ModalForm
                isOpen={showCopyModal}
                title="Copy Menu dari Cabang Lain"
                form={{}}
                setForm={() => {}}
                onClose={() => setShowCopyModal(false)}
                onSubmit={handleCopyMenu}
                isDirty={false}
                setIsDirty={() => {}}
            >
                {() => (
                    <div>
                        <p className="text-gray-600">
                            Pilih cabang yang ingin Anda copy menu-nya:
                        </p>
                        <select
                            value={sourceBranchId}
                            onChange={(e) =>
                                setSourceBranchId(
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all cursor-pointer mb-3"
                        >
                            <option value="">
                                Pilih Cabang
                            </option>

                            {availableBranches.map(branch => (
                                <option
                                    key={branch.id}
                                    value={branch.id}
                                >
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={overwrite}
                                onChange={(e) =>
                                    setOverwrite(e.target.checked)
                                }
                            />

                            Timpa menu yang sudah ada 

                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                            Jika dicentang, stok, diskon, dan status menu akan mengikuti cabang asal.
                        </p>
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default BranchStock;