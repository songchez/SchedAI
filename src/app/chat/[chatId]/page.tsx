import { auth } from "@/auth";
import SchedAIChatbot from "@/components/ChatBot/SchedAIChatbot";
import { SessionProvider } from "next-auth/react";

interface PageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: PageProps) {
  const { chatId } = params;
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <SchedAIChatbot chatId={chatId} />
    </SessionProvider>
  );
}
