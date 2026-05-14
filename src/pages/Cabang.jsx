import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/ui/SidebarAdmin.jsx";
import Navbar from "../components/ui/TitleBar.jsx";
import API from "../services/api";
import { Navigate } from "react-router-dom";

function Cabang() {

    const [search, setSearch] = useState("");
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("edit"); // "add" | "edit"

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const res = await API.get("/api/admin/branches");
                setBranches(res.data.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBranches();
    }, []);

    // FILTER SEARCH
    const filtered = branches.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        status: "active",
        opening_time: "",
        closing_time: "",
    });

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

            // refresh
            const res = await API.get("/api/admin/branches");
            setBranches(res.data.data);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text:
                    mode === "edit"
                        ? "Cabang berhasil diperbarui"
                        : "Cabang berhasil ditambahkan",
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
        <>
            <main className="flex-1 p-6 overflow-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Search branch..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setMode("add");
                            setSelectedBranch(null);
                            setForm({
                                name: "",
                                address: "",
                                phone: "",
                                status: "active",
                                opening_time: "",
                                closing_time: "",
                            });
                            setIsDirty(false);
                            setIsModalOpen(true);
                        }}
                        className="bg-[#2F5231] text-white px-4 py-2 rounded-xl"
                    >
                        Tambah Cabang
                    </button>

                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                    {/* HEADER */}
                    <div className="grid grid-cols-6 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231]">

                        <div>Nama</div>
                        <div>Alamat</div>
                        <div>No. HP</div>
                        <div>Status</div>
                        <div>Jam</div>
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
                                className="grid grid-cols-6 px-6 py-4 border-t items-center text-sm"
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-600">{item.address}</div>
                                <div>{item.phone}</div>

                                <div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            item.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                    {item.status}
                                    </span>
                                </div>

                                <div>{item.opening_time} - {item.closing_time}</div>

                                <div>
                                    {/* <button className="w-8 h-8 bg-[#EAE5D8] rounded-lg"></button> */}
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-sm bg-[#EAE5D8] px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => Navigate("/admin/cabang/1")} 
                                        className="text-sm bg-[#EAE5D8] px-3 py-1 rounded-lg"
                                    >
                                        Admin
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

                        {/* <h2 className="text-lg font-semibold">Edit Cabang</h2> */}
                        <h2 className="text-lg font-semibold">
                            {mode === "edit" ? "Edit Cabang" : "Tambah Cabang"}
                        </h2>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nama"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Alamat"
                            className="w-full border p-2 rounded"
                        />

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="No HP"
                            className="w-full border p-2 rounded"
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <div className="flex gap-2">
                            <input
                                type="time"
                                name="opening_time"
                                value={form.opening_time}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="time"
                                name="closing_time"
                                value={form.closing_time}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>

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
        </>
    );
}

export default Cabang;