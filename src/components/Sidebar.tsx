import logo from "../assets/logo_minimal_no_bg.png";
import "../styles/Sidebar.css";

interface Link {
  key: string;
  link: string;
}

interface SidebarProps {
  selected: string;
  onSelect: (key: string) => void;
}

const links: Array<Link> = [
  { key: "Guilds", link: "#" },
  { key: "Nitrado Servers", link: "#" },
  { key: "Guild Config", link: "#" },
  { key: "Economy", link: "#" },
  { key: "Alarms", link: "#" },
  { key: "UAVs", link: "#" },
  { key: "Events", link: "#" },
  { key: "Player Map", link: "#" },
  { key: "Analytics", link: "#" },
];

export default function Sidebar({ selected, onSelect }: SidebarProps) {
  return (
    <div
      style={{
        background: "#1A1B1E",
        borderRight: "solid 1px #2A2B2F",
        position: "fixed",
        top: "0",
        left: "0",
        overflowX: "hidden",
        width: "200px",
        height: "100vh",
      }}
    >
      <div>
        <img
          style={{
            margin: "12pt",
            marginLeft: "18pt",
            marginTop: "12pt",
            width: "160px",
          }}
          src={logo}
          alt="Logo"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
        }}
      >
        {links.map((link) => (
          <a
            key={link.key}
            href={link.link}
            className={selected === link.key ? "link selected" : "link"}
            onClick={(e) => {
              e.preventDefault();
              onSelect(link.key);
            }}
          >
            {link.key}
          </a>
        ))}
      </div>
    </div>
  );
}
