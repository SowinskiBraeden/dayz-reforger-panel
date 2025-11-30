import { useEffect, useState } from "react";
import type { Guild } from "../types/guild";
import NitradoLinker from "../components/NitradoAccount";
import GuildCard from "../components/GuildCard";
import api from "../api";

interface GuildsPageProps {
  user: any;
  fetchUser: () => void;
  showLinkedMsg: boolean;
  openGuildConfig: (guildID: string) => void;
}

export default function GuildsPage({
  user,
  fetchUser,
  showLinkedMsg,
  openGuildConfig,
}: GuildsPageProps) {
  const [limitReached, setLimitReached] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [linkedGuildIds, setLinkedGuildIds] = useState<string[]>([]);

  const loadLinkedGuilds = async () => {
    try {
      const res = await api.get("/api/guilds/linked");
      setLinkedGuildIds(res.data.guilds.map((g: any) => g.server_id));
    } catch (err) {
      console.error("Failed to fetch linked guilds:", err);
    }
  };

  useEffect(() => {
    fetchGuilds();
    loadLinkedGuilds();
    setLimitReached(user.used_instances >= user.instance_addons.instance_limit);
  }, []);

  const handleLinkedSuccess = async () => {
    setRefreshing(true);
    await fetchUser(); // updates instance usage
    await loadLinkedGuilds(); // updates which guilds are linked
    setRefreshing(false);
  };

  const fetchGuilds = async () => {
    setLoadingGuilds(true);
    try {
      const res = await api.get("/api/guilds");
      setGuilds(res.data.guilds);
    } catch (err) {
      console.error("Error fetching guilds:", err);
    } finally {
      setLoadingGuilds(false);
    }
  };

  // Fetch linked guilds and usage info
  useEffect(() => {
    fetchGuilds();
    const fetchLinkedGuilds = async () => {
      try {
        const res = await api.get("/api/guilds/linked");
        if (res.data && Array.isArray(res.data.guilds)) {
          setLinkedGuildIds(res.data.guilds.map((g: any) => g.server_id));
        }
      } catch (err) {
        console.error("Failed to fetch linked guilds:", err);
      }
    };

    fetchLinkedGuilds();
    setLimitReached(user.used_instances >= user.instance_addons.instance_limit);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  return (
    <div>
      <header
        style={{
          marginLeft: "20px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <img
          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
          alt="Discord Avatar"
          style={{ borderRadius: "50%", width: "96px", height: "96px" }}
        />
        <div>
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {showLinkedMsg && (
        <div
          style={{
            backgroundColor: "#2ecc71",
            color: "black",
            padding: "10px 20px",
            borderRadius: "8px",
            marginTop: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          Successfully linked your Nitrado account!
        </div>
      )}

      <NitradoLinker user={user} refreshUser={fetchUser} />

      <h2 style={{ marginLeft: "20px" }}>Owned Discord Guilds</h2>

      {loadingGuilds || refreshing ? (
        <p style={{ color: "#888", marginLeft: "20px" }}>
          Fetching your servers...
        </p>
      ) : guilds.length === 0 ? (
        <p style={{ marginLeft: "20px" }}>No servers found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            padding: "20px",
            gap: "20px",
            width: "100%",
          }}
        >
          {guilds.map((g: Guild) => (
            <GuildCard
              key={g.id}
              guild={g}
              linkedGuildIds={linkedGuildIds}
              limitReached={limitReached}
              onLinked={handleLinkedSuccess}
              openConfig={() => openGuildConfig(g.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
