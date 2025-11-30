import type { Guild } from "../types/guild";
import { AlertTriangle } from "lucide-react";
import "../styles/GuildCard.css";
import api from "../api";
import { useState } from "react";
import ServiceSelectModal from "./ServiceSelect";

interface GuildCardProps {
  guild: Guild;
  linkedGuildIds: string[];
  limitReached: boolean;
  onLinked?: () => void;
  openConfig: () => void;
}

export default function GuildCard({
  guild,
  linkedGuildIds,
  limitReached,
  onLinked,
  openConfig,
}: GuildCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  const isLinked = linkedGuildIds.includes(guild.id);

  const iconUrl = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  const openModal = async () => {
    try {
      const nitradoRes = await api.get("/api/nitrado/servers");
      const srv = nitradoRes.data.data.services || [];

      if (!srv.length) {
        alert("No Nitrado servers found. Please link your Nitrado account.");
        return;
      }

      setServices(srv);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load Nitrado services.");
    }
  };

  const linkGuild = async (serviceID: string) => {
    setShowModal(false);
    try {
      const res = await api.post(`/api/guilds/${guild.id}/link`, {
        nitrado_server_id: serviceID,
      });

      if (res.data.success) {
        alert(`Guild "${guild.name}" linked successfully!`);
        onLinked?.();
      } else {
        alert(res.data.error || "Failed to link guild.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Unexpected error linking guild");
    }
  };

  const handleOpenConfig = () => {
    openConfig();
  };

  return (
    <div className="guild-card">
      {showModal && (
        <ServiceSelectModal
          services={services}
          onClose={() => setShowModal(false)}
          onSelect={linkGuild}
        />
      )}

      <div className="guild-header">
        <img src={iconUrl} alt={`${guild.name} icon`} className="guild-icon" />
        <div className="guild-info">
          <h2 className="guild-name">{guild.name}</h2>
          <span className={`guild-status ${isLinked ? "linked" : "unlinked"}`}>
            {isLinked ? "Linked" : "Unlinked"}
          </span>
        </div>
      </div>

      {limitReached && !isLinked ? (
        <div className="guild-warning">
          <AlertTriangle size={16} />
          <span>Cannot be linked: instance limit reached</span>
        </div>
      ) : (
        <div className="guild-actions">
          {isLinked ? (
            <button className="guild-btn config" onClick={handleOpenConfig}>
              Open Config
            </button>
          ) : (
            <button
              className="guild-btn link"
              onClick={openModal}
              disabled={limitReached}
            >
              {limitReached ? "Limit Reached" : "Link Guild"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
