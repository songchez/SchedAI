export declare module "next-auth" {
  interface Session {
    user: {
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
    error?: "RefreshTokenError";
  }
}
