import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/api";
import ModalForm from "../../components/ui/ModalForm";
import deleteIcon from "../../assets/mdi--delete.svg";

function FeeManagement() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [form, setForm] = useState({
        key: "",
        label: "",
        value: "",
        type: "fixed",
    });

    const fetchFees = async () =>{
        const res = await API.get("/api/admin/settings/fee");
        setFees(res.data.data || []);
    };

    useEffect(() => {
        const loadFees = async () => {
            try {
                await fetchFees();
            } catch (err) {
                console.error("Fetch error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal mengambil data fee",
                });
            } finally {
                setLoading(false);
            }
        };
        loadFees();
    }, []);

    const filtered = fees.filter(
        (item) =>
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.key.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await API.put(`/api/admin/settings/fee/${form.key}`, form);
            } else {
                await API.post("/api/admin/settings/fee", form);
            }

            setIsModalOpen(false);

            setForm({
                key: "",
                label: "",
                value: "",
                type: "fixed",
            });

            await fetchFees();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: isEdit
                    ? "Fee berhasil diperbarui"
                    : "Fee berhasil ditambahkan",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err?.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Hapus Fee?",
            text: item.label,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Hapus",
        });

        if (!result.isConfirmed) return;

        try {
            await API.delete(`/api/admin/settings/fee/${item.key}`);

            await fetchFees();

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Fee berhasil dihapus",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (item) => {
        setIsEdit(true);

        setForm({
            key: item.key,
            label: item.label,
            value: item.value,
            type: item.type,
        });

        setIsModalOpen(true);
    };

    return (
        <main className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Fee Management
                    </h1>

                    <p className="text-sm text-gray-500">
                        Kelola biaya tambahan aplikasi
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEdit(false);

                        setForm({
                            key: "",
                            label: "",
                            value: "",
                            type: "fixed",
                        });

                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-[#2F5231] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e3a20] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                    + Tambah Fee
                </button>
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
                    placeholder="Cari fee..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2F5231] focus:ring-2 focus:ring-[#2F5231]/20 transition-all"
                />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-5 bg-[#EAE5D8] px-6 py-4 text-sm font-semibold text-[#2F5231]">
                    <div>Key</div>
                    <div>Label</div>
                    <div>Value</div>
                    <div>Type</div>
                    <div className="text-center">Aksi</div>
                </div>

                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2F5231] border-t-transparent"></div>
                        <p className="mt-3 text-gray-500 text-sm">Loading...</p>
                    </div>
                )}

                {!loading && filtered.map((item) => (
                        <div key={item.id} className="grid md:grid-cols-5 px-6 py-4 border-t items-center">
                            <div>{item.key}</div>

                            <div>{item.label}</div>

                            <div>
                                {item.type === "percentage"
                                    ? `${item.value}%`
                                    : `Rp${Number(
                                          item.value
                                      ).toLocaleString(
                                          "id-ID"
                                      )}`}
                            </div>

                            <div>
                                <span className="px-3 py-1 rounded-full text-xs bg-[#EAE5D8] text-[#2F5231]">
                                    {item.type}
                                </span>
                            </div>

                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() =>
                                        openEdit(item)
                                    }
                                    className="px-3 py-2 bg-blue-50 rounded-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(item)
                                    }
                                    className="p-2 bg-red-50 rounded-lg"
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
            </div>

            {!loading && filtered.length === 0 && (
                <div className="p-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Fee tidak ditemukan
                    </p>

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="mt-3 text-[#2F5231] text-sm font-medium hover:underline"
                        >
                            Hapus filter
                        </button>
                    )}
                </div>
            )}

            <ModalForm
                isOpen={isModalOpen}
                title={
                    isEdit
                        ? "Edit Fee"
                        : "Tambah Fee"
                }
                form={form}
                setForm={setForm}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            >
                {(handleChange) => (
                    <div className="space-y-4">
                        <input
                            name="key"
                            value={form.key}
                            disabled={isEdit}
                            onChange={handleChange}
                            placeholder="admin_fee"
                            className="w-full px-4 py-3 border rounded-xl"
                        />

                        <input
                            name="label"
                            value={form.label}
                            onChange={handleChange}
                            placeholder="Admin Fee"
                            className="w-full px-4 py-3 border rounded-xl"
                        />

                        <input
                            name="value"
                            type="number"
                            value={form.value}
                            onChange={handleChange}
                            placeholder="2000"
                            className="w-full px-4 py-3 border rounded-xl"
                        />

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl"
                        >
                            <option value="fixed">
                                Fixed
                            </option>

                            <option value="percentage">
                                Percentage
                            </option>
                        </select>
                    </div>
                )}
            </ModalForm>
        </main>
    );
}

export default FeeManagement;