import type { Guild } from "../types/guild";
import { AlertTriangle } from "lucide-react";
import "../styles/GuildCard.css";
// import api from "../api";

export default function GuildCard({ guild }: Guild) {
  // const handleSelectGuild = (guildID: string) => {
  //   setSelectedGuild(guildID);
  //   api
  //     .get(`/api/guilds/${guildID}/config`)
  //     .then((res) => setConfig(res.data))
  //     .catch(() => setConfig(null));
  // };

  const status = "unlinked";
  const limitReached = true;

  const iconUrl = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <div className="guild-card">
      <div className="guild-header">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`${guild.name} icon`}
            className="guild-icon"
          />
        ) : (
          <div className="guild-icon placeholder">?</div>
        )}

        <div className="guild-info">
          <h2 className="guild-name">{guild.name}</h2>
          <span className={`guild-status ${status}`}>{status}</span>
        </div>
      </div>

      {limitReached && (
        <div className="guild-warning">
          <AlertTriangle size={16} />
          <span>Cannot be linked: limit reached</span>
        </div>
      )}
    </div>
  );
}
