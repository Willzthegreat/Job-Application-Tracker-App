import { Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { getSession, ensureMongoConnection } from "@/lib/auth/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signOut } from "@/lib/auth/auth";




export default async function Navbar () {
  await ensureMongoConnection();
  const session = await getSession();



  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
            <Briefcase />
            Job Tracker
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/pages/dashboard">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-black">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" className="cursor-pointer">
                      <Avatar>
                        <AvatarFallback className="bg-primary  text-white font-bold">
                          {session.user.name[0].toUpperCase() ||'?'}
                        </AvatarFallback>  
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                        <p>{session.user.name}</p>
                        <p>{session.user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={await signOut() } className="mt-4 cursor-pointer">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (  <>
              <Link href="/pages/sign-in" className="cursor-pointer">
                <Button variant='ghost' className="text-gray-700 hover:cursor-pointer hover:text-black">
                  Log In
                </Button>
              </Link>
              <Link href="/pages/sign-up" className="cursor-pointer">
                <Button  className="bg-primary hover:cursor-pointer hover:bg-primary/90">
                  Start for free
                </Button>
              </Link>
            </>)}
          </div>
        </div>
      </nav>
    </>
  )
}

