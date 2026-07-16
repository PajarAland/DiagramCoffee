import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api.js";
import Swal from "sweetalert2";
import MenuCard from "../../components/ui/MenuCard.jsx";
import ModalForm from "../../components/ui/ModalForm.jsx";

function ItemMenu() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [mode, setMode] = useState("edit");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        base_price: "",
        is_active: "1",
        image_url: null,
    });

    const fetchMenus = async () => {
        const res = await API.get("/api/menu-items");
        setItems(res.data.data);
    };

    const fetchCategories = async () => {
        const res = await API.get("/api/categories");
        setCategories(res.data.data);
    };

    useEffect(() => {
        const load = async () => {
            try {
                await Promise.all([fetchMenus(), fetchCategories()]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCancel = async () => {
        if (isDirty) {
            const result = await Swal.fire({
                title: "Perubahan belum disimpan",
                text: "Yakin ingin keluar?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, keluar",
                cancelButtonText: "Tidak",
            });

            if (result.isConfirmed) {
                setIsModalOpen(false);
                setIsDirty(false);
            }
        } else {
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async () => {
        const confirm = await Swal.fire({
            title: "Simpan data?",
            text: "Pastikan data sudah benar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
        });

        if (!confirm.isConfirmed) return;

        try {
            const formData = new FormData();
            formData.append("category_id", Number(form.category_id));
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("base_price", Number(form.base_price));
            formData.append("is_active", String(form.is_active));

            if (form.image_url) {
                formData.append("image_url", form.image_url);
            }

            if (mode === "edit") {
                formData.append("_method", "PUT");
                await API.post(`/api/admin/menu-items/${selectedItem.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await API.post(`/api/admin/menu-items`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: mode === "edit" ? "Menu berhasil diupdate" : "Menu berhasil ditambahkan",
            });
            setIsModalOpen(false);
            setIsDirty(false);
            await fetchMenus();
        } catch {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan",
            });
        }
    };

    const handleImport = async () => {
        if (!csvFile) {
            await Swal.fire({
                icon: "warning",
                title: "Pilih file",
                text: "Silakan pilih file CSV terlebih dahulu.",
            });
            return;
        }

        const confirm = await Swal.fire({
            title: "Import data?",
            text: "Pastikan data sudah benar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, import",
        });

        if (!confirm.isConfirmed) return;

        try {
            const formData = new FormData();
            formData.append("file", csvFile);

            const res = await API.post(
                "/api/admin/menu-items/import",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Import Berhasil",
                text: res.data.message,
            });

            await fetchMenus();
            setCsvFile(null);
            setShowImportModal(false);

        } catch (err) {
            console.error(err);
            console.log(err.response?.data);
            await Swal.fire({
                icon: "error",
                title: "Import Gagal",
                text: err.response?.data?.message || "Terjadi kesalahan saat mengimpor data.",
            });
        }
    };

    const handleExport = async () => {
        const confirm = await Swal.fire({
            title: "Unduh data?",
            text: "Apakah anda ingin mengunduh data menu?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, unduh",
        });

        if (!confirm.isConfirmed) return;
        try {
            const response = await API.get(
                "/api/admin/menu-items/export",
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: "text/csv;charset=utf-8;",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;

            // ambil filename dari backend kalau ada
            const disposition = response.headers["content-disposition"];

            let filename = "menu-export.csv";

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);

                if (match) {
                    filename = match[1];
                }
            }

            link.setAttribute("download", filename);

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File CSV berhasil diunduh.",
                timer: 1200,
                showConfirmButton: false,
            });

        } catch (err) {

            console.error(err);

            await Swal.fire({
                icon: "error",
                title: "Export Gagal",
                text:
                    err.response?.data?.message ??
                    "Terjadi kesalahan saat mengunduh CSV.",
            });
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen Menu</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola semua menu makanan & minuman</p>
                    </div>

                    {/* <button
                        onClick={() => {
                            setMode("add");
                            setSelectedItem(null);
                            setForm({ category_id: "", name: "", description: "", base_price: "", is_active: "1", image_url: null });
                            setIsDirty(false);
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        + Tambah Menu
                    </button> */}

                    <div className="flex gap-3">
                        <button
                            className="border border-[#2F5231] text-[#2F5231] px-5 py-3 rounded-xl font-semibold hover:bg-[#2F5231] hover:text-white transition-all"
                            onClick={handleExport}
                        >
                            Export CSV
                        </button>

                        <button
                            className="border border-[#2F5231] text-[#2F5231] px-5 py-3 rounded-xl font-semibold hover:bg-[#2F5231] hover:text-white transition-all"

                            onClick={() => {
                                setCsvFile(null);
                                setShowImportModal(true);
                                
                            }}
                        >
                            Import CSV
                        </button>

                        <button
                        onClick={() => {
                            setMode("add");
                            setSelectedItem(null);
                            setForm({ category_id: "", name: "", description: "", base_price: "", is_active: "1", image_url: null });
                            setIsDirty(false);
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        + Tambah Menu
                    </button>

                    </div>
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                    />
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-4 text-gray-500 text-sm">Loading menu items...</p>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {filtered.map((item) => (
                                <MenuCard key={item.id} item={item} onClick={(item) => navigate(`/admin/menu-items/${item.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <p className="text-gray-500 text-sm">Menu tidak ditemukan</p>
                            {search && (
                                <button onClick={() => setSearch("")} className="mt-3 text-[#2F5231] text-sm font-medium hover:underline">Hapus filter</button>
                            )}
                        </div>
                    )}
                </>
            )}

            {!loading && items.length > 0 && (
                <div className="mt-6 text-xs text-gray-400">
                    Menampilkan {filtered.length} dari {items.length} menu
                </div>
            )}

            <ModalForm
                isOpen={isModalOpen}
                title={mode === "edit" ? "Edit Menu" : "Tambah Menu"}
                form={form}
                setForm={setForm}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
                onClose={handleCancel}
                onSubmit={handleSubmit}
            >
                {(handleChange) => (
                    <div className="space-y-5">
                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </p>
                            <div className="relative">
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all cursor-pointer"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Nama Menu <span className="text-red-500">*</span>
                            </p>
                            <div className="relative">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama menu"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Deskripsi
                            </p>
                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Masukkan deskripsi menu"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Harga <span className="text-red-500">*</span>
                            </p>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="base_price"
                                    value={form.base_price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Status
                            </p>
                            <div className="relative">
                                <select
                                    name="is_active"
                                    value={form.is_active}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all cursor-pointer"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gambar Menu</p>
                            <label className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-[#2F5231] hover:bg-[#2F5231]/5 transition-all group">
                                <div className="flex flex-col items-center justify-center py-6">
                                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{form.image_url ? "accepted" : "photo"}</span>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-[#2F5231] transition-colors">{form.image_url ? "Gambar siap diupload" : "Klik untuk upload gambar"}</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max 2MB)</span>
                                    {form.image_url?.name && (
                                        <span className="text-xs text-green-600 mt-2">
                                            {form.image_url.name}
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, image_url: file });
                                            setIsDirty(true);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                )}
            </ModalForm>

            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowImportModal(false)}
                    />

                    <div className="relative bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold">
                            Import Menu CSV
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Upload file CSV sesuai format yang ditentukan.
                        </p>

                        <input
                            type="file"
                            accept=".csv"
                            className="mt-5"
                            onChange={(e) => {
                                setCsvFile(e.target.files[0]);
                            }}
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowImportModal(false)}
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleImport}
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default ItemMenu;