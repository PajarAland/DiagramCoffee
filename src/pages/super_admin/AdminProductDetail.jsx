import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Swal from "sweetalert2";

function AdminProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        base_price: "",
        is_active: true,
        image_url: "",
    });

    const baseImageUrl = `${import.meta.env.VITE_API_URL}/storage/`;

    const fetchCategories = useCallback(async () => {
        const res = await API.get("/api/categories");
        setCategories(res.data.data);
    }, []);

    const fetchMenuDetail = useCallback(async () => {
        const res = await API.get(`/api/menu-items/${id}`);
        const item = res.data.data;
        setForm({
            category_id: item.category_id,
            name: item.name,
            description: item.description ?? "",
            base_price: item.base_price,
            is_active: item.is_active,
            image_url: item.image_url,
        });
        setImagePreview(`${baseImageUrl}${item.image_url}`);
    }, [id, baseImageUrl]);

    useEffect(() => {
        const load = async () => {
            try {
                await Promise.all([fetchMenuDetail(), fetchCategories()]);
            } catch (err) {
                console.error(err);

                    Swal.fire({
                        icon: "error",
                        title:"Gagal load data",
                            
                    });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchMenuDetail, fetchCategories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === "category_id" || name === "base_price") newValue = Number(value);
        if (name === "is_active") newValue = value === "true";
        setForm({ ...form, [name]: newValue });
    };

    const handleImageFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, image_url: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDelete = async () => {
    const result = await Swal.fire({
        title: "Hapus Menu",
        html: `
            <div class="text-left space-y-4">
                <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 text-sm">
                    <div class="flex items-start gap-2">
                        <div class="flex-1">
                            <p class="font-semibold text-red-700 mb-1">Peringatan!</p>
                            <p class="text-red-600 text-xs">Data yang dihapus tidak dapat dikembalikan</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Menu yang akan dihapus
                    </p>
                    <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <div class="flex items-center gap-3">
                            <div>
                                <h4 class="font-bold text-gray-800">${form.name}</h4>
                                <p class="text-xs text-gray-500">ID: ${id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="text-xs font-medium text-gray-700 mb-2">
                        Ketik <span class="font-bold text-red-600">"${form.name}"</span> untuk konfirmasi
                    </p>
                    <input
                        id="menu-confirm-input"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                        placeholder="Masukkan nama menu"
                        autocomplete="off"
                    />
                </div>

                <div class="bg-gray-50 rounded-lg p-2 text-center">
                    <p class="text-xs text-gray-500">
                        Tombol hapus akan aktif dalam
                        <span class="inline-flex items-center gap-1">
                            <span class="font-bold text-red-600 text-sm" id="countdown">5</span>
                            <span>detik</span>
                        </span>
                    </p>

                    <div class="w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden">
                        <div
                            id="countdown-bar"
                            class="bg-red-500 h-1 rounded-full transition-all duration-1000"
                            style="width:100%"
                        ></div>
                    </div>
                </div>
            </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus Permanen",
        cancelButtonText: "Batal",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6B7280",
        allowOutsideClick: false,
        width: "450px",
        customClass: {
            popup: "rounded-2xl",
            title: "text-xl font-bold text-gray-800",
            confirmButton: "px-4 py-2 text-sm font-semibold rounded-lg",
            cancelButton: "px-4 py-2 text-sm font-medium rounded-lg",
        },
        didOpen: () => {
            const confirmBtn = Swal.getConfirmButton();
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = "0.5";
            confirmBtn.style.cursor = "not-allowed";

            let timeLeft = 5;
            const countdownBar = document.getElementById("countdown-bar");
            let timerInterval;

            timerInterval = setInterval(() => {
                timeLeft--;

                const countdownSpan = document.getElementById("countdown");
                if (countdownSpan) {
                    countdownSpan.textContent = timeLeft;
                }

                if (countdownBar) {
                    countdownBar.style.width = `${(timeLeft / 5) * 100}%`;

                    if (timeLeft <= 2) {
                        countdownBar.style.backgroundColor = "#ef4444";
                    }
                }

                const input = document.getElementById("menu-confirm-input");
                const isValid = input?.value === form.name;

                if (timeLeft <= 0 && isValid) {
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = "1";
                    confirmBtn.style.cursor = "pointer";
                    clearInterval(timerInterval);
                }

                if (timeLeft <= 0) {
                    if (countdownSpan) countdownSpan.textContent = "0";
                }
            }, 1000);

            const input = document.getElementById("menu-confirm-input");

            if (input) {
                input.addEventListener("input", () => {
                    const isValid = input.value === form.name;

                    if (isValid && timeLeft <= 0) {
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = "1";
                        confirmBtn.style.cursor = "pointer";
                    } else {
                        confirmBtn.disabled = true;
                        confirmBtn.style.opacity = "0.5";
                        confirmBtn.style.cursor = "not-allowed";
                    }

                    if (isValid) {
                        input.classList.remove("border-red-200");
                        input.classList.remove("border-gray-200");
                        input.classList.add("border-green-400", "bg-green-50");
                    } else {
                        input.classList.remove("border-green-400", "bg-green-50");
                        input.classList.add("border-gray-200");
                    }
                });

                setTimeout(() => input.focus(), 100);
            }

            window._deleteMenuTimer = timerInterval;
        },
        willClose: () => {
            if (window._deleteMenuTimer) {
                clearInterval(window._deleteMenuTimer);
            }
        },
    });

    if (!result.isConfirmed) return;

    Swal.fire({
        title: "Menghapus...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    try {
        await API.delete(`/api/admin/menu-items/${id}`);

        Swal.fire({
            icon: "success",
            title: "Berhasil Dihapus!",
            html: `
                <div class="text-center">
                    <p class="text-gray-600">${form.name} telah dihapus</p>
                </div>
            `,
            confirmButtonColor: "#2F5231",
            confirmButtonText: "OK",
            timer: 2000,
            showConfirmButton: true,
        });

        navigate("/superadmin/item-menu");
    } catch (err) {
        console.error("Delete error:", err);

        Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            html: `
                <div class="text-center">
                    <p class="text-gray-600 mb-2">Terjadi kesalahan saat menghapus menu</p>
                    <p class="text-xs text-gray-400">
                        ${err?.response?.data?.message || "Silakan coba lagi"}
                    </p>
                </div>
            `,
            confirmButtonColor: "#2F5231",
            confirmButtonText: "OK",
        });
    }
};

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("category_id", form.category_id);
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("base_price", Number(form.base_price));
            formData.append("is_active", form.is_active ? "1" : "0");

            if (form.image_url instanceof File) {
                formData.append("image_url", form.image_url);
            }

            formData.append("_method", "PUT");

            await API.post(`/api/admin/menu-items/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Menu berhasil diupdate",
            });
            navigate("/superadmin/item-menu");
        } catch (err) {
            console.log(err.response?.data);

            Swal.fire({
                icon: "error",
                title: "Gagal update data",
                text:
                    err.response?.data?.message ??
                    "Unknown error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F1E5] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2F5231] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading menu details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#F5F1E5] py-8 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#2F5231] hover:bg-[#F5F1EA] transition-all hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Edit Menu</h1>
                            <p className="text-xs text-gray-500 font-medium">Update menu item details & availability</p>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                        form.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {form.is_active ? '● Active' : '● Inactive'}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detail Informasi Menu</span>
                        <span className="text-[11px] text-gray-400 font-semibold">ID: #{id}</span>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Nama Menu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Espresso Romano"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/10 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Deskripsi Menu <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Brief description about this coffee or dish..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/10 transition-all outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-gray-100">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Harga Dasar (Base Price) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-sm">Rp</span>
                                    <input
                                        type="number"
                                        name="base_price"
                                        value={form.base_price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/10 transition-all outline-none font-semibold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Kategori
                                </label>
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/10 transition-all outline-none"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Foto Menu (Upload) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                {imagePreview ? (
                                    <div className="relative w-20 h-20 shrink-0 shadow-sm rounded-xl overflow-hidden border border-gray-200">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex-1 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileUpload}
                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2F5231]/10 file:text-[#2F5231] hover:file:bg-[#2F5231]/20 cursor-pointer"
                                    />
                                    <p className="mt-1.5 text-[11px] text-gray-400 font-medium">Recommended size: 1200x900px • Max 2MB • JPG or PNG</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-gray-100 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Status Menu (Global)
                                </label>
                                <select
                                    name="is_active"
                                    value={form.is_active.toString()}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/10 transition-all outline-none"
                                >
                                    <option value="true">Active (Visible to customers)</option>
                                    <option value="false">Inactive (Hidden from customers)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 justify-between items-center">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 font-semibold rounded-xl text-sm transition-all"
                        >
                            Delete Menu
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-8 py-2.5 bg-[#2F5231] hover:bg-[#1e3820] text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
                        >
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-[11px] text-gray-400 font-medium">
                    All fields marked with <span className="text-red-500">*</span> are required. Changes are applied globally.
                </p>
            </div>
        </div>
    );
}

export default AdminProductDetail;