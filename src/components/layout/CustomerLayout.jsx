import { Outlet } from "react-router-dom";
import TitleBar from "../ui/TitleBar.jsx";
import Home from "../../pages/Home.jsx";
import ItemCart from "../ui/ItemCart.jsx";

function CustomerLayout() {
    return (
        <div className="min-h-screen bg-[#F7F3Ef] pb-5">

            {/* TITLEBAR */}
            <TitleBar/>

            {/* <ItemCart /> */}

            {/* PAGE CONTENT */}
            <main>
                <Outlet />
            </main>

        </div>
    );
}

export default CustomerLayout;