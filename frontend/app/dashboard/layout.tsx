import LeftSidebar from "@/components/shared/LeftSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light900_black relative">
      <div className="flex">
        <LeftSidebar />
        <div className="background-light900_black min-h-screen flex-1">
          <Navbar />
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>

      <Toaster />
    </main>
  );
};

export default Layout;
