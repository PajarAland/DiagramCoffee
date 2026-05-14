import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function AdminProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState({});

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        base_price: "",
        is_active: true,
        image_url: "",
    });

    const baseImageUrl = "http://localhost:8000/storage/";

    useEffect(() => {
        const load = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    API.get(`/api/menu-items/${id}`),
                    API.get("/api/categories"),
                ]);

                const item = menuRes.data.data;

                setForm({
                    category_id: item.category_id,
                    name: item.name,
                    description: item.description,
                    base_price: item.base_price,
                    is_active: item.is_active,
                    image_url: item.image_url,
                });

                setImagePreview(`${baseImageUrl}${item.image_url}`);
                setCategories(catRes.data.data);

            } catch (err) {
                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Gagal load data",
                });

            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "category_id") {
            newValue = Number(value);
        }

        if (name === "base_price") {
            newValue = Number(value);
        }

        if (name === "is_active") {
            newValue = value === "true";
        }

        setForm({
            ...form,
            [name]: newValue,
        });
    };

    const handleImageFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
        ...form,
        image_url: file,
    });

    setImagePreview(URL.createObjectURL(file));
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

        // upload file hanya saat submit
        if (form.image_url instanceof File) {
            formData.append("image_url", form.image_url);
        }

        formData.append("_method", "PUT");

        await API.post(
            `/api/admin/menu-items/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Menu berhasil diupdate",
        });

        navigate("/superadmin/item-menu");

    } catch (err) {
        console.error(err);

        Swal.fire({
            icon: "error",
            title: "Gagal update data",
        });

    } finally {
        setSaving(false);
    }
};

    if (loading) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F1E5]">
            {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Edit Menu</h1>
                            <p className="text-gray-500 mt-1">Update your menu item details</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        form.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {form.is_active ? 'Active' : 'Inactive'}
                    </div>
                </div>
            <div className="grid md:grid-cols-1 gap-6">
                {/* HERO IMAGE */}
            <div className="space-y-4">
                <div className="relative group rounded-2xl w-full md:max-w-3xl md:mx-auto aspect-[4/3] overflow-hidden md:rounded-[32px]">
                    {imagePreview ? (
                        <>
                            <img
                                src={imagePreview}
                                alt={form.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileUpload}
                                        className="hidden"
                                    />
                                    Upload New
                                </label>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <label className="cursor-pointer bg-[#2F5231] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#1e3820] transition-all">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileUpload}
                                    className="hidden"
                                />
                                Upload Image
                            </label>
                        </div>
                    )}
                </div>
            </div>
            

            {/* CONTENT */}
            <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-3xl mx-auto p-6">

                    <div className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Menu Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nama Menu"
                                className="w-full p-4 rounded-2xl border"
                            />
                        </div>
                        

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Deskripsi"
                            rows={4}
                            className="w-full p-4 rounded-2xl border"
                        />

                        <input
                            type="number"
                            name="base_price"
                            value={form.base_price}
                            onChange={handleChange}
                            placeholder="Harga"
                            className="w-full p-4 rounded-2xl border"
                        />

                        {/* <input
                            type="text"
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-full p-4 rounded-2xl border"
                        /> */}

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="w-full p-4 rounded-2xl border"
                        >
                            <option value="">
                                Pilih Kategori
                            </option>

                            {categories.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            name="is_active"
                            value={form.is_active.toString()}
                            onChange={handleChange}
                            className="w-full p-4 rounded-2xl border"
                        >
                            <option value="true">
                                Active
                            </option>

                            <option value="false">
                                Inactive
                            </option>
                        </select>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#2F5231] text-white py-4 rounded-2xl text-lg"
                        >
                            Simpan Perubahan
                        </button>

                    </div>
                </div>
            </div>
            </div>
            
            
        </div>
    );
}

export default AdminProductDetail;

// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../services/api";
// import Swal from "sweetalert2";

// function AdminProductDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [categories, setCategories] = useState([]);
//     const [imagePreview, setImagePreview] = useState("");
//     const [errors, setErrors] = useState({});
//     const [dirty, setDirty] = useState({});

//     const [form, setForm] = useState({
//         category_id: "",
//         name: "",
//         description: "",
//         base_price: "",
//         is_active: true,
//         image_url: "",
//     });

//     const baseImageUrl = "http://localhost:8000/storage/";

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const [menuRes, catRes] = await Promise.all([
//                     API.get(`/api/menu-items/${id}`),
//                     API.get("/api/categories"),
//                 ]);

//                 const item = menuRes.data.data;

//                 setForm({
//                     category_id: item.category_id,
//                     name: item.name,
//                     description: item.description || "",
//                     base_price: item.base_price,
//                     is_active: item.is_active === 1 || item.is_active === true,
//                     image_url: item.image_url,
//                 });

//                 setImagePreview(`${baseImageUrl}${item.image_url}`);
//                 setCategories(catRes.data.data);

//             } catch (err) {
//                 console.error(err);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Failed to load",
//                     text: err.response?.data?.message || "Something went wrong",
//                     backdrop: true,
//                 }).then(() => navigate(-1));
//             } finally {
//                 setLoading(false);
//             }
//         };

//         load();
//     }, [id, navigate]);

//     const validateField = useCallback((name, value) => {
//         switch (name) {
//             case "name":
//                 if (!value?.trim()) return "Name is required";
//                 if (value.length < 3) return "Name must be at least 3 characters";
//                 if (value.length > 100) return "Name must be less than 100 characters";
//                 return "";
//             case "category_id":
//                 if (!value) return "Category is required";
//                 return "";
//             case "base_price":
//                 if (!value && value !== 0) return "Price is required";
//                 if (value <= 0) return "Price must be greater than 0";
//                 if (value > 999999999) return "Price is too high";
//                 return "";
//             case "image_url":
//                 if (!value?.trim()) return "Image URL is required";
//                 if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(value)) 
//                     return "Image must be JPG, PNG, WEBP, or SVG";
//                 return "";
//             default:
//                 return "";
//         }
//     }, []);

//     const validateForm = useCallback(() => {
//         const newErrors = {};
//         const fields = ["name", "category_id", "base_price", "image_url"];
        
//         fields.forEach(field => {
//             const error = validateField(field, form[field]);
//             if (error) newErrors[field] = error;
//         });
        
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     }, [form, validateField]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
        
//         let newValue = type === "checkbox" ? checked : value;
        
//         if (name === "category_id") newValue = Number(value);
//         if (name === "base_price") {
//             if (value === "") newValue = "";
//             else if (!isNaN(value) && value >= 0) newValue = Number(value);
//             return;
//         }
        
//         setForm(prev => ({ ...prev, [name]: newValue }));
//         setDirty(prev => ({ ...prev, [name]: true }));
        
//         const error = validateField(name, newValue);
//         setErrors(prev => ({ ...prev, [name]: error }));
//     };

//     const handleImageUrlChange = (e) => {
//         const url = e.target.value;
//         setForm(prev => ({ ...prev, image_url: url }));
//         setImagePreview(url ? `${baseImageUrl}${url}` : "");
//         setDirty(prev => ({ ...prev, image_url: true }));
        
//         const error = validateField("image_url", url);
//         setErrors(prev => ({ ...prev, image_url: error }));
//     };

//     const handleImageFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
//         if (!validTypes.includes(file.type)) {
//             Swal.fire("Invalid Format", "Please upload JPG, PNG, WEBP, or SVG", "error");
//             return;
//         }

//         if (file.size > 2 * 1024 * 1024) {
//             Swal.fire("File Too Large", "Maximum size is 2MB", "error");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("image", file);
//         formData.append("_method", "PUT");

//         try {
//             const response = await API.post(`/api/admin/menu-items/${id}/upload-image`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
            
//             const newImageUrl = response.data.data.image_url;
//             setForm(prev => ({ ...prev, image_url: newImageUrl }));
//             setImagePreview(`${baseImageUrl}${newImageUrl}`);
            
//             Swal.fire("Success", "Image uploaded successfully", "success");
//         } catch (err) {
//             console.error(err);
//             Swal.fire("Upload Failed", "Could not upload image", "error");
//         }
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Validation Failed",
//                 text: "Please check all fields and try again",
//                 confirmButtonColor: "#2F5231",
//             });
//             return;
//         }
        
//         setSaving(true);
        
//         try {
//             await API.put(`/api/admin/menu-items/${id}`, {
//                 ...form,
//                 base_price: Number(form.base_price),
//             });
            
//             await Swal.fire({
//                 icon: "success",
//                 title: "Updated!",
//                 text: "Menu item has been updated",
//                 timer: 2000,
//                 showConfirmButton: false,
//                 position: "top-end",
//                 toast: true,
//             });
            
//             navigate("/admin/menu-items");
            
//         } catch (err) {
//             console.error(err);
//             Swal.fire({
//                 icon: "error",
//                 title: "Update Failed",
//                 text: err.response?.data?.message || "Something went wrong",
//                 confirmButtonColor: "#2F5231",
//             });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDelete = async () => {
//         const result = await Swal.fire({
//             title: "Delete Menu?",
//             text: `Are you sure you want to delete "${form.name}"?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#2F5231",
//             confirmButtonText: "Yes, delete it!",
//             cancelButtonText: "Cancel",
//             backdrop: true,
//         });
        
//         if (result.isConfirmed) {
//             try {
//                 await API.delete(`/api/admin/menu-items/${id}`);
                
//                 await Swal.fire({
//                     icon: "success",
//                     title: "Deleted!",
//                     text: "Menu item has been deleted",
//                     timer: 2000,
//                     showConfirmButton: false,
//                     position: "top-end",
//                     toast: true,
//                 });
                
//                 navigate("/admin/menu-items");
                
//             } catch (err) {
//                 console.error(err);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Delete Failed",
//                     text: err.response?.data?.message || "Could not delete item",
//                     confirmButtonColor: "#2F5231",
//                 });
//             }
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-[#F5F1E5] to-[#e8e3d5] flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                     <div className="relative">
//                         <div className="w-16 h-16 border-4 border-[#2F5231] border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                     <p className="text-gray-600 font-medium">Loading menu item...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#F5F1E5] to-[#e8e3d5] py-8 px-4 md:py-12">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8 flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-110"
//                         >
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                                       d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                             </svg>
//                         </button>
//                         <div>
//                             <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Edit Menu</h1>
//                             <p className="text-gray-500 mt-1">Update your menu item details</p>
//                         </div>
//                     </div>
//                     <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         form.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                         {form.is_active ? 'Active' : 'Inactive'}
//                     </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                     {/* Image Section */}
//                     <div className="space-y-4">
//                         <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
//                             <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
//                                 {imagePreview ? (
//                                     <>
//                                         <img
//                                             src={imagePreview}
//                                             alt={form.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
//                                             <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-all">
//                                                 <input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     onChange={handleImageFileUpload}
//                                                     className="hidden"
//                                                 />
//                                                 Upload New
//                                             </label>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="w-full h-full flex flex-col items-center justify-center gap-4">
//                                         <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
//                                                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                         </svg>
//                                         <label className="cursor-pointer bg-[#2F5231] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#1e3820] transition-all">
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleImageFileUpload}
//                                                 className="hidden"
//                                             />
//                                             Upload Image
//                                         </label>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
                        
//                         {/* Image URL input as fallback */}
//                         <div className="bg-white rounded-xl p-4 shadow-sm">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Or enter image URL
//                             </label>
//                             <input
//                                 type="text"
//                                 value={form.image_url}
//                                 onChange={handleImageUrlChange}
//                                 placeholder="path/to/image.jpg"
//                                 className={`w-full px-4 py-2 rounded-lg border transition-all text-sm font-mono
//                                     ${errors.image_url && dirty.image_url 
//                                         ? 'border-red-500 focus:ring-red-500' 
//                                         : 'border-gray-300 focus:ring-[#2F5231]'
//                                     } focus:outline-none focus:ring-2`}
//                             />
//                             {errors.image_url && dirty.image_url && (
//                                 <p className="mt-1 text-xs text-red-500">{errors.image_url}</p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Form Section */}
//                     <div className="space-y-4">
//                         <div className="bg-white rounded-2xl shadow-lg p-6">
//                             <div className="space-y-5">
//                                 {/* Name */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Menu Name <span className="text-red-500">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={form.name}
//                                         onChange={handleChange}
//                                         placeholder="e.g., Nasi Goreng Special"
//                                         className={`w-full px-4 py-3 rounded-xl border transition-all
//                                             ${errors.name && dirty.name 
//                                                 ? 'border-red-500 focus:ring-red-500' 
//                                                 : 'border-gray-300 focus:ring-[#2F5231]'
//                                             } focus:outline-none focus:ring-2`}
//                                     />
//                                     {errors.name && dirty.name && (
//                                         <p className="mt-1 text-xs text-red-500">{errors.name}</p>
//                                     )}
//                                 </div>

//                                 {/* Category */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Category <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         name="category_id"
//                                         value={form.category_id}
//                                         onChange={handleChange}
//                                         className={`w-full px-4 py-3 rounded-xl border transition-all bg-white
//                                             ${errors.category_id && dirty.category_id 
//                                                 ? 'border-red-500 focus:ring-red-500' 
//                                                 : 'border-gray-300 focus:ring-[#2F5231]'
//                                             } focus:outline-none focus:ring-2`}
//                                     >
//                                         <option value="">Select category</option>
//                                         {categories.map((cat) => (
//                                             <option key={cat.id} value={cat.id}>
//                                                 {cat.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     {errors.category_id && dirty.category_id && (
//                                         <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>
//                                     )}
//                                 </div>

//                                 {/* Description */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Description
//                                     </label>
//                                     <textarea
//                                         name="description"
//                                         value={form.description}
//                                         onChange={handleChange}
//                                         placeholder="Describe your menu item..."
//                                         rows={3}
//                                         className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2F5231] resize-none"
//                                     />
//                                 </div>

//                                 {/* Price */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Price <span className="text-red-500">*</span>
//                                     </label>
//                                     <div className="relative">
//                                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//                                             Rp
//                                         </span>
//                                         <input
//                                             type="number"
//                                             name="base_price"
//                                             value={form.base_price}
//                                             onChange={handleChange}
//                                             placeholder="0"
//                                             className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all
//                                                 ${errors.base_price && dirty.base_price 
//                                                     ? 'border-red-500 focus:ring-red-500' 
//                                                     : 'border-gray-300 focus:ring-[#2F5231]'
//                                                 } focus:outline-none focus:ring-2`}
//                                         />
//                                     </div>
//                                     {errors.base_price && dirty.base_price && (
//                                         <p className="mt-1 text-xs text-red-500">{errors.base_price}</p>
//                                     )}
//                                 </div>

//                                 {/* Status Toggle */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Status
//                                     </label>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleChange({ target: { name: "is_active", type: "checkbox", checked: !form.is_active } })}
//                                         className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
//                                             form.is_active ? 'bg-[#2F5231]' : 'bg-gray-300'
//                                         }`}
//                                     >
//                                         <span
//                                             className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
//                                                 form.is_active ? 'translate-x-7' : 'translate-x-0'
//                                             }`}
//                                         />
//                                     </button>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="flex gap-3 pt-4">
//                                     <button
//                                         onClick={handleSubmit}
//                                         disabled={saving}
//                                         className="flex-1 bg-[#2F5231] text-white py-3 rounded-xl font-semibold
//                                                  hover:bg-[#1e3820] transition-all transform hover:scale-[1.02] 
//                                                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                                     >
//                                         {saving ? (
//                                             <span className="flex items-center justify-center gap-2">
//                                                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                                                 </svg>
//                                                 Saving...
//                                             </span>
//                                         ) : (
//                                             "Save Changes"
//                                         )}
//                                     </button>
                                    
//                                     <button
//                                         onClick={handleDelete}
//                                         className="px-6 bg-red-500 text-white py-3 rounded-xl font-semibold
//                                                  hover:bg-red-600 transition-all transform hover:scale-[1.02]"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminProductDetail;