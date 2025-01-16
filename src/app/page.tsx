import ChatInterface from "@/components/Chat/ChatInterface";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <ChatInterface />
    </div>
  );
}
