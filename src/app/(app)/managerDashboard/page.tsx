"use client";

import { useSession } from "next-auth/react";

export default function ManagerDashboard() {
  const { data: session } = useSession();
  const companyName: string | null = session?.user.companyName;
  const showUsers = () => {};
  const liClass = "w-full h-10 p-2 bg-[#C4A682] rounded-lg text-center";
  return (
    <main className="w-full h-screen flex justify-start bg-slate-400">
      {/* sidebar */}
      <div className="w-60 h-full flex flex-col justify-start items-center px-2 py-5 space-y-5 bg-black text-white">
        <h1 className="max-sm:w-30 max-sm:text-lg w-full text-2xl text-center">
          {companyName ?? "companyName"}
        </h1>
        <ul className="w-full flex flex-col space-y-2">
          <li className={liClass} onClick={showUsers}>
            Users
          </li>
          <li className={liClass}>Forms</li>
        </ul>
      </div>
      <div className="w-full h-full"></div>
    </main>
  );
}
