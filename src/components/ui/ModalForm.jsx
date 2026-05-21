import Swal from "sweetalert2";

function ModalForm({
    isOpen,
    title,
    form,
    setForm,
    onClose,
    onSubmit,
    isDirty,
    setIsDirty,
    children,
}) {

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setIsDirty(true);
    };

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
            if (!result.isConfirmed) return;
        }
        onClose();
        setIsDirty(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-gray-900/40"
                onClick={handleCancel}
            />
            
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
                {/* Decorative circle */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#2F5231]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-[#2F5231]/10 rounded-full blur-2xl"></div>
                
                {/* Close button top right */}
                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                
                <div className="p-6 pt-8">
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        Isi data dengan benar
                    </p>
                    
                    <div className="space-y-4 mb-8">
                        {children(handleChange)}
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-2.5 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onSubmit}
                            className="flex-1 py-2.5 bg-[#2F5231] text-white font-semibold rounded-xl hover:bg-[#1e3a20] transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalForm;