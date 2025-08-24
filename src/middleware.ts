import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin", 
    "/auth/signup",
    "/api/auth"
  ]
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If not authenticated and trying to access a protected route
  if (!req.auth && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return Response.redirect(signInUrl)
  }
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (req.auth && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
    return Response.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
