"use client";

import Link from "next/link";
import Logo from "@/images/SchedAILogo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavLogo() {
  const pathname = usePathname();

  return !pathname.includes("/chat") ? (
    <Link href="/" className="flex gap-2 items-center">
      <Image src={Logo} alt="logo" height={30} width={30} />
      <h1 className="text-xl font-bold text-primary ">SchedAI</h1>
    </Link>
  ) : (
    <span></span> // TITLE
  );
}
