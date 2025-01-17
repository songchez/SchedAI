import { auth } from "@/auth";
import EventTester from "@/components/Dashboard/EventTester";
import TaskTester from "@/components/Dashboard/TaskTester";
import { SessionProvider } from "next-auth/react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>You need to be signed in to access this page.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
      <p>Email: {session.user?.email}</p>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Dashboard API Tester</h1>
        <SessionProvider>
          <EventTester />
          <TaskTester />
        </SessionProvider>
      </div>
    </div>
  );
}
