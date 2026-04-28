import { useNavigate } from "react-router-dom";

function Navbar({ title = "Diagram", showBack = false }) {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-[#2F5231] border-b px-4 py-3 flex items-center justify-center relative">
        
        {/* Back button (optional) */}
        {showBack && (
            <button
            onClick={() => navigate(-1)}
            className="absolute left-4 text-[#2F5D34]"
            >
            ←
            </button>
        )}

        {/* Title */}
        <h1 className="text-lg font-semibold text-[#2F5D34]">
            {title}
        </h1>
        </div>
    );
}

export default Navbar;