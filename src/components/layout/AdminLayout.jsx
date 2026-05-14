// components/layout/SuperAdminLayout.jsx
import { Outlet } from "react-router-dom"; // Import Outlet
import SidebarAdmin from "../ui/SideBarAdmin.jsx";
import { useAuth } from "../../context/useAuth"; // Import useAuth

function AdminLayout() {
    const { logout } = useAuth(); // Get logout from context instead of props
    
    return (
        <div className="min-h-screen bg-[#F5F1E5]">
            <SidebarAdmin logout={logout} />
            
            {/* Main content area with responsive margin */}
            <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet /> {/* This will render the child routes */}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;