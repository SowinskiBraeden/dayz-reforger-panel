import api from "../api";
import type { NitradoUser } from "../types/nitrado";

export default function NitradoLinker({
  user,
  refreshUser,
}: {
  user: NitradoUser;
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
            backgroundColor: "#1A1B1E",
            padding: "15px",
            borderRadius: "12px",
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
