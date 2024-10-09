import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "@/components/signInForm";

export const metadata: Metadata = {
  title: "SignIn",
};
export default function SignInPage() {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen pt-20 space-y-20 bg-gradient-to-br from-blue-500 to-black/10">
      <div className="max-sm:w-[90vw] w-full max-w-md p-8 space-y-8 bg-slate-200/30 backdrop-blur-sm rounded-lg shadow-2xl">
        <div className="text-center text-[#333333]">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back
          </h1>
          <p className="mb-4 text-lg">Please sign in to continue</p>
        </div>
        <SignInForm />
        <div className="flex items-center justify-center flex-wrap space-y-2 text-center py-2 text-[#343666] text-lg">
          <span>Not a member yet?</span>
          <Link
            href="/signup"
            className="text-white hover:text-white/50 active:bg-white/30 border border-white px-3 py-2 rounded-xl ml-2"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
