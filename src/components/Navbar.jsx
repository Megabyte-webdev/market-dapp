import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { FaBars, FaTimes } from "react-icons/fa";
import Btn from "./Btn";
import logo from "../assets/logo2.png";

const Navbar = () => {
  const { account, connectWallet, isLoading } = useAuth();
  const [menu, setMenu] = useState(false);
  const location = useLocation(); // Get current route location

  // Close menu when route changes
  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const navbarHeight = document.querySelector('nav').offsetHeight; // Get the height of the navbar
      const sectionOffset = section.offsetTop;
      window.scrollTo({
        top: sectionOffset - navbarHeight, // Adjust the scroll position to account for the navbar
        behavior: 'smooth',
      });
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 mx-auto px-3 flex px-sm md:px-md lg:px-lg justify-between items-center flex-wrap md:flex-nowrap transition-all duration-300 bg-white shadow-md">
      <NavLink to="/" className="flex justify-center items-center mx-2 mr-auto">
        <img src={logo} alt="Logo" className="w-28 object-contain" />
      </NavLink>

      <div className={`${!menu ? "hidden" : "absolute min-h-8 top-28 left-0 right-0 bg-white flex flex-col gap-2 p-4"} lg:flex lg:flex-row lg:static lg:bg-transparent lg:items-center lg:gap-4 mx-auto gap-2 font-bold text-sm order-1 w-full lg:w-max lg:order-0`}>
      <NavLink to="#"
          onClick={() => scrollToSection("my-product")}
          className="text-slate-500 hover:text-slate-600"
        >
          Home
        </NavLink>
        <NavLink to="#"
          onClick={() => scrollToSection("my-product")}
          className="text-slate-500 hover:text-slate-600"
        >
          My Products
        </NavLink>
        <NavLink to="#"
          onClick={() => scrollToSection("market")}
          className="text-slate-500 hover:text-slate-600"
        >
          Market
        </NavLink>
        <NavLink to="#"
          onClick={() => scrollToSection("about")}
          className="text-slate-500 hover:text-slate-600"
        >
          About Us
        </NavLink>

        {!account && (
          <div className="cursor-default flex md:hidden items-center gap-3 lg:order-2">
            <Btn
              title="Connect"
              loc={connectWallet}
              styl="bg-transparent border-2 border-primary text-primary"
            />
          </div>
        )}
      </div>

      {account ? (
        <div className="lg:order-2 ml-auto hidden md:flex items-center gap-4 text-gray-600">
          <ProfileDropdown user={account} fullMode={true} />
        </div>
      ) : (
        <div className="hidden md:flex items-center justify-center gap-3 lg:order-2 ml-auto">
          <Btn
            title={isLoading ? "Connecting..." : "Connect"}
            loc={connectWallet}
            styl="bg-transparent border-2 border-primary text-primary"
          />
        </div>
      )}

      {account && (
        <div className="lg:order-2 ml-auto flex md:hidden items-center gap-4 text-gray-600">
          <ProfileDropdown user={account} />
        </div>
      )}

      <div
        onClick={() => setMenu(!menu)}
        className="mx-2 block lg:hidden transition-all ease-in-out duration-300 cursor-pointer"
      >
        {!menu ? <FaBars size={24} /> : <FaTimes size={24} />}
      </div>
    </nav>
  );
};

export default Navbar;
