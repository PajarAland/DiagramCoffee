import Swal from "sweetalert2";

function FormModal({
    isOpen,
    onClose,
    title,
    fields = [],
    form,
    setForm,
    onSubmit,
}) {
    if (!isOpen) return null;

    const handleChange = (e) => {
        let { name, value } = e.target;

        const field = fields.find(f => f.name === name);

        // 🔥 auto type casting
        if (field?.type === "number") {
            value = Number(value);
        }

        if (field?.type === "boolean") {
            value = value === "true";
        }

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        const confirm = await Swal.fire({
            title: "Yakin?",
            icon: "question",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        await onSubmit();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

                <h2 className="text-lg font-semibold">{title}</h2>

                {fields.map(field => {
                    if (field.type === "select") {
                        return (
                            <select
                                key={field.name}
                                name={field.name}
                                value={form[field.name] ?? ""}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">-- Pilih --</option>
                                {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        );
                    }

                    return (
                        <input
                            key={field.name}
                            name={field.name}
                            value={form[field.name] ?? ""}
                            onChange={handleChange}
                            placeholder={field.label}
                            className="w-full border p-2 rounded"
                        />
                    );
                })}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
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
    );
}

export default FormModal;