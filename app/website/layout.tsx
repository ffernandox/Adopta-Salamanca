"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/website/profile");

  return (
    <section>
      {!isProfilePage && <Navbar />}
      {children}
    </section>
  );
}