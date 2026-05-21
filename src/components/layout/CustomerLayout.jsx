import { Outlet, useLocation, } from "react-router-dom";
import { useEffect } from "react";
import TitleBar from "../ui/TitleBar.jsx";
import SidebarUser from "../ui/SidebarCustomer.jsx";

function CustomerLayout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#F7F3EF]">
            <SidebarUser />

            {/* CONTENT AREA */}
            <div className="lg:ml-64 min-h-screen flex flex-col">
                <TitleBar />

                {/* PAGE CONTENT */}
                <main className="flex-1 pb-24 lg:pb-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default CustomerLayout;