import { Outlet } from "react-router-dom";
import SidebarAdmin from "../ui/SideBarAdmin.jsx";
import { useAuth } from "../../context/useAuth";

function AdminLayout() {
    const { logout } = useAuth();
    
    return (
        <div className="min-h-screen bg-[#F5F1E5]">
            <SidebarAdmin logout={logout} />
            
            {/* MAIN CONTENT*/}
            <main className="lg:ml-64 p-4 md:p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;