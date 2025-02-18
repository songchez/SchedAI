"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  session: Session | null;
}

export default function OnLoginDropdownBtn({ session }: Props) {
  // 1. Set up your items as an array
  const items = [
    { key: "myaccount", label: "My Account", href: "/myaccount" },
    { key: "checkout", label: "✨프리미엄구독", href: "/checkout" },
    { key: "signOut", label: "Sign Out", className: "text-danger" },
  ].flat();

  // 2. Handle item press
  const onItemPress = async (key: string) => {
    if (key === "signOut") {
      signOut({ redirectTo: "/" });
    }
  };

  return (
    <Dropdown size="sm">
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
