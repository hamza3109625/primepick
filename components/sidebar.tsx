"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Users,
  Mail,
  FolderOpen,
  UserPlus,
  Send,
  Inbox,
  Archive,
  FileText,
  Upload,
  Download,
  LayoutDashboard,
  Building,
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
  href?: string;
  allowedRoles?: string[]; 
  subItems?: {
    title: string;
    icon: React.ElementType;
    href: string;
    allowedRoles?: string[]; 
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    allowedRoles: ["ADMIN", "INTERNAL_USER", "EXTERNAL_USER"], 
  },
  {
    title: "Users",
    icon: Users,
    allowedRoles: ["ADMIN"], 
    subItems: [
      { 
        title: "All Users", 
        icon: Users, 
        href: "/users",
        allowedRoles: ["ADMIN"]
      },
      { 
        title: "Add User", 
        icon: UserPlus, 
        href: "/users/create-user",
        allowedRoles: ["ADMIN"] 
      },
    ],
  },
  {
    title: "Company",
    icon: Building,
    allowedRoles: ["ADMIN"],
    subItems: [
      { 
        title: "List of Companies", 
        icon: LayoutDashboard, 
        href: "/company",
        allowedRoles: ["ADMIN"]
      },
    ],
  },
  {
    title: "Products",
    icon: FileText,
    allowedRoles: ["ADMIN"], 
    subItems: [
      { 
        title: "All Products", 
        icon: FileText, 
        href: "/products",
        allowedRoles: ["ADMIN"]
      }
    ],
  },
  {
    title: "File Management",
    icon: FolderOpen,
    allowedRoles: ["ADMIN", "INTERNAL_USER", "EXTERNAL_USER"],
    subItems: [
      { 
        title: "Upload Collection File", 
        icon: Upload, 
        href: "/file/upload",
        allowedRoles: ["ADMIN", "INTERNAL_USER", "EXTERNAL_USER"]
      },
      {
        title: "Download",
        icon: Download,
        href: "/file/download",
        allowedRoles: ["ADMIN", "INTERNAL_USER"]
      }
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>(["Users"]);
  const [username, setUsername] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [userRole, setUserRole] = useState<string>("EXTERNAL_USER");

  useEffect(() => {
    setMounted(true);

    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("roles") || "EXTERNAL_USER";

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    setUserRole(storedRole);
  }, []);

  // Helper function to check if user has access
  const hasAccess = (allowedRoles?: string[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole);
  };

  if (!mounted) {
    return (
      <aside className="w-64 h-screen bg-[#0E325D] border-r border-[#0E325D]/80" />
    );
  }

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const avatarInitial = username.trim().charAt(0).toUpperCase() || "A";

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems
    .filter(item => hasAccess(item.allowedRoles))
    .map(item => ({
      ...item,
      subItems: item.subItems?.filter(subItem => hasAccess(subItem.allowedRoles))
    }));

  return (
    <aside className="w-64 h-screen bg-[#0E325D] text-white flex flex-col border-r border-[#0E325D]/80">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-center">
        <img src="/logo-dark.png" alt="Logo" width="128" height="128" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredSidebarItems.map((item) =>
            item.subItems && item.subItems.length > 0 ? (
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
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === subItem.href
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
            ) : item.href ? (
              <a
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#007CFC] text-white"
                    : "text-white/80 hover:text-white hover:bg-[#EEFBFF]/10",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </a>
            ) : null,
          )}
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#007CFC] flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-white">
              {avatarInitial}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {username}
            </p>
            <p className="text-xs text-white/60 truncate">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}