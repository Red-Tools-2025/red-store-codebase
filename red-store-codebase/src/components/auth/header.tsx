import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string; // Changed to lowercase `string`
  heading: string; // Changed to lowercase `string`
}

export const Header = ({ label, heading }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2">
      {/* Heading aligned to the left */}
      <h1
        className={cn(
          "text-3xl font-semibold font-inter text-left",
          font.className
        )}
      >
        {heading}
      </h1>

      {/* Label with grey color and smaller font size */}
      <p className="text-gray-500 font-inter text-sm text-left">{label}</p>
    </div>
  );
};
