import SchedAIChatbot from "@/components/ChatBot/SchedAIChatbot";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-end">
      <SchedAIChatbot />
    </div>
  );
}
