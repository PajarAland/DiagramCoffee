import { NavLink } from "react-router-dom";
import { useState } from "react";
import dashboardIconWhite from "../../assets/mdi--view-dashboard-white.svg";
import dashboardIconGold from "../../assets/mdi--view-dashboard-gold.svg";
import houseIconWhite from "../../assets/mdi--house-group-white.svg";
import houseIconGold from "../../assets/mdi--house-group-gold.svg";
import coffeeIconWhite from "../../assets/mdi--coffee-white.svg";
import coffeeIconGold from "../../assets/mdi--coffee-gold.svg";
import categoryIconWhite from "../../assets/mdi--category-plus-white.svg";
import categoryIconGold from "../../assets/mdi--category-plus-gold.svg";
import logOutIcon from "../../assets/mdi--logout.svg";

function Sidebar({ logout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const NavItems = () => (
        <nav className="space-y-2 px-4">

            <NavLink
                to="/superadmin/cabang"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                            ? "bg-[#3B6B3D] text-[#F9C350] font-medium"
                            : "hover:bg-[#3B6B3D]"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? houseIconGold : houseIconWhite}
                            alt="cabang"
                            className="w-5 h-5"
                        />
                        <span>Cabang</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/superadmin/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                            ? "bg-[#3B6B3D] text-[#F9C350] font-medium"
                            : "hover:bg-[#3B6B3D]"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? dashboardIconGold : dashboardIconWhite}
                            alt="dashboard"
                            className="w-5 h-5"
                        />
                        <span>Dashboard</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/superadmin/categories"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                            ? "bg-[#3B6B3D] text-[#F9C350] font-medium"
                            : "hover:bg-[#3B6B3D]"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? categoryIconGold : categoryIconWhite}
                            alt="categories"
                            className="w-5 h-5"
                        />
                        <span>Categories</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/superadmin/item-menu"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                            ? "bg-[#3B6B3D] text-[#F9C350] font-medium"
                            : "hover:bg-[#3B6B3D]"
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <img
                            src={isActive ? coffeeIconGold : coffeeIconWhite}
                            alt="menu"
                            className="w-5 h-5"
                        />
                        <span>Item Menu</span>
                    </>
                )}
            </NavLink>
        </nav>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2F5231] text-white rounded-lg shadow-lg"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isMobileMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-[#2F5231] text-white flex-col justify-between py-6 fixed h-full shadow-xl z-40">
                <div>
                    <h1 className="text-xl font-semibold px-6 mb-8">
                        Diagram
                    </h1>
                    <NavItems />
                </div>
                <div className="px-4">
                    {/* <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#3B6B3D] rounded-lg w-full text-left transition-colors"
                    >
                        <span>Logout</span>
                    </button> */}

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#3B6B3D] rounded-lg w-full text-left transition-colors"
                    >
                        <img
                            src={logOutIcon}
                            alt="logout"
                            className="w-5 h-5"
                        />

                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`
                    lg:hidden fixed top-0 left-0 w-64 bg-[#2F5231] text-white 
                    flex flex-col justify-between py-6 h-full shadow-xl z-40
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div>
                    <div className="flex justify-between items-center px-6 mb-8">
                        <h1 className="text-xl font-semibold">
                            Diagram
                        </h1>
                        <button
                            onClick={closeMobileMenu}
                            className="lg:hidden text-white hover:text-[#F9C350]"
                        >
                            <svg
                                className="w-6 h-6"
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
                    </div>
                    <NavItems />
                </div>
                <div className="px-4">
                    <button
                        onClick={() => {
                            logout();
                            closeMobileMenu();
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#3B6B3D] rounded-lg w-full text-left transition-colors"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default SidebarAdmin;