import { MouseEvent, ReactNode } from "react";
import { number, string } from "zod";
import { Colors } from "../../types/frontend-types/color-types";

interface ButtonProps {
  children: ReactNode;
  width?: string;
  height?: string | number;
  borderRadius?: string | number;
  color?: Colors;
  fontSize?: number | string;
  gap?: string;
  padding?: string;
  classes?: string;
  clickCallback?: (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {};
  disabled?: boolean;
}

const colors = {
  [Colors.PEACH_ACTIVE]:
    "text-amber-900 bg-white hover:text-white hover:bg-rose-900",
  [Colors.PEACH_PRIMARY]:
    "text-rose-600 bg-white hover:text-white hover:bg-rose-900",
  [Colors.STEEL_GREY_PRIMARY]:
    "text-sky-900 bg-white hover:text-white hover:bg-sky-900",
  [Colors.PEACH_FOCUS]:
    "text-rose-500 bg-white hover:text-white hover:bg-rose-900",
  [Colors.STEEL_GREY_TEXT]:
    "text-gray-900 bg-white hover:text-white hover:bg-gray-900",
  [Colors.DANGER_RED]:
    "text-red-500 bg-white hover:text-white hover:bg-red-900",
  [Colors.DANGER_OPAQUE]:
    "text-red-500 bg-white hover:text-white hover:bg-red-900",
  [Colors.WARNING_YELLOW]:
    "text-amber-300 bg-white hover:text-white hover:bg-amber-900",
  [Colors.WARNING_YELLOW_DARK]:
    "text-yellow-700 bg-white hover:text-white hover:bg-rose-900",
  [Colors.SUCCESS_OPAQUE]:
    "text-green-300 bg-white hover:text-white hover:bg-rose-900",
  [Colors.INFO_DARK]:
    "text-slate-900 bg-white hover:text-white hover:bg-rose-900",
  [Colors.WARNING_OPAQUE]:
    "text-yellow-100 bg-white hover:text-white hover:bg-rose-900",
  [Colors.SUCCESS_DARK]:
    "text-lime-800 bg-white hover:text-white hover:bg-lime-900",
  [Colors.DANGER_DARK]:
    "text-red-900 bg-white hover:text-white hover:bg-red-900",
  [Colors.INFO_OPAQUE]:
    "text-blue-300 bg-white hover:text-white hover:bg-blue-900",
  [Colors.SUCCESS_GREEN]:
    "text-green-700 bg-white hover:text-white hover:bg-green-900",
  [Colors.DANGER_ROYAL]:
    "text-rose-800 bg-white hover:text-white hover:bg-rose-900",
  [Colors.DANGER_LIGHT]:
    "text-rose-300 bg-white hover:text-white hover:bg-rose-900",
  [Colors.SUCCESS_LIGHT]:
    "text-green-500 bg-white hover:text-white hover:bg-green-900",
  [Colors.SUCCESS_ROYAL]:
    "text-green-700 bg-white hover:text-white hover:bg-green-900",
  [Colors.WARNING_ROYAL]:
    "text-yellow=600 bg-white hover:text-white hover:bg-yellow-900",
  [Colors.WARNING_LIGHT]:
    "text-yellow-500 bg-white hover:text-white hover:bg-yellow-900",
  [Colors.INFO_ROYAL]:
    "text-blue-900 bg-white hover:text-white hover:bg-blue-900",
  [Colors.INFO_LIGHT]:
    "text-blue-400 bg-white hover:text-white hover:bg-blue-900",
  [Colors.INFO_BLUE]:
    "text-blue-800 bg-white hover:text-white hover:bg-blue-900",
  [Colors.STEEL_ACTIVE]:
    "text-sky-700 bg-white hover:text-white hover:bg-sky-900",
  [Colors.PEACH_DARK]:
    "text-yellow-800 bg-white hover:text-white hover:bg-rose-900",
};

const Button = ({
  children,
  color = Colors.PEACH_PRIMARY,
  width = "w-auto w-min-2",
  borderRadius = "rounded-6",
  height = "h-auto h-min-8",
  gap = "gap-1",
  fontSize = "text-14px",
  padding = "p-2",
  clickCallback,
  classes = "",
  disabled,
}: ButtonProps) => {
  let className = "";
  if (width) className += `${width} `;
  if (height) className += `${height} `;
  if (gap) className += `${gap} `;
  if (padding) className += `${padding} `;
  if (borderRadius) className += `${borderRadius} `;
  if (fontSize) className += `${fontSize} `;

  const colorClasses = colors[color];

  const allClasses = className + colorClasses + " " + classes;

  const handleClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    !!clickCallback && clickCallback(e);
  };

  return (
    <button
      onClick={(e) => handleClick}
      className={allClasses}
      disabled={disabled}
      role="button"
    >
      {children}
    </button>
  );
};

export default Button;
