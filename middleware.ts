import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          // Primero actualizar las cookies del request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Luego actualizar las cookies del response
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: usar getUser() refresca el token automáticamente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // 1. Sin sesión → redirigir al inicio
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // 2. Verificar rol admin en la BD
    const { data: profile } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    // 3. Sin rol admin → redirigir al website
    if (!profile || profile.rol !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/website";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};