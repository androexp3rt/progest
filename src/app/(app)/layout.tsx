"use client";
import Sidebar from "@/components/sidebar/sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <main className="w-full h-[calc(100vh-theme(space.20))] flex">
      <div className={`h-full transform ${isSidebarOpen ? "w-60" : "w-16"}`}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div
        className={`h-full overflow-hidden transform ${
          isSidebarOpen
            ? "w-[calc(100%-theme(space.60))]"
            : "w-[calc(100%-theme(space.16))]"
        }`}
      >
        {children}
      </div>
    </main>
  );
}
