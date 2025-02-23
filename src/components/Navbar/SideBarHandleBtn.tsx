"use client";

import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { useSidebarStore } from "@/lib/store/SideBarHandleStore";
import { usePathname } from "next/navigation";
import { SideBarIcon } from "../SVGAssets";

export default function SideBarHandleBtn() {
  const { openSidebar, isSidebarOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    !isSidebarOpen &&
    pathname.includes("/chat") && (
      <div className="m-4">
        <Button isIconOnly onPress={openSidebar} className="bg-background">
          <SideBarIcon />
        </Button>
      </div>
    )
  );
}
