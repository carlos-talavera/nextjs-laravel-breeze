"use client"

import { DASHBOARD_ROUTE, sidebarLinks } from "@/constants";
import iconMapping from "@/lib/icon-mapping";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar sticky left-0 top-0 flex h-screen flex-col gap-6 overflow-y-auto overflow-x-hidden bg-black px-4 py-10 dark:bg-zinc-900 max-lg:hidden lg:w-[257px]">
      <div className="px-1.5 py-2">
        <h2 className="h2-bold text-white">
          <Link href={DASHBOARD_ROUTE}>NextJS - Breeze</Link>
        </h2>
      </div>
      {sidebarLinks.map((link) => {
        const IconComponent = iconMapping[
          link.iconName
        ] as React.ComponentType<{
          className: string;
        }>;

        const isActive =
          (pathname === link.route && link.route.length > 1) ||
          pathname === link.route;

        return (
          <Link
            key={`sidebar-link-${link.label}`}
            className={`flex flex-col gap-1 ${isActive ? "text-white" : "text-gray-300"} rounded-md outline-none transition-colors hover:text-white`}
            href={link.route}
          >
            <div className="flex items-center gap-2 py-1.5 pl-1.5 pr-[5px]">
              <div className="flex items-center gap-3">
                <IconComponent className="size-3.5" />
                <p className="small-medium">{link.label}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export default LeftSidebar