import { auth, signIn } from "@/auth";
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
import MobileDropDown from "./MobileDropdownMenu";
import OnLoginDropdownBtn from "./OnLoginDropdownBtn";
import { SessionProvider } from "next-auth/react";

export default async function CustomNavbar() {
  const session = await auth();

  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ base: "bg-white/10 dark:bg-black/10" }}
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
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="md:hidden">
          {/* client component 모바일 전용 메뉴 */}
          <SessionProvider session={session}>
            <MobileDropDown />
          </SessionProvider>
        </NavbarItem>
        <NavbarItem className="hidden md:inline-block">
          <div>
            {session ? (
              <OnLoginDropdownBtn session={session} />
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button
                  type="submit"
                  variant="bordered"
                  className="border-black-500 shadow-sm hover:shadow-emerald-400"
                >
                  Sign In
                </Button>
              </form>
            )}
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
