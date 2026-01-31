"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Users,
  Mail,
  FolderOpen,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  Inbox,
  Archive,
  FileText,
  Upload,
  Download,
} from "lucide-react";
import { cn } from "lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  subItems: {
    title: string;
    icon: React.ElementType;
    href: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Users",
    icon: Users,
    subItems: [
      { title: "All Users", icon: Users, href: "#all-users" },
      { title: "Add User", icon: UserPlus, href: "#add-user" },
      { title: "Active Users", icon: UserCheck, href: "#active-users" },
      { title: "Inactive Users", icon: UserX, href: "#inactive-users" },
    ],
  },
  {
    title: "Email Management",
    icon: Mail,
    subItems: [
      { title: "Inbox", icon: Inbox, href: "#inbox" },
      { title: "Sent", icon: Send, href: "#sent" },
      { title: "Drafts", icon: FileText, href: "#drafts" },
      { title: "Archive", icon: Archive, href: "#archive" },
    ],
  },
  {
    title: "File Management",
    icon: FolderOpen,
    subItems: [
      { title: "All Files", icon: FileText, href: "#all-files" },
      { title: "Upload", icon: Upload, href: "#upload" },
      { title: "Downloads", icon: Download, href: "#downloads" },
      { title: "Archived", icon: Archive, href: "#archived" },
    ],
  },
];

export function Sidebar() {
  const [openItems, setOpenItems] = useState<string[]>(["Users"]);
  const [activeItem, setActiveItem] = useState<string>("All Users");

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  return (
    <aside className="w-64 h-screen bg-[#0E325D] text-white flex flex-col border-r border-[#0E325D]/80">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-center">
        <img
          src="/logo-dark.png"
          alt="Logo"
          width="128"
          height="128"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <Collapsible
              key={item.title}
              open={openItems.includes(item.title)}
              onOpenChange={() => toggleItem(item.title)}
            >
              <CollapsibleTrigger
                className="
                  flex items-center justify-between w-full
                  px-3 py-2.5 rounded-lg
                  text-sm font-medium
                  text-white/80
                  hover:bg-[#EEFBFF]/10
                  transition-colors group
                "
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-white/60 group-hover:text-[#007CFC] transition-colors" />
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-white/50 transition-transform",
                    openItems.includes(item.title) && "rotate-180",
                  )}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1">
                <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.href}
                      onClick={() => setActiveItem(subItem.title)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        activeItem === subItem.title
                          ? "bg-[#007CFC] text-white"
                          : "text-white/70 hover:text-white hover:bg-[#EEFBFF]/10",
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </a>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#007CFC] flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-white/60 truncate">
              admin@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
