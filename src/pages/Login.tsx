import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/auth/discord/login";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <h1>Novus DayZ Admin Panel</h1>
      <button
        onClick={handleLogin}
        style={{
          background: "#5865F2",
          border: "none",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Login with Discord
      </button>
    </div>
  );
}
