"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EXPIRED_SESSION_ROUTE } from "@/constants";
import { useUser } from "@/context/UserProvider";
import { logout } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const { user, deleteUser } = useUser();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-8 cursor-pointer select-none flex-col items-center justify-center gap-2.5 rounded-full bg-black p-2.5 dark:bg-slate-700">
        <p className="paragraph-regular text-white">
          {user?.name.charAt(0).toUpperCase()}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow_darknone background-light900_dark rounded-lg p-1.5">
        <p className="text-gray700_light850 body-regular px-2 py-1.5">
          {user?.name}
        </p>
        <p className="text-gray700_light850 body-regular px-2 py-1.5">
          {user?.email}
        </p>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-gray700_light850 cursor-pointer hover:bg-light-800 dark:hover:bg-zinc-950"
          onClick={async () => {
            await logout();
            router.push(EXPIRED_SESSION_ROUTE);
            deleteUser();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu