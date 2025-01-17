import ChatInterface from "@/components/Chat/ChatInterface";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <p className="text-xl">{session?.user.name}님 환영합니다</p>
      <p className="text-xl">{session?.user.email}</p>
      <ChatInterface />
    </div>
  );
}
