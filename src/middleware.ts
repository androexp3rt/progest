// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
// import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/options";

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(request: NextRequestWithAuth) {
//     // console.log(request.nextUrl.pathname);
//     // console.log(request.nextauth.token);
//     if (
//       request.nextUrl.pathname.startsWith("/adminDashboard") &&
//       request.nextauth.token?.role !== "admin"
//     ) {
//       return NextResponse.rewrite(new URL("/denied", request.url));
//     }
//     if (
//       request.nextUrl.pathname.startsWith("/dashboard") &&
//       request.nextauth.token?.role === "admin"
//     ) {
//       return NextResponse.rewrite(new URL("/adminDashboard", request.url));
//     }

//     if (
//       request.nextUrl.pathname.startsWith("/managerDashboard") &&
//       request.nextauth.token?.role !== "admin" &&
//       request.nextauth.token?.role !== "manager"
//     ) {
//       return NextResponse.rewrite(new URL("/denied", request.url));
//     }
//     if (
//       request.nextUrl.pathname.startsWith("/dashboard") &&
//       request.nextauth.token?.role === "manager"
//     ) {
//       return NextResponse.rewrite(new URL("/managerDashboard", request.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export default async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.rewrite(new URL("/signin", request.url));
    } else if (user.role === "admin") {
      return NextResponse.rewrite(new URL("/adminDashboard", request.url));
    } else if (user.role === "manager") {
      return NextResponse.rewrite(new URL("/managerDashboard", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/adminDashboard")) {
    if (!user) {
      return NextResponse.rewrite(new URL("/signin", request.url));
    } else if (user.role === "user") {
      return NextResponse.rewrite(new URL("/denied", request.url));
    } else if (user.role === "manager") {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/managerDashboard")) {
    if (!user) {
      return NextResponse.rewrite(new URL("/signin", request.url));
    } else if (user.role === "user") {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }
  }
}

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/adminDashboard", "/dashboard", "/managerDashboard"],
};
