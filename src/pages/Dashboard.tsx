import { useEffect, useState } from "react";
import api from "../api";
import type { NitradoUser } from "../types/nitrado";
import Sidebar from "../components/Sidebar";
import type { Guild } from "../types/guild";
import GuildsPage from "./Guilds";

export default function Dashboard() {
  const [selected, setSelected] = useState("Guilds");
  const [user, setUser] = useState<NitradoUser | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [showLinkedMsg, setShowLinkedMsg] = useState(false);

  // Fetch user (and then guilds)
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);

      const params = new URLSearchParams(window.location.search);
      const linkedParam = params.get("linked");

      if (linkedParam === "true") {
        if (res.data.user.nitrado) setShowLinkedMsg(true);
        params.delete("linked");
        window.history.replaceState({}, "", window.location.pathname);
      }

      // Fetch guilds once user is set
      fetchGuilds();
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
    fetchUser();
  }, []);

  useEffect(() => {
    if (showLinkedMsg) {
      const timer = setTimeout(() => setShowLinkedMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showLinkedMsg]);

  if (!user) return <p>Loading user...</p>;

  const renderContent = () => {
    switch (selected) {
      case "Guilds":
        return (
          <GuildsPage
            user={user}
            guilds={guilds}
            loadingGuilds={loadingGuilds}
            fetchUser={fetchUser}
            showLinkedMsg={showLinkedMsg}
          />
        );
      case "Nitrado Servers":
        return <div>Placeholder for Nitrado Servers.</div>;
      case "Guild Config":
        return <div>Placeholder for Guild Config.</div>;
      case "Economy":
        return <div>Placeholder for Economy.</div>;
      case "Alarms":
        return <div>Placeholder for Alarms.</div>;
      case "UAVs":
        return <div>Placeholder for UAVs.</div>;
      case "Events":
        return <div>Placeholder for Events.</div>;
      case "Player Map":
        return <div>Placeholder for Player Map.</div>;
      case "Analytics":
        return <div>Placeholder for Analytics.</div>;
      default:
        return <div>Select a section.</div>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar selected={selected} onSelect={setSelected} />
      <div
        style={{
          marginLeft: "200px",
          padding: "24px",
          width: "150%",
          color: "#fff",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
