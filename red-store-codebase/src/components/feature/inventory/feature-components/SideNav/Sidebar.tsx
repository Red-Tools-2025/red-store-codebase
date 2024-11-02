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
} from "lucide-react";
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuList = [
    {
      group: "General",
      items: [
        { links: "/", text: "Profile", icon: <User /> },
        { link: "/", text: "Inbox", icon: <Inbox /> },
        { link: "/", text: "Billing", icon: <Receipt /> },
        { link: "/", text: "Logs", icon: <Logs /> },
      ],
    },
    {
      group: "Settings",
      items: [
        { links: "/", text: "General Settings", icon: <Settings /> },
        { link: "/", text: "Privacy", icon: <GlobeLock /> },
        { link: "/", text: "Notification", icon: <Bell /> },
      ],
    },
  ];

  return (
    <div>
      {/* Toggle button to open sidebar */}
      <button
        className="block lg:hidden p-2 border rounded-md m-2"
        onClick={toggleSidebar}
      >
        <Menu size={24} className="text-black " />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[300px] min-w-[300px] border-r p-4 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 lg:static lg:block`}
      >
        {/* Close button inside the sidebar */}
        {isOpen && (
          <button
            className="absolute top-4 right-4 p-2"
            onClick={toggleSidebar}
          >
            <X size={24} className="text-black" />
          </button>
        )}

        <div>
          <UserItem />
        </div>
        <div className="grow mt-8">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              {menuList.map((menu: any, key: number) => (
                <CommandGroup key={key} heading={menu.group}>
                  {menu.items.map((options: any, optionKey: number) => (
                    <CommandItem key={optionKey}>
                      {options.icon}
                      {options.text}
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandGroup>
              ))}
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </div>
        <div className="mt-4">Settings / Notifications</div>
      </div>
    </div>
  );
}
