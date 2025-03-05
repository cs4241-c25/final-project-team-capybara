import { Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

function Header() {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
          const res = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include",
          });
          if (res.ok) {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("username");

            navigate("/login");
          } else {
            console.error("Logout failed");
          }
        } catch (err) {
          console.error("Error logging out:", err);
        }
    };
    
    return (        
        <header className="bg-wpi-red border-b-2 border-shadow-red p-4 flex items-center">
            <span onClick={openNav} className="hover:bg-shadow-red pl-[6px] py-2"><Bars3Icon className="h-5 w-5 mr-3 ml-1 fill-white"></Bars3Icon></span>
            <a href="/main"><img src="/wpi.png" alt="WPI Logo" className="h-12 w-auto ml-4" /></a>

            <Button
              variant="outlined"
              color="white"
              onClick={handleLogout}
              className="hover:bg-shadow-red text-white font-body font-bold px-4 py-2 mx-4 rounded ml-auto"
            >
              Logout
            </Button>
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