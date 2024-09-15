import ThemeSwitch from "@/components/shared/navbar/ThemeSwitch";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="background-light900_black flex min-h-screen flex-col">
      <div className="flex h-[60px] w-full items-center justify-end px-6">
        <ThemeSwitch />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="card-wrapper flex max-w-[500px] flex-col gap-4 rounded-md p-5 sm:min-w-[400px]">
          <h1 className="text-gray900_light850 text-center text-3xl font-bold leading-tight">
            Next - Breeze
          </h1>
          {children}
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
