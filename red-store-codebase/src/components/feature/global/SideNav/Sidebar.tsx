"use client";
import { useState } from "react";
import {
  Bell,
  GlobeLock,
  Inbox,
  Logs,
  Menu,
  Receipt,
  Settings,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";

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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuList = [
    {
      group: "General",
      items: [
        { links: "/", text: "DashBoard", icon: <User /> },
        { link: "/", text: "Accounting", icon: <Inbox /> },
        { link: "/", text: "Inventory", icon: <Receipt /> },
        { link: "/", text: "Invoicing", icon: <Logs /> },
        { link: "/", text: "Goods Sold", icon: <Logs /> },
        { link: "/", text: "Users", icon: <Logs /> },
        { link: "/", text: "Sales Report", icon: <Logs /> },
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
            <UserItem name={session?.user?.name} email={session?.user?.email} />
          </div>

          <div className="grow mt-8">
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                {menuList.map((menu, key) => (
                  <CommandGroup key={key} heading={menu.group}>
                    {menu.items.map((options, optionKey) => (
                      <CommandItem key={optionKey}>
                        {options.icon}
                        <span className="ml-2">{options.text}</span>
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
