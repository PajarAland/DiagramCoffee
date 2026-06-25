import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import editIcon from "../../assets/mdi--edit.svg";
import deleteIcon from "../../assets/mdi--delete.svg";
import API from "../../services/api";
import ModalForm from "../../components/ui/ModalForm";

function Categories() {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("edit");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", sort_order: "" });

    const fetchCategories = async () => {
        const res = await API.get("/api/categories");
        setCategories(res.data.data);
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                await fetchCategories();
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const filtered = categories.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (category) => {
        setMode("edit");
        setSelectedCategory(category);
        setForm({
            name: category.name,
            description: category.description,
            sort_order: category.sort_order,
        });
        setIsDirty(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (category) => {
        const result = await Swal.fire({
            title: "Hapus Kategori",
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
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Kategori yang akan dihapus</p>
                        <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><span class="text-red-500 text-lg">📂</span></div>
                                <div>
                                    <h4 class="font-bold text-gray-800">${category.name}</h4>
                                    <p class="text-xs text-gray-500">ID: ${category.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p class="text-xs font-medium text-gray-700 mb-2">Ketik <span class="font-bold text-red-600">"${category.name}"</span> untuk konfirmasi</p>
                        <input id="category-confirm-input" type="text" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" placeholder="Masukkan nama kategori" autocomplete="off" />
                    </div>

                    <div class="bg-gray-50 rounded-lg p-2 text-center">
                        <p class="text-xs text-gray-500">Tombol hapus akan aktif dalam <span class="inline-flex items-center gap-1"><span class="font-bold text-red-600 text-sm" id="countdown">5</span> <span>detik</span></span></p>
                        <div class="w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden">
                            <div id="countdown-bar" class="bg-red-500 h-1 rounded-full transition-all duration-1000" style="width: 100%"></div>
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
                        const percentage = (timeLeft / 5) * 100;
                        countdownBar.style.width = `${percentage}%`;

                        if (timeLeft <= 2) {
                            countdownBar.style.backgroundColor = "#ef4444";
                        }
                    }

                    const input = document.getElementById("category-confirm-input");
                    const isValid = input?.value === category.name;

                    if (timeLeft <= 0 && isValid) {
                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = "1";
                        confirmBtn.style.cursor = "pointer";
                        clearInterval(timerInterval);
                    }

                    if (timeLeft <= 0) {
                        const timerText = document.getElementById("countdown");
                        if (timerText) {
                            timerText.textContent = "0";
                        }
                    }
                }, 1000);

                const input = document.getElementById("category-confirm-input");
                if (input) {
                    input.addEventListener("input", () => {
                        const isValid = input.value === category.name;

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
                            input.classList.add("border-green-400", "bg-green-50");
                        } else {
                            input.classList.remove("border-green-400", "bg-green-50");
                            input.classList.add("border-gray-200");
                        }
                    });
                    setTimeout(() => input.focus(), 100);
                }
                window._deleteTimerInterval = timerInterval;
            },
            willClose: () => {
                if (window._deleteTimerInterval) {
                    clearInterval(window._deleteTimerInterval);
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
            await API.delete(`/api/admin/categories/${category.id}`);
            await fetchCategories();

            Swal.fire({
                icon: "success",
                title: "Berhasil Dihapus!",
                html: `
                    <div class="text-center">
                        <p class="text-gray-600">${category.name} telah dihapus</p>
                    </div>
                `,
                confirmButtonColor: "#2F5231",
                confirmButtonText: "OK",
                timer: 2000,
                showConfirmButton: true,
            });
        } catch (err) {
            console.error("Delete error:", err);

            Swal.fire({
                icon: "error",
                title: "Gagal Menghapus",
                html: `
                    <div class="text-center">
                        <p class="text-gray-600 mb-2">Terjadi kesalahan saat menghapus kategori</p>
                        <p class="text-xs text-gray-400">${err?.response?.data?.message || "Silakan coba lagi"}</p>
                    </div>
                `,
                confirmButtonColor: "#2F5231",
                confirmButtonText: "OK",
            });
        }
    };

    const handleSubmit = async () => {
        const result = await Swal.fire({
            title: "Simpan data?",
            text: "Pastikan data sudah benar sebelum disimpan",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Cek lagi",
        });

        if (!result.isConfirmed) return;

        try {
            if (mode === "edit") {
                await API.put(`/api/admin/categories/${selectedCategory.id}`, form);
            } else {
                await API.post(`/api/admin/categories`, form);
            }
            setIsModalOpen(false);
            setIsDirty(false);
            await fetchCategories();

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: mode === "edit" ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Submit error:", err);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan",
            });
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola kategori menu Anda</p>
                    </div>

                    <button
                        onClick={() => {
                            setMode("add");
                            setSelectedCategory(null);
                            setForm({ name: "", description: "", sort_order: "" });
                            setIsDirty(false);
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        + Tambah Kategori
                    </button>
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
                        placeholder="Cari kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-4 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231] gap-4">
                    <div>Nama Kategori</div>
                    <div>Deskripsi</div>
                    <div>Urutan</div>
                    <div className="text-center">Aksi</div>
                </div>

                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {!loading && filtered.map((item) => (
                    <div key={item.id} className="block md:grid md:grid-cols-4 px-4 md:px-6 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors gap-4">
                        <div className="md:hidden space-y-2 mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{item.description || "Tidak ada deskripsi"}</p>
                                </div>
                                <span className="text-xs text-gray-400">#{item.sort_order}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#EAE5D8] rounded-lg text-sm hover:bg-[#dfd9c9] transition-colors">
                                    <img src={editIcon} alt="edit" className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
                                    <img src={deleteIcon} alt="delete" className="w-4 h-4" /> Hapus
                                </button>
                            </div>
                        </div>

                        <div className="hidden md:block font-medium text-gray-800">{item.name}</div>
                        <div className="hidden md:block text-gray-600 text-sm truncate">
                            {item.description || "-"}
                        </div>
                        <div className="hidden md:block">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                                {item.sort_order || "0"}
                            </span>
                        </div>
                        <div className="hidden md:flex justify-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-[#EAE5D8] rounded-lg hover:bg-[#dfd9c9] transition-colors" title="Edit Kategori">
                                <img src={editIcon} alt="edit" className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(item)} className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Kategori">
                                <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 text-sm">Kategori tidak ditemukan</p>
                        {search && (
                            <button onClick={() => setSearch("")} className="mt-3 text-[#2F5231] text-sm font-medium hover:underline">Hapus filter</button>
                        )}
                    </div>
                )}
            </div>

            {!loading && categories.length > 0 && (
                <div className="mt-4 text-xs text-gray-400">
                    Menampilkan {filtered.length} dari {categories.length} kategori
                </div>
            )}

            <ModalForm
                isOpen={isModalOpen}
                title={mode === "edit" ? "Edit Kategori" : "Tambah Kategori"}
                form={form}
                setForm={setForm}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            >
                {(handleChange) => (
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Nama Kategori
                            </label>
                            <div className="relative">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama kategori"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Deskripsi
                            </label>
                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Masukkan deskripsi kategori"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Urutan Tampilan
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="sort_order"
                                    value={form.sort_order}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Semakin kecil angka, semakin atas tampilannya
                            </p>
                        </div>
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default Categories;