import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalForm from "../../components/ui/ModalForm.jsx";
import editIcon from "../../assets/mdi--edit.svg";
import adminIcon from "../../assets/mdi--administrator.svg";
import coffeeIconGreen from "../../assets/mdi--coffee-green.svg";
import deleteIcon from "../../assets/mdi--delete.svg";
import API from "../../services/api.js";
import { useNavigate } from "react-router-dom";

function Cabang() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("edit");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        status: "active",
        opening_time: "",
        closing_time: "",
    });

    const fetchBranches = async () => {
        const res = await API.get("/api/admin/branches");
        setBranches(res.data.data);
    };

    useEffect(() => {
        const loadBranches = async () => {
            try {
                await fetchBranches();
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBranches();
    }, []);

    const filtered = branches.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (branch) => {
        setMode("edit");
        setSelectedBranch(branch);
        setForm({
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            status: branch.status,
            opening_time: branch.opening_time,
            closing_time: branch.closing_time,
        });
        setIsDirty(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (branch) => {
        let timerInterval;
        const result = await Swal.fire({
            title: "Hapus Cabang",
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
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Cabang yang akan dihapus</p>
                        <div class="bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <span class="text-red-500 text-lg">🏢</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800">${branch.name}</h4>
                                    <p class="text-xs text-gray-500">ID: ${branch.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-700 mb-2">Ketik <span class="font-bold text-red-600">"${branch.name}"</span> untuk konfirmasi</p>
                        <input id="branch-confirm-input" type="text" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400" placeholder="Masukkan nama cabang" autocomplete="off" />
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

                    const input = document.getElementById("branch-confirm-input");
                    const isValid = input?.value === branch.name;

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

                const input = document.getElementById("branch-confirm-input");
                if (input) {
                    input.addEventListener("input", () => {
                        const isValid = input.value === branch.name;
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
            },
            willClose: () => {
            if (timerInterval) {
                clearInterval(timerInterval);
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
            await API.delete(`/api/admin/branches/${branch.id}`);
            await fetchBranches();

            Swal.fire({
                icon: "success",
                title: "Berhasil Dihapus!",
                html: `
                    <div class="text-center">
                        <p class="text-gray-600">${branch.name} telah dihapus dari sistem</p>
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
                        <p class="text-gray-600 mb-2">Terjadi kesalahan saat menghapus cabang</p>
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
            text: "Pastikan data sudah benar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Cek lagi",
        });
        if (!result.isConfirmed) return;

        try {
            if (mode === "edit") {
                await API.put(`/api/admin/branches/${selectedBranch.id}`, form);
            } else {
                await API.post(`/api/admin/branches`, form);
            }
            setIsModalOpen(false);
            setIsDirty(false);
            await fetchBranches();

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: mode === "edit" ? "Cabang berhasil diperbarui" : "Cabang berhasil ditambahkan",
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

    const getStatusColor = (status) => {
        return status === "active"
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-red-100 text-red-700 border-red-200";
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manajemen Cabang</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data cabang dan admin</p>
                    </div>
                    <button
                        onClick={() => {
                            setMode("add");
                            setSelectedBranch(null);
                            setForm({ name: "", address: "", phone: "", status: "active", opening_time: "", closing_time: "" });
                            setIsDirty(false);
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        + Tambah Cabang
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
                        placeholder="Cari cabang..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-6 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231] gap-4">
                    <div>Nama Cabang</div>
                    <div>Alamat</div>
                    <div>No. Telepon</div>
                    <div>Status</div>
                    <div>Jam Operasional</div>
                    <div className="text-center">Aksi</div>
                </div>

                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {!loading && filtered.map((item) => (
                    <div key={item.id} className="block md:grid md:grid-cols-6 px-4 md:px-6 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors gap-4">
                        <div className="md:hidden space-y-2 mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{item.address}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="text-xs text-gray-600">
                                <p>📞 {item.phone}</p>
                                <p className="mt-1">🕒 {item.opening_time} - {item.closing_time}</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#EAE5D8] rounded-lg text-sm hover:bg-[#dfd9c9] transition-colors">
                                    <img src={editIcon} alt="edit" className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => navigate(`/superadmin/admin-cabang?branch=${item.id}`)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#EAE5D8] rounded-lg text-sm hover:bg-[#dfd9c9] transition-colors">
                                    <img src={adminIcon} alt="admin" className="w-4 h-4" /> Admin
                                </button>
                                <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
                                    <img src={deleteIcon} alt="delete" className="w-4 h-4" /> Hapus
                                </button>
                            </div>
                        </div>

                        <div className="hidden md:block font-medium text-gray-800">{item.name}</div>
                        <div className="hidden md:block text-gray-600 text-sm truncate">{item.address}</div>
                        <div className="hidden md:block text-sm">{item.phone}</div>
                        <div className="hidden md:block">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status === "active" ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="hidden md:block text-sm">
                            {item.opening_time} - {item.closing_time}
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-[#EAE5D8] rounded-lg hover:bg-[#dfd9c9] transition-colors" title="Edit Cabang">
                                <img src={editIcon} alt="edit" className="w-5 h-5" />
                            </button>
                            <button onClick={() => navigate(`/superadmin/admin-cabang?branch=${item.id}`)} className="p-2 bg-[#EAE5D8] rounded-lg hover:bg-[#dfd9c9] transition-colors" title="Kelola Admin">
                                <img src={adminIcon} alt="admin" className="w-5 h-5" />
                            </button>
                            <button onClick={() => navigate(`/admin/stock?branch=${item.id}`)} className="p-2 bg-[#EAE5D8] rounded-lg hover:bg-[#dfd9c9] transition-colors" title="Kelola Menu Cabang">
                                <img src={coffeeIconGreen} alt="menu" className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(item)} className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Hapus Cabang">
                                <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-3">🏢</div>
                        <p className="text-gray-500 text-sm">Data tidak ditemukan</p>
                        {search && (
                            <button onClick={() => setSearch("")} className="mt-3 text-[#2F5231] text-sm font-medium hover:underline">Hapus filter</button>
                        )}
                    </div>
                )}
            </div>

            {!loading && branches.length > 0 && (
                <div className="mt-4 text-xs text-gray-400">
                    Menampilkan {filtered.length} dari {branches.length} cabang
                </div>
            )}

            <ModalForm
                isOpen={isModalOpen}
                title={mode === "edit" ? "Edit Cabang" : "Tambah Cabang"}
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
                                Nama Cabang
                            </label>
                            <div className="relative">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama cabang"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Alamat
                            </label>
                            <div className="relative">
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat lengkap"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all resize-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Nomor Telepon
                            </label>
                            <div className="relative">
                                
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="0821xxxxxxxx"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all cursor-pointer"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* <div className="space-y-3">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Jam Operasional
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="opening_time"
                                        value={form.opening_time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="closing_time"
                                        value={form.closing_time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div> */}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    name="opening_time"
                                    value={form.opening_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    name="closing_time"
                                    value={form.closing_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default Cabang;