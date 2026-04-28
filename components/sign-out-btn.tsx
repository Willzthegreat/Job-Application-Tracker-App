"use client";
import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function SignOutButton() {
    return (
      <DropdownMenuItem onClick={async () => await signOut() } className="mt-4 cursor-pointer">
        Log Out
      </DropdownMenuItem>
    )
}