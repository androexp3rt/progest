"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <main className="w-full min-h-screen flex flex-col items-center p-20 text-white bg-gradient-to-br from-[#325777] to-[#000987] space-y-5">
      <h1 className="w-full text-center text-5xl font-bold">
        Welcome to ProGest
      </h1>
      {user ? (
        <>
          <p className="w-full text-center text-xl">
            Continue to your Dashboard
          </p>
          <Link
            className="p-3 bg-white font-bold rounded-lg text-black"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </>
      ) : (
        <>
          <p className="w-full text-center text-xl">
            Please SignIn to Continue
          </p>
          <Link
            className="p-3 bg-white font-bold rounded-lg text-black"
            href="/signin"
          >
            SignIn
          </Link>
        </>
      )}
    </main>
  );
}
