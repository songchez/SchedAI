import { auth, signIn, signOut } from "@/auth";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/SchedAILogo.png";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import MobileDropDown from "./MobileDropdownMenu";

export default async function CustomNavbar() {
  const session = await auth();

  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ base: "bg-white/40 dark:bg-black/10" }}
    >
      <NavbarBrand>
        <Link href="/" className="flex gap-2 items-center">
          <Image src={Logo} alt="logo" height={30} width={30} />
          <h1 className="text-xl font-bold text-primary ">SchedAI</h1>
        </Link>
      </NavbarBrand>
      {/* theme */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Link href={"/chat"} className="hover:text-primary-300">
          <p>✨ChatBot</p>
        </Link>
        <Link href={"/dashboard"} className="hover:text-primary-300">
          <p>Dashboard</p>
        </Link>
        <Link href={"/pricing"} className="hover:text-primary-300">
          <p>Pricing</p>
        </Link>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          {/* client component */}
          <MobileDropDown session={session} />
        </NavbarItem>
        <NavbarItem className="hidden md:inline-block">
          <div>
            {session ? (
              <>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button type="submit">Sign Out</Button>
                </form>
              </>
            ) : (
              <form
                className="btn btn-primary"
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button type="submit">Sign in</Button>
              </form>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
