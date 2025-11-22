"use client";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
export default function SignOutLink() {
  const handleLogout = () => {
    toast("", { description: "Logout Successful" });
  };
  return (
    <SignOutButton>
      <Link
        href={`/`}
        className="w-full text-left"
        onClick={handleLogout}>
        Logout
      </Link>
    </SignOutButton>
  );
}
