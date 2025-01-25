import SchedAIChatbot from "@/components/ChatBot/SchedAIChatbot";

export default async function Chat() {
  return (
    <div className="min-h-screen flex flex-col justify-end dark:bg-primary-700">
      <SchedAIChatbot />
    </div>
  );
}
