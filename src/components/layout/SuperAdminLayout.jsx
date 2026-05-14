// // components/layout/SuperAdminLayout.jsx
// import { Outlet } from "react-router-dom"; // Import Outlet
// import SidebarAdmin from "../ui/SideBarAdmin.jsx";
// import { useAuth } from "../../context/useAuth"; // Import useAuth
// import TitleBar from "../ui/TitleBar.jsx";

// function SuperAdminLayout() {
//     const { logout } = useAuth(); // Get logout from context instead of props
    
//     return (
//         <div className="min-h-screen bg-[#F5F1E5]">
//             <SidebarAdmin logout={logout} />
            
//             {/* Main content area with responsive margin */}
//             <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
//                 <div className="max-w-7xl mx-auto">
//                     <Outlet /> {/* This will render the child routes */}
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default SuperAdminLayout;

// components/layout/SuperAdminLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import SidebarAdmin from "../ui/SideBarAdmin.jsx";
import { useAuth } from "../../context/useAuth";
import TitleBar from "../ui/TitleBar.jsx";
import { useState, useEffect } from "react";

function SuperAdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();
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

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [location, isMobile]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Get page title from route
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        const titles = {
            dashboard: 'Dashboard',
            categories: 'Categories',
            cabang: 'Branches',
            'item-menu': 'Menu Items'
        };
        return titles[path] || 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-[#F5F1E5]">
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-[#2F5231] text-white 
                             rounded-lg shadow-lg hover:bg-[#1e3820] transition-all
                             active:scale-95"
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                              strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
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
                <TitleBar 
                    title={getPageTitle()}
                    action={
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Add any global actions here, like notifications or profile */}
                            <button className="p-1.5 md:p-2 hover:bg-white/50 rounded-full 
                                            transition-colors relative">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" 
                                          strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    }
                />
                
                {/* Content Area */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SuperAdminLayout;