import LandingPage from "@/components/Home/LandingPage";
import CustomNavbar from "@/components/Navbar/CustomNavbar";

export default async function HomePage() {
  return (
    <div style={{ userSelect: "none" }}>
      <CustomNavbar />
      <LandingPage />
    </div>
  );
}
