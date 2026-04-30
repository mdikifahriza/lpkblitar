import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  // Route restrictions for unauthenticated users
  if (isAdminRoute && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Route restrictions for authenticated users
  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Superadmin Only Routes Protection
  if (
    user && 
    (request.nextUrl.pathname.startsWith('/admin/settings') || 
     request.nextUrl.pathname.startsWith('/admin/users'))
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If user is not superadmin or profile doesn't exist, redirect to dashboard
    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
