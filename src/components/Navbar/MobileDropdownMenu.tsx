"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";
export default function MobileDropdownMenu() {
  const { data: session } = useSession();

  // 1. Set up your items as an array
  const items = [
    { key: "chat", label: "✨ChatBot", href: "/chat" },
    { key: "dashboard", label: "Dashboard", href: "/dashboard" },
    { key: "myaccount", label: "MyAccount", href: "/myaccount" },
    session
      ? [
          { key: "signOut", label: "Sign Out", className: "text-danger" },
          { key: "checkout", label: "✨프리미엄구독", href: "/checkout" },
        ]
      : { key: "signIn", label: "Sign In", className: "text-success" },
  ].flat();

  // 2. Handle item press
  const onItemPress = async (key: string) => {
    if (key === "signIn") {
      signIn("google", { redirectTo: "/chat" });
    } else if (key === "signOut") {
      signOut({ redirectTo: "/" });
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        {session?.user.image ? (
          <Image
            className="rounded-full cursor-pointer"
            src={session?.user.image}
            alt="userImage"
            width={40}
            height={40}
          />
        ) : (
          <UserCircleIcon />
        )}
      </DropdownTrigger>
      {/* 3. Manually map items into <DropdownItem> elements */}
      <DropdownMenu>
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
