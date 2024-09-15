"use client"

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DASHBOARD_ROUTE, sidebarLinks } from "@/constants";
import iconMapping from "@/lib/icon-mapping";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavContentProps {
  pathname: string;
}

const NavContent = ({
  pathname
}: NavContentProps) => {
  return (
    <section className="flex h-full flex-col justify-between gap-6 px-4 py-10">
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

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Bars3Icon
          className="text-slate600_light900 size-9 lg:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="custom-scrollbar overflow-y-auto border-none bg-black dark:bg-zinc-900"
      >
        <div>
          <SheetClose asChild>
            <NavContent
              pathname={pathname}
            />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav