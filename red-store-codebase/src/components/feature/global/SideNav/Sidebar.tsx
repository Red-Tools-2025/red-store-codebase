"use client";
import { useState } from "react";
import {
  SquareChartGantt,
  Inbox,
  Receipt,
  User,
  ChevronLeft,
  ChevronRight,
  SquarePercent,
  UserCog,
  FileCheck2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link for navigation

import UserItem from "./UserItem";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuList = [
    {
      group: "General",
      items: [
        { link: "/dashboard", text: "DashBoard", icon: <User /> },
        { link: "/", text: "Accounting", icon: <Inbox /> },
        { link: "/inventory", text: "Inventory", icon: <Receipt /> },
        { link: "/management", text: "Management", icon: <SquareChartGantt /> },
        { link: "/", text: "Goods Sold", icon: <SquarePercent /> },
        { link: "/", text: "Users", icon: <UserCog /> },
        { link: "/sales", text: "Sales Report", icon: <FileCheck2 /> }, // Update the link for Sales Report
      ],
    },
  ];

  return (
    <div className="relative h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[300px] min-w-[300px] border-r bg-white transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-[256px]"
        }`}
      >
        {/* Sidebar Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div>
            <UserItem name={"Jhon"} email={session?.user?.email} />
          </div>

          <div className="grow mt-8">
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                {menuList.map((menu, key) => (
                  <CommandGroup key={key} heading={menu.group}>
                    {menu.items.map((options, optionKey) => (
                      <CommandItem
                        key={optionKey}
                        className="flex items-center space-x-2"
                      >
                        <Link
                          href={options.link}
                          className="flex items-center w-full"
                        >
                          {/* Make sure the icon and text are aligned properly */}
                          <span className="flex-shrink-0">{options.icon}</span>
                          <span className="ml-2">{options.text}</span>
                        </Link>
                      </CommandItem>
                    ))}
                    <CommandSeparator />
                  </CommandGroup>
                ))}
                <CommandEmpty>No results found.</CommandEmpty>
              </CommandList>
            </Command>
          </div>
        </div>

        {/* Toggle Button - Now at the bottom */}
        <button
          onClick={toggleSidebar}
          className={`absolute bottom-4 right-0 transform translate-x-full flex items-center justify-center w-6 h-12 bg-gray-700 border border-l-0 rounded-r-md`}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-white" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Overlay for clicking outside to close on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
