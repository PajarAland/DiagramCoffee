import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import dashboardIconWhite from "../../assets/mdi--view-dashboard-white.svg";
import dashboardIconGold from "../../assets/mdi--view-dashboard-gold.svg";
import houseIconWhite from "../../assets/mdi--house-group-white.svg";
import houseIconGold from "../../assets/mdi--house-group-gold.svg";
import coffeeIconWhite from "../../assets/mdi--coffee-white.svg";
import coffeeIconGold from "../../assets/mdi--coffee-gold.svg";
import categoryIconWhite from "../../assets/mdi--category-plus-white.svg";
import categoryIconGold from "../../assets/mdi--category-plus-gold.svg";
import receiptIconWhite from "../../assets/mdi--receipt-text-white.svg";
import receiptIconGold from "../../assets/mdi--receipt-text-gold.svg";
import cashRegIconWhite from "../../assets/mdi--cash-register-white.svg";
import cashRegIconGold from "../../assets/mdi--cash-register-gold.svg";
import bannerIconWhite from "../../assets/mdi--newspaper-variant-white.svg";
import bannerIconGold from "../../assets/mdi--newspaper-variant-gold.svg";
import voucherIconWhite from "../../assets/mdi--voucher-white.svg";
import voucherIconGold from "../../assets/mdi--voucher-gold.svg";
import logOutIcon from "../../assets/mdi--logout.svg";

function NavItems() {
    const { user } = useAuth();

    const superAdminMenus = [
        {
            label: "Dashboard",
            path: "/superadmin/dashboard",
            iconWhite: dashboardIconWhite,
            iconGold: dashboardIconGold,
        },
        {
            label: "Cabang",
            path: "/superadmin/cabang",
            iconWhite: houseIconWhite,
            iconGold: houseIconGold,
        },
        {
            label: "Categories",
            path: "/superadmin/categories",
            iconWhite: categoryIconWhite,
            iconGold: categoryIconGold,
        },
        {
            label: "Item Menu",
            path: "/superadmin/item-menu",
            iconWhite: coffeeIconWhite,
            iconGold: coffeeIconGold,
        },
        {
            label: "Banners",
            path: "/superadmin/banners",
            iconWhite: bannerIconWhite,
            iconGold: bannerIconGold,
        },
        {
            label: "Vouchers",
            path: "/superadmin/vouchers",
            iconWhite: voucherIconWhite,
            iconGold: voucherIconGold,
        },
    ];

    const adminMenus = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            iconWhite: dashboardIconWhite,
            iconGold: dashboardIconGold,
        },
        {
            label: "Manage Menu",
            path: "/admin/stock",
            iconWhite: coffeeIconWhite,
            iconGold: coffeeIconGold,
        },
        {
            label: "Manage Order",
            path: "/admin/orders",
            iconWhite: receiptIconWhite,
            iconGold: receiptIconGold,
        },
        {
            label: "Kasir",
            path: "/admin/orders/create",
            iconWhite: cashRegIconWhite,
            iconGold: cashRegIconGold,
        },
    ];

    const menus = user?.role === "super_admin" ? superAdminMenus : adminMenus;

    return (
        <nav className="space-y-2 px-2 lg:px-4">
            {menus.map((menu) => (
                <NavLink
                    key={menu.path}
                    to={menu.path}
                    className={({ isActive }) => `flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:px-4 rounded-xl transition-all duration-200 ${isActive ? "bg-[#3B6B3D] text-[#F9C350] font-bold shadow-inner" : "hover:bg-[#3B6B3D] text-white/80 hover:text-white"
                        }`}
                    title={menu.label}
                >
                    {({ isActive }) => (
                        <>
                            <img
                                src={isActive ? menu.iconGold : menu.iconWhite}
                                alt={menu.label}
                                className="w-5 h-5 shrink-0 transition-transform duration-200 hover:scale-110"
                            />
                            <span className="hidden lg:block text-sm font-medium tracking-wide">
                                {menu.label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}

function SidebarAdmin() {
    const { logout } = useAuth();

    return (
        <aside className="w-20 lg:w-64 bg-[#2F5231] text-white flex flex-col justify-between py-6 fixed h-full shadow-xl z-40 transition-all duration-300">
            <div>
                <div className="flex flex-col items-center lg:items-start px-4 mb-8">
                    <h1 className="text-xl font-bold tracking-tight text-[#F9C350] lg:hidden">D.</h1>
                    <h1 className="text-xl font-black tracking-tight text-white hidden lg:block px-2">Diagram Coffee</h1>
                </div>
                <NavItems />
            </div>

            <div className="px-2 lg:px-4">
                <button
                    onClick={logout}
                    className="flex items-center justify-center lg:justify-start gap-3 px-3 py-3 lg:px-4 hover:bg-red-900/20 hover:text-red-400 rounded-xl w-full text-left transition-all duration-200 text-white/80"
                    title="Logout"
                >
                    <img src={logOutIcon} alt="logout" className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:block text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default SidebarAdmin;