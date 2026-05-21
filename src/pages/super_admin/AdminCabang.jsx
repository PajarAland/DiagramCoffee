import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../services/api";
import ModalForm from "../../components/ui/ModalForm.jsx";
import deleteIcon from "../../assets/mdi--delete.svg";

function AdminCabang() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const branchId = searchParams.get("branch");
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        branch_id: branchId,
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const adminRes = await API.get(`/api/admin/branches/${branchId}/admins`);
            setAdmins(adminRes.data.data);
        } catch (err) {
            console.error("Load data error:", err);
            
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data",
            });
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        if (!branchId) return;
        const load = async () => {
            await fetchData();
        };
        load();
    }, [branchId, fetchData]);

    const filtered = admins.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async () => {
        const result = await Swal.fire({
            title: "Tambah Admin?",
            text: "Pastikan data sudah benar",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Tambah",
            cancelButtonText: "Batal",
            confirmButtonColor: "#2F5231",
        });
        if (!result.isConfirmed) return;

        try {
            if (form.password !== form.password_confirmation) {
                
                Swal.fire({
                    icon: "warning",
                    title: "Password tidak sama",
                    text: "Konfirmasi password harus sama",
                });
                return;
            }
            await API.post("/api/admin/admins", { ...form });
            setIsModalOpen(false);

            setForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                branch_id: branchId,
            });
            await fetchData();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Admin cabang berhasil ditambahkan",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Submit error:", err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Terjadi kesalahan",
            });

        }
    };

    const handleDelete = async (admin) => {
        const result = await Swal.fire({
            title: "Hapus Admin?",
            html: `
                <div class="text-center">
                    <p class="text-gray-600">
                        Yakin ingin menghapus
                    </p>

                    <p class="font-bold text-lg mt-1">
                        ${admin.name}
                    </p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed) return;

        try {
            await API.delete(`/api/admin/admins/${admin.id}`);
            await fetchData();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Admin berhasil dihapus",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Delete error:", err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <button
                        onClick={() => navigate("/superadmin/cabang")}
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#2F5231] hover:text-[#1e3a20] transition-colors"
                    >
                        ← Kembali ke Cabang
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manajemen Admin Cabang
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Kelola admin cabang
                    </p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsDirty(false);
                    }}
                    className="bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all"
                >
                    + Tambah Admin
                </button>
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
                        placeholder="Cari admin..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* HEADER */}
                <div className="hidden md:grid grid-cols-4 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231]">
                    <div>Nama</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div className="text-center">Aksi</div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {/* BODY */}
                {!loading && filtered.map((item) => (
                    <div key={item.id} className="block md:grid md:grid-cols-5 px-4 md:px-6 py-4 border-t border-gray-100 items-center gap-4 hover:bg-gray-50 transition-colors">
                        {/* MOBILE */}
                        <div className="md:hidden space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {item.name}
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.email}
                                    </p>
                                </div>
                                <span className="px-2 py-1 rounded-full text-xs bg-[#EAE5D8] text-[#2F5231] font-medium">Admin</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                🏢 {item.branch?.name || "-"}
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <img
                                        src={deleteIcon}
                                        alt="delete"
                                        className="w-4 h-4"
                                    />

                                    Hapus
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:block font-medium text-gray-800">
                            {item.name}
                        </div>

                        <div className="hidden md:block text-gray-600 text-sm">
                            {item.email}
                        </div>

                        <div className="hidden md:block">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#EAE5D8] text-[#2F5231]">Admin Cabang</span>
                        </div>
                        <div className="hidden md:flex justify-center">
                            <button
                                onClick={() => handleDelete(item)}
                                className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <img
                                    src={deleteIcon}
                                    alt="delete"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    </div>
                ))}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center">

                        <div className="text-4xl mb-3">
                            👤
                        </div>

                        <p className="text-gray-500 text-sm">
                            Data admin tidak ditemukan
                        </p>

                    </div>
                )}
            </div>

            {/* FOOTER */}
            {!loading && admins.length > 0 && (
                <div className="mt-4 text-xs text-gray-400">
                    Menampilkan {filtered.length} dari {admins.length} admin
                </div>
            )}

            {/* MODAL */}
            <ModalForm
                isOpen={isModalOpen}
                title="Tambah Admin Cabang"
                form={form}
                setForm={setForm}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            >
                {(handleChange) => (
                    <div className="space-y-4">
                        {/* NAME */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nama</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama admin"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Masukkan email"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Masukkan password"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Konfirmasi Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Konfirmasi password"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#2F5231] focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                            />
                        </div>
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default AdminCabang;