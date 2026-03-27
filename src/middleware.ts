import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect agency routes — redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!user && request.nextUrl.pathname.startsWith("/listings/new")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!user && request.nextUrl.pathname.startsWith("/events/new")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!user && request.nextUrl.pathname.match(/^\/listings\/[^/]+\/edit$/)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/new",
    "/listings/:id/edit",
    "/events/new",
  ],
};
