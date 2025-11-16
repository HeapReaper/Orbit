import { moduleType } from "@/app/types/modules";

const modules: moduleType[] = [
  {
    name: "Bump Reminder",
    url: "bump-reminder",
    description: "Receive reminders when it’s time to bump your server.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Anti Bot",
    url: "anti-bot",
    description: "Protect your server from spam and malicious bots.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Analytics",
    url: "analytics",
    description: "View server activity and popular channels at a glance.",
    free: false,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Auto Role",
    url: "auto-role",
    description: "Automatically assign roles to new members joining your server.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Birthday",
    url: "birthday",
    description: "Let members share birthdays and get notifications on them.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Tickets",
    url: "tickets",
    description: "Manage member requests with an easy ticketing system.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Logging",
    url: "logging",
    description: "Track server events like messages and voice activity.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Introduction",
    url: "introduction",
    description: "Set up how new members are welcomed and introduced.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Invite Tracker",
    url: "invite-tracker",
    description: "See which invite links your members are using.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Picture Contest",
    url: "picture-contest",
    description: "Run photo contests and pick winners automatically.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Youtube Watcher",
    url: "youtube-watcher",
    description: "Get notified when your favorite YouTube channels post.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Twitch Watcher",
    url: "twitch-watcher",
    description: "Receive alerts when selected Twitch streamers go live.",
    free: false,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Kick Watcher",
    url: "kick-watcher",
    description: "Get notifications when favorite Kick streamers start streaming.",
    free: false,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Auto Message",
    url: "auto-message",
    description: "Send automated messages to channels on a schedule.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Welcome Message",
    url: "welcome-message",
    description: "Send messages automatically when new members join.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Leave Message",
    url: "leave-message",
    description: "Notify the server when a member leaves automatically.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Leveling",
    url: "leveling",
    description: "Add a leveling system for members based on activity.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Channel of Fame",
    url: "channel-of-fame",
    description: "Show starred messages in a special channel automatically.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Giveaway",
    url: "giveaway",
    description: "Host giveaways and let members win prizes easily.",
    free: true,
    enabled: true,
    inDevelopment: true
  },
  {
    name: "Minecraft",
    url: "minecraft",
    description: "Display online players and status of your Minecraft server.",
    free: true,
    enabled: true,
    inDevelopment: false
  },
  {
    name: "Mod Link",
    url: "mod-link",
    description: "Synchronize moderation actions across multiple servers automatically.",
    free: true,
    enabled: false,
    inDevelopment: true
  },
  {
    name: "Message Glue",
    url: "message-glue",
    description: "Keep a specific message pinned as the last message.",
    free: true,
    enabled: false,
    inDevelopment: true
  },
  {
    name: "Daily Spark",
    url: "daily-spark",
    description: "Reward members for daily activity and maintain streaks.",
    free: true,
    enabled: false,
    inDevelopment: true
  },
  {
    name: "Time Keeper",
    url: "time-keeper",
    description: "Set personal or server reminders for important moments.",
    free: true,
    enabled: false,
    inDevelopment: true
  },
  {
    name: "Boost Spotlight",
    url: "boost-spotlight",
    description: "Celebrate and notify whenever someone boosts your server.",
    free: true,
    enabled: false,
    inDevelopment: true
  },
  {
    name: "Git Buddy",
    url: "git-buddy",
    description: "Track bugs, requests, and issues directly in Discord.",
    free: true,
    enabled: false,
    inDevelopment: true
  }
];

export default modules;
