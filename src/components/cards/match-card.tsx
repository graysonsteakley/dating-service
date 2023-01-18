import { ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

interface MatchCardProps {
  children: ReactNode;
  user: {
    id: string;
    age: number;
    city: string;
    name: string;
  };
}

const MatchCard = ({ user }: MatchCardProps) => {
  return (
    <div className="flex justify-center rounded-lg hover:drop-shadow-xl">
      <div className="flex max-w-xs flex-col rounded-lg bg-white">
        <a>
          <img
            className="rounded-lg"
            alt="card"
            src="https://images5.alphacoders.com/951/thumb-1920-951748.jpg"
          />
        </a>
        <div className="flex flex-col p-3">
          <h5 className="mt-0 text-2xl font-extrabold text-gray-900">
            {user.name}, {user.age}
          </h5>
          <p className="mb-4 text-base text-gray-400">{user.city}</p>
          <div className="flex items-center justify-around pt-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 drop-shadow-xl hover:bg-red-700">
              <FaTimes className="h-6 w-6 text-white" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 drop-shadow-xl hover:bg-blue-700">
              <FaComment className="h-6 w-6 text-white" />
            </button>
            <button className=" flex h-12 w-12 items-center justify-center rounded-full bg-green-500 drop-shadow-xl hover:bg-green-700">
              <FaHeart className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
