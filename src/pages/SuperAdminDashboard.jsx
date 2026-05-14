import SideBarAdmin from "../components/ui/SideBarAdmin.jsx";
import Navbar from "../components/ui/TitleBar.jsx";
import { useAuth } from "../context/useAuth.jsx";

function SuperAdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-[#F5F1E5]">

            <SideBarAdmin logout={logout} />

            <div className="flex-1 flex flex-col">
                <Navbar user={user} />

                <main className="flex-1 p-6">
                    {/* isi konten */}
                    <h1 className="text-2xl font-bold mb-4">Welcome to Super Admin Dashboard!!!</h1>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;