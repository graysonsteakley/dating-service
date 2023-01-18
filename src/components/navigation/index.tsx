import Link from "next/link";
import { ReactNode } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

interface GridCardProps {
  children: ReactNode;
}

const Navigation = () => {
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
      </ul>
    </nav>
  );
};

export default Navigation;
