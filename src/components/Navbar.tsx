import { auth, signIn, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">SchedAI</h1>
      <div>
        {session ? (
          <>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </>
        ) : (
          <form
            className="btn btn-primary"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button type="submit">Sign in</button>
          </form>
        )}
      </div>
    </nav>
  );
}
