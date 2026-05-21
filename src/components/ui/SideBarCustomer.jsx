import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import homeIcon from "../../assets/mdi--home-white.svg";
import homeActiveIcon from "../../assets/mdi--home-gold.svg";
import menuIcon from "../../assets/mdi--coffee-white.svg";
import menuActiveIcon from "../../assets/mdi--coffee-gold.svg";
import historyIcon from "../../assets/mdi--history-white.svg";
import historyActiveIcon from "../../assets/mdi--history-gold.svg";
import profileIcon from "../../assets/mdi--user-white.svg";
import profileActiveIcon from "../../assets/mdi--user-gold.svg";
import voucherIconWhite from "../../assets/mdi--voucher-white.svg";
import voucherIconGold from "../../assets/mdi--voucher-gold.svg";
import logOutIcon from "../../assets/mdi--logout.svg";

function SidebarUser() {
    const { logout } = useAuth();
    const menus = [
        {
            label: "Home",
            path: "/home",
            icon: homeIcon,
            activeIcon: homeActiveIcon,
        },
        {
            label: "Menu",
            path: "/menu",
            icon: menuIcon,
            activeIcon: menuActiveIcon,
        },
        {
            label: "Riwayat",
            path: "/history",
            icon: historyIcon,
            activeIcon: historyActiveIcon,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: profileIcon,
            activeIcon: profileActiveIcon,
        },
        {
            label: "My Vouchers",
            path: "/myvoucher",
            icon: voucherIconWhite,
            activeIcon: voucherIconGold,
        },
    ];

    const mobileMenus = menus.slice(0, 4);
    
    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-[#ECE6DC] flex-col justify-between py-6 z-40">
                <div>
                    {/* LOGO */}
                    <div className="px-6 mb-10">
                        <h1 className="text-2xl font-bold text-[#2F5231]">Diagram</h1>
                    </div>

                    {/* NAV */}
                    <nav className="flex flex-col gap-2 px-4">
                        {menus.map((menu) => (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                                    isActive ? "bg-[#2F5231] text-white" : "text-[#2F5231] hover:bg-[#F5F1EA]"
                                }`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <img src={isActive ? menu.activeIcon : menu.icon} alt={menu.label} className="w-5 h-5" />
                                        <span>{menu.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="px-2 lg:px-4">
                    <button
                        onClick={async () => {
                            try {
                                await logout();
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                        className="flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:px-4 hover:bg-red-900/20 hover:text-red-400 rounded-xl w-full text-left transition-all duration-200 text-[#2F5231]"
                        title="Logout"
                    >
                        <img src={logOutIcon} alt="logout" className="w-5 h-5 shrink-0" />
                        <span className="hidden lg:block text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* MOBILE BOTTOM NAV */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#ECE6DC] z-50 px-2 py-2">
                <div className="grid grid-cols-4 gap-1">
                    {mobileMenus.map((menu) => (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all ${
                                isActive ? "bg-[#2F5231]/10" : ""
                            }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <img src={isActive ? menu.activeIcon : menu.icon} alt={menu.label} className="w-5 h-5" />
                                    <span className={`text-[11px] font-medium ${isActive ? "text-[#2F5231]" : "text-gray-400"}`}>
                                        {menu.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
}

export default SidebarUser;