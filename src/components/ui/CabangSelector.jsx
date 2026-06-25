import { useEffect, useRef, useState } from "react";
import arrowDownIcon from "../../assets/mdi--arrow-down.svg";
import { useBranch } from "../../context/useBranch";

function BranchSelector() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { branches, selectedBranch, changeBranch } = useBranch();

    const selectedBranchData = branches.find((branch) => branch.id === Number(selectedBranch)); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white border border-[#E5DED3] rounded-xl px-3 py-2 shadow-sm min-w-[170px] max-w-[220px] transition-all hover:border-[#2F5231]/30"
            >
                <div className="flex-1 text-left min-w-0">
                    <p className="text-[10px] text-gray-400 leading-none">Cabang</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                        {selectedBranchData?.name || "Pilih Cabang"}
                    </p>
                </div>

                <img
                    src={arrowDownIcon}
                    alt="open"
                    className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border border-[#E5DED3] rounded-2xl shadow-xl overflow-hidden z-50">
                    {branches.map((branch) => {
                        const active = Number(selectedBranch) === branch.id;

                        return (
                            <button
                                key={branch.id}
                                onClick={async () => {
                                    await changeBranch(branch.id);
                                    setOpen(false);
                                    window.location.reload();
                                }}
                                className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                                    active ? "bg-[#2F5231] text-white" : "hover:bg-[#F5F1E5] text-gray-700"
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-medium">{branch.name}</p>
                                    {branch.address && (
                                        <p className={`text-xs mt-0.5 ${active ? "text-white/70" : "text-gray-400"}`}>
                                            {branch.address}
                                        </p>
                                    )}
                                </div>

                                {active && (
                                    <div className="w-2 h-2 rounded-full bg-[#F9D96B]"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default BranchSelector;