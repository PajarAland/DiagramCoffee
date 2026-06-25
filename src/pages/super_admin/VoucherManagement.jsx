import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import ModalForm from "../../components/ui/ModalForm";

function VoucherManagement() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [form, setForm] = useState({
        name: "",
        code: "",
        discount_amount: "",
        min_transaction_amount: "",
        points_required: "",
        is_active: true,
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/vouchers");
            setVouchers(res.data.data || []);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data voucher",                    
            });

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const load =
            async () => {
                await fetchData();
            };
        load();
    }, [fetchData]);

    const resetForm = () => {
        setForm({ name: "", code: "", discount_amount: "", min_transaction_amount: "", points_required: "", is_active: true });
        setSelectedVoucher(null);
        setIsDirty(false);
    };

    const openCreateModal = () => {
        resetForm();
        setMode("create");
        setIsModalOpen(true);
    };

    const openEditModal = (voucher) => {
        setSelectedVoucher(voucher);
        setForm({
            name: voucher.name || "",
            code: voucher.code || "",
            discount_amount: voucher.discount_amount || "",
            min_transaction_amount: voucher.min_transaction_amount || "",
            points_required: voucher.points_required || "",
            is_active: voucher.is_active,
        });
        setMode("edit");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                discount_amount: Number(form.discount_amount),
                min_transaction_amount: Number(form.min_transaction_amount),
                points_required: Number(form.points_required),
            };

            if (mode === "create") {
                await API.post("/api/admin/vouchers", payload);
            } else {
                await API.put(`/api/admin/vouchers/${selectedVoucher.id}`, payload);
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: mode === "create" ? "Voucher berhasil ditambahkan" : "Voucher berhasil diperbarui",
                timer: 1500,
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", 
                title: "Gagal", 
                text: err.response?.data?.message || "Terjadi kesalahan" 
            });
        }
    };

    const handleDelete = async (voucher) => {
        const result = await Swal.fire({
            title: "Hapus voucher?",
            text: "Voucher akan dihapus permanen",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });
        if (!result.isConfirmed) return;

        try {
            await API.delete(`/api/admin/vouchers/${voucher.id}`);
            
            Swal.fire({ 
                icon: "success", 
                title: "Berhasil", 
                text: "Voucher berhasil dihapus", 
                timer: 1200, 
                showConfirmButton: false 
            });
            fetchData();
        } catch (err) {
            console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal menghapus voucher",
                        
                });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Voucher Loyalty</h1>
                        <p className="text-gray-500 mt-1">Kelola voucher reward customer</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-[#2F5231] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1e3a20] transition-all shadow-md">
                        + Tambah Voucher
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vouchers.map((voucher) => (
                        <div key={voucher.id} className="relative bg-gradient-to-br from-[#2F5231] to-[#1e3a20] rounded-3xl overflow-hidden shadow-xl text-white">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full" />

                            <div className="relative p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-white/70 mb-2">Voucher</p>
                                        <h2 className="text-2xl font-bold">{voucher.name}</h2>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${voucher.is_active ? "bg-green-400 text-black" : "bg-red-400 text-black"}`}>
                                        {voucher.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="mt-6 border border-dashed border-white/30 rounded-2xl px-4 py-3 bg-white/10 backdrop-blur-sm">
                                    <p className="text-xs text-white/70 mb-1">Voucher Code</p>
                                    <p className="text-xl font-bold tracking-wider">{voucher.code}</p>
                                </div>

                                <div className="mt-6 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Discount</span>
                                        <span className="font-semibold">{formatPrice(voucher.discount_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Min Transaction</span>
                                        <span className="font-semibold">{formatPrice(voucher.min_transaction_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Points Required</span>
                                        <span className="font-semibold">{voucher.points_required} pts</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button onClick={() => openEditModal(voucher)} className="flex-1 py-2.5 rounded-xl bg-white text-[#2F5231] font-semibold hover:bg-gray-100 transition-all">Edit</button>
                                    <button onClick={() => handleDelete(voucher)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all">Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalForm
                isOpen={isModalOpen}
                title={mode === "create" ? "Tambah Voucher" : "Edit Voucher"}
                form={form}
                setForm={setForm}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
            >
                {(handleChange) => (
                    <div className="space-y-4">
                        <input type="text" name="name" placeholder="Nama Voucher" value={form.name} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none" />
                        <input type="text" name="code" placeholder="Kode Voucher" value={form.code} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none uppercase" />
                        <input type="number" name="discount_amount" placeholder="Jumlah Diskon" value={form.discount_amount} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none" />
                        <input type="number" name="min_transaction_amount" placeholder="Minimal Transaksi" value={form.min_transaction_amount} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none" />
                        <input type="number" name="points_required" placeholder="Point Required" value={form.points_required} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none" />
                        <select name="is_active" value={form.is_active ? "1" : "0"} onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })} className="w-full border rounded-xl px-4 py-3 outline-none">
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                )}
            </ModalForm>
        </div>
    );
}

export default VoucherManagement;