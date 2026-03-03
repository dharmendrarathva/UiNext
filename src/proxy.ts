// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => {
//       if (!token) return false;
//       if (token.isBlocked) return false;
//       return true;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/protected/:path*"],
// };




import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/api/protected");

  if (isProtected) {
    if (!token || token.isBlocked) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};