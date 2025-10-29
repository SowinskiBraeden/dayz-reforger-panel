import { useEffect, useState } from "react";
import api from "../api";
import GuildConfigPanel from "../components/GuildConfigPanel";
import type { NitradoUser } from "../types/nitrado";
import NitradoLinker from "../components/NitradoAccount";
import Sidebar from "../components/Sidebar";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<NitradoUser | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [config, setConfig] = useState<null>(null);
  const [showLinkedMsg, setShowLinkedMsg] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);

      const params = new URLSearchParams(window.location.search);
      const linkedParam = params.get("linked");

      if (linkedParam === "true") {
        if (res.data.user.nitrado) setShowLinkedMsg(true);

        // Clean the URL (remove ?linked=true)
        params.delete("linked");
        window.history.replaceState({}, "", window.location.pathname);
      }

      setTimeout(() => fetchGuilds(), 100);
    } catch {
      console.log("Bad JWT token");
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }
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

  useEffect(() => {
    if (showLinkedMsg) {
      const timer = setTimeout(() => setShowLinkedMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLinkedMsg]);

  useEffect(() => {
    fetchUser();
  }, []); // react at its finest, this empty array is required otherwise, api gets spammed, we get rate limited, and connect access the dashboard

  const handleSelectGuild = (guildID: string) => {
    setSelectedGuild(guildID);
    api
      .get(`/api/guilds/${guildID}/config`)
      .then((res) => setConfig(res.data))
      .catch(() => setConfig(null));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  if (!user) return <p>Loading user...</p>;

  const getIconUrl = (guild: Guild) =>
    guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "24pt" }}>
        <h1>Welcome, {user.username}</h1>
        <button onClick={handleLogout}>Logout</button>

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
              transition: "opacity 0.5s ease",
              opacity: showLinkedMsg ? 1 : 0,
            }}
          >
            Successfully linked your Nitrado account!
          </div>
        )}

        {/* Pass refreshUser to re-fetch data after link/unlink */}
        <NitradoLinker user={user} refreshUser={fetchUser} />

        <hr style={{ margin: "20px 0" }} />

        <h2>Your Servers</h2>

        {loadingGuilds ? (
          <p style={{ color: "#888" }}>Fetching your servers...</p>
        ) : guilds.length === 0 ? (
          <p>No servers found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {guilds.map((g) => (
              <div
                key={g.id}
                onClick={() => handleSelectGuild(g.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedGuild === g.id
                      ? "#2f3136"
                      : "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "10px",
                  textAlign: "center",
                  transition: "0.2s",
                }}
              >
                <img
                  src={getIconUrl(g)}
                  alt={g.name}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ fontWeight: "bold" }}>{g.name}</div>
              </div>
            ))}
          </div>
        )}

        {selectedGuild && (
          <div style={{ marginTop: "30px" }}>
            <h3>Guild Config: {selectedGuild}</h3>
            {config ? (
              <GuildConfigPanel guildConfig={config} />
            ) : (
              <p>No config found for this guild.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
