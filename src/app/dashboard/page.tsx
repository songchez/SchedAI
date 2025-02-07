import { auth } from "@/auth";
// import TaskTester from "@/components/Dashboard/TaskTester";
// import { SessionProvider } from "next-auth/react";
import Image from "next/image";
// import darkBackground from "@/images/dark_dashboard_background.png";
// import lightBackground from "@/images/light_dashboard_background.png";
import rocketicon from "@/images/rocketicon-404.png";
// import CalendarEventHandler from "@/components/Dashboard/CalendarEventHandler";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="w-screen mt-32 flex justify-center items-center">
      {/* <Image
        className="absolute -z-10 w-screen h-screen transition-colors"
        src={darkBackground}
        alt="background"
        height={1920}
        width={1080}
      ></Image>
      <Image
        className="absolute -z-10 w-screen h-screen transition-colors dark:hidden"
        src={lightBackground}
        alt="background"
        height={1920}
        width={1080}
      ></Image> */}

      <div className="flex justify-center items-center text-center">
        <div className="flex flex-col items-center gap-5">
          {session && (
            <h1 className="text-xl">
              Welcome, to Dashboard {session.user?.name}!
            </h1>
          )}
          <Image
            className="w-1/2 p-3"
            src={rocketicon}
            alt="background"
            height={512}
            width={512}
          ></Image>

          <p className="md:text-3xl text-xl font-bold">열심히 만드는 중...</p>

          <h2 className="whitespace-pre-line">
            {`여러분의 일정관리가 더 편안해지도록
               다양한 기능을 개발하고 있습니다!`}
          </h2>
          <a
            href="https://www.flaticon.com/"
            title="로켓 아이콘"
            className="text-xs"
          >
            로켓 아이콘 제작자: Pixel Buddha - Flaticon
          </a>
        </div>
        {/*<div className="p-6 ">
           <SessionProvider>
              <CalendarEventHandler />
              <TaskTester />
            </SessionProvider> 
        </div>*/}
      </div>
    </div>
  );
}
