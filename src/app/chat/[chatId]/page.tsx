import SchedAIChatbot from "@/components/ChatBot/SchedAIChatbot";
import { SessionProvider } from "next-auth/react";

interface PageProps {
  params: { chatId: string };
}

export default async function ChatPage({ params }: PageProps) {
  const { chatId } = params;

  return (
    <div>
      <SessionProvider>
        <SchedAIChatbot chatId={chatId} />
      </SessionProvider>
    </div>
  );
}
