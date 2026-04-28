import { getSession } from "./lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";


export default async function proxy(request: NextRequest) {

    const session = await getSession(); 

    const isDashboardPage = request.nextUrl.pathname.startsWith("/pages/dashboard");
    if (isDashboardPage && !session?.user) {
        return NextResponse.redirect(new URL("/pages/sign-in", request.url));
    }
    
    
    const inSignInPage = request.nextUrl.pathname.startsWith("/pages/sign-in");
    const inSignUpPage = request.nextUrl.pathname.startsWith("/pages/sign-up");
    
    
    if ((inSignInPage || inSignUpPage) && session?.user) {
        return NextResponse.redirect(new URL("/pages/dashboard", request.url));
    }

    
    return NextResponse.next();
}