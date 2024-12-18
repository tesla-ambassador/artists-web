"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const currentRoute = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title}
            className={
              currentRoute === item.url
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md text-white"
                : "bg-none"
            }
          >
            <SidebarMenuButton
              tooltip={item.title}
              className={
                currentRoute === item.url
                  ? "hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:rounded-md hover:text-white"
                  : "bg-none"
              }
            >
              {item.icon && <item.icon />}
              <a href={item.url}>
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
