import Image from "next/image";
import LogoV1 from "@/public/logos/Logov1.svg";
import { usePathname } from "next/navigation";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import React from "react";

const NavigationLinks: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sales", href: "/sales" },
  { label: "Inventory", href: "/inventory" },
  { label: "Stores", href: "/management" },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <div className="py-4 border-b border-gray-300 px-10 max-w-[100%] flex items-center justify-between">
      {/* Logo + search links */}
      <div className="flex flex-row gap-6 items-center">
        <Image src={LogoV1} alt="Logo" height={140} width={140} />
        <div className="flex flex-row gap-5 items-center">
          {NavigationLinks.map((link, i) => {
            return (
              <a
                className={`text-[14px] font-medium text-gray-600 transition-all hover:text-black hover:font-semibold
                    ${
                      pathname.includes(link.href)
                        ? "text-red-600 px-3 bg-red-100 rounded-md py-1"
                        : ""
                    }`}
                key={i}
                href={link.href}
              >
                <div className="flex flex-row gap-2 items-center">
                  {/* <> {React.createElement(link.icon)}</> */}

                  <p>{link.label}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row items-center gap-5">
        <IoSettingsOutline size={20} />
        <IoNotificationsOutline size={20} />
      </div>
    </div>
  );
};

export default Header;
