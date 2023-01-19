import { useState, useEffect } from "react";
import Link from "next/link";
import { ReactNode } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { AiOutlineSetting } from "react-icons/ai";

interface GridCardProps {
  children: ReactNode;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".dropdown") === null) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 left-0 z-10 flex h-16 justify-end bg-rose-100 p-2 text-xl text-gray-700">
      <ul className="flex w-1/2 gap-10">
        <li className="mr-6">
          <Link
            href="/home"
            className="flex flex-col items-center text-lg hover:text-rose-900"
          >
            <FaHome className="text-2xl" />
            Home
          </Link>
        </li>
        <li className="mr-6">
          <Link
            href="/search"
            className="flex flex-col items-center text-lg hover:text-rose-900"
          >
            <BiSearchAlt2 className="text-2xl" />
            Search
          </Link>
        </li>
        <li className="mr-6">
          <Link
            href="/chats"
            className="flex flex-col items-center text-lg hover:text-rose-900"
          >
            <FaComment className="text-2xl" />
            Chats
          </Link>
        </li>
        <li className="mr-6">
          <Link
            href="notifications"
            className="flex flex-col items-center text-lg hover:text-rose-900"
          >
            <FaBell className="text-2xl" />
            Notifications
          </Link>
        </li>
        <li className="relative mr-6">
          <button
            onClick={handleDropdownClick}
            className="flex flex-col items-center justify-center hover:text-rose-900"
          >
            <CgProfile className="pb-6 text-7xl" />
          </button>
          {isOpen && (
            <ul className="text-extrabold h-46 absolute top-14 -left-14 w-40 flex-col rounded-lg bg-white py-px text-gray-700 ">
              <Link href="profile">
                <li className="flex items-center justify-start py-2 pl-4 text-center hover:rounded-t-lg hover:bg-slate-100 hover:text-rose-900">
                  <CgProfile className="mr-3 inline text-2xl" />
                  Profile
                </li>
              </Link>
              <Link href="account">
                <li className="flex items-center justify-start py-2 pl-4 text-center hover:bg-slate-100 hover:text-rose-900 ">
                  <MdOutlineManageAccounts className="mr-3 inline text-2xl" />
                  Account
                </li>
              </Link>
              <Link href="settings">
                <li className="flex items-center justify-start py-2 pl-4 text-center hover:bg-slate-100 hover:text-rose-900">
                  <AiOutlineSetting className="mr-3 inline text-2xl" />
                  Settings
                </li>
              </Link>
              <Link href="log out">
                <li className="flex items-center justify-start py-2 pl-4 text-center hover:rounded-b-lg hover:bg-slate-100 hover:text-rose-900">
                  <RiShutDownLine className="mr-2 inline text-2xl" />
                  Log Out
                </li>
              </Link>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
