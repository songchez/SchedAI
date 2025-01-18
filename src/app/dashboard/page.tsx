import { auth } from "@/auth";
import EventTester from "@/components/Dashboard/EventTester";
import TaskTester from "@/components/Dashboard/TaskTester";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import background from "@/images/dashboard_background.png";
import GlassContainer from "@/components/GlassContainer";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>You need to be signed in to access this page.</p>;
  }

  return (
    <div className="p-4 flex justify-center">
      <Image
        className="absolute -z-10 w-screen h-screen -translate-y-20"
        src={background}
        alt="background"
        height={1920}
        width={1080}
      ></Image>
      <div className="max-w-7xl">
        <GlassContainer>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Dashboard API Tester</h1>
            <h1 className="text-xl">Welcome, {session.user?.name}!</h1>
            <h2 className="text-sm">등록하고 싶은 일정을 입력해 보세요</h2>
          </div>
          <div className="p-6">
            <SessionProvider>
              <EventTester />
              <TaskTester />
            </SessionProvider>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
}
