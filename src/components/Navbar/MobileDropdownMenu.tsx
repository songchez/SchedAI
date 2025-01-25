"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { signIn, signOut } from "next-auth/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function MyDropdown({ session }: Props) {
  // 1. Set up your items as an array
  const items = [
    { key: "chat", label: "✨ChatBot", href: "/chat" },
    { key: "dashboard", label: "Dashboard", href: "/dashboard" },
    { key: "pricing", label: "Pricing", href: "/pricing" },
    session
      ? { key: "signOut", label: "Sign Out", className: "text-danger" }
      : { key: "signIn", label: "Sign In", className: "text-success" },
  ].flat();

  // 2. Handle item press
  const onItemPress = async (key: string) => {
    switch (key) {
      case "signIn":
        await signIn("google");
        break;
      case "signOut":
        await signOut({ redirectTo: "/" });
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        {/* Instead of a Button, your original icon: */}
        <Bars3Icon className="w-9" />
      </DropdownTrigger>
      {/* 3. Manually map items into <DropdownItem> elements */}
      <DropdownMenu aria-label="Dynamic Menu">
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className ?? ""}
            href={item.href}
            onPress={() => onItemPress(item.key)}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
