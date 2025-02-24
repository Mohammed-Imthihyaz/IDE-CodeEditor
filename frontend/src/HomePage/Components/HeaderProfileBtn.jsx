import { LogOut, User, UserRoundPen } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

const HeaderProfileBtn = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const userEmail = user.email;
  const userName = user.name;
  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    await logout();
    console.log("signed-out successfully");
  };

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); 
  };

  return (
    <>
      <button
        className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
        onClick={handleToggleDropdown}
      >
        <User className="w-6 h-6 text-gray-600" />
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-150 bg-white rounded-lg shadow-xl border border-gray-100"
          onBlur={handleToggleDropdown}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="p-2 bg-gray-100 rounded-full">
                <UserRoundPen className="w-6 h-6 text-gray-600" />
              </span>
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">
                  {userName}
                </span>
                <br />
                <span className="text-xs text-gray-500">{userEmail}</span>
              </div>
            </div>
          </div>
          <ul>
            <li>
              <button
                className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
                onClick={handleProfileClick}
              >
                <span className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-2" />
                  Profile
                </span>
              </button>
            </li>

            <li>
              <button
                className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-100 transition duration-300"
                onClick={handleSignOut}
              >
                <span className="flex items-center">
                  <LogOut className="w-5 h-5 text-gray-500 mr-2" /> Sign Out
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default HeaderProfileBtn;
