import { Bars3Icon } from "@heroicons/react/24/solid";

function Header() {
    return (
        <header className="bg-[#A9B0B7] p-4 w-[100vw] flex items-center">
            <span onClick={openNav}><Bars3Icon className="h-5 w-5 mr-3 ml-1"></Bars3Icon></span>
            <img src="/wpi.png" alt="WPI Logo" className="h-12 w-auto ml-4" />
        </header>
    );
}

function openNav() {
    [...document.querySelectorAll(".sidebarItem")].forEach((item, y) => item.style.visibility = "visible");
    document.getElementById("closebtn").style.visibility = "visible";
    document.getElementById("sidebar").style.width = "100%";
    document.getElementById("sidebar").style.visibility = "visible";   
}

export default Header;