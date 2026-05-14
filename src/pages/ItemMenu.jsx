import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import iconPlusWhite from "../assets/mdi--plus-thick-white.svg";
import MenuCard from "../components/ui/MenuCard.jsx";

function ItemMenu() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [mode, setMode] = useState("edit");

    useEffect(() => {
        const load = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    API.get("/api/menu-items"),
                    API.get("/api/categories"),
                ]);

                setItems(menuRes.data.data);
                setCategories(catRes.data.data);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        base_price: "",
        is_active: "1",
        image_url: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "category_id") {
            newValue = Number(value);
        }

        if (name === "base_price") {
            newValue = Number(value);
        }

        setForm({
            ...form,
            [name]: newValue,
        });

        setIsDirty(true);
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

                await API.post(
                    `/api/admin/menu-items/${selectedItem.id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                await API.post(`/api/admin/menu-items`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text:
                    mode === "edit"
                        ? "Menu berhasil diupdate"
                        : "Menu berhasil ditambahkan",
            });

            setIsModalOpen(false);
            setIsDirty(false);

            const res = await API.get("/api/menu-items");
            setItems(res.data.data);

        } catch (err) {
            console.log(err.response?.data);

            await Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan",
            });
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none"
                    />
                </div>

                <button
                    onClick={() => {
                        setMode("add");
                        setSelectedItem(null);

                        setForm({
                            category_id: "",
                            name: "",
                            description: "",
                            base_price: "",
                            is_active: "1",
                            image_url: null,
                        });

                        setIsDirty(false);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#2F5231] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                >
                    <img src={iconPlusWhite} alt="plus" className="w-4 h-4" />
                    <span>Tambah Menu</span>
                </button>
                    
            </div>

            {loading && (
                <div className="p-6 text-center text-gray-500">
                    Loading...
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {filtered.map((item) => (
                        <MenuCard
                            key={item.id}
                            item={item}
                            onClick={(item) =>
                                navigate(`/admin/menu-items/${item.id}`)
                            }
                        />
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <p className="text-center text-gray-500">
                    Data tidak ditemukan
                </p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-[400px] space-y-3">

                        {/* <h2>Edit Menu</h2> */}
                        <h2>
                            {mode === "edit" ? "Edit Menu" : "Tambah Menu"}
                        </h2>

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">-- Pilih Kategori --</option>

                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <input
                            name="name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border p-2"
                        />

                        <input
                            name="description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border p-2"
                        />

                        <input
                            name="base_price"
                            value={form.base_price}
                            onChange={(e) =>
                                setForm({ ...form, base_price: e.target.value })
                            }
                            className="w-full border p-2"
                        />

                        <select
                            name="is_active"
                            value={form.is_active}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    image_url: e.target.files[0],
                                })
                            }
                            className="w-full border p-2"
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
        </>    
    );
}

export default ItemMenu;