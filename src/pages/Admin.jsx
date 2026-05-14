import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/ui/SidebarAdmin.jsx";
import Navbar from "../components/ui/TitleBar.jsx";
import { useAuth } from "../context/useAuth.jsx";
import API from "../services/api";
import iconPlusWhite from "../assets/mdi--plus-thick-white.svg";

function Admin() {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState("");
    const [admin, setAdmin] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdmin = async () => {
            try {
                const res = await API.get("/api/admin");
                setAdmin(res.data.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, []);

    const filtered = admin.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        sort_order: "",
    });

    const handleEdit = (category) => {
        setSelectedCategory(category);

        setForm({
            name: category.name,
            description: category.description,
            sort_order: category.sort_order,
        });

        setIsDirty(false); // reset
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setIsDirty(true); // tandain ada perubahan
    };

    const [isDirty, setIsDirty] = useState(false);

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

        const result = await Swal.fire({
            title: "Simpan perubahan?",
            text: "Pastikan data sudah benar sebelum disimpan",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, simpan",
            cancelButtonText: "Cek lagi",
        });

        // ❌ kalau user batal → stop
        if (!result.isConfirmed) return;

        try {
            await API.put(`/api/admin/admin/${selectedCategory.id}`, form);

            setIsModalOpen(false);
            setIsDirty(false);

            // refresh data
            const res = await API.get("/api/admin");
            setAdmin(res.data.data);

            // ✅ SUCCESS
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Admin berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (err) {
            console.error("Update error:", err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat update",
            });
        }
    };

    return (
        <div className="flex h-screen bg-[#F5F1E5]">
            <Sidebar logout={logout} />

            <div className="flex-1 flex flex-col">
                <Navbar user={user} />

                <main className="flex-1 p-6 overflow-auto">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-80">
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                            />
                        </div>

                        <button className="flex items-center gap-2 bg-[#2F5231] text-white px-4 py-2 rounded-xl hover:opacity-90">
                            <img
                                src={iconPlusWhite}
                                alt="plus"
                                className="w-4 h-4"
                            />
                            <span>Tambah Admin</span>
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                        {/* HEADER */}
                        <div className="grid grid-cols-4 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231]">
                            <div>Nama</div>
                            <div>Deskripsi</div>
                            <div>Urut Tampilan</div>
                            <div>Aksi</div>
                        </div>

                        {/* LOADING */}
                        {loading && (
                            <div className="p-6 text-center text-gray-500">
                                Loading...
                            </div>
                        )}

                        {/* BODY */}
                        {!loading &&
                            filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-4 px-6 py-4 border-t items-center text-sm"
                                >
                                    <div className="font-medium">{item.name}</div>
                                    <div>{item.description}</div>
                                    <div>{item.sort_order}</div>

                                    <div>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-sm bg-[#EAE5D8] px-3 py-1 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}

                        {/* EMPTY */}
                        {!loading && filtered.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                Data tidak ditemukan
                            </div>
                        )}
                    </div>
                </main>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

                            <h2 className="text-lg font-semibold">Edit Admin</h2>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nama"
                                className="w-full border p-2 rounded"
                            />

                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Deskripsi"
                                className="w-full border p-2 rounded"
                            />

                            <input
                                name="sort_order"
                                value={form.sort_order}
                                onChange={handleChange}
                                placeholder="Sort Order"
                                className="w-full border p-2 rounded"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Batal
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-[#2F5231] text-white rounded"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;