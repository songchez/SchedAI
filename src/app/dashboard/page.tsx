import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>You need to be signed in to access this page.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
