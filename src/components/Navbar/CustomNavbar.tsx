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

export default async function CustomNavbar() {
  const session = await auth();

  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ base: "bg-white/40 dark:bg-black/10" }}
    >
      <NavbarBrand>
        <Link href="/">
          <h1 className="text-xl font-bold text-primary ">SchedAI</h1>
        </Link>
      </NavbarBrand>
      {/* theme */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Link href={"/"} className="hover:text-primary">
          <p>Home</p>
        </Link>
        <Link href={"/dashboard"} className="hover:text-primary">
          <p>Dashboard</p>
        </Link>
        <Link href={"/About"} className="hover:text-primary">
          <p>About</p>
        </Link>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <div>
            {session ? (
              <>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
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
