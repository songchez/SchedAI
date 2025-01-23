import LandingPage from "@/components/Home/LandingPage";

export default async function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-end"
      style={{ userSelect: "none" }}
    >
      <LandingPage />
    </div>
  );
}
