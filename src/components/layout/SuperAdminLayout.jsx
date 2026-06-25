import { Outlet } from "react-router-dom";
import SidebarAdmin from "../ui/SideBarAdmin.jsx";
import { useAuth } from "../../context/useAuth";
import { useState, useEffect } from "react";

function SuperAdminLayout() {
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F1E5]">
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-0 z-30 m-3 p-2 bg-[#2F5231] text-white rounded-lg shadow-lg hover:bg-[#1e3820] transition-all active:scale-95"
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="
                        absolute
                        top-4
                        right-4
                        z-50
                        w-9
                        h-9
                        rounded-lg
                        bg-white/10
                        hover:bg-white/20
                        text-white
                        flex
                        items-center
                        justify-center
                        transition-all
                    "
                >

                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />

                    </svg>

                </button>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
                ${isMobile
                    ? `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
                    : 'translate-x-0 w-64 lg:w-72'
                }
            `}>
                <SidebarAdmin logout={logout} onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300 min-h-screen flex flex-col
                ${isMobile ? 'w-full' : 'lg:ml-64'}
            `}>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div onClick={closeSidebar}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SuperAdminLayout;