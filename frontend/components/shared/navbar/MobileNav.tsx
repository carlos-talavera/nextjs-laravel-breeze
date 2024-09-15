"use client"

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { useUser } from "@/context/UserProvider";
import iconMapping from "@/lib/icon-mapping";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavContentProps {
  userAreaId: number | undefined;
  pathname: string;
}

const NavContent = ({
  userAreaId,
  pathname
}: NavContentProps) => {
  return (
    <section className="flex h-full flex-col justify-between gap-6 px-4 py-10">
      <div className="px-1.5 py-2">
        <h2 className="h2-bold text-white">
          <Link href="/">MD MX</Link>
        </h2>
      </div>
      {sidebarLinks.map((group, groupIndex) => {
        // Checar si el usuario tiene permisos dentro de
        // algún enlace del grupo
        const hasPermission = group.links.some((link) =>
          link.allowedAreas.includes(userAreaId as number)
        );

        // Si no tiene permisos, no mostrar el grupo
        if (!hasPermission) return null;

        return (
          <div
            className="flex flex-col gap-2 outline-none"
            key={`sidebar-link-${groupIndex}`}
          >
            {group.title && (
              <div className="subtle-regular tracking-tight text-gray-300">
                {group.title}
              </div>
            )}
            {group.links.map((link, linkIndex) => {
              // Checar si el usuario tiene permisos
              // para ver el enlace
              const hasPermission = link.allowedAreas.includes(
                userAreaId as number
              );

              // Si no tiene permisos, no mostrar el enlace
              if (!hasPermission) return null;

              const IconComponent = iconMapping[
                link.iconName
              ] as React.ComponentType<{
                className: string;
              }>;

              const isActive =
                (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

              return (
                <SheetClose
                  asChild
                  key={`sidebar-link-${groupIndex}-${linkIndex}`}
                >
                  <Link
                    className={`flex flex-col gap-1 ${isActive ? "text-white" : "text-gray-300"} rounded-md transition-colors hover:text-white`}
                    href={link.route}
                  >
                    <div className="flex items-center gap-2 py-1.5 pl-1.5 pr-[5px]">
                      <div className="flex items-center gap-3">
                        <IconComponent className="size-3.5" />
                        <p className="small-medium">{link.label}</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}

const MobileNav = () => {
  const { user } = useUser();
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
              userAreaId={user?.area.id}
              pathname={pathname}
            />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav