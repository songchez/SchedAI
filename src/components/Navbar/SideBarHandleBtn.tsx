"use client";

import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { useSidebarStore } from "@/lib/store/SideBarHandleStore";
import { usePathname } from "next/navigation";

export default function SideBarHandleBtn() {
  const { openSidebar, isSidebarOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    !isSidebarOpen &&
    pathname.includes("/chat") && (
      <div className="m-3">
        <Button
          variant="light"
          isIconOnly
          onPress={openSidebar}
          className="bg-background rounded-full p-2 shadow"
        >
          <Bars3BottomRightIcon className="w-8 h-8" />
        </Button>
      </div>
    )
  );
}
