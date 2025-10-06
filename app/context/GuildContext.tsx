"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Guild {
  id: string;
  name: string;
  channels: Channel[];
}

interface GuildContextType {
  selectedGuild: string;
  setSelectedGuild: (id: string) => void;
  channels: Channel[];
  guilds: Guild[];
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: ReactNode }) {
  const [selectedGuild, setSelectedGuild] = useState<string>("");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const res = await fetch("https://lumix.heapreaper.nl/api/ExposeGuildChannels");
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
  }, [selectedGuild, guilds]);

  return (
    <GuildContext.Provider value={{ selectedGuild, setSelectedGuild, channels, guilds }}>
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild() {
  const context = useContext(GuildContext);
  if (!context) throw new Error("useGuild must be used within a GuildProvider");
  return context;
}
