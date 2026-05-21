import {
    useBranch,
} from "../context/useBranch";

function BranchGuard({ children }) {
    const {
        branches,
        loading,
        selectedBranch,
        changeBranch,
    } = useBranch();

    if (loading) {
        return null;
    }

    if (!selectedBranch) {
        return (
            <div className="fixed inset-0 bg-[#F8F5F0] flex items-center justify-center z-[999] p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">

                    <h1 className="text-2xl font-bold text-[#2F5231] mb-2">
                        Pilih Cabang
                    </h1>

                    <p className="text-sm text-gray-500 mb-6">
                        Pilih cabang untuk
                        mulai memesan
                    </p>

                    <div className=" flex flex-col gap-3">
                        {branches.map((branch) => (
                            <button
                                key={branch.id}
                                onClick={() => {
                                    changeBranch(branch.id);
                                }}
                                className="p-4 rounded-2xl border border-[#ECE6DC] hover:border-[#2F5231] hover:bg-[#F8F5F0] transition-all text-left"
                            >
                                <p className="font-semibold text-[#2F5231]">
                                    {branch.name}
                                </p>

                                <p className=" text-sm text-gray-400 mt-1">
                                    {branch.address}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return children;
}

export default BranchGuard;