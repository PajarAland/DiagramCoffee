function Navbar({ title = "Diagram"}) {

    return (
        <div className="w-full bg-[#2F5231] border-b px-4 py-3 flex items-center justify-center relative">

        {/* Title */}
        <h1 className="text-lg font-semibold text-white">
            {title}
        </h1>
        </div>
    );
}

export default Navbar;