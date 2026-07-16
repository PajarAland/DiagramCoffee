import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import ModalForm from "../../components/ui/ModalForm";

function BannerManagement() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: null,
        is_active: true,
        sort_order: 0,
    });

    const baseImageUrl = `${import.meta.env.VITE_API_URL}/storage/`;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/admin/banners");
            setBanners(res.data.data || []);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data banner",                    
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchData();
        };
        load();
    }, [fetchData]);

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            image: null,
            is_active: true,
            sort_order: 0,
        });
        setSelectedBanner(null);
        setIsDirty(false);
    };

    const openCreateModal = () => {
        resetForm();
        setMode("create");
        setIsModalOpen(true);
    };

    const openEditModal = (banner) => {
        setSelectedBanner(banner);
        setForm({
            title: banner.title || "",
            description: banner.description || "",
            image: null,
            is_active: banner.is_active,
            sort_order: banner.sort_order || 0,
        });
        setMode("edit");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("is_active", form.is_active ? 1 : 0);
            formData.append("sort_order", form.sort_order);

            if (form.image) {
                formData.append(
                    "image", form.image);
            }

            if (mode === "create") {
                await API.post("/api/admin/banners", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                formData.append("_method", "PUT");
                await API.post(`/api/admin/banners/${selectedBanner.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: mode === "create" ? "Banner berhasil ditambahkan" : "Banner berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            Swal.fire({ 
                icon: "error", 
                title: "Gagal", 
                text: err.response?.data?.message || "Terjadi kesalahan" 
            });
        }
    };

    const handleDelete = async (banner) => {
        const result = await Swal.fire({
            title: "Hapus banner?",
            text: "Banner akan dihapus permanen",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed) return;

        try {
            await API.delete(`/api/admin/banners/${banner.id}`);
            
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:"Banner berhasil dihapus",
                timer: 1200,
                showConfirmButton: false,
            });
            fetchData();
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text:"Gagal menghapus banner",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Banner Promo
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Kelola banner promo homepage
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        + Tambah Banner
                    </button>
                </div>

                {banners.length === 0 && (
                    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-700">
                            Banner tidak tersedia
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Tambahkan banner promo baru untuk ditampilkan di homepage
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-white rounded-3xl overflow-hidden shadow-md border">
                            {/* IMAGE */}
                            <div className="h-52 overflow-hidden bg-gray-100">
                                <img
                                    src={`${baseImageUrl}${banner.image_url}`}
                                    alt={banner.title}
                                    className="w-full h-full object-cover" 
                                        
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">                             
                                            {banner.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {banner.description} 
                                        </p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                        banner.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {banner.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                                    <p>
                                        Sort:
                                        {" "}
                                        <span className="font-semibold">
                                            {banner.sort_order}  
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button onClick={() => openEditModal(banner)} className="flex-1 py-2.5 rounded-xl border font-semibold hover:bg-gray-50 transition-all">Edit</button>
                                    <button onClick={() => handleDelete(banner)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-60 transition-all">Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalForm
                isOpen={isModalOpen}
                title={mode === "create" ? "Tambah Banner" : "Edit Banner"}
                form={form}
                setForm={setForm}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
            >
                {(handleChange) => (
                    <div className="space-y-4">
                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Judul Banner <span className="text-red-500">*</span>
                            </p>
                            <input
                                type="text"
                                name="title"
                                placeholder="B1G1"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3 outline-none"
                            />
                        </div>           

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Deskripsi <span className="text-red-500">*</span>
                            </p>
                            <textarea
                                name="description"
                                placeholder="Deskripsi"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border rounded-xl px-4 py-3 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Sort Order <span className="text-red-500">*</span>
                            </p>       
                            <input
                                type="number"
                                name="sort_order"
                                placeholder="Sort Order"
                                value={form.sort_order}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3 outline-none"
                            />
                        </div>

                        <div>
                            <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </p>    
                            <select
                                name="is_active"
                                value={form.is_active ? "1" : "0"}
                                onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })}
                                className="w-full border rounded-xl px-4 py-3 outline-none"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                            className="w-full border rounded-xl px-4 py-3"
                        />
                        {/* <div>
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
                                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                                />
                            </label>
                        </div> */}
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default BannerManagement;