import { type NextAuthOptions } from "next-auth";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;
        token.accessToken = account.access_token;
        token.id = discordProfile.id;
        token.username = discordProfile.username;
        token.discriminator = discordProfile.discriminator;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          discriminator: token.discriminator as string,
        },
        accessToken: token.accessToken,
      };
    },
  },
};