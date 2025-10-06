import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// @ts-ignore
export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // @ts-ignore
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id;
        token.username = profile.username;
        token.discriminator = profile.discriminator;
      }
      return token;
    },

    // @ts-ignore
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id!,
          username: token.username!,
          discriminator: token.discriminator!,
        },
      };
    },
  },
};

// @ts-ignore
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
