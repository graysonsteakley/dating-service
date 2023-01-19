import { ReactNode } from "react";
import { useState } from "react";
import { FaComment } from "react-icons/fa";

interface GridCardProps {
  children: ReactNode;
  users: {
    id: number;
    name: string;
    img: string;
  }[];
}

const GridCard = ({ users }) => {
  const [cardGrid, setCardGrid] = useState(users);

  return (
    <div className="grid cursor-pointer gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {cardGrid.map((item) => (
        <div
          key={item.id}
          className=" mx-4 mb-2 max-w-xs rounded-lg bg-white hover:drop-shadow-2xl"
        >
          <img
            alt="card image"
            src={item.img}
            className="h-40 w-40 rounded-t-lg object-cover"
          />
          <h1 className="flex items-center justify-between px-2 py-2 pt-2 text-xl font-semibold tracking-tight text-gray-800">
            {item.name}
            <FaComment className="text-blue-500 hover:text-blue-700" />
          </h1>
        </div>
      ))}
    </div>
  );
};

export default GridCard;
