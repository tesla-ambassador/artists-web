"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md text-white w-full"
                : "bg-none w-full"
            }
          >
            <Link href={item.url}>
              <SidebarMenuButton
                tooltip={item.title}
                className={
                  currentRoute === item.url
                    ? "hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:rounded-md hover:text-white w-full"
                    : "bg-none w-full"
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
