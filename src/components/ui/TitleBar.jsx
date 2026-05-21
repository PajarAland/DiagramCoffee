import { useState } from "react";
import cartIcon from "../../assets/mdi--cart.svg";
import ItemCart from "../ui/ItemCart.jsx";
import CabangSelector from "./CabangSelector.jsx";
import { useAuth } from "../../context/useAuth";

function TitleBar() {
    const { user } = useAuth();
    const [showCart, setShowCart] = useState(false);

    const showCabangSelector = !user || (user.role !== "admin" && user.role !== "super_admin");

    return (
        <>
            <header className="
                sticky top-0 z-40
                bg-[#FFFFFF]/95 backdrop-blur-sm
                px-4 md:px-6 py-4
                flex justify-between items-center
                border-b border-[#E8E2D9]
            ">

                <div>
                    {showCabangSelector && <CabangSelector />}
                </div>

                <button
                    onClick={() => setShowCart(true)}
                    className="
                        w-11 h-11 md:w-14 md:h-14
                        rounded-xl md:rounded-2xl
                        bg-[#2F5D34]
                        flex items-center justify-center
                        relative
                    "
                >

                    <img
                        src={cartIcon}
                        alt="cart"
                        className="w-6 h-6 md:w-7 md:h-7"
                    />
                </button>

            </header>

            {showCart && (
                <ItemCart
                    onClose={() => setShowCart(false)}
                />
            )}
        </>
    );
}

export default TitleBar;