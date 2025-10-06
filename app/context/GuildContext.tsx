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
}

interface GuildContextType {
  selectedGuild: string;
  setSelectedGuild: (id: string) => void;
  channels: Channel[];
  roles: Role[];
  guilds: Guild[];
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: ReactNode }) {
  const [selectedGuild, setSelectedGuild] = useState<string>("");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const res = await fetch("https://lumix.heapreaper.nl/api/expose-guild-channels-and-roles");
        const data = await res.json();
        setGuilds(data.guilds || []);
      } catch (err) {
        console.error(err);
        setGuilds([]);
      }
    };
    void fetchGuilds();
  }, []);

  useEffect(() => {
    const guild = guilds.find(g => g.id === selectedGuild);
    setChannels(guild?.channels || []);
    setRoles(guild?.roles || []);
  }, [selectedGuild, guilds]);

  return (
    <GuildContext.Provider value={{ selectedGuild, setSelectedGuild, channels, roles, guilds }}>
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild() {
  const context = useContext(GuildContext);
  if (!context) throw new Error("useGuild must be used within a GuildProvider");
  return context;
}
