import { auth, signIn } from "@/auth";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import OnLoginDropdownBtn from "./OnLoginDropdownBtn";
import NavLogo from "./NavLogo";

export default async function CustomNavbar() {
  const session = await auth();

  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ base: "bg-white/10 dark:bg-black/10" }}
    >
      <NavbarBrand>
        <NavLogo />
      </NavbarBrand>
      {/* theme */}
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
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
