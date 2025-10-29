import { useEffect, useState } from "react";
import api from "../api";
import GuildConfigPanel from "../components/GuildConfigPanel";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface NitradoUser {
  user_id: string;
  email: string;
  country: string;
}

interface User {
  username: string;
  nitrado?: NitradoUser | null;
}

function NitradoLinker({
  user,
  refreshUser,
}: {
  user: User;
  refreshUser: () => void;
}) {
  const linked = !!user?.nitrado;

  const handleLinkClick = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/nitrado/login?user_token=${encodeURIComponent(jwt)}`;
  };

  const handleUnlinkClick = async () => {
    if (!confirm("Are you sure you want to unlink your Nitrado account?"))
      return;
    await api.post("/api/nitrado/unlink");
    refreshUser();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nitrado Account</h2>

      {linked ? (
        <div
          style={{
            border: "1px solid #333",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <p>Your Nitrado account is linked</p>
          <p>
            <strong>User ID:</strong> {user.nitrado?.user_id}
          </p>
          <p>
            <strong>Email:</strong> {user.nitrado?.email}
          </p>
          <button onClick={handleUnlinkClick}>Unlink Account</button>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid #555",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <p>No Nitrado account linked</p>
          <button onClick={handleLinkClick}>Link Nitrado Account</button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
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

  // ✅ fade out success banner after 5 seconds
  useEffect(() => {
    if (showLinkedMsg) {
      const timer = setTimeout(() => setShowLinkedMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLinkedMsg]);

  useEffect(() => {
    fetchUser();
  }, []);

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
    <div style={{ padding: "40px" }}>
      <h1>Welcome, {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* ✅ success banner */}
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
                  selectedGuild === g.id ? "#2f3136" : "rgba(255,255,255,0.05)",
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
  );
}
