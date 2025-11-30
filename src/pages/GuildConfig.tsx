import { useEffect, useState } from "react";
import api from "../api";
import GuildConfigPanel from "../components/GuildConfigPanel";

interface GuildConfigPageProps {
  activeGuildId: string | null;
  setActiveGuildId: (id: string | null) => void;
}

export default function GuildConfigPage({
  activeGuildId,
  setActiveGuildId,
}: GuildConfigPageProps) {
  const [linkedGuilds, setLinkedGuilds] = useState<any[]>([]);
  const [guildConfig, setGuildConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch list of linked guilds once
  useEffect(() => {
    const fetchLinkedGuilds = async () => {
      try {
        const res = await api.get("/api/guilds/linked");
        setLinkedGuilds(res.data.guilds || []);
      } catch (err) {
        console.error("Failed to fetch linked guilds:", err);
      }
    };

    fetchLinkedGuilds();
  }, []);

  // Fetch config whenever a guild is selected
  useEffect(() => {
    if (!activeGuildId) return;

    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/guilds/${activeGuildId}/config`);
        setGuildConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch guild config:", err);
        setGuildConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [activeGuildId]);

  // If user comes to this tab without selecting a guild
  if (!activeGuildId) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Select a Guild Configuration</h2>

        {linkedGuilds.length === 0 ? (
          <p>No linked guilds found.</p>
        ) : (
          <div style={{ marginTop: "14px" }}>
            {linkedGuilds.map((g) => (
              <button
                key={g.server_id}
                onClick={() => setActiveGuildId(g.server_id)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  padding: "10px 14px",
                  background: "#333",
                  border: "1px solid #555",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {g.guild_name || g.server_id}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Guild Configuration</h2>

      {/* Quick Switch */}
      <select
        value={activeGuildId}
        onChange={(e) => setActiveGuildId(e.target.value)}
        style={{
          padding: "6px 10px",
          marginBottom: "20px",
          background: "#222",
          color: "#fff",
          borderRadius: "6px",
        }}
      >
        {linkedGuilds.map((g) => (
          <option key={g.server_id} value={g.server_id}>
            {g.guild_name || g.server_id}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading config...</p>
      ) : guildConfig ? (
        <GuildConfigPanel guildConfig={guildConfig} />
      ) : (
        <p style={{ marginTop: "20px" }}>No configuration found.</p>
      )}
    </div>
  );
}
