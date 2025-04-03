import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ user, fullMode = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { disconnectWallet } = useAuth();

    return (
        <div className="relative text-gray-700">
            {/* Profile */}
            <div
                className="flex items-center gap-2 ml-2 font-medium cursor-pointer"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
            >
                {fullMode && <p className="text-sm">Hello, {(user?.name?.length > 7 ? `${user?.name?.slice(0,7)}...`: user?.name) || "User"}</p>}
                <div className="flex items-center rounded-full bg-gray-200/50 w-max p-1">
                    {/* Show user avatar if available, otherwise show MdAccountCircle icon */}
                    {user?.profile?.profileImage ? (
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}${user?.profile?.profileImage}`}
                            alt="User Avatar"
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                        />
                    ) : (
                        <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <FaPowerOff size={24} className="text-red-500" /> {/* Bigger icon */}
                        </span>
                    )}

                    {/* Dropdown Icon */}
                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center">
                        <IoIosArrowDown size={20} className={`transition-transform ${isOpen ? "-rotate-180" : ""}`} />
                    </span>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[1000] right-0 mt-2 w-44 bg-white font-medium border rounded-md shadow-md">
                    <ul className="py-2 text-sm text-gray-700">
                        {fullMode &&
                            <>
                                <Link to={user?.lastRoleId === 2 ? "/promoter/profile" : user?.lastRoleId === 3 ? "/attendee/home" : ""} className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                                    <FiUser size={16} /> Profile
                                </Link>
                                <Link to={user?.lastRoleId === 2 ? "/promoter/settings" : user?.lastRoleId === 3 ? "/attendee/settings" : ""} className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                                    <FiSettings size={16} /> Settings
                                </Link>
                            </>
                        }
                        <li
                            className="px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                            onClick={disconnectWallet} // Call logout function
                        >
                            <FiLogOut size={16} /> Disconnect
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
