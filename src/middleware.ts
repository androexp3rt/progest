// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
// import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    console.log("not authenticated");
    if (!req.nextUrl.pathname.startsWith("/signin")) {
      console.log("redirect to signin");
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (token && req.nextUrl.pathname.startsWith("/dashboard")) {
    if (token.role === "admin") {
      return NextResponse.rewrite(new URL("/adminDashboard", req.url));
    } else if (token.role === "manager") {
      return NextResponse.rewrite(new URL("/managerDashboard", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/adminDashboard")) {
    if (token.role === "user") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    } else if (token.role === "manager") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  }
  if (token && req.nextUrl.pathname.startsWith("/managerDashboard")) {
    if (token.role === "user") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  }
}

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/signin", "/adminDashboard", "/dashboard", "/managerDashboard"],
};
