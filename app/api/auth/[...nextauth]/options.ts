import { type NextAuthOptions } from "next-auth";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";

async function refreshDiscordAccessToken(token: any) {
  try {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

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
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,   // Refresh cookie every 24h
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign-in
      if (account && profile) {
        const discordProfile = profile as DiscordProfile;

        const avatarUrl = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${Number(discordProfile.discriminator) % 5}.png`;

        return {
          accessToken: account.access_token,
          // @ts-ignore
          accessTokenExpires: Date.now() + (account.expires_in ?? 3600) * 1000,
          refreshToken: account.refresh_token,
          id: discordProfile.id,
          username: discordProfile.username,
          discriminator: discordProfile.discriminator,
          image: avatarUrl, // Store profile picture
        };
      }

      // Still valid?
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Else refresh it
      return await refreshDiscordAccessToken(token);
    },

    // @ts-ignore
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          discriminator: token.discriminator,
          image: token.image,
        },
        accessToken: token.accessToken,
        error: token.error,
      };
    },
  },
};