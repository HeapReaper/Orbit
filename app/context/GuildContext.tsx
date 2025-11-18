"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Channel {
  id: string;
  name: string;
  type: number;
}

export interface Role {
  id: string;
  name: string;
  color: number;
  position: number;
  hoist: boolean;
  permissions: string;
  managed: boolean;
}

interface Guild {
  id: string;
  name: string;
  channels: Channel[];
  roles: Role[];
  isPremium?: boolean;
}

interface GuildContextType {
  selectedGuild: string;
  setSelectedGuild: (id: string) => void;
  channels: Channel[];
  roles: Role[];
  guilds: Guild[];
  setGuilds: (guilds: Guild[]) => void;
  currentGuild: Guild | undefined;
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: ReactNode }) {
  const [selectedGuild, setSelectedGuild] = useState<string>("");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Load all guilds
  useEffect(() => {
    const fetchUserGuilds = async () => {
      try {
        const res = await fetch("/api/discord/guilds");
        const data = await res.json();

        const fetchedGuilds = data.guilds || [];
        setGuilds(fetchedGuilds);

        // Fetch premium per guild
        fetchedGuilds.forEach(async (g: Guild) => {
          try {
            const premRes = await fetch(`/api/discord/premium?guildId=${g.id}`);
            const premData = await premRes.json();

            setGuilds((prev) =>
              prev.map((x) =>
                x.id === g.id ? { ...x, isPremium: !!premData } : x
              )
            );
          } catch (err) {
            console.error("Premium check failed:", err);
          }
        });
      } catch (err) {
        console.error(err);
        setGuilds([]);
      }
    };

    void fetchUserGuilds();
  }, []);

  // Compute currently active guild
  const currentGuild = guilds.find((g) => g.id === selectedGuild);

  // Update channels + roles
  useEffect(() => {
    setChannels(currentGuild?.channels || []);
    setRoles(currentGuild?.roles || []);
  }, [currentGuild]);

  return (
    <GuildContext.Provider
      value={{
        selectedGuild,
        setSelectedGuild,
        channels,
        roles,
        guilds,
        setGuilds,
        currentGuild,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild() {
  const context = useContext(GuildContext);
  if (!context) throw new Error("useGuild must be used within a GuildProvider");
  return context;
}