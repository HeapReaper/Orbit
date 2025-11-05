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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // refresh JWT every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // keep JWT valid for 30 days
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign-in
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        // @ts-ignore
        token.expiresAt = Date.now() + account.expires_in * 1000;
        token.id = discordProfile.id;
        token.username = discordProfile.username;
        token.discriminator = discordProfile.discriminator;
        return token;
      }

      // If token hasn't expired yet, just return it
      // @ts-ignore
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Token expired — try to refresh
      if (token.refreshToken) {
        try {
          const response = await fetch("https://discord.com/api/oauth2/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.DISCORD_CLIENT_ID!,
              client_secret: process.env.DISCORD_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });

          const refreshedTokens = await response.json();

          if (!response.ok) throw refreshedTokens;

          token.accessToken = refreshedTokens.access_token;
          token.refreshToken =
            refreshedTokens.refresh_token ?? token.refreshToken;
          token.expiresAt = Date.now() + refreshedTokens.expires_in * 1000;
        } catch (error) {
          console.error("Failed to refresh Discord access token:", error);
          token.error = "RefreshAccessTokenError";
        }
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
        error: token.error,
      };
    },
  },
};
