import { auth } from "@/auth";
// import TaskTester from "@/components/Dashboard/TaskTester";
// import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import darkBackground from "@/images/dark_dashboard_background.png";
import lightBackground from "@/images/light_dashboard_background.png";
import GlassContainer from "@/components/GlassContainer";
// import CalendarEventHandler from "@/components/Dashboard/CalendarEventHandler";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="p-4 flex justify-center">
      <Image
        className="absolute -z-10 w-screen h-screen -translate-y-20 transition-colors "
        src={darkBackground}
        alt="background"
        height={1920}
        width={1080}
      ></Image>
      <Image
        className="absolute -z-10 w-screen h-screen -translate-y-20 transition-colors dark:hidden"
        src={lightBackground}
        alt="background"
        height={1920}
        width={1080}
      ></Image>
      <div className="max-w-7xl">
        <GlassContainer>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-3xl">현재 준비중...</p>
            {session && (
              <h1 className="text-xl">
                Welcome, to Dashboard {session.user?.name}!
              </h1>
            )}

            <h2>
              여러분의 일정관리가 더 편안해지도록 현재 다양한 기능을
              개발중입니다!
            </h2>
          </div>
          <div className="p-6 ">
            {/* <SessionProvider>
              <CalendarEventHandler />
              <TaskTester />
            </SessionProvider> */}
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
