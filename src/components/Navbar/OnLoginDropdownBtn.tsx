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
import {
  ChatBubbleOvalLeftEllipsisIcon,
  CreditCardIcon,
  HomeIcon,
  PowerIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

interface Props {
  session: Session | null;
}

export default function OnLoginDropdownBtn({ session }: Props) {
  // 1. Set up your items as an array
  const items = [
    {
      key: "home",
      label: "Home",
      href: "/",
      icon: <HomeIcon />,
    },
    {
      key: "chat",
      label: "ChatBot✨",
      href: "/chat",
      icon: <ChatBubbleOvalLeftEllipsisIcon />,
    },
    {
      key: "myaccount",
      label: "My Account",
      href: "/myaccount",
      icon: <UserIcon />,
    },
    {
      key: "checkout",
      label: "프리미엄구독✨",
      href: "/checkout",
      icon: <CreditCardIcon />,
    },
    {
      key: "signOut",
      label: "Sign Out",
      className: "text-danger",
      icon: <PowerIcon />,
    },
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
      <DropdownMenu>
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className ?? ""}
            href={item.href}
            onPress={() => onItemPress(item.key)}
            startContent={<div className="w-4 h-4">{item.icon}</div>}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
