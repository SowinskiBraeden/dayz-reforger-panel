import { useState } from "react";
import type { NitradoUser } from "../types/nitrado";
import type { Guild } from "../types/guild";
// import GuildConfigPanel from "../components/GuildConfigPanel";
import NitradoLinker from "../components/NitradoAccount";
import GuildCard from "../components/GuildCard";

interface GuildsPageProps {
  user: NitradoUser;
  guilds: Guild[];
  loadingGuilds: boolean;
  fetchUser: () => void;
  showLinkedMsg: boolean;
}

export default function GuildsPage({
  user,
  guilds,
  loadingGuilds,
  fetchUser,
  showLinkedMsg,
}: GuildsPageProps) {
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

      {loadingGuilds ? (
        <p style={{ color: "#888" }}>Fetching your servers...</p>
      ) : guilds.length === 0 ? (
        <p>No servers found.</p>
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
            <GuildCard key={g.id} guild={g} />
          ))}
        </div>
      )}
    </div>
  );
}
